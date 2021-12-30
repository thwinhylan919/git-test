define([
    "ojL10n!resources/nls/request-finance-review",
    "knockout",
    "./model",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojbutton",
    "ojs/ojpagingtabledatasource"
], function (resourceBundle, ko, Model, oj) {
    "use strict";

    return function (params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);
        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("view-finances", "supply-chain-finance");
        params.baseModel.registerComponent("view-invoice-details", "supply-chain-finance");
        params.rootModel.params.fromReview = true;
        self.hideButtons = ko.observable(false);

        if (params.rootModel.params.mode && params.rootModel.params.mode === "approval") {

            self.data = ko.mapping.fromJS(params.rootModel.params.data);
            self.invoiceList = ko.mapping.fromJS(params.rootModel.params.data.invoices);

            (function (extensionObject) {
                extensionObject.isSet = true;
                extensionObject.data = self.params.data;
                extensionObject.template = "supply-chain-finance/request-finance/request-finance-confirm-screen-checker";

                extensionObject.customFields = {
                    resourceBundle: self.nls,
                    amountRequested: self.data.totalAmount.amount,
                    disbursementCurrency: self.data.totalAmount.currency
                };
            })(self.params.confirmScreenExtensions);

            self.hideButtons(true);
        } else {
            self.data = ko.mapping.fromJS(params.rootModel.params.data.payLoad);
            self.invoiceList = ko.mapping.fromJS(params.rootModel.params.data.payLoad.invoices);
        }

        self.columnsArray = [{
                headerText: self.nls.invoiceNumber,
                sortable: false
            },
            {
                headerText: self.nls.invoiceAmount,
                sortable: false,
                headerClassName: "right"
            },
            {
                headerText: self.nls.totalInvoiceAmount,
                sortable: false,
                headerClassName: "right"
            },
            {
                headerText: self.nls.maximumFinanceAmount,
                sortable: false,
                headerClassName: "right"
            },
            {
                headerText: self.nls.outstandingAmount,
                sortable: false,
                headerClassName: "right"
            },
            {
                headerText: self.nls.netFinanceAmount,
                sortable: false,
                headerClassName: "right"
            }
        ];

        self.onClickConfirm = function () {
            Model.requestFinance(ko.toJSON(ko.mapping.toJS(self.data))).then(function (data) {
                const confirmMessage = self.nls.confirmMessage;

                params.dashboard.loadComponent("confirm-screen", {
                    transactionResponse: data,
                    transactionName: self.nls.componentHeader,
                    hostReferenceNumber: data.finance ? data.finance.requestId : "-",
                    customFields: {
                        resourceBundle: self.nls,
                        amountRequested: self.data.totalAmount.amount,
                        disbursementCurrency: self.data.totalAmount.currency
                    },
                    confirmScreenExtensions: {
                        confirmScreenMsgEval: function () {
                            return confirmMessage;
                        },
                        isSet: true,
                        template: "supply-chain-finance/request-finance/request-finance-confirm-screen"
                    }
                });
            });
        };

        self.dataSource58 = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.invoiceList, {
            idAttribute: "invoiceId"
        }));

        self.onClickCancel = function () {
            params.dashboard.switchModule(true);
        };

        self.onClickBack = function () {
            if(params.rootModel.params.fromDetailInvoice){
                params.dashboard.loadComponent("view-invoice-details", {
                    role : self.data.role(),
                    invoiceNo: self.data.invoices()[0].invoiceId
                });
            } else {
                params.dashboard.hideDetails();
            }
        };
    };
});