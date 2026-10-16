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
class COMMAND_ORBAT_RoutePoint
{
    float worldX;
    float worldZ;
};
class JSOC_ORBAT_GMRequest
{
    int version;
    string requestId;
    string kind;
    string targetRequestId;
    string sourceMissionSha256;
    string unitId;
    float worldX;
    float worldZ;
    int holdSeconds;
    ref array<ref COMMAND_ORBAT_RoutePoint> waypoints = {};
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
    ref array<string> UnitIds = {};
    ref map<string, ref COMMAND_ORBAT_OwnedRoute> Routes = new map<string, ref COMMAND_ORBAT_OwnedRoute>();
    ref map<string, AIWaypoint> Orders = new map<string, AIWaypoint>();
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
    protected bool m_LegacyRelay;
    protected bool m_OrdersAllowed;
    protected int m_CapabilityMode;
    protected string m_Expected;
    ref JSOC_ORBAT_GMRecord Pending;
    string Status = "No GM request loaded";
    void Pair(string endpoint, string code) { Stop(); m_LegacyRelay = false; m_OrdersAllowed = false; m_CapabilityMode = 3; m_Context = GetGame().GetRestApi().GetContext(endpoint); if (m_Context) m_Context.SetTimeout(5); m_Code = code; }
    void Stop() { if (m_Callback) { m_Callback.Stopped = true; m_Callback.Owner = null; } m_Callback = null; m_Context = null; m_Code = ""; m_Busy = false; m_OrdersAllowed = false; Pending = null; }
    void Post(string action, string body)
    {
        if (!Replication.IsServer() || !m_Context || m_Busy) return;
        m_Busy = true; m_Callback = new JSOC_ORBAT_GMCallback(); m_Callback.Owner = this; m_Callback.Action = action;
        m_Context.POST(m_Callback, "gm-" + action, body);
    }
    void Poll()
    {
        Status = "Checking paired GM requests";
        if (m_LegacyRelay) Post("poll",string.Format("{\"token\":\"%1\"}",m_Code));
        else if (m_CapabilityMode == 1) Post("poll",string.Format("{\"token\":\"%1\",\"capabilities\":[\"ai-orders-v1\"]}",m_Code));
        else if (m_CapabilityMode == 2) Post("poll",string.Format("{\"token\":\"%1\",\"capabilities\":[\"ai-orders-v1\",\"ai-tactical-v1\"]}",m_Code));
        else Post("poll",string.Format("{\"token\":\"%1\",\"capabilities\":[\"ai-orders-v1\",\"ai-tactical-v1\",\"ai-routes-v1\"]}",m_Code));
    }
    bool CanApprove() { return Pending && Pending.request && !m_Busy; }
    int PreviewCount() { if (!Pending || !Pending.request) { return 0; } if (Pending.request.kind == "ai-route") { return Pending.request.waypoints.Count(); } else { return Pending.request.entities.Count(); } }
    string Preview(int index)
    {
        if (!Pending || !Pending.request) return Status;
        JSOC_ORBAT_GMRequest request = Pending.request;
        if (request.kind == "ai-route")
        {
            if (index < 0 || index >= request.waypoints.Count()) return "Invalid route preview";
            COMMAND_ORBAT_RoutePoint point = request.waypoints[index];
            return string.Format("INFANTRY ROUTE: point %1 / %2\nGroup %3 / unit %4\nX %5 / Z %6\nReview every point with NEXT. Approval installs the full route; arrival is not confirmed.",index+1,request.waypoints.Count(),request.targetRequestId,request.unitId,point.worldX,point.worldZ);
        }
        if (request.kind == "ai-move") return string.Format("MOVE AI infantry group %1 / planned unit %2\nDestination X %3 / Z %4\nReplaces only the previous Companion waypoint. Player-controlled or mounted groups are blocked. Arrival is not confirmed by acceptance.",request.targetRequestId,request.unitId,request.worldX,request.worldZ);
        if (request.kind == "ai-hold") return string.Format("HOLD AI infantry group %1 / planned unit %2\nWait at current leader position for %3 seconds. AI may still react to combat.\nPlayer-controlled or mounted groups are blocked.",request.targetRequestId,request.unitId,request.holdSeconds);
        if (request.kind == "ai-defend") return string.Format("DEFEND infantry AI group %1 / planned unit %2\nX %3 / Z %4 for %5 seconds, using the native defend preset.\nApproval confirms installation, not arrival or successful defence.",request.targetRequestId,request.unitId,request.worldX,request.worldZ,request.holdSeconds);
        if (request.kind == "ai-halt") return "CANCEL the Companion-owned movement/defend waypoint for group " + request.targetRequestId + " / unit " + request.unitId + ". Combat reactions remain enabled.";
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
        if (action == "poll" && code == 409 && !m_LegacyRelay) { m_CapabilityMode--; m_LegacyRelay = m_CapabilityMode <= 0; m_OrdersAllowed = false; Poll(); return; }
        if (code != 200) { Status = "GM relay rejected request or connection unavailable"; return; }
        if (action == "poll" && !m_LegacyRelay) m_OrdersAllowed = true;
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
        if (record.request.kind == "ai-move" || record.request.kind == "ai-hold" || record.request.kind == "ai-defend" || record.request.kind == "ai-halt" || record.request.kind == "ai-route") Status = "Pending infantry AI order. Review target and waypoint before approving.";
        else Status = string.Format("Pending %1 request %2 (%3 units). Review before approving.", record.request.kind, record.request.requestId, record.request.entities.Count());
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
        if (!Replication.IsServer() || !request || (request.version != 1 && request.version != 2) || !SafeKey(request.requestId) || request.requestId.Length() > 40) return;
        string cached;
        if (m_Results.Find(request.requestId, cached)) { Post("result", cached); return; }
        if (m_Results.Count() >= 100) { Status = "Scene GM command budget reached"; return; }
        if (request.kind == "ai-move" || request.kind == "ai-hold" || request.kind == "ai-defend" || request.kind == "ai-halt" || request.kind == "ai-route") { ExecuteAIOrder(request); return; }
        if (request.version != 1) { Report(request.requestId,"failed","Unsupported GM version for this action",""); return; }
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
            foreach (string routeUnit, COMMAND_ORBAT_OwnedRoute route : group.Routes) if (route) COMMAND_ORBAT_RouteOrders.DeleteWaypoints(route.Waypoints);
            group.Routes.Clear();
            foreach (string orderUnit, AIWaypoint orderWaypoint : group.Orders) if (orderWaypoint) SCR_EntityHelper.DeleteEntityAndChildren(orderWaypoint);
            group.Orders.Clear();
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
            created.Entities.Insert(spawned); created.Ids.Insert(createdId); created.UnitIds.Insert(entity.unitId);
            if (!resultIds.IsEmpty()) resultIds += ","; resultIds += "\"" + createdId + "\"";
        }
        m_Owned.Insert(request.requestId, created); Report(request.requestId, "executed", "Approved prefab batch spawned", resultIds);
    }
    protected void ExecuteAIOrder(JSOC_ORBAT_GMRequest request)
    {
        if (request.version != 2 || !m_OrdersAllowed || !SafeKey(request.targetRequestId) || request.targetRequestId.Length() > 40 || !SafeKey(request.unitId)) { Report(request.requestId,"failed","AI order requires the updated paired mod and a safe target",""); return; }
        if ((request.kind == "ai-move" || request.kind == "ai-defend") && (!(request.worldX >= 0 && request.worldX <= 13500) || !(request.worldZ >= 0 && request.worldZ <= 13500))) { Report(request.requestId,"failed","AI destination is outside supported Everon bounds",""); return; }
        if ((request.kind == "ai-hold" || request.kind == "ai-defend") && (request.holdSeconds < 5 || request.holdSeconds > 300)) { Report(request.requestId,"failed","Hold duration must be 5 to 300 seconds",""); return; }
        JSOC_ORBAT_GMSpawnGroup ownedBatch;
        if (!m_Owned.Find(request.targetRequestId,ownedBatch)) { Report(request.requestId,"failed","Only bridge-created groups can receive AI orders",""); return; }
        int index = ownedBatch.UnitIds.Find(request.unitId);
        if (index < 0 || index >= ownedBatch.Entities.Count()) { Report(request.requestId,"failed","Owned unit identity is unavailable",""); return; }
        SCR_AIGroup group = SCR_AIGroup.Cast(ownedBatch.Entities[index]); AIWaypoint previous;
        ownedBatch.Orders.Find(request.unitId,previous);
        COMMAND_ORBAT_OwnedRoute ownedRoute; ownedBatch.Routes.Find(request.unitId,ownedRoute);
        array<AIWaypoint> previousPoints = {};
        if (ownedRoute) { foreach (AIWaypoint ownedPoint : ownedRoute.Waypoints) if (ownedPoint) previousPoints.Insert(ownedPoint); }
        else if (previous) previousPoints.Insert(previous);
        string problem = JSOC_ORBAT_AIOrders.Check(group,previous,previousPoints);
        if (!problem.IsEmpty()) { Report(request.requestId,"failed",problem,""); return; }
        if ((request.kind == "ai-defend" || request.kind == "ai-halt") && m_CapabilityMode < 2) { Report(request.requestId,"failed","Paired relay did not negotiate tactical AI support",""); return; }
        if (request.kind == "ai-route" && (m_CapabilityMode < 3 || !COMMAND_ORBAT_RouteOrders.Valid(request))) { Report(request.requestId,"failed","Route requires negotiated support and 1 to 16 valid points",""); return; }
        if (request.kind == "ai-halt")
        {
            if (!COMMAND_ORBAT_RouteOrders.Cancel(group,previousPoints)) { Report(request.requestId,"failed","Owned route cancellation could not be confirmed",""); return; }
            ownedBatch.Orders.Remove(request.unitId); ownedBatch.Routes.Remove(request.unitId);
            Report(request.requestId,"executed","Companion route cancelled; combat reactions remain enabled",""); return;
        }
        COMMAND_ORBAT_OwnedRoute next = new COMMAND_ORBAT_OwnedRoute();
        if (request.kind == "ai-route") next = COMMAND_ORBAT_RouteOrders.Create(request,group);
        else
        {
            AIWaypoint waypoint;
            if (request.kind == "ai-defend") waypoint = COMMAND_ORBAT_TacticalOrders.CreateDefend(group,previous,request.worldX,request.worldZ,request.holdSeconds,previousPoints);
            else waypoint = JSOC_ORBAT_AIOrders.Create(request,group);
            if (waypoint) next.Waypoints.Insert(waypoint);
        }
        if (!next || next.Waypoints.Count() < 1) { Report(request.requestId,"failed","Required native waypoints unavailable; previous order retained",""); return; }
        if (!COMMAND_ORBAT_RouteOrders.Replace(group,previousPoints,next.Waypoints))
        {
            COMMAND_ORBAT_RouteOrders.DeleteWaypoints(next.Waypoints);
            Report(request.requestId,"failed","Route attachment failed; previous waypoints retained or restored",""); return;
        }
        ownedBatch.Routes.Set(request.unitId,next); ownedBatch.Orders.Set(request.unitId,next.Waypoints[0]);
        if (request.kind == "ai-route") { Report(request.requestId,"executed","Native route installed in order; travel and arrival are not confirmed",""); return; }
        if (request.kind == "ai-move") Report(request.requestId,"executed","AI move waypoint accepted; arrival is not confirmed","");
        else if (request.kind == "ai-defend") Report(request.requestId,"executed","Native defend waypoint accepted; arrival and combat outcome are unconfirmed","");
        else Report(request.requestId,"executed","Timed AI hold waypoint accepted; combat reactions remain possible","");
    }
    protected void Report(string id, string status, string message, string ids)
    {
        string body = string.Format("{\"token\":\"%1\",\"result\":{\"requestId\":\"%2\",\"status\":\"%3\",\"message\":\"%4\",\"createdIds\":[%5]}}", m_Code,id,status,message,ids);
        m_Results.Insert(id,body); Status = message; Post("result",body);
    }
};
