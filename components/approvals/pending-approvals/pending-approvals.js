define([
    "knockout",
    "jquery",
    "ojs/ojcore",
    "./model",
    "ojL10n!resources/nls/pending-approvals",

    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource",
    "ojs/ojpopup"
], function (ko, $, oj, PendingApprovalModel, resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.loadModule = ko.observable();
        self.transactionListLoaded = ko.observable(false);
        self.transactionList = ko.observableArray();
        self.Nls = resourceBundle;
        self.menuSelection = ko.observable();
        self.menuCountOptions = ko.observableArray();
        self.isPendingApproval = true;

        self.uiOptions = {
            menuFloat: "left",
            fullWidth: false,
            defaultOption: self.menuSelection
        };

        self.totalCountVar = 0;
        self.totalCount = ko.observable(0);
        self.widgetHeading = ko.observable("");
        self.countForHeader = ko.observable();

        self.currentSelection = ko.observable("financialTxn").extend({
            notify: "always"
        });

        const financialTxn = [
                "ACCOUNT_FINANCIAL",
                "PAYMENTS",
                "BULK_FILE",
                "BULK_RECORD"
            ],
            nonFinancialTxn = [
                "ACCOUNT_NON_FINANCIAL",
                "PAYEE_BILLER",
                "NON_FINANCIAL_BULK_FILE",
                "NON_FINANCIAL_BULK_RECORD",
                "TRADE_FINANCE",
                "FOREX_DEAL",
                "LIQUIDITY_MANAGEMENT",
                "OTHER_TRANSACTION"
            ],
            financialTxnList = [],
            nonFinancialTxnList = [];

        self.financialTxnCount = ko.observable(0);
        self.nonFinancialTxnCount = ko.observable(0);
        ko.utils.extend(self, rootParams.rootModel);

        rootParams.baseModel.registerElement("action-widget");
        rootParams.baseModel.registerElement("nav-bar");
        rootParams.baseModel.registerComponent("batch-process-approvals", "approvals");
        rootParams.baseModel.registerElement("date-time");
        rootParams.baseModel.registerComponent("transaction-detail", "approvals");

        self.fetchCount = function (args) {
            PendingApprovalModel.getCountForApproval(rootParams.dashboard.appData.segment === "CORPADMIN" ? "PA" : rootParams.dashboard.appData.segment === "ADMIN" ? "A" : "P").then(function (data) {
                self.financialTxnCount(0);
                self.nonFinancialTxnCount(0);
                financialTxnList.length = nonFinancialTxnList.length = 0;
                self.menuCountOptions.removeAll();
                self.totalCount(self.totalCountVar = 0, self.totalCountVar);

                if (data.countDTOList.length) {
                    for (let j = 0; j < data.countDTOList.length; j++) {
                        const count = data.countDTOList[j].pendingApproval || 0;

                        if (data.countDTOList[j].transactionType) {
                            const currData = {
                                label: self.Nls.pendingApprovalsDetails.labels[data.countDTOList[j].transactionType],
                                id: data.countDTOList[j].transactionType + "_PENDING",
                                count: count
                            };

                            if (rootParams.dashboard.appData.segment === "ADMIN" || rootParams.dashboard.appData.segment === "CORPADMIN") {
                                self.menuCountOptions.push(currData);
                            }

                            if (financialTxn.indexOf(data.countDTOList[j].transactionType) > -1) {
                                self.financialTxnCount(self.financialTxnCount() + count);
                                financialTxnList.push(currData);
                            } else if (nonFinancialTxn.indexOf(data.countDTOList[j].transactionType) > -1) {
                                self.nonFinancialTxnCount(self.nonFinancialTxnCount() + count);
                                nonFinancialTxnList.push(currData);
                            }

                            self.totalCountVar += count;
                        }
                    }

                    self.totalCount(self.totalCountVar);

                    self.widgetHeading(rootParams.baseModel.format(self.Nls.pendingApprovalsDetails.labels.header, {
                        count: self.totalCount()
                    }));

                    if (!rootParams.dashboard.isDashboard() && rootParams.baseModel.small()) {
                        rootParams.dashboard.headerName(self.widgetHeading());
                    }
                }

                self.handleNavBarEntries(self.currentSelection(), args);
            });
        };

        self.fetchCount();

        self.arrayDataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.transactionList, {
            idAttribute: "transactionId"
        }));

        self.menuSelection.subscribe(function (newValue) {
            self.transactionListLoaded(false);
            self.loadModule(newValue.toLowerCase().replace("_pending", "").replace(/\_/g, "-"));

            if (!rootParams.baseModel.large()) {
                rootParams.dashboard.loadComponent("pending-approvals", {
                    parent: ko.mapping.toJS(self)
                }, self);

                return false;
            }

            self.refreshTable(newValue);
        });

        self.onTransactionRowClicked = function (data) {
            rootParams.dashboard.loadComponent("transaction-detail", {
                data: data
            });
        };

        if (!rootParams.baseModel.large() && self.loadModule()) {
            self.refreshTable(self.loadModule().toUpperCase().replace(/\-/g, "_") + "_PENDING");
        }

        self.refreshTable = function (value) {
            self.transactionList.removeAll();

            PendingApprovalModel.getTransactionData(value.replace("_PENDING", "").replace(/\-/g, "_"), rootParams.dashboard.appData.segment === "ADMIN" ? "A" : rootParams.dashboard.appData.segment === "CORPADMIN" ? "PA" : "P").then(function (data) {
                ko.utils.arrayPushAll(self.transactionList, self.dataSourceMapper(data, value, self.Nls).map(function (listingData) {
                    if (listingData.maxApprovalDate && listingData.maxApprovalDate !== null) {
                        listingData.isInGracePeriod = true;
                    } else {
                        listingData.isInGracePeriod = false;
                    }

                    return listingData;
                }));

                self.transactionListLoaded(true);
            });
        };

        self.gracePeriodPopUpMessage = function (index) {
            $("#gracePeriodPopup_" + index).ojPopup({
                position: {
                    my: {
                        horizontal: "start",
                        vertical: "top"
                    },
                    offset: {
                        x: -50,
                        y: 5
                    },
                    at: {
                        horizontal: "start",
                        vertical: "bottom"
                    }
                }
            });

            $("#gracePeriodPopup_" + index).ojPopup("open", "#gracePeriodID_" + index);
        };

        self.gracePeriodPopUpCloseMessage = function (index) {
            $("#gracePeriodPopup_" + index).ojPopup("close", "#gracePeriodID_" + index);
        };

        self.renderCheckBox = function (context) {
            const checkBox = $(document.createElement("input")),
                label = $(document.createElement("label"));

            checkBox.attr("type", "checkbox");
            checkBox.attr("value", context.row.transactionId);
            checkBox.attr("name", "selection");
            label.attr("class", "oj-checkbox-label hide-label");
            checkBox.attr("id", context.row.transactionId + "_labelID");
            label.attr("for", context.row.transactionId + "_labelID");
            label.text(self.Nls.pendingApprovalsDetails.labels.childCheckBox);
            $(context.cellContext.parentElement).append(checkBox);
            $(context.cellContext.parentElement).append(label);
        };

        self.renderHeadCheckBox = function (context) {
            const checkBox = $(document.createElement("input")),
                label = $(document.createElement("label"));

            checkBox.attr("type", "checkbox");
            checkBox.attr("value", "selectAll");
            checkBox.attr("name", "selectionParent");
            checkBox.attr("id", "headerbox_labelID");
            label.attr("class", "oj-checkbox-label hide-label");
            label.attr("for", "headerbox_labelID");
            label.text(self.Nls.pendingApprovalsDetails.labels.headerCheckBox);
            context.headerContext.parentElement.title = self.Nls.pendingApprovalsDetails.labels.headerCheckBox;
            $(context.headerContext.parentElement.firstElementChild.firstChild).append(checkBox);
            $(context.headerContext.parentElement.firstElementChild.firstChild).append(label);
        };

        self.showModule = function (module) {
            self.menuSelection(module.id);
            rootParams.dashboard.headerName(self.widgetHeading());
        };

        self.currentSelection.subscribe(function (newValue) {
            if (!rootParams.dashboard.appData.segment === "ADMIN" || !rootParams.dashboard.appData.segment === "CORPADMIN") {
                self.menuCountOptions.removeAll();
            }

            self.handleNavBarEntries(newValue);
        });

        self.handleNavBarEntries = function (natureOfTransaction, selectedTab) {
            if (natureOfTransaction === "financialTxn") {
                ko.utils.arrayPushAll(self.menuCountOptions, financialTxnList);
            } else {
                ko.utils.arrayPushAll(self.menuCountOptions, nonFinancialTxnList);
            }

            if (rootParams.baseModel.large()) {
                self.menuSelection(selectedTab || self.menuCountOptions()[0].id);
            } else if (self.loadModule()) {
                self.countForHeader(self.menuCountOptions().filter(function (obj) {
                    return obj.id === self.loadModule().toUpperCase().replace(/\-/g, "_") + "_PENDING";
                })[0].count);
            }
        };
    };
});