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
        string rawWorld=GetGame().GetWorldFile();
        rawWorld.Replace("\\","/");
        // Packed worlds are reported as $AddonID:relative/path, not an absolute file.
        // Check the loaded namespace against the expected loaded addon before stripping it.
        bool packedWorld=rawWorld.Length()>0 && rawWorld.Substring(0,1)=="$";
        if (packedWorld)
        {
            int colon=rawWorld.IndexOf(":");
            string addonName=GameProject.GetAddonID(identity.addonId);
            if (colon<2 || addonName.IsEmpty() || rawWorld.Substring(1,colon-1)!=addonName)
            {
                Print("[COMMAND TERRAIN] Loaded addon namespace mismatch");
                return;
            }
            rawWorld=rawWorld.Substring(colon+1,rawWorld.Length()-colon-1);
        }
        rawWorld.ToLower();
        string relative=identity.path; relative.ToLower();
        string suffix="/"+relative;
        bool pathMatches=rawWorld==relative;
        // Packed paths are already addon-relative: never accept a shortened suffix.
        if (!packedWorld && rawWorld.Length()>=suffix.Length())
            pathMatches=pathMatches || rawWorld.Substring(rawWorld.Length()-suffix.Length(),suffix.Length())==suffix;
        if (!pathMatches) { Print("[COMMAND TERRAIN] Loaded world path mismatch"); return; }

        string observed=rawWorld.Substring(rawWorld.Length()-identity.path.Length(),identity.path.Length());
        Print("[COMMAND TERRAIN] Loaded world path matched; GUID remains unverified");
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
// Runs after world initialization even when the diagnostic terrain has no game mode.
modded class ArmaReforgerScripted
{
    override void OnAfterInit(BaseWorld world)
    {
        super.OnAfterInit(world);
        GetGame().GetCallqueue().CallLater(COMMAND_TerrainSampler.Run,1000,false);
    }
};
