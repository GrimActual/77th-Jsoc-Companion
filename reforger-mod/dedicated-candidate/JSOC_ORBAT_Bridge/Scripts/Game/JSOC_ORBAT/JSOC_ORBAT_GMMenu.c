class JSOC_ORBAT_GMHandler : ScriptedWidgetEventHandler
{
    Widget Root;
    JSOC_ORBAT_PairingHandler Owner;
    JSOC_ORBAT_HostGM GM;
    int UnitIndex;
    void Refresh()
    {
        if (!Root || !GM) return;
        TextWidget status = TextWidget.Cast(Root.FindAnyWidget("GMStatus")); if (status) status.SetText(GM.Status);
        TextWidget preview = TextWidget.Cast(Root.FindAnyWidget("GMPreview")); if (preview) preview.SetText(GM.Preview(UnitIndex));
        Widget approve = Root.FindAnyWidget("GMApprove"); if (approve) approve.SetEnabled(GM.CanApprove());
        Widget reject = Root.FindAnyWidget("GMReject"); if (reject) reject.SetEnabled(GM.CanApprove());
    }
    override bool OnClick(Widget w, int x, int y, int button)
    {
        if (!Root || !GM || !w) return false;
        string name = w.GetName();
        if (name == "GMDone") { Owner.CloseGM(); return true; }
        if (name == "GMPoll") { UnitIndex = 0; GM.Poll(); }
        if (name == "GMApprove" && GM.CanApprove()) GM.Approve();
        if (name == "GMReject" && GM.CanApprove()) GM.Reject();
        if (name == "GMNext" && GM.Pending && GM.Pending.request && GM.Pending.request.entities.Count() > 0) UnitIndex = (UnitIndex+1) % GM.Pending.request.entities.Count();
        Refresh(); return true;
    }
};
