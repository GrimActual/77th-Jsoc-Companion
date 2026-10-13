// Typed, host-approved GM requests. No arbitrary scripts or file paths are executed.
class JSOC_ORBAT_GMEntityIntent
{
    string unitId;
    string name;
    ResourceName resourceName;
    float worldX;
    float worldZ;
    float headingDegrees;
};
class JSOC_ORBAT_GMRequest
{
    int version;
    string requestId;
    string kind;
    string targetRequestId;
    string sourceMissionSha256;
    ref array<ref JSOC_ORBAT_GMEntityIntent> entities = {};
};
class JSOC_ORBAT_GMRecord
{
    ref JSOC_ORBAT_GMRequest request;
    string phase;
};
class JSOC_ORBAT_GMSpawnGroup
{
    ref array<IEntity> Entities = {};
    ref array<string> Ids = {};
};
class JSOC_ORBAT_GMCallback : RestCallback
{
    JSOC_ORBAT_HostGM Owner;
    string Action;
    bool Stopped;
    void JSOC_ORBAT_GMCallback() { SetOnSuccess(Complete); SetOnError(Complete); }
    void Complete(RestCallback cb) { if (!Stopped && Owner) Owner.Complete(Action, cb.GetHttpCode(), cb.GetData()); }
};
class JSOC_ORBAT_HostGM
{
    protected RestContext m_Context;
    protected string m_Code;
    protected ref JSOC_ORBAT_GMCallback m_Callback;
    protected ref map<string, ref JSOC_ORBAT_GMSpawnGroup> m_Owned = new map<string, ref JSOC_ORBAT_GMSpawnGroup>();
    protected ref map<string, string> m_Results = new map<string, string>();
    protected bool m_Busy;
    protected string m_Expected;
    ref JSOC_ORBAT_GMRecord Pending;
    string Status = "No GM request loaded";
    void Pair(string endpoint, string code) { Stop(); m_Context = GetGame().GetRestApi().GetContext(endpoint); if (m_Context) m_Context.SetTimeout(5); m_Code = code; }
    void Stop() { if (m_Callback) { m_Callback.Stopped = true; m_Callback.Owner = null; } m_Callback = null; m_Context = null; m_Code = ""; m_Busy = false; Pending = null; }
    void Post(string action, string body)
    {
        if (!Replication.IsServer() || !m_Context || m_Busy) return;
        m_Busy = true; m_Callback = new JSOC_ORBAT_GMCallback(); m_Callback.Owner = this; m_Callback.Action = action;
        m_Context.POST(m_Callback, "gm-" + action, body);
    }
    void Poll() { Status = "Checking paired GM requests"; Post("poll", string.Format("{\"token\":\"%1\"}", m_Code)); }
    bool CanApprove() { return Pending && Pending.request && !m_Busy; }
    string Preview(int index)
    {
        if (!Pending || !Pending.request) return Status;
        JSOC_ORBAT_GMRequest request = Pending.request;
        if (request.kind == "remove") return "REMOVE bridge-created group " + request.targetRequestId;
        if (index < 0 || index >= request.entities.Count()) return Status;
        JSOC_ORBAT_GMEntityIntent entity = request.entities[index];
        return string.Format("%1 / %2: %3\n%4\nX %5 / Z %6 / heading %7\nTerrain height will be resolved. Full batch needs host approval.",index+1,request.entities.Count(),entity.name,entity.resourceName,entity.worldX,entity.worldZ,entity.headingDegrees);
    }
    void Approve()
    {
        if (!Pending || !Pending.request) return;
        m_Expected = Pending.request.requestId;
        Status = "Checking approval and expiry with relay";
        Post("approve", string.Format("{\"token\":\"%1\",\"requestId\":\"%2\"}", m_Code, m_Expected));
    }
    void Reject()
    {
        if (!Pending || !Pending.request) return;
        Report(Pending.request.requestId, "rejected", "Host rejected the request", ""); Pending = null;
    }
    void Complete(string action, int code, string data)
    {
        m_Busy = false;
        if (code != 200) { Status = "GM relay rejected request or connection unavailable"; return; }
        if (action == "result") { Status = "GM result acknowledged by Companion relay"; Pending = null; return; }
        if (data.Length() > 32768) { Status = "Oversized GM response rejected"; return; }
        JsonLoadContext json = new JsonLoadContext(); JSOC_ORBAT_GMRecord record;
        if (!json.LoadFromString(data) || !json.ReadValue("record", record) || !record || !record.request) { Pending = null; Status = "No pending GM request"; return; }
        if (action == "approve")
        {
            if (record.phase != "approved" || record.request.requestId != m_Expected) { Status = "Approval identity mismatch"; return; }
            ExecuteApproved(record.request); return;
        }
        Pending = record;
        Status = string.Format("Pending %1 request %2 (%3 units). Review before approving.", record.request.kind, record.request.requestId, record.request.entities.Count());
    }
    protected bool SafeKey(string value)
    {
        if (value.IsEmpty() || value.Length() > 64) return false;
        string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
        for (int i = 0; i < value.Length(); i++) if (chars.IndexOf(value.Substring(i,1)) < 0) return false;
        return true;
    }
    protected bool SafeResource(string value)
    {
        if (value.Length() < 22 || value.Length() > 530 || value.Substring(0,1) != "{" || value.Substring(17,1) != "}" || value.Substring(value.Length()-3,3) != ".et") return false;
        string hex = "0123456789abcdefABCDEF";
        for (int i = 1; i < 17; i++) if (hex.IndexOf(value.Substring(i,1)) < 0) return false;
        if (value.IndexOf("..") >= 0 || value.IndexOf(":") >= 0 || value.IndexOf("\\") >= 0 || value.IndexOf("%") >= 0 || value.IndexOf("?") >= 0 || value.IndexOf("#") >= 0 || value.Substring(18,1) == "/") return false;
        return true;
    }
    void ExecuteApproved(JSOC_ORBAT_GMRequest request)
    {
        if (!Replication.IsServer() || !request || request.version != 1 || !SafeKey(request.requestId) || request.requestId.Length() > 40) return;
        string cached;
        if (m_Results.Find(request.requestId, cached)) { Post("result", cached); return; }
        if (m_Results.Count() >= 100) { Status = "Scene GM command budget reached"; return; }
        if (request.kind == "remove")
        {
            JSOC_ORBAT_GMSpawnGroup group;
            if (!SafeKey(request.targetRequestId) || !m_Owned.Find(request.targetRequestId, group)) { Report(request.requestId, "failed", "Only bridge-created groups can be removed", ""); return; }
            PlayerManager manager = GetGame().GetPlayerManager();
            if (manager)
            {
                array<int> players = {}; manager.GetPlayers(players);
                foreach (int player : players)
                {
                    IEntity controlled = manager.GetPlayerControlledEntity(player);
                    foreach (IEntity root : group.Entities)
                    {
                        IEntity ancestor = controlled; int depth = 0;
                        while (ancestor && depth < 64) { if (ancestor == root) { Report(request.requestId,"failed","A player occupies this group; leave it before removal",""); return; } ancestor = ancestor.GetParent(); depth++; }
                        if (controlled)
                        {
                            SCR_EditableCharacterComponent editable = SCR_EditableCharacterComponent.Cast(controlled.FindComponent(SCR_EditableCharacterComponent));
                            if (editable)
                            {
                                SCR_EditableEntityComponent vehicle = editable.GetVehicle(); SCR_EditableEntityComponent aiGroup = editable.GetAIGroup();
                                if ((vehicle && vehicle.GetOwnerScripted() == root) || (aiGroup && aiGroup.GetOwnerScripted() == root)) { Report(request.requestId,"failed","A player occupies this group; leave it before removal",""); return; }
                            }
                        }
                    }
                }
            }
            foreach (IEntity createdEntity : group.Entities) if (createdEntity) SCR_EntityHelper.DeleteEntityAndChildren(createdEntity);
            m_Owned.Remove(request.targetRequestId); Report(request.requestId, "executed", "Bridge-created group removed", ""); return;
        }
        if (request.kind != "spawn" || request.entities.Count() < 1 || request.entities.Count() > 16) { Report(request.requestId, "failed", "Unsupported spawn request", ""); return; }
        int ownedCount = 0; foreach (string ownedKey, JSOC_ORBAT_GMSpawnGroup ownedGroup : m_Owned) { foreach (IEntity existing : ownedGroup.Entities) { if (existing) ownedCount++; } }
        if (ownedCount + request.entities.Count() > 60) { Report(request.requestId, "failed", "60 bridge-created entities maximum", ""); return; }
        ref array<ref Resource> resources = {}; array<string> unitIds = {};
        foreach (JSOC_ORBAT_GMEntityIntent intent : request.entities)
        {
            if (!intent || !SafeKey(intent.unitId) || unitIds.Find(intent.unitId) >= 0 || !SafeResource(intent.resourceName) || !(intent.worldX >= 0 && intent.worldX <= 13500) || !(intent.worldZ >= 0 && intent.worldZ <= 13500) || !(intent.headingDegrees >= 0 && intent.headingDegrees < 360)) { Report(request.requestId, "failed", "Invalid native spawn intent", ""); return; }
            unitIds.Insert(intent.unitId); ref Resource resource = Resource.Load(intent.resourceName);
            if (!resource || !resource.IsValid() || !resource.GetResource() || !resource.GetResource().ToEntitySource() || resource.GetResource().GetResourceName() != intent.resourceName) { Report(request.requestId, "failed", "Required prefab is unavailable on this server", ""); return; }
            resources.Insert(resource);
        }
        JSOC_ORBAT_GMSpawnGroup created = new JSOC_ORBAT_GMSpawnGroup(); string resultIds;
        for (int i = 0; i < request.entities.Count(); i++)
        {
            JSOC_ORBAT_GMEntityIntent entity = request.entities[i]; EntitySpawnParams parameters = new EntitySpawnParams(); parameters.TransformMode = ETransformMode.WORLD;
            Math3D.AnglesToMatrix(Vector(entity.headingDegrees, 0, 0), parameters.Transform);
            parameters.Transform[3] = Vector(entity.worldX, GetGame().GetWorld().GetSurfaceY(entity.worldX, entity.worldZ), entity.worldZ);
            IEntity spawned = GetGame().SpawnEntityPrefab(resources[i], GetGame().GetWorld(), parameters);
            if (!spawned)
            {
                foreach (IEntity partial : created.Entities) if (partial) SCR_EntityHelper.DeleteEntityAndChildren(partial);
                Report(request.requestId, "failed", "Spawn failed; partial batch removed", ""); return;
            }
            string createdId = string.Format("spawn_%1_%2", request.requestId, i);
            created.Entities.Insert(spawned); created.Ids.Insert(createdId);
            if (!resultIds.IsEmpty()) resultIds += ","; resultIds += "\"" + createdId + "\"";
        }
        m_Owned.Insert(request.requestId, created); Report(request.requestId, "executed", "Approved prefab batch spawned", resultIds);
    }
    protected void Report(string id, string status, string message, string ids)
    {
        string body = string.Format("{\"token\":\"%1\",\"result\":{\"requestId\":\"%2\",\"status\":\"%3\",\"message\":\"%4\",\"createdIds\":[%5]}}", m_Code,id,status,message,ids);
        m_Results.Insert(id,body); Status = message; Post("result",body);
    }
};
