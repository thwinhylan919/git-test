define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/pending-for-action-mail-box"
], function(ko, PendingActions, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.nls = resourceBundle;
        self.totalCountVar = 0;
        self.totalCount = ko.observable(0);
        self.dataLoaded = ko.observable(false);
        self.loadImage = ko.observable("dashboard/pending-for-approval.svg");
        self.hasAccess = ko.observable(false);

        function setData(data) {
            if (data.countDTOList.length) {
                for (let j = 0; j < data.countDTOList.length; j++) {
                    const count = data.countDTOList[j].pendingApproval || 0;

                    self.totalCountVar += count;
                }

                self.totalCount(self.totalCountVar);
                self.dataLoaded(true);
                self.hasAccess(true);
            }
        }

        PendingActions.getCountForApproval(rootParams.dashboard.appData.segment === "CORPADMIN" ? "PA" : rootParams.dashboard.appData.segment === "ADMIN" ? "A" : "P").then(function(data) {
            setData(data);
        }).catch(function() {
            self.hasAccess(false);
            self.dataLoaded(true);
        });

        self.switchRole = function(root) {
            root.currentRole("checker");
            rootParams.dashboard.switchModule("checker");
        };
    };
});