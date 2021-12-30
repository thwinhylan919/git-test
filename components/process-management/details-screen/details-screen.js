define([ "knockout",
    "ojL10n!resources/nls/details-screen",
    "./model",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup"
], function (ko,resourceBundle, DetailsScreenModel) {
    "use strict";

    return function (rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel.previousState ? rootParams.rootModel.previousState : rootParams.rootModel.params);

        self.nls = resourceBundle;
        rootParams.dashboard.headerName(self.nls.componentHeader);
        rootParams.baseModel.registerElement(["help", "segment-container"]);
        rootParams.baseModel.registerComponent("documents-application-tracker", "credit-facility");
        rootParams.baseModel.registerComponent("view-submitted-application", "credit-facility");
        rootParams.baseModel.registerComponent("facility-application-listing", "process-management");

        self.headerMessages = ko.observableArray();
        self.headerStyle = ko.observable("successHeader");

        self.headerMessages.push({
            icon: "dashboard/confirmation.svg",
            headerMessage:"delta",
            summaryMessage: "summary-msg",
            headerStyle: "successHeader"
          });

        self.partyName = ko.observable();
        self.partyId = ko.observable();

        DetailsScreenModel.fetchParty().done(function (data) {
            self.partyName(data.party.personalDetails.fullName);
            self.partyId(data.party.id.value);
        });

        self.documents = function () {
            rootParams.dashboard.loadComponent("documents-application-tracker", {payload :self.payload,
                type:self.type,
                midOfficeRefNo:self.midOfficeRefNo,
                status:self.status,
                creationDate:self.creationDate,
                partyName:self.partyName(),
                partyId:self.partyId()
            });

        };

        self.applicantDetails = function () {
            rootParams.dashboard.loadComponent("view-submitted-application", {payload :self.payload,
                type:self.type,
                midOfficeRefNo:self.midOfficeRefNo,
                status:self.status,
                creationDate:self.creationDate});
        };

        self.onClickBack = function () {
            history.back();
            rootParams.dashboard.loadComponent("facility-application-listing", {});
        };
    };
});