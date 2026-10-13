// Protocol 3, opt-in named entities. No world traversal, discovery, commands or spawning.
class JSOC_ORBAT_TrackedBridge : JSOC_ORBAT_DedicatedBridge
{
    protected ref array<string> m_Names = {};
    protected ref array<string> m_Ids = {};
    protected ref array<IEntity> m_Targets = {};
    protected ref array<vector> m_LastPositions = {};
    protected ref array<bool> m_HavePosition = {};
    protected bool m_Full = true;
    protected int m_Batches;
    protected int m_Recovery;

    override void Load()
    {
        if (!Replication.IsServer()) return;
        ref JsonLoadContext json = new JsonLoadContext();
        if (!json.LoadFromFile("$profile:JSOC_ORBAT_Tracked.json")) { Suspend(); return; }
        bool enabled;
        if (!json.ReadValue("enabled", enabled) || !enabled) { Suspend(); return; }
        string endpoint, code;
        int interval, timeout;
        bool reconnect;
        ref array<string> names = {};
        ref array<string> ids = {};
        if (!json.ReadValue("endpoint", endpoint) || !json.ReadValue("pairingCode", code) || !json.ReadValue("entityNames", names) || !json.ReadValue("entityIds", ids) || !json.ReadValue("intervalMs", interval) || !json.ReadValue("timeoutSeconds", timeout) || !json.ReadValue("autoReconnect", reconnect)) { InvalidConfig(); return; }
        if (names.Count() < 1 || names.Count() > 60 || names.Count() != ids.Count() || interval < 1000 || interval > 2000 || timeout < 2 || timeout > 15 || code.Length() != 32) { InvalidConfig(); return; }
        string hex = "0123456789abcdef";
        for (int c = 0; c < code.Length(); c++) if (hex.IndexOf(code.Substring(c, 1)) < 0) { InvalidConfig(); return; }
        for (int i = 0; i < names.Count(); i++)
        {
            if (!SafeKey(names[i], 64) || !SafeKey(ids[i], 64)) { InvalidConfig(); return; }
            for (int j = 0; j < i; j++) if (names[i] == names[j] || ids[i] == ids[j]) { InvalidConfig(); return; }
        }
        if (endpoint.IndexOf("https://") != 0 || endpoint.Length() < 10 || endpoint.Length() > 240 || endpoint.IndexOf("?") >= 0 || endpoint.IndexOf("#") >= 0 || endpoint.IndexOf("@") >= 0) { InvalidConfig(); return; }
        if (endpoint.Substring(endpoint.Length()-1, 1) != "/") endpoint += "/";
        string host = endpoint.Substring(8, endpoint.Length()-9);
        string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:-";
        if (host.IsEmpty()) { InvalidConfig(); return; }
        for (int h = 0; h < host.Length(); h++) if (chars.IndexOf(host.Substring(h, 1)) < 0) { InvalidConfig(); return; }
        bool same = m_Code == code && m_Endpoint == endpoint && m_Names.Count() == names.Count();
        if (same) for (int n = 0; n < names.Count(); n++) if (m_Names[n] != names[n] || m_Ids[n] != ids[n]) same = false;
        if (same && m_Interval == interval && m_Timeout == timeout && m_Reconnect == reconnect) return;
        int sequence = 0;
        if (same) sequence = m_Sequence;
        Suspend();
        m_Names = names; m_Ids = ids; m_Targets.Clear(); m_LastPositions.Clear(); m_HavePosition.Clear();
        for (int k = 0; k < names.Count(); k++) { m_Targets.Insert(GetGame().GetWorld().FindEntityByName(names[k])); m_LastPositions.Insert(vector.Zero); m_HavePosition.Insert(false); }
        m_Code = code; m_Endpoint = endpoint; m_Interval = interval; m_Timeout = timeout; m_Reconnect = reconnect;
        m_Context = GetGame().GetRestApi().GetContext(endpoint);
        if (!m_Context) return;
        m_Context.SetTimeout(timeout);
        m_Callback = new JSOC_ORBAT_DedicatedCallback(); m_Callback.Owner = this;
        m_Sequence = sequence; m_Active = true; m_Failures = 0; m_Body = ""; m_Full = true; m_Batches = 0; m_Recovery = 0; m_ConfigProblem = false;
        Print("[JSOC ORBAT] Tracked sender enabled: explicit named allowlist, maximum 60, read-only.");
        GetGame().GetCallqueue().CallLater(Send, m_Interval, false);
    }
    override void Send()
    {
        if (!m_Active || !Replication.IsServer() || !m_Context || !m_Callback) return;
        if (m_Body.IsEmpty())
        {
            bool full = m_Full || m_Batches % 10 == 0;
            string active = "", states = "";
            for (int i = 0; i < m_Names.Count(); i++)
            {
                // Retry only missing registered names every five batches; never enumerate world entities.
                if (!m_Targets[i] && m_Batches % 5 == 0) m_Targets[i] = GetGame().GetWorld().FindEntityByName(m_Names[i]);
                IEntity target = m_Targets[i];
                if (!target) { m_HavePosition[i] = false; continue; }
                vector p = target.GetOrigin();
                if (p[0] < -13500 || p[0] > 13500 || p[2] < -13500 || p[2] > 13500) { Halt(); return; }
                if (!active.IsEmpty()) active += ",";
                active += string.Format("\"%1\"", m_Ids[i]);
                vector prior = m_LastPositions[i];
                float dx = p[0] - prior[0]; float dz = p[2] - prior[2];
                if (full || !m_HavePosition[i] || dx * dx + dz * dz >= 0.25)
                {
                    if (!states.IsEmpty()) states += ",";
                    states += string.Format("{\"id\":\"%1\",\"x\":%2,\"z\":%3}", m_Ids[i], p[0], p[2]);
                    m_LastPositions[i] = p; m_HavePosition[i] = true;
                }
            }
            string fullText = "false";
            if (full) fullText = "true";
            m_Sequence++; m_Batches++; m_Full = false;
            m_Body = string.Format("{\"protocol\":3,\"token\":\"%1\",\"sequence\":%2,\"full\":%3,\"activeIds\":[%4],\"entities\":[%5]}", m_Code, m_Sequence, fullText, active, states);
        }
        m_Context.POST(m_Callback, "batch", m_Body);
    }
    override void Result(int code)
    {
        if (!m_Active) return;
        if (code == 409)
        {
            m_Recovery++;
            if (m_Recovery > 3) { Print("[JSOC ORBAT] Tracked snapshot recovery exhausted; sender stopped."); Halt(); return; }
            m_Body = ""; m_Full = true;
            GetGame().GetCallqueue().CallLater(Send, m_Interval, false);
            return;
        }
        if (code == 200) m_Recovery = 0;
        super.Result(code);
    }
};
