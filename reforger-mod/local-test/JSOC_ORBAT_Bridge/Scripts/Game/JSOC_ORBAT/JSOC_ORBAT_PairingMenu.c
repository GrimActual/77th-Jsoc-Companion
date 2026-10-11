class JSOC_ORBAT_PairingHandler : ScriptedWidgetEventHandler
{
    Widget Root;
    JSOC_ORBAT_HostBridge Bridge;
    override bool OnClick(Widget w, int x, int y, int button)
    {
        if (!Root || !Bridge || !w) return false;
        if (w.GetName() == "JSOCConnect")
        {
            EditBoxWidget endpoint = EditBoxWidget.Cast(Root.FindAnyWidget("JSOCEndpoint"));
            EditBoxWidget code = EditBoxWidget.Cast(Root.FindAnyWidget("JSOCCode"));
            if (!endpoint || !code) return false;
            if (Bridge.Connect(endpoint.GetText(), code.GetText())) code.SetText("");
            Refresh();
            return true;
        }
        if (w.GetName() == "JSOCDisconnect") { Bridge.Disconnect(); Refresh(); return true; }
        return false;
    }
    void Refresh()
    {
        if (!Root || !Bridge) return;
        TextWidget status = TextWidget.Cast(Root.FindAnyWidget("JSOCStatus"));
        if (status) status.SetText(Bridge.Status());
    }
}

modded class PauseMenuUI
{
    protected Widget m_JSOCPanel;
    protected ref JSOC_ORBAT_PairingHandler m_JSOCHandler;
    override void OnMenuOpen()
    {
        super.OnMenuOpen();
        if (!Replication.IsServer() || m_JSOCPanel) return;
        SCR_BaseGameMode mode = SCR_BaseGameMode.Cast(GetGame().GetGameMode());
        if (!mode) return;
        m_JSOCPanel = GetGame().GetWorkspace().CreateWidgets("UI/layouts/JSOC_ORBAT_Pairing.layout", GetRootWidget());
        if (!m_JSOCPanel) { Print("[JSOC ORBAT] Pairing layout failed to load", LogLevel.ERROR); return; }
        m_JSOCHandler = new JSOC_ORBAT_PairingHandler();
        m_JSOCHandler.Root = m_JSOCPanel;
        m_JSOCHandler.Bridge = mode.GetJSOCBridge();
        m_JSOCPanel.AddHandler(m_JSOCHandler);
        m_JSOCHandler.Refresh();
        GetGame().GetCallqueue().CallLater(m_JSOCHandler.Refresh, 500, true);
    }
    override void OnMenuClose()
    {
        if (m_JSOCHandler) GetGame().GetCallqueue().Remove(m_JSOCHandler.Refresh);
        if (m_JSOCPanel) m_JSOCPanel.RemoveFromHierarchy();
        m_JSOCPanel = null;
        m_JSOCHandler = null;
        super.OnMenuClose();
    }
}
