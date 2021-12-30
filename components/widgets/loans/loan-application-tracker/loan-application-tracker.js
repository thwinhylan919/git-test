define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/loan-application-tracker",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup"
], function(ko, LoanAppTrackerModel, resourceBundle) {
    "use strict";

    return function(params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);
        params.baseModel.registerComponent("loan-application-listing", "process-management");
        self.nls = resourceBundle;
        self.accountsListLoaded = ko.observable(false);
        self.submitted = 0;
        self.drafts = 0;
        self.approved = 0;
        self.rejected = 0;
        self.inProgress = 0;

         LoanAppTrackerModel.mepartyget().then(function (response) {

        LoanAppTrackerModel.getProcessSnapshots(response.party.id.value).then(function(listData) {
            self.accountsListLoaded(false);

            for (let i = 0; i < listData.processManagementDTOs.length; i++) {

                switch (listData.processManagementDTOs[i].status) {

                    case "DRAFT":
                        self.drafts = self.drafts + 1;
                        break;
                    case "SUBMITTED":
                        self.submitted = self.submitted + 1;
                        break;
                    case "IN_PROGRESS":
                        self.inProgress = self.inProgress + 1;
                        break;
                    case "APPROVED":
                        self.approved = self.approved + 1;
                        break;
                    case "REJECTED":
                        self.rejected = self.rejected + 1;
                        break;

                }
            }

            self.accountsListLoaded(true);
        });
          });
    };
});