define([
    "knockout",
    "jquery",
    "ojs/ojcore",
    "./model",
    "ojL10n!resources/nls/latest-pending-approvals",
    "ojL10n!resources/nls/corporate-pending-approvals",
    "ojL10n!resources/nls/reports",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource",
    "ojs/ojpopup",
    "ojs/ojselectcombobox"
], function(ko, $, oj, PendingApprovalModel, resourceBundle, CorporatePendingApproval, otherTxnResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.loadModule = ko.observable(rootParams.rootModel && rootParams.rootModel.params? rootParams.rootModel.params.loadModule : null);
        self.transactionList = ko.observableArray();
        self.Nls = resourceBundle;
        self.otherTxnNls = otherTxnResourceBundle;
        self.resource = CorporatePendingApproval;
        self.menuSelection = ko.observable();
        self.menuCountOptions = ko.observableArray();
        self.activeXHRControl = null;
        self.isPendingApproval = true;
        self.countLoaded = ko.observable(false);

        self.uiOptions = {
            menuFloat: "left",
            fullWidth: false,
            defaultOption: self.menuSelection
        };

        self.totalCountVar = 0;
        self.totalCount = ko.observable(0);
        self.widgetHeading = ko.observable("");
        self.countForHeader = ko.observable();
        self.accountTxnList = ko.observableArray();
        self.currentSelection = ko.observable("financialTxn");

        const financialTxn = [
                "ACCOUNT_FINANCIAL",
                "PAYMENTS",
                "BULK_FILE",
                "BULK_RECORD",
                "ELECTRONIC_BILL_PAYMENTS",
                "AMOUNT_FINANCIAL",
                "AMT_FINANCIAL_BULK_RECORD"
            ],
            nonFinancialTxn = [
                "ACCOUNT_NON_FINANCIAL",
                "PAYEE_BILLER",
                "NON_FINANCIAL_BULK_FILE",
                "NON_FINANCIAL_BULK_RECORD",
                "TRADE_FINANCE",
                "TRADE_FINANCE_MAINTENANCE",
                "FOREX_DEAL",
                "OTHER_TRANSACTION",
                "LIQUIDITY_MANAGEMENT",
                "BILLER_MAINTENANCE"
            ],
            financialTxnList = [],
            nonFinancialTxnList = [],
            txnList = [
                "financialTxn",
                "nonFinancialTxn"
            ];

        self.txnListData = ko.observableArray();
        self.financialTxnCount = ko.observable(0);
        self.nonFinancialTxnCount = ko.observable(0);

        rootParams.baseModel.registerElement([
            "nav-bar",
            "date-time"
        ]);

        rootParams.baseModel.registerComponent("batch-process-approvals", "approvals");
        rootParams.baseModel.registerComponent("transaction-detail", "approvals");
        ko.utils.arrayPushAll(self.txnListData, txnList);

        function setData(data) {
            self.countLoaded(false);
            ko.tasks.runEarly();
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
                            data: rootParams.baseModel.format(self.Nls.pendingApprovalsDetails.labels[data.countDTOList[j].transactionType + "_COUNT"], {
                                count: count
                            }),
                            id: data.countDTOList[j].transactionType + "_PENDING",
                            count: count,
                            label: self.Nls.pendingApprovalsDetails.labels[data.countDTOList[j].transactionType]
                        };

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
        }

        self.handleNavBarEntries = function(natureOfTransaction, selectedTab) {
            if (natureOfTransaction[0] === "financialTxn" || natureOfTransaction === "financialTxn") {
                ko.utils.arrayPushAll(self.menuCountOptions, financialTxnList);
            } else {
                ko.utils.arrayPushAll(self.menuCountOptions, nonFinancialTxnList);
            }

            if (rootParams.baseModel.large()) {
                self.menuSelection(selectedTab || self.menuCountOptions()[0] ? self.menuCountOptions()[0].id : null);
            }
        };

        self.fetchCount = function(args) {
            PendingApprovalModel.getCountForApproval(rootParams.dashboard.appData.segment === "CORPADMIN" ? "PA" : rootParams.dashboard.appData.segment === "ADMIN" ? "A" : "P").then(function(data) {
                setData(data);
                self.handleNavBarEntries(self.currentSelection(), args);
                ko.tasks.runEarly();
                self.countLoaded(true);
            });
        };

        self.fetchCount();

        self.arrayDataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.transactionList, {
            idAttribute: "transactionId"
        }));

        function rejectPromise() {
            self.activeXHRControl = this;
        }

        self.dataSourceMapper = function(data, discriminator, resourceBundle) {
            $.map(data.transactionDTOs, function(transaction) {

                transaction.maxApprovalDate = ko.observable(transaction.maxApprovalDate);

                transaction.type = transaction.taskDTO.name;
                transaction.description = transaction.taskDTO.name;
                transaction.noOfApprovalSteps = transaction.approvalDetails.countOfApprovals;
                transaction.processingStatus = transaction.approvalDetails.status === "EXPIRED" ? "E" : transaction.approvalDetails.status === "APPROVED" ? "S" : transaction.processingDetails.status;

                transaction.initiatedBy = rootParams.baseModel.format(resourceBundle.generic.common.name, {
                    firstName: transaction.createdByDetails.firstName,
                    lastName: transaction.createdByDetails.lastName
                });

                transaction.status = resourceBundle.pendingApprovalsDetails.status[transaction.approvalDetails.status];
                transaction.date = transaction.creationDate;

                if (transaction.amount) {
                    transaction.amount = rootParams.baseModel.formatCurrency(transaction.amount.amount, transaction.amount.currency);
                }

                switch (discriminator) {
                    case "ACCOUNT_FINANCIAL":
                    case "ACCOUNT_NON_FINANCIAL":
                        transaction.accountId = transaction.accountId.displayValue;

                        break;
                    case "FOREX_DEAL":
                        transaction.dealType = rootParams.baseModel.format(resourceBundle.pendingApprovalsDetails.labels.dealType, {
                            dealpatterntype: resourceBundle.pendingApprovalsDetails.labels.dealPatternType[transaction.dealType]
                        });

                        transaction.currencyCombination = rootParams.baseModel.format(resourceBundle.pendingApprovalsDetails.labels.fieldSet, {
                            field1: transaction.currency1,
                            field2: transaction.currency2
                        });

                        transaction.amount = transaction.rateType === "B" ? rootParams.baseModel.format(resourceBundle.pendingApprovalsDetails.labels.dealAmountBuyCp, {
                            rateType: resourceBundle.pendingApprovalsDetails.labels.buy,
                            currency: rootParams.baseModel.formatCurrency(transaction.buyAmount.amount, transaction.buyAmount.currency)
                        }) : rootParams.baseModel.format(resourceBundle.pendingApprovalsDetails.labels.dealAmountSellCp, {
                            rateType: resourceBundle.pendingApprovalsDetails.labels.sell,
                            currency: rootParams.baseModel.formatCurrency(transaction.sellAmount.amount, transaction.sellAmount.currency)
                        });

                        break;
                    case "LIQUIDITY_MANAGEMENT":
                        transaction.structureId = transaction.transactionName === "LM_M_IMS" ? transaction.transactionSnapshot.requestPayload.strListKeyDTO[0].structureId : transaction.transactionSnapshot.requestPayload.structureList[0].structureKey.structureId;
                        transaction.structureDescription = transaction.transactionName === "LM_M_IMS" ? transaction.transactionSnapshot.requestPayload.strListKeyDTO[0].desc : transaction.transactionSnapshot.requestPayload.structureList[0].desc;

                        break;
                    case "NON_FINANCIAL_BULK_FILE":
                        transaction.type = resourceBundle.pendingApprovalsDetails.labels.nonFinancialTxn;

                        transaction.fileType = resourceBundle.pendingApprovalsDetails.labels[transaction.taskDTO.id];

                        transaction.fileIdentifierDetails = rootParams.baseModel.format(resourceBundle.pendingApprovalsDetails.labels.fieldSet, {
                            field1: transaction.fileIdentifier,
                            field2: transaction.fileIdentifierDescription
                        });

                        break;
                    case "NON_FINANCIAL_BULK_RECORD":
                        transaction.fileType = resourceBundle.pendingApprovalsDetails.labels[transaction.taskDTO.id];
                        transaction.type = resourceBundle.pendingApprovalsDetails.labels.record;
                        transaction.fileIdentifierDetails = transaction.fileIdentifier + "-" + transaction.fileIdentifierDescription;
                        break;
                    case "PAYMENTS":
                        transaction.beneficiaryAccountNumber = transaction.creditAccountId.displayValue || "";
                        transaction.debitAccountNumber = transaction.accountId.displayValue;
                        transaction.beneficiaryName = transaction.creditAccountName || "";
                        break;
                    case "ELECTRONIC_BILL_PAYMENTS":
                        transaction.details = rootParams.baseModel.format(resourceBundle.pendingApprovalsDetails.labels.fieldSet, {
                            field1: transaction.labelId,
                            field2: transaction.labelValue
                        });

                        transaction.fromAccount = transaction.accountId.displayValue;
                        break;
                    case "BULK_FILE":
                        transaction.description = transaction.fileIdentifierDescription;
                        transaction.type = resourceBundle.pendingApprovalsDetails.labels.file;
                        transaction.referenceNo = transaction.fileRefId;
                        break;
                    case "BULK_RECORD":
                        transaction.type = resourceBundle.pendingApprovalsDetails.labels.record;
                        transaction.debitAccountNumber = transaction.debitAccountNumber.displayValue;
                        transaction.payeeDetails = transaction.creditAccountNumber + (transaction.beneName ? "-" + transaction.beneName : "");

                        if (transaction.txnAmount) {
                            transaction.amt = rootParams.baseModel.formatCurrency(transaction.txnAmount.amount, transaction.txnAmount.currency);
                        }

                        break;
                    case "PAYEE_BILLER":
                        transaction.category = resourceBundle.pendingApprovalsDetails.payeeCategory[transaction.category] || transaction.category;
                        break;
                    case "PARTY_MAINTENANCE":
                        if (transaction.partyName) {
                            transaction.partyName = transaction.partyName.fullName;
                        }

                        break;
                    case "ADMIN_MAINTENANCE":
                        break;
                    case "BILLER_MAINTENANCE":
                        transaction.category = resourceBundle.pendingApprovalsDetails.payeeCategory[transaction.category] || transaction.category;
                        break;
                    case "AMOUNT_FINANCIAL":
                        break;

                    case "AMT_FINANCIAL_BULK_RECORD":
                        break;

                    default:
                        break;
                }
            });

            return data.transactionDTOs;
        };

        self.refreshTable = function(value) {
            self.transactionList.removeAll();

            PendingApprovalModel.getTransactionData(value.replace("_PENDING", "").replace(/\-/g, "_"), rejectPromise).then(function(values) {
                ko.utils.arrayPushAll(self.transactionList, self.dataSourceMapper(values, value.replace("_PENDING", "").replace(/\-/g, "_"), self.Nls));
                self.countForHeader(self.transactionList().length);
            });

        };

        if (!rootParams.baseModel.large() && self.loadModule()) {
            self.refreshTable(self.loadModule().toUpperCase());
        }

        self.gracePeriodPopUpMessage = function(index) {
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

        self.gracePeriodPopUpCloseMessage = function(index) {
            $("#gracePeriodPopup_" + index).ojPopup("close", "#gracePeriodID_" + index);
        };

        self.renderCheckBox = function(context) {
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

        self.renderHeadCheckBox = function(context) {
            const checkBox = $(document.createElement("input")),
                label = $(document.createElement("label"));

            checkBox.attr("type", "checkbox");
            checkBox.attr("value", "selectAll");
            checkBox.attr("name", "selectionParent");
            checkBox.attr("id", "headerbox_labelID");
            label.attr("class", "oj-checkbox-label hide-label");
            label.attr("for", "headerbox_labelID");
            label.text(self.Nls.pendingApprovalsDetails.labels.headerCheckBox);
            $(context.headerContext.parentElement.firstElementChild.firstChild).append(checkBox);
            $(context.headerContext.parentElement.firstElementChild.firstChild).append(label);
            context.parentElement.title = self.Nls.pendingApprovalsDetails.labels.headerCheckBox;
            context.parentElement.abbr = self.Nls.pendingApprovalsDetails.labels.headerCheckBox;
        };

        self.menuSelection.subscribe(function(newValue) {
            if (newValue) {
                if (self.activeXHRControl) {
                    self.activeXHRControl();
                }

                self.loadModule(newValue.toLowerCase().replace(/\_/g, "-").replace("-pending", ""));

                if (!rootParams.baseModel.large()) {
                    self.txnListData().length = 0;

                    rootParams.dashboard.loadComponent("latest-pending-approvals",
                        ko.mapping.toJS(self));

                    return false;
                }

                self.refreshTable(newValue.toUpperCase());
            }
        });

        self.showModule = function(module) {
            self.menuSelection(module.id);
            rootParams.dashboard.headerName(self.widgetHeading());
        };

        self.currentSelection.subscribe(function(newValue) {
            self.countLoaded(false);
            ko.tasks.runEarly();

            if (!rootParams.dashboard.appData.segment.match("ADMIN")) {
                self.menuCountOptions.removeAll();
            }

            self.handleNavBarEntries(newValue);
            self.countLoaded(true);
        });
    };
});