define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/inward-remittance",
    "ojs/ojknockout",
    "ojs/ojdatetimepicker",
    "ojs/ojselectcombobox",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource",
    "ojs/ojlistview",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup"
], function(oj, ko, $, inwardRemittanceModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        rootParams.dashboard.headerName(self.resource.inwardRemittance.headerDetail);

        self.isDateLoaded = ko.observable(false);
        self.fromDate = ko.observable();
        self.toDate = ko.observable();
        self.accountId = ko.observable();
        self.accountList = ko.observableArray();
        self.isAccountListLoaded = ko.observable(true);
        self.fromAmount = ko.observable();
        self.toAmount = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.searchData = ko.observable("");
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        rootParams.baseModel.registerElement("modal-window");
        self.isAdviceLoaded = ko.observable(false);
        self.creditAccountBranch = ko.observable();
        self.creditAccountNumber = ko.observable();
        self.transDate = ko.observable();
        self.refNumber = ko.observable();
        self.remitAmount = ko.observable();
        self.creditedOn = ko.observable();
        self.creditAmount = ko.observable();
        self.purposeText = ko.observable();
        self.description = ko.observable();
        self.remitName = ko.observable();
        self.accountNumber = ko.observable();
        self.bankDetails = ko.observable();
        self.branches = ko.observableArray();
        self.additionalDetails = ko.observable();
        self.currentTask = ko.observable("PC_I_INRL");
        self.accountList = ko.observableArray();
        self.accountFetched = ko.observable(false);
        self.validator = ko.observable();
        self.intermediaryBankDetails =ko.observable();

        self.closeDialog = function() {
            $("#noaccount").hide();
        };

        self.filterintermediaryBankDetails = function() {
            return [self.intermediaryBankDetails().code,self.intermediaryBankDetails().codeType,self.intermediaryBankDetails().name,self.intermediaryBankDetails().branch,self.intermediaryBankDetails().address,self.intermediaryBankDetails().city,self.intermediaryBankDetails().country].filter(function(n){
                return n && n.trim() !== "";
            }).join(",");
        };

        self.fetchAccountList = function() {
            self.accountList.removeAll();

            inwardRemittanceModel.fetchAccountData(self.currentTask()).done(function(data) {
                if (data.accounts) {
                    self.accountList.push({
                        id: {
                            value: "all",
                            displayValue: self.resource.inwardRemittance.allAccounts
                        }
                    });

                    ko.utils.arrayPushAll(self.accountList, data.accounts);
                    self.accountFetched(true);
                }
            });
        };

        self.fetchAccountList();

        self.getHostDate = function() {
            inwardRemittanceModel.getHostDate().done(function(data) {
                const date = new Date(data.currentDate.valueDate);

                self.currentDate(date);
                self.isDateLoaded(true);
            });
        };

        self.reset = function() {
            self.accountId("all");
            self.fromDate("");
            self.toDate("");
            self.fromAmount("");
            self.toAmount("");
        };

        self.searchAccounts = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("amountTracker"))) {
                return;
            }

            self.baseURL = "payments/inwardRemittances";

            if (self.fromDate() || self.toDate() || self.fromAmount() || self.toAmount()) {
                self.baseURL = self.baseURL + "?";

                if (self.fromDate()) {
                    if (self.baseURL.indexOf("=") > -1) {
                        self.baseURL = self.baseURL + "&fromDate=" + self.fromDate();
                    } else {
                        self.baseURL = self.baseURL + "fromDate=" + self.fromDate();
                    }
                }

                if (self.toDate()) {
                    if (self.baseURL.indexOf("=") > -1) {
                        self.baseURL = self.baseURL + "&toDate=" + self.toDate();
                    } else {
                        self.baseURL = self.baseURL + "toDate=" + self.toDate();
                    }
                }

                if (self.fromAmount()) {
                    if (self.baseURL.indexOf("=") > -1) {
                        self.baseURL = self.baseURL + "&fromAmount=" + self.fromAmount();
                    } else {
                        self.baseURL = self.baseURL + "fromAmount=" + self.fromAmount();
                    }
                }

                if (self.toAmount()) {
                    if (self.baseURL.indexOf("=") > -1) {
                        self.baseURL = self.baseURL + "&toAmount=" + self.toAmount();
                    } else {
                        self.baseURL = self.baseURL + "toAmount=" + self.toAmount();
                    }
                }
            }

            if (self.accountId() && self.accountId()[0] !== "all") {
                if (self.baseURL.indexOf("=") > -1) {
                    self.baseURL = self.baseURL + "&accountId=" + self.accountId();
                } else {
                    self.baseURL = self.baseURL + "?accountId=" + self.accountId();
                }
            }

            self.dataLoaded(false);

            inwardRemittanceModel.getTransactions(self.baseURL).done(function (data) {
                let array = [];

                if (data.inwardremittances) {
                    self.searchData(data.inwardremittances);

                    array = $.map(self.searchData(), function (u) {
                        const obj = {
                            transDate: u.transactionDate || "-",
                            refNumber: u.txnReferenceNo || "-",
                            remitAmount: u.transactionAmount ? {amount : u.transactionAmount.amount,
currency: u.transactionAmount.currency} : "-",
                            creditAccount: u.creditAccount.id ? u.creditAccount.id.displayValue : "-",
                            creditAmount: u.inwardRemittanceDetailsDTO.creditAmount ? {amount : u.inwardRemittanceDetailsDTO.creditAmount.amount,
currency : u.inwardRemittanceDetailsDTO.creditAmount.currency} : "-",
                            remitName: u.inwardRemittanceDetailsDTO.remitterName ? u.inwardRemittanceDetailsDTO.remitterName : "-"
                        };

                        return obj;
                    });
                }

                self.dataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(array), {
                    idAttribute: "refNumber"
                });

                self.dataLoaded(true);
            });
        };

        self.getBranches = function(creditBranchCode) {
            inwardRemittanceModel.getBranches().done(function(data) {
                for (let i = 0; i < data.branchAddressDTO.length; i++) {
                    self.branches.push({
                        text: data.branchAddressDTO[i].branchName,
                        value: data.branchAddressDTO[i].id
                    });

                    if (creditBranchCode === data.branchAddressDTO[i].id) {
                        self.creditAccountBranch(data.branchAddressDTO[i].branchName);
                        self.stageTwo(true);
                        break;
                    }
                }
            });
        };

        self.getPurpose = function(purposeCode) {
            inwardRemittanceModel.getPurpose().done(function(data) {
                if (data.purposeList !== null && data.purposeList.length > 0) {
                    for (let i = 0; i < data.purposeList.length; i++) {
                        if (purposeCode === data.purposeList[i].code) {
                            self.purposeText(data.purposeList[i].description);
                            break;
                        }
                    }
                }
            });
        };

        self.transactionSelected = function(data) {
            const refNo = data.refNumber;

            inwardRemittanceModel.getDetail(refNo).done(function(data) {
                const creditBranchCode = data.inwardRemittanceDTO.creditAccount.branchCode,
                    purposeCode = data.inwardRemittanceDTO.remittancePurpose;

                self.stageOne(false);
                self.getBranches(creditBranchCode);
                self.getPurpose(purposeCode);
                self.creditAccountNumber(data.inwardRemittanceDTO.creditAccount.id.displayValue);
                self.transDate(data.inwardRemittanceDTO.transactionDate);
                self.refNumber(refNo);

                self.remitAmount({
                        amount :data.inwardRemittanceDTO.transactionAmount.amount,
                        currency : data.inwardRemittanceDTO.transactionAmount.currency
                    });

                self.creditedOn(data.inwardRemittanceDTO.activationDate);

                self.creditAmount({
                        amount :data.inwardRemittanceDTO.inwardRemittanceDetailsDTO.creditAmount.amount,
                        currency : data.inwardRemittanceDTO.inwardRemittanceDetailsDTO.creditAmount.currency
                    });

                self.description(data.inwardRemittanceDTO.remarks);
                self.remitName(data.inwardRemittanceDTO.inwardRemittanceDetailsDTO.remitterName);
                self.accountNumber(data.inwardRemittanceDTO.debitAccount.id.displayValue);
                self.bankDetails(data.inwardRemittanceDTO.debitAccount.bankCode);
                self.intermediaryBankDetails(data.inwardRemittanceDTO.intermediaryBankDetails && Object.keys(data.inwardRemittanceDTO.intermediaryBankDetails).length>0 ? data.inwardRemittanceDTO.intermediaryBankDetails : null);
                rootParams.dashboard.headerName(self.resource.inwardRemittance.headerDetail);

                self.isAdviceLoaded(typeof data.inwardRemittanceDTO.adviceList !== "undefined" && data.inwardRemittanceDTO.adviceList);
            });
        };

        self.back = function() {
            rootParams.dashboard.headerName(self.resource.inwardRemittance.headerDetail);
            self.stageTwo(false);
            self.stageOne(true);
        };

        self.cancel = function() {
            history.back();
        };

        self.validateFromAmount = {
            validate: function(value) {
                if (isNaN(value) || value.length > 15 || value < 0) {
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resource.inwardRemittance.amountValidation));
                }

                if (self.toAmount()) {
                    const from = oj.Components.getWidgetConstructor($("#toAmount"));

                    if (typeof from === "function") {
                        from("validate");
                    }
                }
            }
        };

        self.validateToAmount = {
            validate: function(value) {
                if (isNaN(value) || value.length > 15 || value < 0) {
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resource.inwardRemittance.amountValidation));
                }

                if (self.fromAmount()) {
                    if (Number(value) < Number(self.fromAmount())) {
                        throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resource.inwardRemittance.toAmountValidation));
                    }
                }
            }
        };

        self.generatePDF = function() {
            inwardRemittanceModel.fetchPDF(self.refNumber());
        };
    };
});