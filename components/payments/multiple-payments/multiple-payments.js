define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/multiple-payments",
    "./model",
    "ojs/ojknockout",
    "ojs/ojbutton"
], function(oj, ko, $, ResourceBundle, Model) {
    "use strict";

    return function(Params) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(Model.getNewModel());

                return KoModel.autoPopulationData;
            },
            getMasterArrayElement = function(autoPopulationData) {
                return {
                    id: self.id++,
                    autoPopulationData: autoPopulationData,
                    payload: null,
                    isSuccess: false,
                    uri: {
                        value: null,
                        params: null
                    }
                };
            },
            batchRequest = {
                batchDetailRequestList: []
            };

        self.id = 1;
        self.refreshLabel = ko.observable(true);
        self.masterBatchArray = ko.observableArray();
        self.supportingData = {};
        ko.utils.extend(self, Params.rootModel.previousState ? Params.rootModel.previousState.retainedData : Params.rootModel);
        Params.baseModel.registerComponent("payments-money-transfer", "payments");
        Params.baseModel.registerComponent("review-multiple-payments", "payments");
        self.resource = ResourceBundle;
        self.isMultiplePayment = true;
        self.supportingDataLoaded = ko.observable(false);
        self.imageUploadFlag = ko.observable();
        self.betweenWalletAcc = ko.observable(false);

        Model.getPayeeMaintenance().then(function(data) {
            const configurationDetails = {};

            for (let k = 0; k < data.configurationDetails.length; k++) {
                configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
            }

            if (Params.dashboard.appData.segment === "CORP") { self.imageUploadFlag(configurationDetails.CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); } else { self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0); }
        });

        Params.dashboard.headerName(self.resource.title.header);

        if (self.masterBatchArray().length === 0) { self.masterBatchArray.push(getMasterArrayElement(getNewKoModel()), getMasterArrayElement(getNewKoModel())); }

        if (Object.getOwnPropertyNames(self.supportingData).length === 0) {
            Model.fireBatch({
                batchDetailRequestList: [{
                        methodType: "GET",
                        uri: {
                            value: "/payments/payeeGroup?expand=ALL&types=INTERNAL,INTERNATIONAL,INDIADOMESTIC,UKDOMESTIC,SEPADOMESTIC"
                        },
                        headers: {
                            "Content-Id": 1,
                            "Content-Type": "application/json"
                        }
                    },
                    {
                        methodType: "GET",
                        uri: {
                            value: "/payments/currentDate"
                        },
                        headers: {
                            "Content-Id": 2,
                            "Content-Type": "application/json"
                        }
                    },
                    {
                        methodType: "GET",
                        uri: {
                            value: "/maintenances/payments"
                        },
                        headers: {
                            "Content-Id": 3,
                            "Content-Type": "application/json"
                        }
                    }
                ]
            }).done(function(data) {
                for (let i = 0; i < data.batchDetailResponseDTOList.length; i++) {
                    switch (Number(data.batchDetailResponseDTOList[i].sequenceId)) {
                        case 1:
                            self.supportingData.payeeList = data.batchDetailResponseDTOList[i].responseObj;
                            break;
                        case 2:
                            self.supportingData.currentDate = data.batchDetailResponseDTOList[i].responseObj;
                            break;
                        case 3:
                            self.supportingData.maxPaymentsCount = Number(ko.utils.arrayFirst(data.batchDetailResponseDTOList[i].responseObj.configurationDetails, function(config) {
                                return config.propertyId === (Params.dashboard.appData.segment === "CORP" ? "CORPORATE_MAX_MULTIPLE_TRANSFER_LIMIT" : "RETAIL_MAX_MULTIPLE_TRANSFER_LIMIT");
                            }).propertyValue);

                            self.supportingData.checkUpcomingPayment = ko.utils.arrayFirst(data.batchDetailResponseDTOList[i].responseObj.configurationDetails, function(config) {
                                return config.propertyId === "CHECK_UPCOMING_PAYMENT";
                            }).propertyValue === "Y";

                            self.supportingData.checkUpcomingDays = Number(ko.utils.arrayFirst(data.batchDetailResponseDTOList[i].responseObj.configurationDetails, function(config) {
                                return config.propertyId === "CHECK_UPCOMING_PAYMENT_FOR_DAYS";
                            }).propertyValue);

                            self.supportingData.toDate = new Date(self.supportingData.currentDate.currentDate.valueDate);
                            self.supportingData.toDate.setDate(self.supportingData.toDate.getDate() + self.supportingData.checkUpcomingDays);
                    }
                }

                self.supportingDataLoaded(true);
            });
        } else {
            self.supportingDataLoaded(true);
        }

        let allSuccess = true,
            validationError = false;
        const crAccountContentIdMap = {},
            crAccountSequenceIdMap = {},
            creaditAccountSet = [];

        self.unsavedTransactionsCount = ko.observable();
        self.savedTransactionsCount = ko.observable();

        self.getPlusOne = function(value) {
            return value + 1;
        };

        self.initiateMultiplePayment = function() {
            for (let j = 0; j < self.masterBatchArray().length; j++) {
                if (!Params.baseModel.showComponentValidationErrors(document.getElementById("paymentsTracker" + self.masterBatchArray()[j].id))) { validationError = true; }
            }

            if (validationError) {
                validationError = false;

                return;
            }

            self.unsavedTransactionsCount(0);
            self.savedTransactionsCount(0);
            batchRequest.batchDetailRequestList = [];

            for (let i = 0; i < self.masterBatchArray().length; i++) {
                if (self.masterBatchArray()[i].autoPopulationData.showPaymentOverview()) {
                    const creditAcc = ko.utils.unwrapObservable(self.masterBatchArray()[i].autoPopulationData.overviewDetails().crtAccount);

                    if (creaditAccountSet.indexOf(creditAcc) < 0) {
                        creaditAccountSet.push(creditAcc);
                    }

                    crAccountContentIdMap[self.masterBatchArray()[i].id] = ko.utils.unwrapObservable(self.masterBatchArray()[i].autoPopulationData.overviewDetails().crtAccount);

                    batchRequest.batchDetailRequestList.push({
                        methodType: "POST",
                        uri: self.masterBatchArray()[i].uri,
                        payload: self.masterBatchArray()[i].payload,
                        headers: {
                            "Content-Id": self.masterBatchArray()[i].id,
                            "Content-Type": "application/json"
                        }
                    });

                    self.savedTransactionsCount(self.savedTransactionsCount() + 1);
                } else { self.unsavedTransactionsCount(self.unsavedTransactionsCount() + 1); }
            }

            if (self.unsavedTransactionsCount() > 0 && self.savedTransactionsCount() > 0) { $("#warning-unsaved").trigger("openModal"); } else { self.postPaymentRequest(); }
        };

        self.closeModal = function() {
            $("#warning-unsaved").trigger("closeModal");
        };

        function getInstructionsRequest() {
            const fromDateString = oj.IntlConverterUtils.dateToLocalIso(new Date(self.supportingData.currentDate.currentDate.valueDate)),
                toDateString = oj.IntlConverterUtils.dateToLocalIso(self.supportingData.toDate);
            let contentId = 1;
            const instructionBatchRequest = {
                batchDetailRequestList: []
            };

            for (let k = 0; k < creaditAccountSet.length; k++) {
                instructionBatchRequest.batchDetailRequestList.push({
                    methodType: "GET",
                    uri: {
                        value: "/payments/instructions?status=ACTIVE&type=ALL&fromDate={fromDate}&toDate={toDate}&creditAccountId={creditAccountId}",
                        params: {
                            fromDate: fromDateString,
                            toDate: toDateString,
                            creditAccountId: creaditAccountSet[k]
                        }
                    },
                    headers: {
                        "Content-Id": contentId,
                        "Content-Type": "application/json"
                    }
                });

                crAccountSequenceIdMap[contentId++] = creaditAccountSet[k];
            }

            return instructionBatchRequest;
        }

        self.postPaymentRequest = function() {
            if (batchRequest.batchDetailRequestList.length === 0 && self.unsavedTransactionsCount() > 0) {
                Params.baseModel.showMessages(null, [self.resource.msg.atleastonetxnmsg], "ERROR");

                return;
            }

            let instructionListPromise;
            const paymentPromise = Model.fireBatch(batchRequest, "CMFT"),
                isUpcomingPaymentMap = {};

            if (self.supportingData.checkUpcomingPayment && Params.dashboard.appData.segment !== "CORP") {
                instructionListPromise = Model.fireBatch(getInstructionsRequest());
            } else {
                instructionListPromise = Promise.resolve();
            }

            Promise.all([instructionListPromise, paymentPromise]).then(function(response) {
                const instructionResponse = response[0],
                    data = response[1];

                if (instructionResponse) {
                    for (let j = 0; j < instructionResponse.batchDetailResponseDTOList.length; j++) {
                        isUpcomingPaymentMap[crAccountSequenceIdMap[Number(instructionResponse.batchDetailResponseDTOList[j].sequenceId)]] = instructionResponse.batchDetailResponseDTOList[j].responseObj.instructionsList && instructionResponse.batchDetailResponseDTOList[j].responseObj.instructionsList.length;
                    }
                }

                for (let i = 0; i < data.batchDetailResponseDTOList.length; i++) {
                    const obj = ko.utils.arrayFirst(self.masterBatchArray(), function(element) {
                        return element.id === Number(data.batchDetailResponseDTOList[i].sequenceId);
                    });

                    obj.isSuccess = data.batchDetailResponseDTOList[i].status === 201;
                    obj.response = data.batchDetailResponseDTOList[i].responseObj;

                    if (obj.isSuccess) {
                        obj.warning = obj.response.status.message.detail;

                        if (instructionResponse && isUpcomingPaymentMap[crAccountContentIdMap[obj.id]]) {
                            obj.warning = (obj.warning || "") + Params.baseModel.format(self.resource.msg.upcomingPaymentMsg, {
                                days: self.supportingData.checkUpcomingDays
                            });
                        }
                    } else {
                        allSuccess = false;

                        const errorMessage = obj.response.message.validationError ? obj.response.message.validationError[0].errorMessage : obj.response.message.title || obj.response.message.detail;

                        obj.autoPopulationData.failureReason(errorMessage);
                        obj.autoPopulationData.txnFailed(true);
                        obj.autoPopulationData.showPaymentOverview(false);
                    }
                }

                if (allSuccess) {
                    Params.dashboard.loadComponent("review-multiple-payments", {
                        masterBatchArray: self.masterBatchArray(),
                        retainedData: self
                    }, self);
                } else { allSuccess = true; }
            });

            for (let i = 0; i < self.masterBatchArray().length; i++) {
                if (!self.masterBatchArray()[i].autoPopulationData.showPaymentOverview()) {
                    self.masterBatchArray().splice(i, 1);
                    i -= 1;
                }
            }
        };

        self.cancel = function() {
            history.back();
        };

        self.removePayment = function(sourceId) {
            self.refreshLabel(false);

            self.masterBatchArray.remove(function(element) {
                return element.id === sourceId;
            });

            ko.tasks.runEarly();
            self.refreshLabel(true);
        };

        self.addPayment = function(sourceId) {
            if (self.masterBatchArray().length === self.supportingData.maxPaymentsCount) {
                Params.baseModel.showMessages(null, [Params.baseModel.format(self.resource.msg.maxPaymentCountLimitMsg, {
                    count: self.supportingData.maxPaymentsCount
                })], "ERROR");

                return;
            }

            let autoPopulationData = getNewKoModel();

            if (sourceId) {
                let obj, index;

                for(index=0;index<self.masterBatchArray().length;index++){
                  if(self.masterBatchArray()[index].id === sourceId){
                    obj = self.masterBatchArray()[index];
                    break;
                  }
                }

                autoPopulationData = ko.mapping.fromJS(ko.mapping.toJS(obj.autoPopulationData));
                autoPopulationData.payeeDetails = ko.observable(autoPopulationData.payeeDetails);
                autoPopulationData.overviewDetails = ko.observable(autoPopulationData.overviewDetails);
                autoPopulationData.showPaymentOverview = ko.observable(false);
                self.masterBatchArray.splice(index+1,0,getMasterArrayElement(autoPopulationData));
            }
            else{
                self.masterBatchArray.push(getMasterArrayElement(autoPopulationData));
            }
        };
    };
});