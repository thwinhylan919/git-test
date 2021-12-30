define([
    "ojL10n!resources/nls/review-split-bill-request",
    "./model",
    "knockout",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojavatar",
    "ojs/ojbutton"
], function (resourceBundle, Model, ko) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);

        self.userInitials = params.rootModel.params.userInitials;
            self.modelInstance = params.rootModel.params.modelInstance;
            self.userName = params.rootModel.params.userName;
            self.myAmount = params.rootModel.params.myAmount;
            self.payeeMap = params.rootModel.params.payeeMap;
            self.vpaArrayMap=params.rootModel.params.vpaArrayMap;

            self.onClickConfirm39 =function() {
                    Model.paymentstransfersupiFundRequestsplitBillpost(ko.mapping.toJSON(self.modelInstance)).then(function (response) {
                    params.dashboard.loadComponent("confirm-screen", {
                    transactionResponse: response,
                    hostReferenceNumber: response.status.externalReferenceNumber,
                    transactionName: self.nls.heading.SplitMoney,
                    confirmScreenExtensions: {
                    isSet: true,
                    template: "confirm-screen/split-bill-template"
                    },
                    resource : self.nls,
                    userName : self.userName,
                    myAmount :self.myAmount,
                    payeeMap :self.payeeMap,
                    vpaArrayMap:self.vpaArrayMap,
                    modelInstance: self.modelInstance,
                    userInitials :self.userInitials
                });
            });
        };

    };
});