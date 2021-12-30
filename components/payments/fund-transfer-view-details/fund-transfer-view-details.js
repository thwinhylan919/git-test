define([

    "knockout",

    "ojL10n!resources/nls/fund-transfer-history",
    "load!./fund-transfer-view-details.json",
    "./model",
    "ojs/ojinputnumber",
    "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojdatetimepicker",
    "ojs/ojdialog",
    "ojs/ojavatar",
    "ojs/ojselectcombobox"
], function (ko, ResourceBundle, FundTransferJSON, FundTransferDetailsModel) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.transferData = {
            paymentId: null
        };

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = ResourceBundle;
        self.paymentId = ko.observable();
        self.paymentType = ko.observable();
        self.transactionStatus = self.params.transferData ? self.params.transferData.transactionStatus : null;
        rootParams.dashboard.headerName(self.nls.headers.fundTransferHistory);

        self.paymentDetails = self.params.transferData ? self.params.transferData.reInitiateData : null;
        self.transferData.paymentId = self.params.transferData ? self.params.transferData.paymentId : self.params.paymentId;
        self.paymentId(self.transferData.paymentId);
        self.paymentType(ko.utils.unwrapObservable(self.params.transferData ? self.params.transferData.paymentType : null));
        self.currentModule = FundTransferJSON[self.paymentType()];
        self.loadComponentName = ko.observable();
        self.selectedPaymentType = ko.observable(self.paymentType());

        if (self.paymentDetails.adhocPayment) {
            rootParams.baseModel.registerComponent(self.currentModule.reviewAdhocComponent, self.currentModule.module);
            self.loadComponentName(self.currentModule.reviewAdhocComponent);
        } else {
            rootParams.baseModel.registerComponent(self.currentModule.name, self.currentModule.module);
            self.loadComponentName(self.currentModule.name);
        }

        rootParams.baseModel.registerComponent("payments-money-transfer", "payments");

        self.cancel = function () {
            rootParams.dashboard.switchModule(true);
        };

        self.download = function () {
            FundTransferDetailsModel.download(self.paymentId(), self.currentModule.paymentType, self.currentModule.uri);
        };

        self.reInitiate = function () {
            let loadingComponent;

            if (self.paymentDetails.adhocPayment) {
                loadingComponent = FundTransferJSON[self.selectedPaymentType()].initADhocComponent;
            } else {
                loadingComponent = FundTransferJSON[self.selectedPaymentType()].initComponent;
            }

            if (self.selectedPaymentType() === "PEER_TO_PEER" || self.selectedPaymentType() === "SELFFT" || self.selectedPaymentType() === "INTERNALFT" || self.selectedPaymentType() === "INDIADOMESTICFT") {
                if (rootParams.dashboard.appData.segment === "CORP") {
                    rootParams.baseModel.registerComponent(loadingComponent, "payments");

                    rootParams.dashboard.loadComponent(loadingComponent, {
                        transferObject: self.paymentDetails ? ko.observable(self.paymentDetails) : null
                    });

                } else {

                    rootParams.dashboard.loadComponent("manage-accounts", {
                        applicationType: "payments",
                        defaultTab: loadingComponent,
                        transferObject: self.paymentDetails ? ko.observable(self.paymentDetails) : null
                    });
                }
            } else if (self.selectedPaymentType() === "DOMESTICDRAFT") {
                if (rootParams.dashboard.appData.segment === "CORP") {
                    rootParams.baseModel.registerComponent(loadingComponent, "payments");

                    rootParams.dashboard.loadComponent(loadingComponent, {
                        fundTransferObject: self.paymentDetails ? ko.observable(self.paymentDetails) : null
                    });
                } else {
                    rootParams.dashboard.loadComponent("manage-accounts", {
                        applicationType: "payments",
                        defaultTab: loadingComponent,
                        fundTransferObject: self.paymentDetails ? ko.observable(self.paymentDetails) : null

                    });
                }

            }

        };

    };
});