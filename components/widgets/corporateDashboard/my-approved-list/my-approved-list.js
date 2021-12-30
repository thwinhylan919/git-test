define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/maker-work-box",
    "ojs/ojdatetimepicker",
    "ojs/ojselectcombobox"
], function (ko, Model, resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.Nls = resourceBundle;

        rootParams.baseModel.registerElement([
            "action-widget",
            "nav-bar"
        ]);

        rootParams.baseModel.registerComponent("transaction-detail", "approvals");
        rootParams.baseModel.registerComponent("accounts-financial", "approvals");
        rootParams.baseModel.registerComponent("amount-financial", "approvals");
        rootParams.baseModel.registerComponent("accounts-non-financial", "approvals");
        rootParams.baseModel.registerComponent("beneficiary", "approvals");
        rootParams.baseModel.registerComponent("bulk", "approvals");
        rootParams.baseModel.registerComponent("payment-transactions", "approvals");
        rootParams.baseModel.registerComponent("biller-registration-approval", "approvals");
        rootParams.baseModel.registerComponent("electronic-bill-payments", "approvals");
        rootParams.baseModel.registerComponent("bulk-record", "approvals");
        rootParams.baseModel.registerComponent("non-account-bulk-record", "approvals");
        rootParams.baseModel.registerComponent("bulk-record-non-financial", "approvals");
        rootParams.baseModel.registerComponent("bulk-file-non-financial", "approvals");
        rootParams.baseModel.registerComponent("trade-finance-approval", "approvals");
        rootParams.baseModel.registerComponent("other-transactions-approval", "approvals");
        rootParams.baseModel.registerComponent("forex-deal-transactions", "approvals");
        rootParams.baseModel.registerComponent("liquidity-management-approval", "approvals");
        self.totalCount = ko.observable(0);
        self.filterDateRange = ko.observable(false);
        self.refreshTransactionLog = ko.observable(true);
        self.widgetHeading = ko.observable("");
        self.hostDate = ko.observable();
        self.fromDate = ko.observable();
        self.toDate = ko.observable();
        self.context = self;

        self.txnType = ko.observable().extend({
            notify: "always"
        });

        self.loadModule = ko.observable();
        self.dataUpdated = ko.observable(false);
        self.txnListData = ko.observableArray([]);
        self.menuCountOptions = ko.observableArray();
        self.menuSelection = ko.observable();
        self.view = "approved";

        self.uiOptions = {
            menuFloat: "left",
            fullWidth: false,
            defaultOption: self.menuSelection
        };

        const financialTxn = [
                "ACCOUNT_FINANCIAL",
                "AMOUNT_FINANCIAL",
                "PAYMENTS",
                "BULK_FILE",
                "BULK_RECORD",
                "AMT_FINANCIAL_BULK_RECORD",
                "ELECTRONIC_BILL_PAYMENTS"
            ],
            nonFinancialTxn = [
                "ACCOUNT_NON_FINANCIAL",
                "PAYEE_BILLER",
                "NON_FINANCIAL_BULK_FILE",
                "NON_FINANCIAL_BULK_RECORD",
                "TRADE_FINANCE",
                "FOREX_DEAL",
                "LIQUIDITY_MANAGEMENT",
                "OTHER_TRANSACTION",
                "BILLER_MAINTENANCE"
            ],
            financialTxnList = [],
            nonFinancialTxnList = [],
            txnList = [
                "financialTxn",
                "nonFinancialTxn"
            ];

        ko.utils.arrayPushAll(self.txnListData, txnList);

        self.comboBoxComponent = ko.observable().extend({
            loaded: false
        });

        self.financialTxnCount = ko.observable(0);
        self.nonFinancialTxnCount = ko.observable(0);

        self.setData = function (data) {
            self.totalCount(0);
            self.financialTxnCount(0);
            self.nonFinancialTxnCount(0);
            self.totalCount(0);
            financialTxnList.length = 0;
            nonFinancialTxnList.length = 0;

            if (data.countDTOList && data.countDTOList.length) {
                for (let j = 0; j < data.countDTOList.length; j++) {
                    const count = (data.countDTOList[j].initiated || 0) + (data.countDTOList[j].approved || 0) + (data.countDTOList[j].rejected || 0),
                        record = {
                            label: self.Nls[data.countDTOList[j].transactionType],
                            id: "APPROVED_" + data.countDTOList[j].transactionType,
                            count: count
                        };

                    if (rootParams.dashboard.appData.segment === "ADMIN" || rootParams.dashboard.appData.segment === "CORPADMIN") {
                        self.menuCountOptions.push(record);
                    } else if (financialTxn.indexOf(data.countDTOList[j].transactionType) > -1) {
                        financialTxnList.push(record);
                        self.financialTxnCount(self.financialTxnCount() + count);
                    } else if (nonFinancialTxn.indexOf(data.countDTOList[j].transactionType) > -1) {
                        nonFinancialTxnList.push(record);
                        self.nonFinancialTxnCount(self.nonFinancialTxnCount() + count);
                    }

                    self.totalCount(self.totalCount() + count);
                }

                if (!rootParams.dashboard.isDashboard() && rootParams.baseModel.small()) {
                    rootParams.dashboard.headerName(self.widgetHeading());
                }

                self.txnType("financialTxn");
            }
        };

        self.txnType.subscribe(function (newValue) {
            self.menuCountOptions.removeAll();
            self.dataUpdated(false);
            ko.tasks.runEarly();

            if (newValue === "financialTxn") {
                ko.utils.arrayPushAll(self.menuCountOptions, financialTxnList);
            } else {
                ko.utils.arrayPushAll(self.menuCountOptions, nonFinancialTxnList);
            }

            if (rootParams.baseModel.large()) {
                self.menuSelection(self.menuCountOptions().length ? self.menuCountOptions()[0].id : "");
            }

            self.dataUpdated(true);
        });

        self.menuSelection.subscribe(function (newValue) {
            if(newValue)
                {
                    self.loadComponentData(newValue);
                }
            });

        self.loadComponentData = function (newValue) {
            let value;

            if (!rootParams.baseModel.large()) {
                value = newValue.id;
            } else {
                value = newValue;
            }

            switch (value) {
                case "APPROVED_ACCOUNT_FINANCIAL":
                    self.loadModule("accounts-financial");
                    break;
                case "APPROVED_AMOUNT_FINANCIAL":
                    self.loadModule("amount-financial");
                    break;
                case "APPROVED_ACCOUNT_NON_FINANCIAL":
                    self.loadModule("accounts-non-financial");
                    break;
                case "APPROVED_PAYMENTS":
                    self.loadModule("payment-transactions");
                    break;
                case "APPROVED_BULK_FILE":
                    self.loadModule("bulk");
                    break;
                case "APPROVED_NON_FINANCIAL_BULK_FILE":
                    self.loadModule("bulk-file-non-financial");
                    break;
                case "APPROVED_NON_FINANCIAL_BULK_RECORD":
                    self.loadModule("bulk-record-non-financial");
                    break;
                case "APPROVED_PAYEE_BILLER":
                    self.loadModule("beneficiary");
                    break;
                case "APPROVED_BULK_RECORD":
                    self.loadModule("bulk-record");
                    break;
                case "APPROVED_AMT_FINANCIAL_BULK_RECORD":
                    self.loadModule("non-account-bulk-record");
                    break;
                case "APPROVED_TRADE_FINANCE":
                    self.loadModule("trade-finance-approval");
                    break;
                case "APPROVED_FOREX_DEAL":
                    self.loadModule("forex-deal-transactions");
                    break;
                case "APPROVED_LIQUIDITY_MANAGEMENT":
                    self.loadModule("liquidity-management-approval");
                    break;
                case "APPROVED_OTHER_TRANSACTION":
                    self.loadModule("other-transactions-approval");
                    break;
                case "APPROVED_BILLER_MAINTENANCE":
                    self.loadModule("biller-registration-approval");
                    break;
                case "APPROVED_ELECTRONIC_BILL_PAYMENTS":
                    self.loadModule("electronic-bill-payments");
                    break;
                default:
                    self.loadModule("accounts-financial");
                    break;
            }

            if (!rootParams.baseModel.large()) {
                rootParams.dashboard.loadComponent(self.loadModule(), {
                    view: self.view,
                    countForHeader: newValue.count
                });
            }
        };

        self.showModule = function (module) {
            self.menuSelection(module.id);
            rootParams.dashboard.headerName(self.widgetHeading());
        };

        self.controls = {
            ctrl2: function () {
                if (self.filterDateRange()) {
                    self.filterDateRange(false);
                } else {
                    self.filterDateRange(true);
                }
            }
        };

        self.dateFilter = function () {
            Model.getTransactionsList(self.fromDate(), self.toDate()).then(self.setData);
        };

        self.dateFilter();
    };
});