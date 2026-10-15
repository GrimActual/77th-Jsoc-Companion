// Optional diagnostic addon only. No entity creation, transforms, mission saves or networking.
class COMMAND_TerrainWorldIdentity
{
    string addonId;
    string guid;
    string path;
};
class COMMAND_TerrainGroundSample
{
    float worldX;
    float worldZ;
    float surfaceY;
};
class COMMAND_TerrainSampler
{
    static bool HexId(string value)
    {
        if (value.Length()!=16) return false;
        string allowed="0123456789abcdefABCDEF";
        for (int i=0;i<16;i++) if (allowed.IndexOf(value.Substring(i,1))<0) return false;
        return value!="0000000000000000";
    }
    static void Run()
    {
        if (!Replication.IsServer()) return;
        JsonLoadContext input=new JsonLoadContext();
        if (!input.LoadFromFile("$profile:COMMAND-terrain-query.json")) return;
        bool enabled;
        int version;
        ref COMMAND_TerrainWorldIdentity identity;
        ref array<ref COMMAND_TerrainGroundSample> samples={};
        if (!input.ReadValue("enabled",enabled) || !enabled || !input.ReadValue("version",version) || version!=1 || !input.ReadValue("world",identity) || !identity || !input.ReadValue("samples",samples) || samples.Count()<1 || samples.Count()>300) { Print("[COMMAND TERRAIN] Invalid query"); return; }
        if (!HexId(identity.addonId) || !HexId(identity.guid) || identity.path.Length()<5 || identity.path.Length()>512 || identity.path.Contains("..") || identity.path.Contains(":") || identity.path.Contains("\\")) { Print("[COMMAND TERRAIN] Invalid identity"); return; }
        PrintFormat("[COMMAND TERRAIN] Raw world=%1 subscene=%2",GetGame().GetWorldFile(),GetGame().GetWorld().GetSubSceneName(0));
        string rawWorld=GetGame().GetWorldFile(); rawWorld.Replace("\\","/"); rawWorld.ToLower(); string suffix="/"+identity.path; suffix.ToLower(); string relative=identity.path; relative.ToLower(); if (rawWorld!=relative && (rawWorld.Length()<suffix.Length() || rawWorld.Substring(rawWorld.Length()-suffix.Length(),suffix.Length())!=suffix)) { Print("[COMMAND TERRAIN] Loaded world path mismatch"); return; }
        string observed=rawWorld.Substring(rawWorld.Length()-identity.path.Length(),identity.path.Length());
        Print("[COMMAND TERRAIN] Loaded world path matched; addon and GUID remain declarations");
        foreach (COMMAND_TerrainGroundSample sample : samples)
        {
            if (!sample || !(sample.worldX>=0 && sample.worldX<=13450) || !(sample.worldZ>=0 && sample.worldZ<=13450)) { Print("[COMMAND TERRAIN] Coordinate rejected"); return; }
            sample.surfaceY=GetGame().GetWorld().GetSurfaceY(sample.worldX,sample.worldZ);
            if (!(sample.surfaceY>=-1000 && sample.surfaceY<=10000)) { Print("[COMMAND TERRAIN] Height rejected"); return; }
        }
        JsonSaveContext output=new JsonSaveContext();
        output.WriteValue("schema","command-terrain-observation");
        output.WriteValue("version",1);
        output.WriteValue("world",identity);
        output.WriteValue("observedWorldFile",observed);
        output.WriteValue("engineVersion",GetGame().GetBuildVersion());
        output.WriteValue("method","GetSurfaceY");
        output.WriteValue("samples",samples);
        bool saved=output.SaveToFile("$profile:COMMAND-terrain-observation.json");
        PrintFormat("[COMMAND TERRAIN] Export saved=%1 samples=%2",saved,samples.Count());
    }
};
modded class SCR_BaseGameMode
{
    override void OnGameStart()
    {
        super.OnGameStart();
        GetGame().GetCallqueue().CallLater(COMMAND_TerrainSampler.Run,1000,false);
    }
};



