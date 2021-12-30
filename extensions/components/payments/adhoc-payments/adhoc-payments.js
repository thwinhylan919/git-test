define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!extensions/resources/nls/adhoc-payments",
    "ojs/ojinputnumber",
    "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojdatetimepicker",
    "ojs/ojdialog",
    "ojs/ojavatar",
    "ojs/ojselectcombobox"
], function(oj, ko, $, AdhocPaymentModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(AdhocPaymentModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, rootParams.rootModel);
        this.params = rootParams.rootModel.params;
        self.payments = ResourceBundle.payments;
        self.common = self.payments.common;
        rootParams.dashboard.headerName(self.payments.addhocinternalheader);

        const batchRequest = {
            batchDetailRequestList: []
        };

        self.payload = getNewKoModel().adhocPaymentModel;
        self.hostDate = ko.observable();
        self.currentDate = ko.observable();
        self.tomorrow = ko.observable();
        self.yesterday = ko.observable();
        self.dayAfterTomorrow = ko.observable();
        self.refreshLookup = ko.observable(true);
        self.additionalBankDetails = ko.observable(null);
        self.accountNumber = ko.observable();
        self.ConfirmaccountNumber = ko.observable();
        self.accountName = ko.observable();
        self.internal = ko.observable({});
        self.reviewMode = true;
        self.transferMode = ko.observable();
        self.confirmScreenDetails = ko.observable();
        self.transactionPurposeList = ko.observableArray();
        self.purpose = ko.observable();
        self.otherPurposeValue = ko.observable();
        self.otherPurpose = ko.observable(false);
        self.currentAccountType = ko.observable("INTERNAL");
        self.refreshAmountComponent = ko.observable(true);
        self.transferAmount = ko.observable();
        self.transferCurrency = ko.observable();
        self.customCurrencyURL = ko.observable();
        self.isStandingInstruction = ko.observable(false);
        self.ispeerToPeer = ko.observable(false);
        self.transferOn = ko.observable();
        self.transferLater = ko.observable(false);
        self.transferTo = ko.observable();
        self.valuedate = ko.observable();
        self.frequency = ko.observable();
        self.model = ko.observable();
        self.srcAccount = ko.observable();
        self.additionalDetailsFrom = ko.observable();
        self.additionalDetails = ko.observable();
        self.initialLimitVisibility = ko.observable(false);
        self.customLimitType = ko.observable("");
        self.enableLimitLink = ko.observable(false);
        self.region = ko.observable("INDIA");
        self.sepaType = ko.observable();
        self.isComponentLoaded = ko.observable(false);
        self.currentRelationType = ko.observable("ACC");
        self.selectedComponent = ko.observable("adhoc-payments");
        self.internationalNetworkTypes = ko.observableArray();
        self.domesticNetworkTypes = ko.observableArray();
        self.loadAccessPointList = ko.observable(false);
        self.paymentTypeLoaded = ko.observable(false);
        self.isChargesLoaded = ko.observable(false);
        self.isTransactionPurposeListLoaded = ko.observable(true);
        self.transactionPurposeList = ko.observableArray();
        self.transactionPurposeMap = {};
        self.chargesList = ko.observableArray();
        self.AdhocFlag = ko.observable(true);
        self.oinNumber = ko.observable();
        self.oinDescription = ko.observable();
        self.paymentTypes = ko.observableArray();
        self.isNetworkTypesLoaded = ko.observable(false);
        self.networkTypesMap = {};
        self.paymentTypesMap = {};
        self.isPaymentTypesLoaded = ko.observable(false);
        self.countries = ko.observableArray();
        self.remarksArray = ko.observableArray();
        self.countriesMap = {};
        self.isCountriesLoaded = ko.observable(false);
        self.remarkLoaded = ko.observable(false);
        self.charges = ko.observable();
        self.otherDetails = ko.observable();
        self.network = ko.observable();
        self.bankDetailsCode = ko.observable();
        self.bankName = ko.observable();
        self.bankAddress = ko.observable();
        self.country = ko.observable();
        self.city = ko.observable();
        self.payeeNickName = ko.observable();
        self.correspondenceCharge = ko.observable("");
        self.correspondenceCharges = ko.observableArray();
        self.invoiceNumber = ko.observable();
        self.note = ko.observable();
        self.dummyAdditionalBankDetails = ko.observable();
        self.clearingCodeType = ko.observable();
        self.fromAdhocTransferUpi = ko.observable(false);
        self.isPurposeListLoaded = ko.observable(true);
        self.refreshAccountInputTF = ko.observable(true);
        self.currentTask = ko.observable("PC_F_INTRNL");
        self.stageOne = ko.observable(true);
        self.parentTaskCode = ko.observable("");
        self.viewlimits = ko.observable(false);
        self.stageTwo = ko.observable(false);
        self.readData = ko.observable();
        self.requestPageLoad = ko.observable(false);
        self.externalReferenceId = ko.observable();
        self.paymentId = ko.observable();
        self.paymentTransferData = ko.observable();
        self.payeeDetails = ko.observable();
        self.formattedToday = ko.observable();
        self.formattedTomorrow = ko.observable();
        self.formattedDayAfterTomorrow = ko.observable();
        self.payeeListExpandAll = ko.observableArray();
        self.addPayeeInGroup = ko.observable();
        self.adhocPayeeDetails = ko.observable();
        self.p2pAddPayeeAs = ko.observable("existing-payee");
        self.groupValid = ko.observable();
        self.contentIdMap = ko.observable({});
        self.imageUploadFlag = ko.observable();
        self.networkSuggestionModel = getNewKoModel().networkSuggestionModel;
        self.networkSuggestionModel.txnAmount.amount = self.transferAmount;
        self.networkSuggestionModel.txnAmount.currency = self.transferCurrency;
        self.networkSuggestionModel.bankCode = self.bankDetailsCode;
        self.paymentDetailsArray = ko.observableArray();
        self.networkTransferViaFlag = ko.observable("NO");
        self.networkTransferViaBankName = ko.observable();
        self.networkTransferViaBankAddress = ko.observable();
        self.networkTransferViaCountry = ko.observable();
        self.networkTransferViaCity = ko.observable();
        self.additionalNetworkTransferViaBankDetails = ko.observable(null);
        self.internationalNote = ko.observable();
        self.networkTransferViaFlag = ko.observable("NO");
        self.networkTransferViaCode = ko.observable();
        self.networkTransferVia = ko.observable();
        self.validateDTO = ko.observable();
        self.isDealCreationAllowed = ko.observable();
        self.refreshTransferOn = ko.observable(true);
        self.transferwhen = ko.observable(true);
        self.disableConfirmButton = ko.observable(false);

        self.combineRest = ko.observableArray(["virtual?q=" + JSON.stringify({
            criteria: [{
                operand: "vStatus",
                operator: "EQUALS",
                value: ["O"]
            }]
        }), "demandDeposit"]);

        self.debitAccountType = ko.observable();
        self.internationalAccBasedPayeePayload = getNewKoModel().internationalAccBasedPayeeModel;

        self.transferViaArray = [{
            value: "YES",
            text: self.payments.generic.common.yes
        }, {
            value: "NO",
            text: self.payments.generic.common.no
        }];

        self.addPaymentDetails = function() {
            if (self.paymentDetailsArray().length < 3) {
                self.paymentDetailsArray.push("");
            }
        };

        self.deletePaymentDetails = function(index) {
            self.paymentDetailsArray.splice(index, 1);
        };

        /**
         * This function is used reset fields related to intermediary bank details.
         *
         * @memberOf adhoc-payments
         * @function resetNetworkTransferViaDetails
         * @returns {void}
         */
        function resetNetworkTransferViaDetails() {
            self.additionalNetworkTransferViaBankDetails(null);
            self.networkTransferViaBankName(null);
            self.networkTransferViaBankAddress(null);
            self.networkTransferViaCountry(null);
            self.networkTransferViaCity(null);
            self.networkTransferViaCode(null);

        }

        self.transferViaBankChanged = function(event) {
            if (event.detail && event.detail.value) {
                self.networkTransferVia("SWI");
                resetNetworkTransferViaDetails();
            }
        };

        self.networkTransferViaChanged = function(event) {
            if (event.detail && event.detail.value) {
                resetNetworkTransferViaDetails();
            }
        };

        self.resetTransferViaCode = function() {
            self.networkTransferViaCode(null);
            self.additionalNetworkTransferViaBankDetails(null);
        };

        self.verifyTransferViaCode = function() {
            if (self.networkTransferVia() === "SWI") {
                AdhocPaymentModel.getBankDetailsBIC(self.networkTransferViaCode()).then(function(data) {
                    self.additionalNetworkTransferViaBankDetails(data);
                });
            } else if (self.networkTransferVia() === "NAC") {
                AdhocPaymentModel.getBankDetailsNCC(self.networkTransferViaCode(), self.region()).then(function(data) {
                    self.additionalNetworkTransferViaBankDetails(data);
                });
            }
        };

        function getDomesticpaymentType() {
            if (self.transferOn() === "now") {
                if (self.region() === "INDIA") {
                    return "INDIADOMESTICFT";
                } else if (self.region() === "UK") {
                    return "UKPAYMENTS";
                } else if (self.region() === "SEPA") {
                    if (self.sepaType() === "CRT") {
                        return "SEPACREDITTRANSFER";
                    } else if (self.sepaType() === "CAT") {
                        return "SEPACARDPAYMENT";
                    }
                }
            } else if (self.transferOn() === "later") {
                if (self.region() === "INDIA") {
                    return "INDIADOMESTICFT_PAYLATER";
                } else if (self.region() === "UK") {
                    return "UKPAYMENTS_PAYLATER";
                } else if (self.region() === "SEPA") {
                    if (self.sepaType() === "CRT") {
                        return "SEPACREDITTRANSFER_PAYLATER";
                    } else if (self.sepaType() === "CAT") {
                        return "SEPACARDPAYMENT_PAYLATER";
                    }
                }
            }
        }

        function getPaymentType() {
            if (self.currentAccountType() === "INTERNAL") {
                if (self.transferOn() === "now") {
                    return "INTERNALFT";
                }

                return "INTERNALFT_PAYLATER";

            } else if (self.currentAccountType() === "DOMESTIC") {
                return getDomesticpaymentType();
            } else if (self.currentAccountType() === "INTERNATIONAL") {
                if (self.transferOn() === "now") {
                    return "INTERNATIONALFT";
                } else if (self.transferOn() === "later") {
                    return "INTERNATIONALFT_PAYLATER";
                }
            }
        }

        const networkPriority = {};
        let nonSuggestedNetworkSelected = false,
            suggestNetwork = function(enable) {
                if (enable) {

                    /**
                     * AdhocPaymentModel.getNetworkPreferences().then(function (data) {
                     * for (let i = 0; i < data.networkpreferencedtos.length; i++) {
                     * networkPriority[data.networkpreferencedtos[i].networkType] = data.networkpreferencedtos[i].priority;
                     * }
                     * });
                     */
                }

                return function() {
                    if (enable && self.currentAccountType() === "DOMESTIC" && self.region() === "INDIA" && self.networkSuggestionModel.bankCode()) {
                        self.networkSuggestionModel.paymentType = getPaymentType();

                        AdhocPaymentModel.getSuggestedNetwork(ko.toJSON(self.networkSuggestionModel)).then(function(data) {
                            if (data.suggestedType.length) {
                                self.isNetworkTypesLoaded(false);

                                let suggestedNetwork, isLimitFailure;

                                for (let i = 0; i < data.suggestedType.length; i++) {
                                    self.domesticNetworkTypesObj[data.suggestedType[i].code].suggested(false);

                                    if (data.suggestedType[i].payeeBankSupport && data.suggestedType[i].workingWindowSet && data.suggestedType[i].limitAvailable) {
                                        if (!suggestedNetwork || networkPriority[data.suggestedType[i].code] < networkPriority[suggestedNetwork]) {
                                            suggestedNetwork = data.suggestedType[i].code;
                                        }

                                        self.domesticNetworkTypesObj[data.suggestedType[i].code].disabled(false);
                                    } else {
                                        if (self.networkSuggestionModel.txnAmount.amount && !data.suggestedType[i].limitAvailable) {
                                            isLimitFailure = true;
                                        }

                                        self.domesticNetworkTypesObj[data.suggestedType[i].code].disabled(true);
                                    }
                                }

                                ko.tasks.runEarly();

                                self.isNetworkTypesLoaded(true);
                                ko.tasks.runEarly();

                                if (suggestedNetwork) {
                                    self.domesticNetworkTypesObj[suggestedNetwork].suggested(true);

                                    if (!self.network() || (self.network() && self.domesticNetworkTypesObj[self.network()].disabled()) || !nonSuggestedNetworkSelected) {
                                        self.network(suggestedNetwork);
                                    }
                                } else {
                                    self.network(null);

                                    if (isLimitFailure) {
                                        rootParams.baseModel.showMessages(null, [self.payments.noNetworkSuggestedLimits], "ERROR");
                                    } else {
                                        rootParams.baseModel.showMessages(null, [self.payments.noNetworkSuggested], "ERROR");
                                        self.bankDetailsCode("");
                                    }

                                }
                            }
                        });
                    }
                };
            };

        AdhocPaymentModel.getMaintenances().then(function(data) {
            const configurationDetails = {};

            for (let k = 0; k < data.configurationDetails.length; k++) {
                configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
            }

            suggestNetwork = suggestNetwork(configurationDetails.NETWORK_SUGGESTION_ENABLED === "Y");

            if (rootParams.dashboard.appData.segment === "CORP") {
                self.imageUploadFlag(configurationDetails.CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0);
            } else {
                self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0);
            }
        });

        function callSuggestNetwork(newValue) {
            if (newValue) {
                suggestNetwork();
            } else if (self.currentAccountType() === "DOMESTIC" && self.region() === "INDIA") {
                self.isNetworkTypesLoaded(false);
                ko.tasks.runEarly();

                ko.utils.arrayForEach(Object.keys(self.domesticNetworkTypesObj), function(key) {
                    self.domesticNetworkTypesObj[key].disabled(false);
                    self.domesticNetworkTypesObj[key].suggested(false);
                });

                self.isNetworkTypesLoaded(true);
                ko.tasks.runEarly();
                self.network(Object.keys(self.domesticNetworkTypesObj)[0]);
            }
        }

        const transferAmountSubscribe = self.transferAmount.subscribe(callSuggestNetwork),
            bankDetailsSubscribe = self.bankDetailsCode.subscribe(callSuggestNetwork),
            transferCurrencySubscribe = self.transferCurrency.subscribe(callSuggestNetwork),
            dummyAdditionalBankDetailsSubscribe = self.dummyAdditionalBankDetails.subscribe(function(data) {
                if (!(self.currentAccountType() === "DOMESTIC" && self.region() === "INDIA") || (data && self.currentAccountType() === "DOMESTIC" && self.region() === "INDIA")) {
                    self.additionalBankDetails(data);
                }
            });

        self.dispose = function() {
            transferAmountSubscribe.dispose();
            bankDetailsSubscribe.dispose();
            transferCurrencySubscribe.dispose();
            dummyAdditionalBankDetailsSubscribe.dispose();
        };

        rootParams.baseModel.registerElement([
            "comment-box",
            "amount-input",
            "confirm-screen",
            "bank-look-up",
            "modal-window",
            "account-input",
            "internal-account-input"
        ]);

        rootParams.baseModel.registerComponent("transfer-view-limits", "financial-limits");
        rootParams.baseModel.registerComponent("available-limits", "financial-limits");
        rootParams.baseModel.registerComponent("review-adhoc-payments", "payments");
        rootParams.baseModel.registerComponent("warning-message-dialog", "payee");
        rootParams.baseModel.registerComponent("payment-money-transfer", "payments");
        rootParams.baseModel.registerComponent("bank-account-payee", "payee");
        self.isPayeeAccountTypeLoaded = ko.observable(false);
        self.payeeAccountTypeList = ko.observableArray();
        self.typeOfAccount = ko.observable(null);
        self.typeOfAccountDescription = ko.observable(null);

        self.accountNumber.subscribe(function(value) {
            if (self.currentAccountType() === "INTERNAL" && value !== "" && value.indexOf("undefined") === -1) {
                AdhocPaymentModel.validateAndFetchCurrency(value).done(function(data) {
                    self.customCurrencyURL("payments/currencies?type=INTERNALFT&currency=" + data.currencyCode);
                });
            }

            if (value !== "" && value !== null) {
                AdhocPaymentModel.getPayeeName(value).done(function(data) {
                    self.accountName(rootParams.baseModel.format(self.payments.payee.fullAccName, {
                        firstName: data.firstName,
                        lastName: data.lastName
                    }));
                });
            }
        });

        self.purposeChanged = function(event) {
            if (event.detail.value) {
                self.otherPurpose(event.detail.value === "OTH_Other");

                if (event.detail.value !== "OTH_Other") {
                    self.otherPurposeValue("");
                }
            }
        };

        self.loadAccessPointList = ko.observable(false);
        self.selectedChannelTypeName = ko.observable();
        self.selectedChannelType = ko.observable();
        self.selectedChannelIndex = ko.observable();
        self.selectedChannel = ko.observable(false);

        const validateDTOList = {
            INTERNAL: "com.ofss.digx.app.payment.dto.payee.InternalPayeeCreateRequestDTO",
            DOMESTIC: "com.ofss.digx.app.payment.dto.payee.DomesticPayeeCreateRequestDTO",
            INTERNATIONAL: "com.ofss.digx.app.payment.dto.payee.InternationalPayeeCreateRequestDTO"
        };

        self.validateDTO(rootParams.dashboard.getTaxonomyDefinition(validateDTOList[self.currentAccountType()]));

        const currentPayeeType = {
            internal: "internalPayee",
            domestic: "domesticPayee",
            international: "internationalPayee",
            domType: {
                INDIA: "indiaDomesticPayee",
                UK: "ukDomesticPayee",
                SEPA: "sepaDomesticPayee"
            }
        };

        self.validateField = function(field) {
            if (self.currentAccountType() === "DOMESTIC") {
                return field !== "nickName" ? currentPayeeType.domestic + "." + currentPayeeType.domType[self.region()] + "." + field : "domesticPayee.nickName";
            } else if (self.currentAccountType() !== "DOMESTIC") {
                return currentPayeeType[self.currentAccountType().toLowerCase()] + "." + field;
            }
        };

        self.channelTypeChangeHandler = function() {
            if (self.selectedChannelIndex() !== null) {
                self.selectedChannel(false);
                ko.tasks.runEarly();
                self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
                self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
                self.selectedChannel(true);
            }
        };

        self.channelList = ko.observableArray();

        AdhocPaymentModel.listAccessPoint().done(function(data) {
            self.channelList(data.accessPointListDTO);

            for (let i = 0; i < data.accessPointListDTO.length; i++) {
                if (data.accessPointListDTO[i].currentLoggedIn === true) {
                    self.selectedChannelIndex(i);
                }
            }

            self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
            self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
            self.selectedChannel(true);
            self.loadAccessPointList(true);
        });

        self.channelPopup = function() {
            const popup1 = document.querySelector("#channel-popup");

            if (popup1.isOpen()) {
                popup1.close();
            } else {
                popup1.open("#channel-disclaimer");
            }
        };

        let todate, dt, fromDate, checkUpcomingPayment, configuredDays;

        self.currentDateLoaded = ko.observable(false);

        function fetchHostDate() {
            AdhocPaymentModel.getHostDate().done(function(data) {
                fromDate = oj.IntlConverterUtils.dateToLocalIso(new Date(data.currentDate.valueDate));
                todate = new Date(data.currentDate.valueDate);
                self.requestPageLoad(false);
                dt = new Date(data.currentDate.valueDate);
                self.formattedToday(dt);
                self.currentDate(dt);

                const tomorrow = new Date(data.currentDate.valueDate);

                tomorrow.setDate(dt.getDate() + 1);
                self.formattedTomorrow(tomorrow);
                self.tomorrow(tomorrow);

                const dayAfterTomorrow = new Date(data.currentDate.valueDate);

                dayAfterTomorrow.setDate(tomorrow.getDate() + 1);
                self.formattedDayAfterTomorrow(dayAfterTomorrow);
                self.currentDateLoaded(true);
                self.requestPageLoad(true);
                self.isComponentLoaded(true);

                AdhocPaymentModel.getMaintenances().then(function(maintenances) {
                    checkUpcomingPayment = ko.utils.arrayFirst(maintenances.configurationDetails, function(config) {
                        return config.propertyId === "CHECK_UPCOMING_PAYMENT";
                    }).propertyValue === "Y";

                    if (checkUpcomingPayment) {
                        configuredDays = Number(ko.utils.arrayFirst(maintenances.configurationDetails, function(config) {
                            return config.propertyId === "CHECK_UPCOMING_PAYMENT_FOR_DAYS";
                        }).propertyValue);

                        todate = oj.IntlConverterUtils.dateToLocalIso(new Date(dt.setDate(dt.getDate() + configuredDays)));
                    }
                });
            });
        }

        fetchHostDate();

        function setNetwork() {
            if (self.region() === "INDIA" && self.currentAccountType() !== "INTERNATIONAL") {
                self.payload.genericPayout.network = self.network();
            } else {
                self.payload.genericPayee.network = self.network;
            }
        }

        function checkUpcomingPaymentsList() {
            AdhocPaymentModel.getUpcomingPaymentsList(fromDate, todate, self.accountNumber()).then(function(upcomingPaymentsList) {
                if (upcomingPaymentsList && upcomingPaymentsList.instructionsList && upcomingPaymentsList.instructionsList.length > 0) {
                    rootParams.baseModel.showMessages(null, [rootParams.baseModel.format(self.payments.warningMessage, {
                        X: configuredDays
                    })], "INFO");
                }
            });
        }

        function validationFailed() {
            const accountInfoValidationFailed = !rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker")),
                internationalNoteValidationFailed = self.currentAccountType() === "INTERNATIONAL" ? !rootParams.baseModel.showComponentValidationErrors(document.getElementById("international-note-validator")) : false,
                internationalValidationFailed = !rootParams.baseModel.showComponentValidationErrors(document.getElementById("internationalTracker")),
                networkCodeValidationFailed = !rootParams.baseModel.showComponentValidationErrors(document.getElementById("verify-code-tracker") || document.getElementById("verify-swiftCode-tracker") || document.getElementById("verify-ncc-tracker") || document.getElementById("verify-bank-details-tracker")),
                amountFromTransferMoneyValidationFailed = !rootParams.baseModel.showComponentValidationErrors(document.getElementById("paymentsTracker")),
                noteValidationFailed = !rootParams.baseModel.showComponentValidationErrors(document.getElementById("note-validator"));

            let payeeAccountTypeFailed = false;

            if (document.getElementById("verify-accountType-tracker")) {
                payeeAccountTypeFailed = !rootParams.baseModel.showComponentValidationErrors(document.getElementById("verify-accountType-tracker"));
            }

            return accountInfoValidationFailed || networkCodeValidationFailed || internationalValidationFailed || amountFromTransferMoneyValidationFailed || noteValidationFailed || payeeAccountTypeFailed || internationalNoteValidationFailed;
        }

        function setOtherDetails() {
            if (self.currentAccountType() === "DOMESTIC" && self.paymentType() === "URG") {
                self.payload.genericPayout.otherDetails.line1 = self.otherDetails;
                self.payload.genericPayout.otherDetails.line2 = self.paymentDetailsArray()[0] ? self.paymentDetailsArray()[0] : null;
                self.payload.genericPayout.otherDetails.line3 = self.paymentDetailsArray()[1] ? self.paymentDetailsArray()[1] : null;
                self.payload.genericPayout.otherDetails.line4 = self.paymentDetailsArray()[2] ? self.paymentDetailsArray()[2] : null;
            }
        }

        self.wraperFunction = function() {
            if (self.currentAccountType() === "INTERNATIONAL" && self.additionalDetailsFrom().account.id.displayValue === "Wallet") {
                rootParams.baseModel.showMessages(null, [self.payments.internationalWalletNotAllowed], "ERROR");
            } else if (self.transferOn() === "later" && self.additionalDetailsFrom().account.id.displayValue === "Wallet") {
                rootParams.baseModel.showMessages(null, [self.payments.noWalletFutureTransaction], "ERROR");
            } else {
                if (self.currentAccountType() === "DOMESTIC" && self.region() === "INDIA" && !self.network()) {
                    document.getElementById("message-box").closeAll();
                    rootParams.baseModel.showMessages(null, [self.payments.noNetworkSuggested], "ERROR");

                    return;
                }

                if (validationFailed()) {
                    return;
                }

                const accNumber = self.accountNumber();

                if (self.currentAccountType() === "INTERNAL") {
                    self.payload.genericPayee.accountNumber = self.accountNumber();
                }

                if (self.currentAccountType() === "INTERNAL" || self.currentAccountType() === "DOMESTIC") {
                    const purposeInitials = self.purpose() ? self.purpose().split("_") : "";

                    self.payload.genericPayout.purpose = purposeInitials[0];
                }

                self.payload.genericPayee.accountName = self.accountName;
                self.payload.genericPayee.name = self.accountName;
                self.payload.genericPayee.nickName = self.accountName;
                self.payload.genericPayee.accountType = self.typeOfAccount;

                if (self.region() === "UK") {
                    self.payload.genericPayee.ukPaymentType = self.paymentType();

                    self.paymentTypeChanged({
                        detail: {
                            value: self.paymentType()
                        }
                    });

                    setOtherDetails();
                }

                if (self.region() === "SEPA" && self.currentAccountType() === "DOMESTIC") {
                    self.payload.genericPayee.sepaType = self.paymentType();

                    self.payload.genericPayout.sepaDomestic = {
                        amount: {
                            currency: self.transferCurrency(),
                            amount: self.transferAmount()
                        },
                        oinNumber: self.oinNumber(),
                        oinDescription: self.oinDescription()
                    };
                } else {
                    self.payload.genericPayout.sepaDomestic = null;
                }

                if (self.currentAccountType() === "INTERNATIONAL" || self.currentAccountType() === "DOMESTIC") {
                    self.payload.genericPayee.accountNumber = accNumber;
                    self.payload.genericPayee.bankDetails.code = self.bankDetailsCode();
                    setNetwork();
                }

                if (self.currentAccountType() === "INTERNATIONAL") {
                    self.payload.genericPayee.address = self.internationalAccBasedPayeePayload.address;

                    if (self.networkTransferViaFlag() === "YES") {
                        self.payload.genericPayout.intermediaryBankNetwork = self.networkTransferVia;

                        if (self.networkTransferVia() === "SPE") {
                            self.payload.genericPayout.intermediaryBankDetails.name = self.networkTransferViaBankName;
                            self.payload.genericPayout.intermediaryBankDetails.address = self.networkTransferViaBankAddress;
                            self.payload.genericPayout.intermediaryBankDetails.country = self.networkTransferViaCountry;
                            self.payload.genericPayout.intermediaryBankDetails.city = self.networkTransferViaCity;
                        } else {
                            self.payload.genericPayout.intermediaryBankDetails.code = self.networkTransferViaCode;
                        }
                    } else {
                        self.payload.genericPayout.intermediaryBankNetwork(null);
                    }

                    self.payload.genericPayout.charges = self.charges()[0].split("_")[0];
                    self.payload.genericPayout.otherDetails.line1 = self.otherDetails;
                    self.payload.genericPayout.otherDetails.line2 = self.paymentDetailsArray()[0] ? self.paymentDetailsArray()[0] : null;
                    self.payload.genericPayout.otherDetails.line3 = self.paymentDetailsArray()[1] ? self.paymentDetailsArray()[1] : null;
                    self.payload.genericPayout.otherDetails.line4 = self.paymentDetailsArray()[2] ? self.paymentDetailsArray()[2] : null;

                    if (self.network() === "SPE") {
                        self.payload.genericPayee.bankDetails.name = self.bankName;
                        self.payload.genericPayee.bankDetails.address = self.bankAddress;
                        self.payload.genericPayee.bankDetails.city = self.city;
                        self.payload.genericPayee.bankDetails.country = self.country();
                    }
                }

                self.payload.genericPayout.amount.currency = self.transferCurrency();
                self.payload.genericPayout.amount.amount = self.transferAmount();
                self.payload.genericPayout.debitAccountId.value = self.srcAccount();
                self.payload.genericPayout.accountType = self.debitAccountType();
                self.payload.genericPayout.startDate = self.valuedate();

                if (self.currentAccountType() === "INTERNATIONAL") {
                    self.payload.genericPayout.remarks = "/" + self.internationalNote() + "/" + self.note();
                } else {
                    self.payload.genericPayout.remarks = self.note();
                }

                if (self.transferOn() === "later") {
                    self.payload.genericPayout.frequency = "10";
                }

                self.payload.genericPayout.purposeText = self.otherPurposeValue();
                self.payload.paymentType = getPaymentType();

                if (self.typeOfAccount()) {
                    self.typeOfAccountDescription(ko.utils.arrayFirst(self.payeeAccountTypeList(), function(element) {
                        return element.code === self.typeOfAccount();
                    }).description);
                }

                AdhocPaymentModel.makeAdhocPayment(ko.toJSON(self.payload)).done(function(data) {
                    document.getElementById("message-box").closeAll(function(message) {
                        return message.severity === "error";
                    });

                    if (checkUpcomingPayment) {
                        checkUpcomingPaymentsList();
                    }

                    self.readData = data;
                    self.paymentId(self.readData.paymentId);
                    self.stageOne(!self.stageOne());
                    self.stageTwo(!self.stageTwo());
                    $(".nav-bar").hide();
                });
            }
        };

        self.paymentType = ko.observable();

        self.paymentTypeChanged = function(event) {
            self.additionalBankDetails(null);
            self.refreshLookup(false);

            if (self.region() === "UK") {
                if (event.detail.value === "URG") {
                    self.clearingCodeType("SWI");
                    self.network("SWIFT");
                } else if (event.detail.value === "NOU") {
                    self.clearingCodeType("NAC");
                    self.network("SORT");
                } else if (event.detail.value === "FAS") {
                    self.network("SORT");
                    self.clearingCodeType("NAC");
                }
            }

            self.refreshLookup(true);
        };

        const networkCodeTypeMap = {
            FAS: "SWI",
            URG: "SWI",
            NOU: "NAC",
            CAT: "SWI",
            CRT: "SWI"
        };

        function paymentTypesForRegions() {
            $.when(AdhocPaymentModel.getPaymentTypes()).then(function(paymentTypesResponse) {
                self.paymentTypes.removeAll();

                if (self.currentAccountType() === "DOMESTIC" && (self.region() === "UK" || self.region() === "SEPA")) {
                    for (let i = 0; i < paymentTypesResponse.enumRepresentations[0].data.length; i++) {
                        self.paymentTypes.push({
                            text: paymentTypesResponse.enumRepresentations[0].data[i].description,
                            value: paymentTypesResponse.enumRepresentations[0].data[i].code
                        });

                        self.paymentTypesMap[paymentTypesResponse.enumRepresentations[0].data[i].code] = paymentTypesResponse.enumRepresentations[0].data[i].description;
                    }

                    self.clearingCodeType(networkCodeTypeMap[self.paymentTypes()[0].value]);

                    if (!self.paymentType()) {
                        self.paymentType(self.paymentTypes()[0].value);
                    }

                    if (self.paymentType() === "CAT" || self.paymentType() === "CRT") {
                        self.sepaType(self.paymentType());
                    }

                    self.paymentTypeChanged({
                        detail: {
                            value: self.paymentTypes()[0].value
                        }
                    });

                    self.isPaymentTypesLoaded(true);
                    self.paymentTypeLoaded(true);
                }
            });
        }

        self.domesticNetworkTypesObj = {};

        function networkTypesForRegions() {
            $.when(AdhocPaymentModel.getNetworkTypes(), AdhocPaymentModel.getCountries(), AdhocPaymentModel.getRemarks()).then(function(networkTypesResponse, countriesResponse, remarksResponse) {
                self.isNetworkTypesLoaded(false);

                if (Object.keys(self.domesticNetworkTypesObj).length === 0 && self.currentAccountType() === "DOMESTIC" && self.region() === "INDIA") {
                    for (let i = 0; i < networkTypesResponse.enumRepresentations[0].data.length; i++) {
                        self.domesticNetworkTypesObj[networkTypesResponse.enumRepresentations[0].data[i].code] = {
                            text: networkTypesResponse.enumRepresentations[0].data[i].description,
                            disabled: ko.observable(false),
                            suggested: ko.observable(false)
                        };

                        self.networkTypesMap[networkTypesResponse.enumRepresentations[0].data[i].code] = networkTypesResponse.enumRepresentations[0].data[i].description;
                    }
                } else if (self.internationalNetworkTypes().length === 0 && self.currentAccountType() === "INTERNATIONAL") {
                    for (let j = 0; j < networkTypesResponse.enumRepresentations[0].data.length; j++) {
                        self.internationalNetworkTypes.push({
                            text: networkTypesResponse.enumRepresentations[0].data[j].description,
                            value: networkTypesResponse.enumRepresentations[0].data[j].code
                        });

                        self.networkTypesMap[networkTypesResponse.enumRepresentations[0].data[j].code] = networkTypesResponse.enumRepresentations[0].data[j].description;
                    }

                    for (let z = 0; z < countriesResponse.enumRepresentations[0].data.length; z++) {
                        self.countries.push({
                            text: countriesResponse.enumRepresentations[0].data[z].description,
                            value: countriesResponse.enumRepresentations[0].data[z].code
                        });

                        self.countriesMap[countriesResponse.enumRepresentations[0].data[z].code] = countriesResponse.enumRepresentations[0].data[z].description;
                    }

                    self.isCountriesLoaded(true);
                }

                self.remarksArray.removeAll();
                ko.tasks.runEarly();

                for (let z = 0; z < remarksResponse.enumRepresentations[0].data.length; z++) {
                    self.remarksArray.push({
                        text: remarksResponse.enumRepresentations[0].data[z].description,
                        value: remarksResponse.enumRepresentations[0].data[z].code
                    });
                }

                self.remarkLoaded(true);

                self.networkTransferVia(networkTypesResponse.enumRepresentations[0].data[0].code);
                self.network(networkTypesResponse.enumRepresentations[0].data[0].code);
                ko.tasks.runEarly();
                self.isNetworkTypesLoaded(true);
            });
        }

        let cnfaccountValue,
            accountValue;

        self.confirmValue = ko.observable();

        function AccountNoValidator_fn(value) {
            accountValue = value;

            if (value) {
                if (cnfaccountValue) {
                    if (value === cnfaccountValue) {
                        document.getElementById("confirmAccNumber").validate();
                    } else {
                        throw new oj.ValidatorError("ERROR", self.payments.accountNoValidation);
                    }
                } else if (self.confirmValue()) {
                    if (value !== self.confirmValue()) {
                        throw new oj.ValidatorError("ERROR", self.payments.accountNoValidation);
                    }
                }
            }
        }

        function cnfAccountNoValidator_fn(value) {
            if ((self.accountNumber() && self.accountNumber() !== "") || value) {
                cnfaccountValue = value;

                if (accountValue !== cnfaccountValue) {
                    if (self.accountNumber() !== value) {
                        self.accountNumber("");
                        throw new oj.ValidatorError("ERROR", self.payments.accountNoValidation);
                    }
                } else if (accountValue === cnfaccountValue) {
                    self.confirmValue(cnfaccountValue);
                    cnfaccountValue = "";
                    AccountNoValidator_fn(accountValue);
                    document.getElementById("accNumber").validate();
                }
            } else {
                throw new oj.ValidatorError("ERROR", self.payments.validationMessage);
            }
        }

        self.accountNoValidator = ko.observableArray([rootParams.baseModel.getValidator("ACCOUNT")]);

        self.accountNoValidator.push({
            validate: AccountNoValidator_fn
        });

        self.confirmAccountNoValidator = [{
            validate: cnfAccountNoValidator_fn
        }];

        self.restrictedEvent = function() {
            $("#accNumber").bind("copy paste cut", function(e) {
                e.preventDefault();
            });

            $("#confirmAccNumber").bind("copy paste cut", function(e) {
                e.preventDefault();
            });
        };

        self.accountTypeChanged = function(event) {
            const data = event.detail;

            if (data.value !== data.previousValue) {
                self.validateDTO(rootParams.dashboard.getTaxonomyDefinition(validateDTOList[self.currentAccountType()]));
                document.getElementById("message-box").closeAll();
                self.isComponentLoaded(false);
                self.isNetworkTypesLoaded(false);
                self.transferOn("now");
                self.transferLater(false);
                self.transferLater(false);
                self.accountNumber("");
                self.ConfirmaccountNumber("");
                self.accountName("");
                self.transferAmount("");
                self.note("");
                self.internationalNote("");
                self.typeOfAccount(null);
                self.typeOfAccountDescription(null);
                self.typeOfAccount(null);
                self.bankDetailsCode("");
                self.paymentType(null);

                if (self.currentRelationType() === "ACC" && data.value === "INTERNAL") {
                    rootParams.dashboard.headerName(self.payments.addhocinternalheader);
                    self.getPurposeList();

                    if (self.accountNumber() && self.accountNumber() !== "") {
                        AdhocPaymentModel.validateAndFetchCurrency(self.accountNumber()).done(function(data) {
                            self.customCurrencyURL("payments/currencies?type=INTERNALFT&currency=" + data.currencyCode);
                        });
                    } else {
                        self.customCurrencyURL("");
                    }
                } else if (self.currentRelationType() === "ACC" && data.value === "INTERNATIONAL") {
                    rootParams.dashboard.headerName(self.payments.addhocinternationalheader);
                    self.customCurrencyURL("payments/currencies?type=PC_F_IT");
                    AdhocPaymentModel.init("INTERNATIONAL");
                    networkTypesForRegions();
                } else if (self.currentRelationType() === "ACC" && data.value === "DOMESTIC") {
                    rootParams.dashboard.headerName(self.payments.addhocdomesticheader);
                    self.customCurrencyURL("payments/currencies?type=DOMESTICFT");
                    self.getPurposeList();

                    if (self.region() === "INDIA") {
                        const networkCodes = Object.keys(self.domesticNetworkTypesObj);

                        for (let i = 0; i < networkCodes.length; i++) {
                            self.domesticNetworkTypesObj[networkCodes[i]].disabled(false);
                        }

                        self.isPayeeAccountTypeLoaded(false);
                        AdhocPaymentModel.init("INDIA");

                        AdhocPaymentModel.getPayeeAccountType(self.region()).then(function(responseData) {
                            self.payeeAccountTypeList(responseData.enumRepresentations[0].data);
                            self.isPayeeAccountTypeLoaded(true);
                        });

                        networkTypesForRegions();
                    } else if (self.region() === "UK") {
                        AdhocPaymentModel.init("UK");
                        paymentTypesForRegions();
                    } else if (self.region() === "SEPA") {
                        AdhocPaymentModel.init("SEPA");
                        paymentTypesForRegions();
                    }
                }

                self.setTaskCodeForPayNow();
                self.isComponentLoaded(true);
            }
        };

        self.openLookup = function() {
            $("#menuButtonDialog").trigger("openModal");
        };

        self.openNetworkTransferViaLookup = function() {
            self.clearingCodeType(self.networkTransferVia());
            $("#networkTransferViaBankLookUp").trigger("openModal");
        };

        self.validateCode = [{
            validate: function(value) {
                if (value.length < 1) {
                    return false;
                } else if (value.length > 11 || !/^[a-zA-Z0-9]+$/.test(value)) {
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.payments.payee.domestic.invalidError));
                }
            }
        }];

        self.validateInterCode = [{
            validate: function(value) {
                if (value.length < 1) {
                    return false;
                } else if (value.length > 20 || !/^[a-zA-Z0-9]+$/.test(value)) {
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.payments.payee.international.invalidError));
                }
            }
        }];

        self.verifyCode = function() {
            let tracker;

            if (self.currentAccountType() === "DOMESTIC") {
                if (self.region() === "INDIA") {
                    tracker = document.getElementById("verify-code-tracker");
                } else if (self.region() === "UK") {
                    if (self.paymentType() === "NOU" || self.paymentType() === "FAS") {
                        tracker = document.getElementById("verify-sortcode-tracker");
                    } else if (self.paymentType() === "URG") {
                        tracker = document.getElementById("verify-swiftCode-tracker");
                    }
                } else if (self.region() === "SEPA") {
                    tracker = document.getElementById("verify-bankCode-tracker");
                }
            } else if (self.currentAccountType() === "INTERNATIONAL") {
                if (self.network() === "SWI") {
                    tracker = document.getElementById("verify-swiftCode-tracker");
                } else if (self.network() === "NAC") {
                    tracker = document.getElementById("verify-ncc-tracker");
                }
            }

            if (!rootParams.baseModel.showComponentValidationErrors(tracker)) {
                return;
            }

            if (self.network() === "SWI" || self.network() === "SWIFT") {
                AdhocPaymentModel.getBankDetailsBIC(self.bankDetailsCode()).done(function(data) {
                    self.additionalBankDetails(data);
                });
            } else if (self.network() === "NAC" || self.network() === "SORT") {
                AdhocPaymentModel.getBankDetailsNCC(self.bankDetailsCode(), self.region()).done(function(data) {
                    self.additionalBankDetails(data);
                });
            } else if (self.currentAccountType() === "DOMESTIC") {
                if (self.region() === "SEPA") {
                    AdhocPaymentModel.getBankDetailsBIC(self.bankDetailsCode()).done(function(data) {
                        self.additionalBankDetails(data);
                    });
                } else {
                    AdhocPaymentModel.getBankDetailsDCC(self.bankDetailsCode()).done(function(data) {
                        self.additionalBankDetails(data);
                    });
                }

            }
        };

        self.networkTypeChanged = function(event) {
            if (event.detail.value) {
                if (!(self.currentAccountType() === "DOMESTIC" && self.region() === "INDIA")) {
                    self.resetCode();
                }

                nonSuggestedNetworkSelected = event.detail.originalEvent ? 1 : 0;

                if (self.network() === "NEFT") {
                    self.customLimitType("PC_F_DOM_NEFT_ADHOC");
                } else if (self.network() === "RTGS") {
                    self.customLimitType("PC_F_DOM_RTGS_ADHOC");
                } else if (self.network() === "IMPS") {
                    self.customLimitType("PC_F_DOM_IMPS_ADHOC");
                } else if (event.detail.value === "CRT") {
                    self.clearingCodeType("SWI");
                    self.customLimitType("PC_F_SEPA_CREDIT_ADHOC");
                    self.paymentType(event.detail.value);
                } else if (event.detail.value === "CAT") {
                    self.clearingCodeType("SWI");
                    self.customLimitType("PC_F_SEPA_CARD_ADHOC");
                    self.paymentType(event.detail.value);
                }

                self.parentTaskCode("PC_F_CGNDP");
            }
        };

        self.resetCode = function() {
            nonSuggestedNetworkSelected = false;

            ko.tasks.runEarly();
            self.bankDetailsCode(null);
            self.additionalBankDetails(null);
        };

        AdhocPaymentModel.getCorrespondenceCharges().done(function(data) {
            self.isChargesLoaded(false);

            for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.correspondenceCharges.push({
                    text: data.enumRepresentations[0].data[i].description,
                    value: data.enumRepresentations[0].data[i].code
                });

                self.chargesList[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }

            ko.tasks.runEarly();
            self.isChargesLoaded(true);
        });

        self.correspondanceChrgFromFavourites = function() {
            if (self.params.relationshipNumber) {
                for (let j = 0; j < self.correspondenceCharges().length; j++) {
                    if (self.correspondenceCharges()[j].value === self.params.charges) {
                        self.charges(self.correspondenceCharges()[j].value + "_" + self.correspondenceCharges()[j].text);
                        break;
                    }
                }
            }
        };

        self.viewLimitsModalId = Date.now().toString();

        self.viewLimits = function() {
            self.viewlimits(false);

            if (self.currentAccountType() === "INTERNAL") {
                self.customLimitType("PC_F_INTRNL_ADHOC");
                self.parentTaskCode("PC_F_CGNIP");
            } else if (self.currentAccountType() === "DOMESTIC") {
                if (self.customLimitType() === "") {
                    self.customLimitType("PC_F_DOM_NEFT_ADHOC");
                    self.parentTaskCode("PC_F_CGNDP");
                }
            } else if (self.currentAccountType() === "INTERNATIONAL") {
                self.customLimitType("PC_F_IT_ADHOC");
                self.parentTaskCode("PC_F_CGNITNP");
            }

            ko.tasks.runEarly();
            $("#" + self.viewLimitsModalId).trigger("openModal");
            self.viewlimits(true);
        };

        self.done = function() {
            $("#" + self.viewLimitsModalId).hide();
        };

        self.transferOnArray = [{
                id: "now",
                label: self.payments.moneytransfer.now
            },
            {
                id: "later",
                label: self.payments.moneytransfer.later
            }
        ];

        self.transferOn(self.transferOnArray[0].id);

        self.setTaskCodeForPayNow = function() {
            self.refreshAccountInputTF(false);

            switch (self.currentAccountType()) {
                case "INTERNAL":
                    self.currentTask("PC_F_INTRNL");
                    self.parentTaskCode("PC_F_CGNIP");
                    break;
                case "INTERNATIONAL":
                    self.currentTask("PC_F_IT");
                    self.parentTaskCode("PC_F_CGNITNP");
                    break;
                case "DOMESTIC":
                    self.currentTask("PC_F_DOM");
                    self.parentTaskCode("PC_F_CGNDP");
                    break;
                default:
                    break;
            }

            self.refreshAccountInputTF(true);
        };

        self.setTaskCodeForInstruction = function() {
            self.refreshAccountInputTF(false);

            switch (self.currentAccountType()) {
                case "INTERNAL":
                    self.currentTask("PC_F_INTRNL");
                    self.parentTaskCode("PC_F_CGNIP");
                    break;
                case "INTERNATIONAL":
                    self.currentTask("PC_F_IT");
                    self.parentTaskCode("PC_F_CGNITNP");
                    break;
                case "DOMESTIC":
                    self.currentTask("PC_F_DOM");
                    self.parentTaskCode("PC_F_CGNDP");
                    break;
                default:
                    break;
            }

            self.refreshAccountInputTF(true);
        };

        self.transferOnChange = function(event) {
            if (event.detail.value === "now" && event.detail.value !== event.detail.previousValue) {
                self.transferLater(false);
                self.setTaskCodeForPayNow();
                self.valuedate(self.formattedToday());
            } else {
                self.valuedate(null);
                self.transferLater(true);
                self.setTaskCodeForInstruction();

                if (self.transferTo() === "self") {
                    self.model(self.selfPayLaterPayload);
                }
            }
        };

        self.currencyParser = function(data) {
            const output = {};

            output.currencies = [];

            if (data) {
                if (data.currencyList !== null) {

                    if (self.transferCurrency() === undefined) {
                        self.transferCurrency(data.currencyList[0].code);

                        for (let i = 0; i < data.currencyList.length; i++) {
                            output.currencies.push({
                                code: data.currencyList[i].code,
                                description: data.currencyList[i].code
                            });
                        }
                    } else {
                        for (let i = 0; i < data.currencyList.length; i++) {
                            if (self.transferCurrency() === data.currencyList[i].code) {
                                self.transferCurrency(data.currencyList[i].code);
                            }

                            output.currencies.push({
                                code: data.currencyList[i].code,
                                description: data.currencyList[i].code
                            });
                        }
                    }
                }
            }

            return output;
        };

        self.getPurposeList = function() {
            AdhocPaymentModel.getTransferPurpose(self.currentAccountType()).done(function(data) {
                self.isPurposeListLoaded(false);

                if (data.linkageList.length > 0) {
                    if (data.linkageList && data.linkageList[0].purposeList && data.linkageList[0].purposeList.length > 0) {
                        self.transactionPurposeList.removeAll();

                        for (let i = 0; i < data.linkageList[0].purposeList.length; i++) {
                            self.transactionPurposeList.push({
                                text: data.linkageList[0].purposeList[i].description,
                                value: data.linkageList[0].purposeList[i].code
                            });
                        }
                    }
                }

                ko.tasks.runEarly();
                self.isPurposeListLoaded(true);
            });
        };

        self.getPurposeList();
        self.isCommentRequired = ko.observable();

        AdhocPaymentModel.fetchBankConfiguration().done(function(data) {
            self.region(data.bankConfigurationDTO.region);
            self.isCommentRequired(data.bankConfigurationDTO.region === "INDIA");
        });

        self.cancelDeletePayment = function() {
            document.getElementById("message-box").closeAll();
            self.stageOne(true);
            self.disableConfirmButton(false);
            self.stageTwo(false);
            fetchHostDate();
            AdhocPaymentModel.deletePayment(self.paymentId());
            $(".nav-bar").show();
        };

        self.confirmPayment = function() {
            self.disableConfirmButton(true);

            AdhocPaymentModel.confirmPayment(self.paymentId(), self.payload.paymentType).done(function(data, status, jqXHR) {
                document.getElementById("message-box").closeAll();

                let successMessage, statusMessages;

                self.httpStatus = jqXHR.status;

                if ((rootParams.dashboard.appData.segment === "CORP" && self.httpStatus && self.httpStatus !== 202) || rootParams.dashboard.appData.segment === "RETAIL") {
                    successMessage = self.payments.common.confirmScreen.successMessage;
                    statusMessages = self.payments.common.completed;
                } else if (rootParams.dashboard.appData.segment === "CORP" && self.httpStatus && self.httpStatus === 202) {
                    successMessage = self.payments.common.confirmScreen.corpMaker;
                    statusMessages = self.payments.pendingApproval;
                }

                let header;

                switch (self.currentAccountType()) {
                    case "INTERNAL":
                        header = self.payments.addhocinternalheader;
                        break;
                    case "INTERNATIONAL":
                        header = self.payments.addhocinternationalheader;
                        break;
                    case "DOMESTIC":
                        header = self.payments.addhocdomesticheader;
                        break;
                    default:
                        break;
                }

                self.externalReferenceId(data.externalReferenceId);
                self.stageTwo(false);

                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    transactionName: header,
                    addAdhocPayee: self.addAdhocPayee,
                    createPayee: self.createPayee,
                    payeeListExpandAll: self.payeeListExpandAll,
                    p2pAddPayeeAs: self.p2pAddPayeeAs,
                    imageUploadFlag: self.imageUploadFlag,
                    addPayeeInGroup: self.addPayeeInGroup,
                    common: self.common,
                    isAdhoc: true,
                    uniqueEndToEndTxnReference: {
                        UetrLabel: self.payments.moneytransfer.internationalPayee.UetrLabel,
                        UetrNumber: data.uniqueEndToEndTxnReference ? data.uniqueEndToEndTxnReference : null
                    },
                    confirmScreenExtensions: {
                        successMessage: successMessage,
                        statusMessages: statusMessages,
                        isSet: true,
                        eReceiptRequired: true,
                        taskCode: self.currentTask(),
                        confirmScreenDetails: self.confirmScreenDetails(),
                        template: "confirm-screen/payments-template"
                    }
                }, self);
            });
        };

        self.existingPayee = function() {
            const groupId = self.addPayeeInGroup().groupId,
                obj = ko.utils.arrayFirst(self.payeeListExpandAll(), function(element) {
                    return element.groupId === groupId;
                });

            self.createBankAccountPayee("manage-accounts", {
                payeeName: obj.payeeGroupName,
                payeeGroupId: groupId,
                isNew: false,
                preview: self.addPayeeInGroup().preview
            });
        };

        self.newPayee = function() {
            self.createBankAccountPayee("manage-accounts", {
                isNew: true
            });
        };

        self.createPayee = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("createpayee"))) {
                return;
            }

            if (self.p2pAddPayeeAs() === "existing-payee") {
                self.existingPayee();
            } else {
                self.newPayee();
            }
        };

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

        self.additionalDetailsFrom.subscribe(function(newValue) {

            if (newValue.account.type) {
                self.debitAccountType(newValue.account.type);
            }

            if (newValue.account.id.displayValue === "Wallet") {
                self.transferwhen(false);
            } else if (newValue.account.id.displayValue !== "Wallet" || (self.additionalDetails() && self.additionalDetails().account.id.displayValue !== "Wallet")) {
                self.transferwhen(true);
            }

        });

        function loadBatchImages() {
            AdhocPaymentModel.batchRead(batchRequest).done(function(batchData) {
                for (let i = 0; i < batchData.batchDetailResponseDTOList.length; i++) {
                    const responseDTO = batchData.batchDetailResponseDTOList[i].responseObj;

                    self.contentIdMap()[responseDTO.contentDTOList[0].contentId.value]("data:image/gif;base64," + responseDTO.contentDTOList[0].content);
                }

                $("#p2p-payee").trigger("openModal");
            });
        }

        self.addAdhocPayee = function() {
            if (rootParams.dashboard.appData.segment === "RETAIL") {
                AdhocPaymentModel.getPayeeList().done(function(data) {
                    if (data.payeeGroups.length === 0) {
                        self.newPayee();

                        return;
                    }

                    for (let i = 0; i < data.payeeGroups.length; i++) {
                        if (data.payeeGroups[i].contentId) {
                            loadBatchRequest(data.payeeGroups[i].contentId.value);
                            self.contentIdMap()[data.payeeGroups[i].contentId.value] = ko.observable();
                        }

                        self.payeeListExpandAll.push({
                            payeeGroupName: data.payeeGroups[i].name,
                            payeeList: data.payeeGroups[i].listPayees,
                            groupId: data.payeeGroups[i].groupId,
                            contentId: data.payeeGroups[i].contentId ? data.payeeGroups[i].contentId.value : null,
                            preview: data.payeeGroups[i].contentId ? self.contentIdMap()[data.payeeGroups[i].contentId.value] : null,
                            initials: oj.IntlConverterUtils.getInitials(data.payeeGroups[i].name)
                        });
                    }

                    if (batchRequest.batchDetailRequestList.length) {
                        loadBatchImages();
                    } else {
                        $("#p2p-payee").trigger("openModal");
                    }
                });
            } else {
                self.createBankAccountPayee("bank-account-payee", {
                    isNew: true
                });
            }
        };

        self.createBankAccountPayee = function(component, params) {
            let type;

            if (self.currentAccountType() === "INTERNAL") {
                type = "internal";
                self.selectedComponent("internal-payee");
            } else if (self.currentAccountType() === "INTERNATIONAL") {
                type = "international";
                self.selectedComponent("international-payee");
            } else if (self.currentAccountType() === "DOMESTIC") {
                type = "domestic";

                if (self.region() === "INDIA") {
                    self.selectedComponent("domestic-payee");
                } else if (self.region() === "UK") {
                    self.selectedComponent("uk-payee");
                } else {
                    self.selectedComponent("sepa-payee");
                }
            }

            AdhocPaymentModel.readPayee(self.readData.groupId, self.readData.payeeId, type).done(function(data) {
                self.adhocPayeeDetails(data);

                rootParams.dashboard.loadComponent(component, ko.mapping.toJS({
                    typeOfAccount: self.typeOfAccount,
                    typeOfAccountDescription: self.typeOfAccountDescription,
                    payeeAccountTypeList: self.payeeAccountTypeList,
                    selectedComponent: self.selectedComponent,
                    currentRelationType: self.currentRelationType,
                    currentAccountType: self.currentAccountType,
                    payeeAccountType: type,
                    accountNumber: self.accountNumber,
                    fromAdhoc: true,
                    region: self.region,
                    defaultTab: "bank-account-payee",
                    applicationType: "payee",
                    isNew: params.isNew,
                    payeeName: params.payeeName,
                    payeeId: self.readData.payeeId,
                    payeeNickName: self.payeeNickName,
                    sepaType: self.sepaType,
                    paymentType: self.paymentType,
                    accountName: self.accountName,
                    network: self.network,
                    bankDetailsCode: self.bankDetailsCode,
                    bankName: self.bankName,
                    bankAddress: self.bankAddress,
                    country: self.country,
                    city: self.city,
                    accessType: "PRIVATE",
                    payeeGroupId: params.payeeGroupId,
                    preview: params.preview ? params.preview : ko.observable(),
                    address: type === "international" ? self.internationalAccBasedPayeePayload.address : null
                }));
            });
        };

        if ((rootParams.options && rootParams.options.data && rootParams.options.data.transferObject && !rootParams.options.data.compName) || (self.params && self.params.transferObject && self.params.transferObject() && !self.params.component)) {
            const data = rootParams.options && rootParams.options.data ? rootParams.options.data.transferObject() : self.params.transferObject ? self.params.transferObject() : null;
            let paymentType;

            if (data.paymentType === "INTERNALFT") {
                paymentType = "INTERNAL";
            } else if (data.paymentType === "INDIADOMESTICFT") {
                paymentType = "DOMESTIC";
            }

            AdhocPaymentModel.readPayee(data.groupId, data.payeeId, paymentType.toLowerCase()).done(function(responseData) {
                const details = responseData.internalPayee ? responseData.internalPayee : responseData.domesticPayee.indiaDomesticPayee;

                self.accountNumber(details.accountNumber);
                self.ConfirmaccountNumber(details.accountNumber);

                if (data.paymentType === "INDIADOMESTICFT") {
                    self.typeOfAccount(details.accountType);
                }
            });

            const event = {
                detail: {
                    value: paymentType,
                    previousValue: self.currentAccountType()
                }
            };

            self.currentAccountType(paymentType);
            self.accountTypeChanged(event);
            self.accountName(data.accountName);
            self.srcAccount(data.debitAccountId);
            self.transferAmount(data.amount);
            self.transferCurrency(data.currency);
            self.purpose(data.purpose);
            self.note(data.remarks);

            if (data.paymentType === "INDIADOMESTICFT") {
                self.network(data.network);

                self.networkTypeChanged({
                    detail: {
                        value: self.network()
                    }
                });

                self.bankDetailsCode(data.bankDetailsCode);
            }
        }
    };
});