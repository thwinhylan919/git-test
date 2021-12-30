define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/outward-remittance",
    "ojs/ojknockout",
    "ojs/ojdatetimepicker",
    "ojs/ojselectcombobox",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup",
    "ojs/ojavatar"
], function(oj, ko, $, outwardRemittanceModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        rootParams.dashboard.headerName(self.resource.outwardRemittance.header);

        const batchRequest = {
            batchDetailRequestList: []
        };

        self.isDateLoaded = ko.observable(false);
        self.fromDate = ko.observable();
        self.toDate = ko.observable();
        self.accountId = ko.observable();
        self.accountList = ko.observableArray();
        self.isAccountListLoaded = ko.observable(true);
        self.additionalDetails = ko.observable();
        self.fromAmount = ko.observable();
        self.toAmount = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.searchData = ko.observable("");
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        rootParams.baseModel.registerElement("modal-window");
        self.debitAccountNumber = ko.observable();
        self.debitAccountBranch = ko.observable();
        self.transDate = ko.observable();
        self.refNumber = ko.observable();
        self.debitAmount = ko.observable();
        self.bankCharges = ko.observable();
        self.remittedAmount = ko.observable();
        self.purposeText = ko.observable();
        self.description = ko.observable();
        self.payeeName = ko.observable();
        self.accountNumber = ko.observable();
        self.bankName = ko.observable();
        self.bankAddress = ko.observable();
        self.branches = ko.observableArray();
        self.isAdviceLoaded = ko.observable(false);
        self.currentTask = ko.observable("PC_I_OUTRL");
        self.accountList = ko.observableArray();
        self.accountFetched = ko.observable(false);
        self.validator = ko.observable();
        self.contentIdMap = ko.observable({});
        self.preview = ko.observable();
        self.initials = ko.observable();
        self.payeeAddress =ko.observable();
        self.intermediaryBankDetails =ko.observable();
        self.uniqueEndToEndTxnReference = ko.observable();

        let array = [];

        self.imageUploadFlag = ko.observable();

        outwardRemittanceModel.getPayeeMaintenance().then(function(data) {
            const configurationDetails = {};

            for (let k = 0; k < data.configurationDetails.length; k++) {
                configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
            }

            if (rootParams.dashboard.appData.segment === "CORP") { self.imageUploadFlag(configurationDetails.CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); } else { self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); }
        });

        self.closeDialog = function() {
            $("#noaccount").hide();
        };

        self.fetchAccountList = function() {
            self.accountList.removeAll();

            outwardRemittanceModel.fetchAccountData(self.currentTask()).done(function(data) {
                if (data.accounts) {
                    self.accountList.push({
                        id: {
                            value: "all",
                            displayValue: self.resource.outwardRemittance.allAccounts
                        }
                    });

                    ko.utils.arrayPushAll(self.accountList, data.accounts);
                    self.accountFetched(true);
                }
            });
        };

        self.fetchAccountList();

        self.getHostDate = function() {
            outwardRemittanceModel.getHostDate().done(function(data) {
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

        self.filterBankDetails = function() {
            return [self.bankAddress().line1,self.bankAddress().line2,self.bankAddress().line3,self.bankAddress().city,self.bankAddress().country].filter(function(n){
                return n && n.trim() !== "";
            }).join(",");
        };

        self.filterintermediaryBankDetails = function() {
            return [self.intermediaryBankDetails().code,self.intermediaryBankDetails().codeType,self.intermediaryBankDetails().name,self.intermediaryBankDetails().branch,self.intermediaryBankDetails().address,self.intermediaryBankDetails().city,self.intermediaryBankDetails().country].filter(function(n){
                return n && n.trim() !== "";
            }).join(",");
        };

        self.filterPayeeAddressDetails = function() {
            return [self.payeeAddress().line1,self.payeeAddress().line2,self.payeeAddress().line3,self.payeeAddress().city,self.payeeAddress().country].filter(function(n){
                return n && n.trim() !== "";
            }).join(",");
        };

        self.searchAccounts = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("amountTracker"))) {
                return;
            }

            self.baseURL = "payments/outwardRemittances";

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

            function loadBatchImages() {
                outwardRemittanceModel.batchRead(batchRequest).done(function(batchData) {
                    for (let i = 0; i < batchData.batchDetailResponseDTOList.length; i++) {
                        const responseDTO = batchData.batchDetailResponseDTOList[i].responseObj;

                        if (responseDTO.contentDTOList[0].contentId) { self.contentIdMap()[responseDTO.contentDTOList[0].contentId.value]("data:image/gif;base64," + responseDTO.contentDTOList[0].content); }
                    }

                    for (let k = 0; k < array.length; k++) {
                        if (array[k].contentId && array[k].contentId.value) { array[k].preview = self.contentIdMap()[array[k].contentId.value]; }
                    }

                    self.dataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(array), {
                        idAttribute: "refNumber"
                    } || []);

                    self.dataLoaded(true);
                });
            }

            function loadBatchRequest(id) {
                batchRequest.batchDetailRequestList.push({
                    methodType: "GET",
                    uri: {
                        value: "/contents/{id}",
                        params: {
                            id: id
                        }
                    },
                    headers: {
                        "Content-Id": batchRequest.batchDetailRequestList.length + 1,
                        "Content-Type": "application/json"
                    }
                });
            }

            outwardRemittanceModel.getTransactions(self.baseURL).done(function(data) {
                if (data.outwardremittances) {
                    self.searchData(data.outwardremittances);

                    array = $.map(self.searchData(), function(u) {
                        const obj = {
                            transDate: u.transactionDate || "-",
                            refNumber: u.txnReferenceNo || "-",
                            remittedAmount: u.transactionAmount ? {amount : u.transactionAmount.amount,
currency: u.transactionAmount.currency} : "-",
                            debitAccount: u.debitAccount.id ? u.debitAccount.id.displayValue : "-",
                            debitAmount: u.outwardRemittanceDetailsDTO.debitAmount ? {amount : u.outwardRemittanceDetailsDTO.debitAmount.amount,
currency : u.outwardRemittanceDetailsDTO.debitAmount.currency} : "-",
                            payee: u.outwardRemittanceDetailsDTO.payeeName ? u.outwardRemittanceDetailsDTO.payeeName : "-",
                            initials: oj.IntlConverterUtils.getInitials(u.outwardRemittanceDetailsDTO.payeeName),
                            preview: null,
                            contentId: u.contentId && u.contentId.value ? u.contentId : null
                        };

                        if (u.contentId && u.contentId.value) {
                            self.contentIdMap()[u.contentId.value] = ko.observable();
                            loadBatchRequest(u.contentId.value);
                        }

                        return obj;
                    });
                }

                if (batchRequest.batchDetailRequestList.length) {
                    loadBatchImages();
                } else {
                    self.dataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(array), {
                        idAttribute: "refNumber"
                    });

                    self.dataLoaded(true);
                }
            });
        };

        self.getBranches = function(debitBranchCode) {
            outwardRemittanceModel.getBranches().done(function(data) {
                for (let i = 0; i < data.branchAddressDTO.length; i++) {
                    self.branches.push({
                        text: data.branchAddressDTO[i].branchName,
                        value: data.branchAddressDTO[i].id
                    });

                    if (debitBranchCode === data.branchAddressDTO[i].id) {
                        self.debitAccountBranch(data.branchAddressDTO[i].branchName);
                        self.stageTwo(true);
                        break;
                    }
                }
            });
        };

        self.getPurpose = function(purposeCode) {
            outwardRemittanceModel.getPurpose().done(function(data) {
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

            outwardRemittanceModel.getDetail(refNo).done(function(data) {
                const debitBranchCode = data.outwardRemittanceDTO.debitAccount.branchCode,
                    purposeCode = data.outwardRemittanceDTO.remittancePurpose;

                self.stageOne(false);
                self.getBranches(debitBranchCode);
                self.getPurpose(purposeCode);
                self.debitAccountNumber(data.outwardRemittanceDTO.debitAccount.id.displayValue);
                self.transDate(data.outwardRemittanceDTO.transactionDate);
                self.refNumber(refNo);

                self.debitAmount({
                        amount :data.outwardRemittanceDTO.outwardRemittanceDetailsDTO.debitAmount.amount,
                        currency : data.outwardRemittanceDTO.outwardRemittanceDetailsDTO.debitAmount.currency
                    });

                self.bankCharges(data.outwardRemittanceDTO.bankCharges ? {
                        amount : data.outwardRemittanceDTO.bankCharges.amount,
                        currency : data.outwardRemittanceDTO.bankCharges.currency
                    } : "-");

                self.remittedAmount({
                        amount :data.outwardRemittanceDTO.transactionAmount.amount,
                        currency : data.outwardRemittanceDTO.transactionAmount.currency
                    });

                self.description(data.outwardRemittanceDTO.remarks);
                self.payeeName(data.outwardRemittanceDTO.outwardRemittanceDetailsDTO.payeeName);
                self.accountNumber(data.outwardRemittanceDTO.creditAccount.id.displayValue);
                self.bankName(data.outwardRemittanceDTO.outwardRemittanceDetailsDTO.payeeBankName);
                self.bankAddress(data.outwardRemittanceDTO.outwardRemittanceDetailsDTO.payeeBankAddress);
                self.uniqueEndToEndTxnReference(data.outwardRemittanceDTO.uniqueEndToEndTxnReference ?data.outwardRemittanceDTO.uniqueEndToEndTxnReference : null);
                self.payeeAddress(data.outwardRemittanceDTO.outwardRemittanceDetailsDTO.payeeAddress && Object.keys(data.outwardRemittanceDTO.outwardRemittanceDetailsDTO.payeeAddress).length>0 ? data.outwardRemittanceDTO.outwardRemittanceDetailsDTO.payeeAddress : null);
                self.intermediaryBankDetails(data.outwardRemittanceDTO.intermediaryBankDetails && Object.keys(data.outwardRemittanceDTO.intermediaryBankDetails).length>0 ? data.outwardRemittanceDTO.intermediaryBankDetails : null);
                rootParams.dashboard.headerName(self.resource.outwardRemittance.headerDetail);

                const obj = ko.utils.arrayFirst(array, function(element) {
                    return element.refNumber === refNo;
                });

                self.preview(obj.preview);
                self.initials(obj.initials);

                self.isAdviceLoaded(typeof data.outwardRemittanceDTO.adviceList !== "undefined" && data.outwardRemittanceDTO.adviceList);
            });
        };

        self.back = function() {
            rootParams.dashboard.headerName(self.resource.outwardRemittance.header);
            self.stageTwo(false);
            self.stageOne(true);
        };

        self.cancel = function() {
            history.back();
        };

        self.validateFromAmount = {
            validate: function(value) {
                if (isNaN(value) || value.length > 15 || value < 0) {
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resource.outwardRemittance.amountValidation));
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
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resource.outwardRemittance.amountValidation));
                }

                if (self.fromAmount()) {
                    if (Number(value) < Number(self.fromAmount())) {
                        throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resource.outwardRemittance.toAmountValidation));
                    }
                }
            }
        };

        self.generatePDF = function() {
            outwardRemittanceModel.fetchPDF(self.refNumber());
        };
    };
});