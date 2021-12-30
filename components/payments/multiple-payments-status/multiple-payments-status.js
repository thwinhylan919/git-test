define([
    "ojs/ojcore",
    "knockout",
    "ojL10n!resources/nls/multiple-payments-status",
    "./model",
    "ojs/ojknockout",
    "ojs/ojarraydataprovider",
    "ojs/ojtable",
    "ojs/ojbutton"
], function(oj, ko, ResourceBundle, Model) {
    "use strict";

    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);
        self.resource = ResourceBundle;
        self.isInitAuth = ko.observable(Params.rootModel.params.isInitAuth);
        Params.dashboard.headerName(Params.baseModel.small() ? self.resource.headerSmall : self.resource.header);
        self.statusDataSource = new oj.ArrayDataProvider(self.params.statusData);

        self.isSuccessful = ko.observable(false);
        self.isUetr = false;

        for (let i = 0; i < self.statusDataSource.data.length; i++) {
            if (self.statusDataSource.data[i].isSuccess) { self.isSuccessful(true); }

            if (self.statusDataSource.data[i].response.uniqueEndToEndTxnReference){
              self.isUetr = true;
            }
        }

        self.firstFailedPayment = ko.utils.arrayFirst(self.params.statusData, function(element) {
            return !element.isSuccess;
        });

        self.firstSuccessfulPayment = ko.utils.arrayFirst(self.params.statusData, function(element) {
            return element.isSuccess;
        });

        self.downloadAllEreceipts = function() {
            ko.utils.arrayForEach(self.params.statusData, function(data) {
                if (data.isSuccess) { Model.downloadEreceipt(data.response.status.referenceNumber); }
            });
        };

        self.downloadEreceipt = function(transactionRefNumber) {
            Model.downloadEreceipt(transactionRefNumber);
        };
    };
});