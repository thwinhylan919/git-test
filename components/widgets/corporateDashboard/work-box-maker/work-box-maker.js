define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/maker-work-box",
    "ojs/ojdatetimepicker",
    "ojs/ojselectcombobox"
], function(ko, $, Model, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this,

            financialTxn = [
                "ACCOUNT_FINANCIAL",
                "AMOUNT_FINANCIAL",
                "PAYMENTS",
                "BULK_FILE",
                "BULK_RECORD",
                "AMOUNT_FINANCIAL_BULK_RECORD",
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

        self.nls = resourceBundle;
        self.dataLoaded = ko.observable(false);
        self.workBoxData = ko.observableArray([]);
        self.txnListData = ko.observableArray([]);
        self.heading = self.nls.activityHeader;
        self.txnType = ko.observable("financialTxn");
        self.filterDateRange = ko.observable(false);
        rootParams.baseModel.registerComponent("accounts-financial", "approvals");
        rootParams.baseModel.registerComponent("amount-financial", "approvals");
        rootParams.baseModel.registerComponent("accounts-non-financial", "approvals");
        rootParams.baseModel.registerComponent("beneficiary", "approvals");
        rootParams.baseModel.registerComponent("biller-registration-approval", "approvals");
        rootParams.baseModel.registerComponent("bulk", "approvals");
        rootParams.baseModel.registerComponent("payment-transactions", "approvals");
        rootParams.baseModel.registerComponent("electronic-bill-payments", "approvals");
        rootParams.baseModel.registerComponent("bulk-record", "approvals");
        rootParams.baseModel.registerComponent("non-account-bulk-record", "approvals");
        rootParams.baseModel.registerComponent("bulk-file-non-financial", "approvals");
        rootParams.baseModel.registerComponent("bulk-record-non-financial", "approvals");
        rootParams.baseModel.registerComponent("trade-finance-approval", "approvals");
        rootParams.baseModel.registerComponent("other-transactions-approval", "approvals");
        rootParams.baseModel.registerComponent("transaction-detail", "approvals");
        rootParams.baseModel.registerComponent("forex-deal-transactions", "approvals");
        rootParams.baseModel.registerComponent("liquidity-management-approval", "approvals");
        self.loadModule = ko.observable();
        self.toDate = ko.observable();
        self.fromDate = ko.observable();
        rootParams.baseModel.registerComponent("work-box-corporate", "widgets/corporateDashboard");

        rootParams.baseModel.registerElement([
            "action-widget"
        ]);

        self.view = null;

        self.getRootContext = function() {
            if (rootParams.rootModel) {
                if (rootParams.rootModel.params && rootParams.rootModel.params.role === "viewer") {
                    self.view = "all";
                } else {
                    self.view = "created";
                }
            } else {
                self.view = "created";
            }

            Model.getCountList(self.view).then(function(data) {
                self.setData(data);
                self.dataLoaded(true);
            });
        };

        ko.utils.arrayPushAll(self.txnListData, txnList);

        self.dateFilter = function() {
            const discriminator = self.loadModule();

            self.loadModule(false);
            ko.tasks.runEarly();
            self.loadModule(discriminator);

            Model.getCountList(self.view, self.fromDate(), self.toDate()).then(function(data) {
                self.setData(data);
            });
        };

        function txnTypeChanged(newValue) {
            if (newValue === "financialTxn") {
                self.workBoxData.removeAll();
                ko.utils.arrayPushAll(self.workBoxData, financialTxnList);
            } else {
                self.workBoxData.removeAll();
                ko.utils.arrayPushAll(self.workBoxData, nonFinancialTxnList);
            }

            if (rootParams.baseModel.large()) {
                self.loadComponentData(self.workBoxData()[0]);
            }
        }

        self.setData = function(data) {
            if (data.countDTOList && data.countDTOList.length) {
                data = data.countDTOList;
                financialTxnList.length = 0;
                nonFinancialTxnList.length = 0;

                for (let i = 0; i < data.length; i++) {
                    const record = data[i];

                    record.status = [];
                    record.header = resourceBundle[record.transactionType];
                    record.countForHeader = 0;

                    record.status.push({
                        count: record.approved || 0,
                        status: resourceBundle.approved,
                        icon: "icon icon-check"
                    });

                    record.status.push({
                        count: record.initiated || 0,
                        status: resourceBundle.initiated,
                        icon: "icon icon-alert"
                    });

                    record.status.push({
                        count: record.rejected || 0,
                        status: resourceBundle.rejected,
                        icon: "icon icon-close"
                    });

                    if (financialTxn.indexOf(data[i].transactionType) > -1) {
                        financialTxnList.push(record);
                    }

                    if (nonFinancialTxn.indexOf(data[i].transactionType) > -1) {
                        nonFinancialTxnList.push(record);
                    }

                    record.status.forEach(function(v) {
                        record.countForHeader = record.countForHeader + parseInt(v.count);
                    });
                }
            }

            txnTypeChanged(self.txnType());
        };

        self.ctrl2 = function() {
            if (self.filterDateRange()) {
                self.filterDateRange(false);
            } else {
                self.filterDateRange(true);
            }
        };

        self.txnType.subscribe(txnTypeChanged);

        self.loadComponentData = function(newValue) {
            const type = newValue.transactionType;

            $("div#loadModuleClass").removeClass();

            setTimeout(function() {
                $("div#loadModuleClass").addClass(type.toLowerCase());
                $("div#loadModuleClass").addClass("animate");

                switch (type) {
                    case "ACCOUNT_FINANCIAL":
                        self.loadModule("accounts-financial");
                        break;
                    case "AMOUNT_FINANCIAL":
                        self.loadModule("amount-financial");
                        break;
                    case "ACCOUNT_NON_FINANCIAL":
                        self.loadModule("accounts-non-financial");
                        break;
                    case "PAYMENTS":
                        self.loadModule("payment-transactions");
                        break;
                    case "ELECTRONIC_BILL_PAYMENTS":
                        self.loadModule("electronic-bill-payments");
                        break;
                    case "BULK_FILE":
                        self.loadModule("bulk");
                        break;
                    case "NON_FINANCIAL_BULK_FILE":
                        self.loadModule("bulk-file-non-financial");
                        break;
                    case "PAYEE_BILLER":
                        self.loadModule("beneficiary");
                        break;
                    case "BULK_RECORD":
                        self.loadModule("bulk-record");
                        break;
                    case "AMOUNT_FINANCIAL_BULK_RECORD":
                        self.loadModule("non-account-bulk-record");
                        break;
                    case "NON_FINANCIAL_BULK_RECORD":
                        self.loadModule("bulk-record-non-financial");
                        break;
                    case "TRADE_FINANCE":
                        self.loadModule("trade-finance-approval");
                        break;
                    case "PARTY_MAINTENANCE":
                        self.loadModule("corporate-activity-log");
                        break;
                    case "ADMIN_MAINTENANCE":
                        self.loadModule("admin-activity-log");
                        break;
                    case "FOREX_DEAL":
                        self.loadModule("forex-deal-transactions");
                        break;
                    case "LIQUIDITY_MANAGEMENT":
                        self.loadModule("liquidity-management-approval");
                        break;
                    case "OTHER_TRANSACTION":
                        self.loadModule("other-transactions-approval");
                        break;
                    case "BILLER_MAINTENANCE":
                        self.loadModule("biller-registration-approval");
                        break;
                    default:
                        self.loadModule("accounts-financial");
                        break;
                }

                if (!rootParams.baseModel.large()) {
                    rootParams.dashboard.loadComponent(ko.toJS(self.loadModule), {
                        view: self.view,
                        countForHeader: newValue.countForHeader
                    });
                }
            }, 100);
        };
    };
});