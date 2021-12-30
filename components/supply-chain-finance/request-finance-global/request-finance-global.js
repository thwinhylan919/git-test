define([
    "ojL10n!resources/nls/request-finance-global",
    "./model",
    "knockout",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton"
], function (resourceBundle, Model, ko) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.mepartygetVar = ko.observable();
        self.partyId = ko.observable();
        self.partyName = ko.observable();
        params.baseModel.registerComponent("request-finance-basic-details", "supply-chain-finance");
        params.baseModel.registerComponent("request-finance-invoice-list", "supply-chain-finance");
        self.selectedComponent = ko.observable("request-finance-basic-details");

        if (params.rootModel.previousState && params.rootModel.previousState.fromReview) {
            self.selectedComponent("request-finance-invoice-list");
        }

        self.fromReview = false;

        self.dataLoaded = ko.observable(true);
        self.currencyCountMap = params.rootModel.previousState ? params.rootModel.previousState.data.navData.currencyCountMap : ko.observableArray();
        self.currencyConversionMap = params.rootModel.previousState ? params.rootModel.previousState.data.navData.currencyConversionMap : ko.observableArray();
        self.invoiceList = params.rootModel.previousState ? params.rootModel.previousState.data.navData.invoiceData : ko.observableArray();

        const getNewKoModel = function () {
            const KoModel = Model.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.modelInstance = params.rootModel.previousState ? params.rootModel.previousState.data : getNewKoModel();

        Model.mepartyget().then(function (response) {
            self.mepartygetVar(response);
            self.partyId(response.party.id.displayValue);
            self.partyName(response.party.personalDetails.fullName);
        });
    };
});