define([
    "ojs/ojcore",
    "knockout",
    "ojL10n!resources/nls/multiple-bill-payments-status",
    "./model",
    "ojs/ojknockout",
    "ojs/ojarraytabledatasource",
    "ojs/ojtable",
    "ojs/ojbutton"
], function(oj, ko, ResourceBundle, Model) {
    "use strict";

    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);
        self.resource = ResourceBundle;
        Params.dashboard.headerName(Params.baseModel.small() ? self.resource.headerSmall : self.resource.header);
        self.statusDataSource = new oj.ArrayTableDataSource(self.params.statusData);

        self.isFailed = ko.observable(false);
        self.isSuccessful = ko.observable(false);

        for (let i = 0; i < self.statusDataSource.data.length; i++) {
            if (!self.statusDataSource.data[i].isSuccess) { self.isFailed(true); } else { self.isSuccessful(true); }
        }

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