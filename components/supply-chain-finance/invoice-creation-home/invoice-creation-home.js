define([
    "ojL10n!resources/nls/invoice-creation-home",
    "knockout",
    "./model",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton"
], function (resourceBundle, ko, Model) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.mepartygetVar = ko.observable();
        self.partyId = ko.observable();
        self.partyName = ko.observable();

        Model.mepartyget().then(function (response) {
            self.mepartygetVar(response);
            self.partyId(self.mepartygetVar().party.id.displayValue);
            self.partyName(self.mepartygetVar().party.personalDetails.fullName);
        });

        self.onClickCreateNewInvoice9 = function () {
            params.baseModel.registerComponent("multiple-invoice-creation", "supply-chain-finance");
            params.dashboard.loadComponent("multiple-invoice-creation");
        };

        self.onClickBulkFileUpload97 = function () {
            params.baseModel.registerComponent("file-upload", "file-upload");
            params.dashboard.loadComponent("file-upload");
        };
    };
});