define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/transaction-group",
    "ojs/ojarraytabledatasource",
    "ojs/ojinputtext"
], function(oj, ko, $, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.dashboard.headerName(self.nls.headers.transactiongroupheader);
        rootParams.baseModel.registerElement("action-header");
        self.reviewdatasource = new oj.ArrayTableDataSource([]);
        self.transactionListArray = ko.observableArray();
        self.transactionList = ko.observableArray();
        self.showData = ko.observable(false);
        self.showHeader = ko.observable(false);
        self.showHeaderText = "";

        if (rootParams.rootModel.params.data) {
            self.createtransactionGroupCode = ko.observable(rootParams.rootModel.params.data.name);
            self.createtransactionGroupDesc = ko.observable(rootParams.rootModel.params.data.description);
            self.selectedTaskDto = ko.observableArray(rootParams.rootModel.params.data.taskDTOs);
        } else {
            self.showHeader(true);
            self.createtransactionGroupCode = ko.observable(rootParams.rootModel.params.reviewData.name);
            self.createtransactionGroupDesc = ko.observable(rootParams.rootModel.params.reviewData.description);
            self.selectedTaskDto = ko.observableArray(rootParams.rootModel.params.reviewData.selectedTransactionGroupValues);
        }

        let i = 1;

        self.transactionListArray = $.map(self.selectedTaskDto(), function(temp) {
            const obj = {
                recordNo: i,
                transaction: temp.name ? temp.name : temp
            };

            i++;

            return obj;
        });

        self.reviewdatasource.reset(self.transactionListArray, {
            idAttribute: "recordNo"
        });

        if(!self.showHeader){
            self.showHeaderText =self.nls.fieldname.review;
          }

        self.showData(true);
        ko.tasks.runEarly();
    };
});