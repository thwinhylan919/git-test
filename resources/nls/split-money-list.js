define([], function() {
    "use strict";

    const splitmoneylistLocale = function() {
        return {
            root: {
                heading: { SelectContributors: "Select Contributors" },
                SelectContributors: {
                    DeleteContributor: "Delete Contributor",
                    DeleteContributorTitle: "Click for Delete Contributor",
                    name: "name",
                    SelectContributors: "Select Contributors",
                    AddAdhocContributor: "Add Adhoc Contributor",
                    addAnother: "Add Another",
                    AddAdhocContributorTitle: "Click for Add Adhoc Contributor",
                    Proceed: "Proceed",
                    cancel: "Cancel",
                    ContributorName: "Contributor Name",
                    VPAId: "VPA Id",
                    AdhocContributornumber: "Adhoc Contributor {number}",
                    Clearadhoccontributor: "Clear  adhoc contributor",
                    ClearadhoccontributorTitle: "Click for Clear  adhoc contributor",
                    Deleteadhoccontributor: "Delete  adhoc contributor",
                    DeleteadhoccontributorTitle: "Click for Delete  adhoc contributor",
                    Done: "Done",
                    Back: "Back",
                    invalidVPA: "VPA ID {VPAId} is invalid",
                    BackToContributors: "Back To Contributors",
                    BackToContributorsAlt: "Back To Contributors",
                    maxPayeeLimit: "You have reached the maximum count of contributors allowed per Split Bill transaction.",
                    minPayeeLimit: "Please add at least one contributor in order to proceed with Split Bill."
                },
                componentHeader: "Select Contributors",
                search: "Name/VPA"
            },
            ar: true,
            fr: true,
            cs: true,
            sv: true,
            en: false,
es :true,
            "en-us": false,
            el: true
        };
    };

    return new splitmoneylistLocale();
});