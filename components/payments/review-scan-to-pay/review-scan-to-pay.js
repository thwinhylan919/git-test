define([
    "knockout",
    "ojL10n!resources/nls/review-scan-to-pay",
    "./model",
    "ojs/ojinputtext",
    "framework/elements/api/account-input/loader"
], function (ko, ResourceBundle, Model) {
    "use strict";

    return function (rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.scanToPay = self.params.scanToPay;
        self.resource = ResourceBundle;
        rootParams.dashboard.headerName(self.resource.header);
        rootParams.baseModel.registerElement(["confirm-screen"]);

        self.cancel = function () {
            rootParams.baseModel.switchPage({}, false, true, null);
        };

        self.handleOk = function () {
            window.location.assign("index.html");
        };

        self.confirm = function () {
            const payload = ko.mapping.toJSON(self.scanToPay);

            Model.makePayment(payload).done(function (data, status, jqXHR) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    transactionName: self.resource.header,
                    confirmScreenExtensions: {
                        isSet: true,
                        template: "confirm-screen/scan-to-pay"
                    }
                }, self);
            });
        };
    };
});