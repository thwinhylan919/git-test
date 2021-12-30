define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojL10n!resources/nls/debtor-money-request",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton",
    "ojs/ojavatar"
], function(oj, ko, RequestMoneyModel, ResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this,
            batchRequest = {
                batchDetailRequestList: []
            },
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(RequestMoneyModel.getNewModel());

                return KoModel;
            };

        self.debtorDetails = null;
        self.RequestMoneyModel = getNewKoModel().RequestMoneyModel;
        self.customDebtorName = ko.observable();
        self.selectedDebtor = ko.observable();
        self.selectedDebtorName = ko.observable();
        self.customDebtorId = ko.observable();
        self.receivedDate = ko.observable();
        self.debtors = ResourceBundle.debtors;
        self.common = ResourceBundle.common;
        self.validationTracker = Params.validator;
        self.validationTracker = ko.observable();
        self.isRequstFromListLoaded = ko.observable(true);
        self.debtorNames = ko.observableArray();
        self.showError = ko.observable(false);
        self.currencyLoaded = ko.observable(false);
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.stageThree = ko.observable(false);
        self.remainingCommentChars = ko.observable(40);
        self.currency = ko.observable();
        self.additionalDetails = ko.observable();
        self.isDebtorListEmpty = ko.observable(false);
        self.DebtorListRefresh = ko.observable(false);
        self.dropDownActive = ko.observable();
        self.authKey = ko.observable();
        self.invalidOtpEntered = ko.observable(false);
        self.instructionId = ko.observable();
        self.externalReferenceId = ko.observable("");
        self.currentDate = ko.observable();
        self.tomorrow = ko.observable();
        self.formattedToday = ko.observable();
        self.formattedTomorrow = ko.observable();
        self.isDateLoaded = ko.observable(true);
        self.minReceivedDate = ko.observable();
        self.debtorListExpandAll = ko.observableArray();
        self.debtorSubList = ko.observableArray();
        self.debtorSubListExpandAll = ko.observableArray();
        self.contentId = ko.observable();
        self.initials = ko.observable();
        self.contentIdMap = ko.observable({});
        self.preview = ko.observable();
        Params.dashboard.headerName(self.debtors.requestMoney);

        if (Params.rootModel && Params.rootModel.previousState) { ko.utils.extend(self, Params.rootModel.previousState); } else if (!Params.rootModel || !Params.rootModel.params.isSuccess) { ko.utils.extend(self, Params.rootModel); }

        Params.baseModel.registerElement([
            "account-input",
            "amount-input",
            "comment-box",
            "confirm-screen"
        ]);

        Params.baseModel.registerComponent("add-new-debtor", "debtor");
        Params.baseModel.registerComponent("otp-verification", "payments");
        Params.baseModel.registerComponent("review-debtor-money-request", "debtor");

        const debtorIndex = {};

        self.setDebtor = function(event) {
            if (event.detail.value) {
                self.customDebtorName(self.debtorSubList()[debtorIndex[event.detail.value]].nickName);
                self.customDebtorId(self.debtorSubList()[debtorIndex[event.detail.value]].id);
                self.contentId(self.debtorSubList()[debtorIndex[event.detail.value]].contentId);
                self.initials(self.debtorSubList()[debtorIndex[event.detail.value]].initials);
                self.preview(self.debtorSubList()[debtorIndex[event.detail.value]].preview);
                self.RequestMoneyModel.payerId(self.debtorSubList()[debtorIndex[event.detail.value]].id);
                self.dropDownActive(false);
            }

        };

        const configurationDetails = {};

        self.imageUploadFlag = ko.observable();

        function getPayerMaintenance(data) {
            for (let k = 0; k < data.configurationDetails.length; k++) {
                configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
            }

            if (Params.dashboard.appData.segment !== "CORP") { self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); }
        }

        function loadBatchImages() {
            RequestMoneyModel.fireBatch(batchRequest).then(function(batchData) {
                for (let i = 0; i < batchData.batchDetailResponseDTOList.length; i++) {
                    const responseDTO = batchData.batchDetailResponseDTOList[i].responseObj;

                    self.contentIdMap()[responseDTO.contentDTOList[0].contentId.value]("data:image/gif;base64," + responseDTO.contentDTOList[0].content);
                }

                self.isDebtorListEmpty(false);
                ko.tasks.runEarly();
                self.isDebtorListEmpty(true);
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

        function getDebtorList(data) {
            batchRequest.batchDetailRequestList = [];

            for (let i = 0; i < data.payerGroups.length; i++) {
                if (data.payerGroups[i].listPayers[0].contentId) {
                    self.contentIdMap()[data.payerGroups[i].listPayers[0].contentId.value] = ko.observable();
                    loadBatchRequest(data.payerGroups[i].listPayers[0].contentId.value);
                }

                self.debtorSubList.push({
                    id: data.payerGroups[i].listPayers[0].id,
                    nickName: data.payerGroups[i].listPayers[0].nickName,
                    debtorType: data.payerGroups[i].listPayers[0].domesticPayerType,
                    transferMode: data.payerGroups[i].listPayers[0].transferMode ? data.payerGroups[i].listPayers[0].transferMode : "",
                    transferValue: data.payerGroups[i].listPayers[0].transferValue ? data.payerGroups[i].listPayers[0].transferValue : "",
                    contentId: data.payerGroups[i].listPayers[0].contentId ? data.payerGroups[i].listPayers[0].contentId.value : null,
                    preview: data.payerGroups[i].listPayers[0].contentId ? self.contentIdMap()[data.payerGroups[i].listPayers[0].contentId.value] : null,
                    initials: oj.IntlConverterUtils.getInitials(data.payerGroups[i].listPayers[0].nickName)
                });

                debtorIndex[data.payerGroups[i].listPayers[0].nickName] = i;

            }

            if (batchRequest.batchDetailRequestList.length) {
                loadBatchImages();
            }

            if (data.payerGroups.length === 0) {
                self.isDebtorListEmpty(true);
            }

            self.DebtorListRefresh(true);

            if (Params.options.data && Params.options.data.transferDataDebtor) {
                ko.tasks.runEarly();
                self.selectedDebtor(Params.options.data.transferDataDebtor.nickName);
            }

        }

        Promise.all([RequestMoneyModel.getDebtorList(), RequestMoneyModel.getPayerMaintenance()]).then(function(response) {
            getDebtorList(response[0]);
            getPayerMaintenance(response[1]);
        });

        self.refreshDropDown = function() {
            self.DebtorListRefresh(false);
            self.customDebtorName(null);
            self.debtorDetails = null;
            self.RequestMoneyModel.amount.amount("");
            self.RequestMoneyModel.sepaDomestic.nominatedAccount.value("");
            self.receivedDate("");
            self.RequestMoneyModel.remarks("");
            self.selectedDebtor("");
            self.dropDownActive(false);
            self.DebtorListRefresh(true);
        };

        self.getHostDate = function() {
            RequestMoneyModel.getHostDate().done(function(data) {
                const date = new Date(data.currentDate.valueDate);

                self.currentDate(date);
                date.setDate(date.getDate() + 1);
                self.tomorrow(date);
                self.formattedToday(new Date(self.currentDate()));
                self.formattedTomorrow(new Date(self.tomorrow()));
                self.receivedDate = self.receivedDate || self.formattedToday;
                ko.tasks.runEarly();
                self.isDateLoaded(true);
            });
        };

        self.getHostDate();

        self.cancel = function() {
            history.back();
        };

        self.verifyRequest = function() {
            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("requestMoneyTracker"))) {
                return;
            }

            self.RequestMoneyModel.payerId(self.RequestMoneyModel.payerId());
            self.RequestMoneyModel.startDate(self.receivedDate());
            self.RequestMoneyModel.endDate(self.receivedDate());
            self.RequestMoneyModel.sepaDomestic.nominatedAccount.value(self.RequestMoneyModel.sepaDomestic.nominatedAccount.value());
            self.RequestMoneyModel.sepaDomestic.nominatedAccount.displayValue(self.additionalDetails().account.id.displayValue);
            self.RequestMoneyModel.amount.currency(self.currency());

            const requestMoneyPayload = ko.toJSON(self.RequestMoneyModel);

            RequestMoneyModel.initiateRequestMoney(requestMoneyPayload).done(function(data) {
                self.instructionId(data.instructionId);
                self.stageOne(false);

                Params.dashboard.loadComponent("review-debtor-money-request", {
                    reviewMode: true,
                    header: Params.dashboard.headerName(),
                    instructionId: self.instructionId,
                    initials: self.initials,
                    customDebtorName: self.customDebtorName,
                    contentId: self.contentId,
                    confirmRequest: self.confirmRequest,
                    RequestMoneyModel: self.RequestMoneyModel,
                    receivedDate: self.receivedDate,
                    debtorDetails: self.debtorDetails,
                    selectedDebtor: self.selectedDebtor,
                    selectedDebtorName: self.selectedDebtorName,
                    customDebtorId: self.customDebtorId,
                    isRequstFromListLoaded: self.isRequstFromListLoaded,
                    debtorNames: self.debtorNames,
                    currencyLoaded: self.currencyLoaded,
                    currency: self.currency,
                    additionalDetails: self.additionalDetails,
                    isDebtorListEmpty: self.isDebtorListEmpty,
                    dropDownActive: self.dropDownActive,
                    currentDate: self.currentDate,
                    tomorrow: self.tomorrow,
                    formattedToday: self.formattedToday,
                    isDateLoaded: self.isDateLoaded,
                    minReceivedDate: self.minReceivedDate,
                    contentIdMap: self.contentIdMap,
                    preview: self.preview
                });
            });
        };

        self.commentLengthTrack = function() {
            self.remainingCommentChars(40 - document.getElementById("note").value.length);
        };

        self.getCurrency = function() {
            RequestMoneyModel.getCurrency().done(function(data) {
                self.currency(data.bankConfigurationDTO.localCurrency);
                self.currencyLoaded(true);
            });
        };

        self.getCurrency();

        self.cancelStageTwo = function() {
            self.stageOne(true);
            self.stageTwo(false);
        };

        self.confirmRequest = function() {
            RequestMoneyModel.confirmRequestMoney(self.instructionId()).done(function(data, status, jqXHR) {
                self.baseURL = "payments/instructions/payins/domestic/" + self.instructionId();
                self.externalReferenceId(data.externalReferenceId);
                self.stageOne(false);
                self.stageTwo(false);

                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    template: "confirm-screen/payments-template",
                    transactionName: self.debtors.confirmRequest,
                    debtor: true
                });
            });
        };

        self.resendOTP = function() {
            RequestMoneyModel.confirmRequestMoney(self.instructionId());
        };

        self.cancelStageThree = function() {
            self.stageOne(true);
            self.stageTwo(false);
            self.stageThree(false);
        };

        self.getFormattedDate = function() {
            const today = Params.baseModel.getDate();
            let month = today.getMonth() + 1;

            month = month < 10 ? "0" + month : month;

            let day = today.getDate();

            day = day < 10 ? "0" + day : day;

            const year = today.getFullYear();

            return year + "-" + month + "-" + day;
        };

        self.minReceivedDate(self.getFormattedDate());

        self.reloadComponent = function() {
            self.stageOne(true);
            self.stageTwo(false);
            self.stageThree(false);
        };
    };
});