define([
    "ojL10n!resources/nls/review-invoice-creation-form",
    "knockout",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (resourceBundle, ko, oj) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);

        self.invoiceData = ko.mapping.fromJS(params.referenceData.payload);
        self.invoiceAmount = ko.observable(params.referenceData.invoiceAmount);
        self.totalAmount = ko.observable(params.referenceData.totalAmount);
        self.formId = params.referenceData.formId;
        self.isCommodityAdded = params.referenceData.isCommodityAdded;
        self.isExpanded = ko.observable(false);
        self.commodityList = self.invoiceData.commodities;

        if (self.isCommodityAdded === "N") {
            self.addCommodity = self.nls.no;
        } else {
            self.addCommodity = self.nls.yes;
        }

        if (self.commodityList) {
            for (let i = 0; i < self.commodityList().length; i++) {
                self.commodityList()[i].currency = self.invoiceData.amount.currency();
            }

            self.dataSource23 = new oj.ArrayTableDataSource(self.commodityList, {
                idAttribute: "id"
            });
        }
    };
});