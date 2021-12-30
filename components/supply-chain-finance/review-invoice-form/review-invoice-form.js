define([
    "ojL10n!resources/nls/review-invoice-form",
    "knockout",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojbutton"
], function (resourceBundle, ko, oj) {
    "use strict";

    return function (params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);
        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.hideButtons = ko.observable(false);
        self.isEdit = ko.observable(true);

        if (params.rootModel.params.mode && params.rootModel.params.mode === "approval") {
            if (!params.rootModel.params.data.invoiceId) {
                params.dashboard.headerName(self.nls.createHeader);
                self.isEdit(false);
            }

            self.invoiceData = ko.mapping.fromJS(params.rootModel.params.data);

            if(self.invoiceData.fileName){
                self.invoiceData.totalAmount = ko.mapping.fromJS(self.invoiceData.totalInvoiceAmount);
            }

            self.hideButtons(true);

            (function (extensionObject) {
                extensionObject.isSet = true;
                extensionObject.data = self.params.data;
                extensionObject.template = "supply-chain-finance/update-invoice-confirmation-checker";

                extensionObject.customFields = {
                    resourceBundle: self.nls,
                    customerInvoiceNumber: self.invoiceData.invoiceNumber
                };
            })(self.params.confirmScreenExtensions);

        } else {
            self.invoiceData = ko.mapping.fromJS(params.rootModel.params.data.invoiceList);
        }

        self.programsgetVar = ko.observable();
        self.programsgetprogramName = ko.observable();
        self.programsgetprogramType = ko.observable();
        self.programsgetprogramCode = ko.observable();
        self.programsgetsupplierId = ko.observable();
        self.programsgetbuyerId = ko.observable();
        self.programsgetspokeId = ko.observable();
        self.programsgetrole = ko.observable();
        self.counterPartiesgetVar = ko.observable();
        self.counterPartiesgetprogramCode = ko.observable();

        self.isCommodityAdded = "N";
        self.programName = ko.observable();
        self.totalAmount = ko.observable();
        self.addCommodity = self.nls.no;
        self.commodityId = 1;
        self.commodityList = self.invoiceData.commodities;
        self.invoiceAmount = ko.observable(self.invoiceData.amount.amount());
        params.baseModel.registerComponent("invoice-create-details", "supply-chain-finance");
        params.baseModel.registerComponent("select-role-invoice", "supply-chain-finance");

        if (self.commodityList && self.commodityList!==null && self.commodityList().length > 0) {
            self.isCommodityAdded = "Y";
            self.addCommodity = self.nls.yes;

            let amount = 0;

            for (let i = 0; i < self.commodityList().length; i++) {
                self.commodityList()[i].id = self.commodityId;
                self.commodityList()[i].currency = self.invoiceData.amount.currency();
                amount += self.commodityList()[i].totalCost();
                self.commodityId++;
            }

            self.totalAmount(amount);

            self.dataSource23 = new oj.ArrayTableDataSource(self.commodityList, {
                idAttribute: "id"
            });
        }

        self.onClickConfirm16 = function () {
            params.rootModel.params.updateInvoice().then(function (data) {
                const confirmMessage = self.nls.confirmScreen.confirmMessage,
                    transactionName = self.nls.componentHeader;

                params.dashboard.loadComponent("confirm-screen", {
                    transactionResponse: data,
                    transactionName: transactionName,
                    customFields: {
                        resourceBundle: self.nls,
                        customerInvoiceNumber: self.invoiceData.invoiceNumber,
                        invoiceRefNumber: data.invoice ? data.invoice.invoiceId : "-",
                        programName: self.invoiceData.program.programName
                    },
                    confirmScreenExtensions: {
                        confirmScreenMsgEval: function (data) {
                            return confirmMessage;
                        },
                        isSet: true,
                        template: "supply-chain-finance/update-invoice-confirmation"
                    }
                });
            });
        };

        self.onClickCancel81 = function () {
            params.dashboard.switchModule(true);
        };

        self.onClickBack37 = function () {
            params.dashboard.hideDetails();
        };
    };
});