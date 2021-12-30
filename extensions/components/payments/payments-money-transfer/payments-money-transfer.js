define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/payments-money-transfer",
    "ojs/ojinputnumber",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojcheckboxset",
    "ojs/ojdatetimepicker",
    "ojs/ojdialog",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation",
    "ojs/ojpopup",
    "ojs/ojavatar"
], function(oj, ko, $, MoneyTransferModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;
        let i = 0,
            initialExecution = true;

        self.accountList = ko.observableArray();
        self.walletAccBalance = ko.observable();
        self.noWalletAcc = ko.observable(false);
        self.walletAccFlag = ko.observable(false);
        self.transferToArrayFlag = ko.observable(false);
        self.transferwhen = ko.observable(true);
        self.payeeId = ko.observable();
        self.selectedGroupName = ko.observable();
        self.accountNumber = self.accountNumber ? self.accountNumber() : ko.observable();

        function formTransferScreenArray() {
            if ((self.isStandingInstruction() && rootParams.dashboard.headerName(self.payments.setstandinginstruction_header)) || rootParams.dashboard.appData.segment === "CORP") {
                self.transferToArray = [{
                        id: "existing",
                        label: self.payments.moneytransfer.existingPayee
                    },
                    {
                        id: "self",
                        label: self.payments.moneytransfer.myAccounts
                    }
                ];
            } else {
                if (self.accountList) {
                    for (let i = 0; i < self.accountList().length; i++) {
                        if (self.accountList()[i].productDTO && self.accountList()[i].productDTO.productId === "WALLET") {
                            self.walletAccBalance(self.accountList()[i].availableBalance.amount);
                            self.walletAccFlag(true);
                        }
                    }
                }

                if (self.walletAccFlag() === false) {
                    self.noWalletAcc(true);

                    self.transferToArray = [{
                            id: "existing",
                            label: self.payments.moneytransfer.existingPayee
                        },
                        {
                            id: "self",
                            label: self.payments.moneytransfer.myAccounts
                        }
                    ];

                } else {
                    self.transferToArray = [{
                            id: "existing",
                            label: self.payments.moneytransfer.existingPayee
                        },
                        {
                            id: "adhoc",
                            label: self.payments.moneytransfer.newPayee
                        },
                        {
                            id: "self",
                            label: self.payments.moneytransfer.myAccounts
                        },
                        {
                            id: "betweenWallets",
                            label: self.payments.peerToPeer.transferWallet.betweenWallets
                        }
                    ];
                }

            }
        }

        MoneyTransferModel.fetchAccountData("demandDeposit").then(function(accounts) {
            self.accountList.removeAll();
            accounts = accounts || [];
            ko.utils.arrayPushAll(self.accountList, accounts);
        }).then(function() {
            formTransferScreenArray();
            self.transferToArrayFlag(true);
            self.transferToModeChange();
            self.transferTo(self.transferTo() ? self.transferTo() : self.transferToArray[0].id);
        });

        self.nls = ResourceBundle;

        const batchRequest = {
                batchDetailRequestList: []
            },
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(MoneyTransferModel.getNewModel());

                return KoModel;
            };

        self.defaultData = rootParams.options ? rootParams.options.data : rootParams.rootModel.params;

        if (rootParams.rootModel && rootParams.rootModel.isMultiplePayment) {
            ko.utils.extend(self, rootParams.referenceHandle.autoPopulationData);
            self.referenceHandel = rootParams.referenceHandle;
            self.isStandingInstruction = ko.observable(false);
        } else {
            self.walletLocalCurrency = ko.observable(rootParams.dashboard.appData.localCurrency);
            self.paymentType = ko.observable();
            self.noteInternational = ko.observable();
            self.purpose = ko.observable();
            self.otherPurposeValue = ko.observable();
            self.charges = ko.observable();
            self.otherDetails = ko.observable();
            self.oinNumber = ko.observable();
            self.oinDescription = ko.observable();
            self.instances = ko.observable();
            self.isEndDateRequired = ko.observable(true);
            self.transferMode = ko.observable("");
            self.otherPurpose = ko.observable(false);
            self.urlAttribute1 = ko.observable();
            self.urlAttribute2 = ko.observable();
            self.peerToPeerModel = getNewKoModel().P2PPayment;
            self.frequency = ko.observable();
            self.valuedate = ko.observable();
            self.selectedPayee = ko.observable();
            self.groupId = ko.observable();
            self.customTransferComponent = ko.observable();
            self.transferAmount = ko.observable();
            self.transferCurrency = ko.observable();
            self.srcAccount = ko.observable();
            self.note = ko.observable();
            self.internationalNote = ko.observable();
            self.siEnd = ko.observable("PAYLATER");
            self.transferOn = ko.observable();
            self.transferLater = ko.observable(false);
            self.siEndDate = ko.observable();
            self.siStartDate = ko.observable();
            self.customPayeeId = ko.observable(rootParams.rootModel.params.payeeId);
            self.domesticPayeeType = ko.observable(null);
            self.customCurrencyURL = ko.observable(null);
            self.adhoc = ko.observable(rootParams.rootModel.params.mode === "PAY_TO_CONTACTS");
            self.transferTo = ko.observable(rootParams.rootModel.params.params !== undefined ? rootParams.rootModel.params.params.transferTo : null);
            self.confirmTransferValue = ko.observable();
            self.payeeDetails = ko.observable("");
            self.validationTracker = ko.observable();
            self.confirmScreenDetails = ko.observable();
            self.customPayeeName = ko.observable(rootParams.rootModel.params.nickName);
            self.region = ko.observable();
            self.network = ko.observable();
            self.isNetworkTypesLoaded = ko.observable(false);
            self.paynowWithSI = ko.observableArray();
            self.currentExchangeRate = ko.observable();
            self.dealId = ko.observable();
            self.usePreBookedDeal = ko.observableArray([]);
            self.showList = ko.observable(false);
            self.dealDetails = ko.observable(false);
            self.dealsAvailable = ko.observable();
            self.isStandingInstruction = ko.observable();
            self.nonSuggestedNetworkSelected = ko.observable(false);
            self.domesticNetworkTypesObj = {};
            self.networkTransferViaCode = ko.observable();
            self.networkTransferVia = ko.observable("SWI");
            self.additionalNetworkTransferViaBankDetails = ko.observable(null);
            self.paymentDetailsArray = ko.observableArray();
            self.networkTransferViaFlag = ko.observable("NO");
            self.networkTransferViaBankName = ko.observable();
            self.networkTransferViaBankAddress = ko.observable();
            self.networkTransferViaCountry = ko.observable();
            self.networkTransferViaCity = ko.observable();
            self.remarksArray = ko.observableArray();
            self.remarkLoaded = ko.observable(false);
            self.betweenWalletAcc = ko.observable(false);
            self.mobileNumber = ko.observable();
            self.amountToTransfer = ko.observable();
            self.onBoardingModel = getNewKoModel().onBoardingModel;
            self.isMandatory = ko.observable(true);
            self.disableConfirmButton = ko.observable(false);

            if (rootParams.dashboard.appData.segment === "CORP") {
                self.isStandingInstruction(rootParams.rootModel.params.isStandingInstruction);
            } else {
                self.isStandingInstruction(rootParams.options && rootParams.options.metaData && rootParams.options.metaData.data ? rootParams.options.metaData.data.isStandingInstruction : rootParams.rootModel.params ? rootParams.rootModel.params.isStandingInstruction || rootParams.isStandingInstruction : null);
            }
        }

        self.payments = ResourceBundle.payments;

        self.openAdhocTransfer = function() {
            if (rootParams.dashboard.appData.segment !== "CORP") {
                rootParams.changeView("adhoc-payments", {
                    transferObject: null,
                    applicationType: "payments"
                });
            } else {
                rootParams.dashboard.loadComponent("adhoc-payments", {}, self);
            }
        };

        self.openMultipleTransfer = function() {
            if (rootParams.dashboard.appData.segment !== "CORP") {
                rootParams.changeView("multiple-payments", {
                    transferObject: null,
                    applicationType: "payments"
                });
            } else {
                rootParams.dashboard.loadComponent("multiple-payments", {}, self);
            }
        };

        rootParams.dashboard.helpComponent.params({
            payments: {
                multipleTransfersText: self.payments.common.help.multipleTransfersText,
                adhocTransfer: self.payments.common.help.adhocTransfer,
                openAdhocTransfer: self.openAdhocTransfer,
                multipleTransfers: self.payments.common.help.multipleTransfers,
                openMultipleTransfer: self.openMultipleTransfer
            }
        });

        self.payeeAccountTypeList = ko.observableArray();

        MoneyTransferModel.getPayeeAccountType("INDIA").then(function(data) {
            self.payeeAccountTypeList(data.enumRepresentations[0].data);
        });

        self.AdhocFlag = ko.observable(false);
        self.currentTask = ko.observable("PC_F_INTRNL");
        ko.utils.extend(self, rootParams.rootModel.previousState ? rootParams.rootModel.previousState.retainedData : rootParams.rootModel.params && rootParams.rootModel.params.isStandingInstruction && rootParams.rootModel.params.retainedData ? rootParams.rootModel.params.retainedData : rootParams.rootModel);

        self.payments = ResourceBundle.payments;

        function checkisStandingInstruction() {
            if (rootParams.rootModel.params && rootParams.rootModel.params.isStandingInstruction) {
                self.isStandingInstruction(rootParams.rootModel.params.isStandingInstruction);
            }
        }

        checkisStandingInstruction();

        if (rootParams.rootModel && rootParams.rootModel.isMultiplePayment) {
            self.validationTracker = rootParams.referenceHandle.validationTracker;
        }

        rootParams.baseModel.registerComponent("payment-self", "payments");
        rootParams.baseModel.registerComponent("payment-internal", "payments");
        rootParams.baseModel.registerComponent("payment-domestic", "payments");
        rootParams.baseModel.registerComponent("payment-international", "payments");
        rootParams.baseModel.registerComponent("payment-uk", "payments");
        rootParams.baseModel.registerComponent("payment-sepa", "payments");
        rootParams.baseModel.registerComponent("transfer-view-limits", "financial-limits");
        rootParams.baseModel.registerComponent("available-limits", "financial-limits");
        rootParams.baseModel.registerComponent("payment-peer-to-peer-existing", "payments");
        rootParams.baseModel.registerComponent("payment-peer-to-peer", "payments");
        rootParams.baseModel.registerComponent("standing-instructions-landing", "payments");
        rootParams.baseModel.registerComponent("payee-main", "payee");
        rootParams.baseModel.registerComponent("bank-account-payee", "payee");
        rootParams.baseModel.registerComponent("warning-message-dialog", "payee");
        rootParams.baseModel.registerComponent("payments-payee-list", "payee");
        rootParams.baseModel.registerComponent("multiple-payments", "payments");
        rootParams.baseModel.registerComponent("adhoc-payments", "payments");
        rootParams.baseModel.registerComponent("forex-deal-utilization", "payments");
        rootParams.baseModel.registerComponent("forex-deal-create", "forex-deal");
        rootParams.baseModel.registerComponent("add-to-favorite-base", "payments");

        rootParams.baseModel.registerElement([
            "modal-window",
            "confirm-screen",
            "row",
            "comment-box",
            "amount-input",
            "account-input",
            "internal-account-input"
        ]);

        function isTransferMode(mode) {
            return self.transferMode().toUpperCase() === mode.toUpperCase();
        }

        if (!rootParams.rootModel.isMultiplePayment) {
            if (rootParams.dashboard.appData.segment === "CORP") {
                rootParams.dashboard.headerName(self.payments.moneytransfer_header);
            } else {
                rootParams.dashboard.headerName(self.payments.moneytransfer_header_retail);
            }
        }

        rootParams.dashboard.headerCaption("");
        self.currentDate = ko.observable();
        self.tomorrow = ko.observable();
        self.dayAfterTomorrow = ko.observable();
        self.oneMonthLater = ko.observable();
        self.formattedToday = ko.observable();
        self.formattedTomorrow = ko.observable();
        self.formattedDayAfterTomorrow = ko.observable();
        self.requestPageLoad = ko.observable(false);
        self.data = ko.observable(rootParams.rootModel.params);
        self.transferObject = ko.observable();
        self.purposeDescription = ko.observable();
        self.chargesDescription = ko.observable();
        self.shareMessage = ko.observable(self.payments.shareMessage);
        self.paymentDetails = ko.observable(self.params.transferDetails);
        self.additionalDetailsFrom = ko.observable();
        self.isDataLoaded = ko.observable(true);
        self.frequencyDescription = ko.observable();
        self.WalletToWalletPayload = getNewKoModel().WalletToWalletModel;
        self.domesticPaymentPayload = getNewKoModel().domesticPaymentModel;
        self.domesticPayLaterPayload = getNewKoModel().domesticPayLaterModel;
        self.internationalPaymentPayload = getNewKoModel().internationalPaymentModel;
        self.internationalPayLaterPayload = getNewKoModel().internationalPayLaterModel;
        self.selfPaymentPayload = getNewKoModel().selfPaymentModel;
        self.selfPayLaterPayload = getNewKoModel().selfPayLaterModel;
        self.internalPaymentPayload = getNewKoModel().internalPaymentModel;
        self.internalPayLaterPayload = getNewKoModel().internalPayLaterModel;
        self.domesticAuthenticationModel = getNewKoModel().domesticAuthenticationModel;
        self.favoritesPayLoad = getNewKoModel().favoritesModel;
        self.finaldate = ko.observable();
        self.isPayeeListEmpty = ko.observable(false);
        self.noteComponentLoaded = ko.observable(true);
        self.creditAccountDisplayValue = ko.observable();
        self.customLimitType = ko.observable("");
        self.parentTaskCode = ko.observable("");
        self.model = ko.observable();
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.frequencyArray = ko.observableArray();
        self.purposeDescription = ko.observable();
        self.externalReferenceId = ko.observable();
        self.securityCode = ko.observable();
        self.transactionType = ko.observable();
        self.additionalDetails = ko.observable();
        self.moneyTransferheader = ko.observable(true);
        self.removeFavouriteFlag = ko.observable(false);
        self.fromFavourites = ko.observable(false);
        self.refreshAccountInputTF = ko.observable(true);
        self.loadAccessPointList = ko.observable(false);
        self.selectedChannelTypeName = ko.observable();
        self.selectedChannelType = ko.observable();
        self.selectedChannelIndex = ko.observable();
        self.currentLoggedInAccessPointIndex = ko.observable();
        self.selectedChannel = ko.observable(false);
        self.typeOfAccountDescription = ko.observable();
        self.contentIdMap = ko.observable({});
        self.networkSuggestionModel = getNewKoModel().networkSuggestionModel;
        self.networkSuggestionModel.payeeId = self.customPayeeId;
        self.networkSuggestionModel.txnAmount.amount = self.transferAmount;
        self.networkSuggestionModel.txnAmount.currency = self.transferCurrency;

        self.combineRest = ko.observableArray(["virtual?q=" + JSON.stringify({
            criteria: [{
                operand: "vStatus",
                operator: "EQUALS",
                value: ["O"]
            }]
        }), "demandDeposit"]);

        self.debitAccountType = ko.observable();

        self.channelTypeChangeHandler = function() {
            if (self.selectedChannelIndex() !== null && self.selectedChannelIndex() !== "") {
                self.selectedChannel(false);
                ko.tasks.runEarly();
                self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
                self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
                self.selectedChannel(true);
            }
        };

        self.channelList = ko.observableArray();

        MoneyTransferModel.listAccessPoint().done(function(data) {
            self.channelList(data.accessPointListDTO);

            for (let i = 0; i < data.accessPointListDTO.length; i++) {
                if (data.accessPointListDTO[i].currentLoggedIn === true) {
                    self.currentLoggedInAccessPointIndex(i);
                    self.selectedChannelIndex(i);
                }
            }

            self.selectedChannel(true);
            self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
            self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
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

        self.isDealCreationAllowed = ko.observable();

        MoneyTransferModel.fetchForexDealCreationFlag().then(function(data) {
            self.isDealCreationAllowed(data.partyPreferencesDTOs ? data.partyPreferencesDTOs.dealCreationAllowed : null);
        });

        if (rootParams.rootModel.params.mode) {
            self.moneyTransferheader(rootParams.rootModel.params.mode !== "PAY_TO_CONTACTS");
        }

        self.selectedPayeeName = ko.observable();
        self.domesticPayeeSubType = ko.observable();
        self.selectedTabData = rootParams.metaData;
        self.ispeerToPeer = ko.observable(false);
        self.paymentId = ko.observable(self.params.paymentId);
        self.payeeListExpandAll = ko.observableArray();
        self.corpPayeeList = ko.observableArray();
        self.payeeSubListExpandAll = ko.observableArray();
        self.payeeSubList = ko.observableArray();
        self.dropdownLevelOne = ko.observable(false);
        self.dropDownActive = ko.observable();
        self.frequencyLoaded = ko.observable(false);
        self.viewlimits = ko.observable(false);

        const transferObject = self.params && self.params.transferObject ? self.params.transferObject() : self.defaultData && self.defaultData.transferObject ? self.defaultData.transferObject() : null;

        self.transferOnArray = [{
                id: "now",
                label: self.payments.moneytransfer.now
            },
            {
                id: "later",
                label: self.payments.moneytransfer.later
            }
        ];

        const transferModeDetails = {
            INTERNAL: {
                component: "payment-internal",
                attr1: "transfers",
                attr2: "internal",
                batchType: {
                    create: "CPNWSII",
                    update: "PNWSII"
                },
                taskCode: "PC_F_INTRNL",
                parentTaskCode: "PC_F_CITF"
            },
            INTERNATIONAL: {
                component: "payment-international",
                attr1: "payouts",
                attr2: "international",
                currencyUrl: "payments/currencies?type=PC_F_IT",
                taskCode: "PC_F_IT",
                parentTaskCode: "PC_F_CITR"
            },
            DOMESTIC: {
                INDIA: {
                    component: "payment-domestic",
                    payeeSubTypeKey: "network",
                    payeeKey: "indiaDomesticPayee"
                },
                SEPA: {
                    component: "payment-sepa",
                    payeeSubTypeKey: "sepaType",
                    payeeKey: "sepaDomesticPayee"
                },
                UK: {
                    component: "payment-uk",
                    payeeSubTypeKey: "paymentType",
                    payeeKey: "ukDomesticPayee"
                },
                attr1: "payouts",
                attr2: "domestic",
                currencyUrl: "payments/currencies?type=DOMESTICFT",
                taskCode: "PC_F_DOM",
                parentTaskCode: "PC_F_CDFT",
                batchType: {
                    create: "CPNWSID",
                    update: "PNWSID"
                }
            },
            PEERTOPEER: {
                component: "payment-peer-to-peer-existing",
                attr1: "transfers",
                attr2: "peerToPeer",
                currencyUrl: "payments/currencies?type=PEER_TO_PEER",
                parentTaskCode: "PC_F_CPTP"
            },
            SELF: {
                taskCode: "PC_F_SELF",
                parentTaskCode: "PC_F_CSFT",
                batchType: {
                    create: "CPNWSIS",
                    update: "PNWSIS"
                }
            }
        };

        function getAccountTypeDescription(code) {
            return ko.utils.arrayFirst(self.payeeAccountTypeList(), function(element) {
                return element.code === code;
            }).description;
        }

        self.isCommentRequired = ko.observable();

        MoneyTransferModel.fetchBankConfig().then(function(data) {
            self.isCommentRequired(data.bankConfigurationDTO.region === "INDIA");
        });

        self.transferOn(self.transferOn() || self.transferOnArray[+!!self.isStandingInstruction()].id);
        self.networkTypesMap = {};

        function setTaskCode() {
            self.refreshAccountInputTF(false);
            self.currentTask(transferModeDetails[self.transferMode().toUpperCase()].taskCode);
            self.refreshAccountInputTF(true);
        }

        self.paynowWithSIChangeHandler = function(event) {
            if (event.detail && event.detail.value.length) {
                $("#pay-now-with-si-msg").trigger("openModal");
            }
        };

        self.closePaynowWithSIMsgModal = function(isProceed) {
            if (!isProceed) {
                self.paynowWithSI.removeAll();
            }

            $("#pay-now-with-si-msg").hide();
        };

        self.togglePaynowWithSIPopup = function() {
            const popup = document.querySelector("#paynowwithsi-popup");

            if (popup.isOpen()) {
                popup.close();
            } else {
                popup.open("#pay-now-with-si-know-more");
            }
        };

        const networkPriority = {};
        let suggestNetwork = function(enable) {
            if (enable) {
                /**
                 * MoneyTransferModel.getNetworkPreferences().then(function (data) {
                 *      for (let i = 0; i < data.networkpreferencedtos.length; i++) {
                 *          networkPriority[data.networkpreferencedtos[i].networkType] = data.networkpreferencedtos[i].priority;
                 *      }
                 * });
                 */
            }

            return function() {
                if (enable && isTransferMode("DOMESTIC") && self.domesticPayeeType() === "INDIA" && self.networkSuggestionModel.payeeId()) {
                    document.getElementById("message-box").closeAll();

                    MoneyTransferModel.getSuggestedNetwork(ko.toJSON(self.networkSuggestionModel)).then(function(data) {
                        if (data.suggestedType.length) {
                            self.isNetworkTypesLoaded(false);

                            let suggestedNetwork,
                                isLimitFailure;

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

                            if (suggestedNetwork) {
                                self.domesticNetworkTypesObj[suggestedNetwork].suggested(true);

                                if (!self.network() || (self.network() && self.domesticNetworkTypesObj[self.network()].disabled()) || !self.nonSuggestedNetworkSelected()) {
                                    self.network(suggestedNetwork);
                                }
                            } else {
                                self.network(null);

                                if (isLimitFailure) {
                                    rootParams.baseModel.showMessages(null, [self.payments.messages.payment.noNetworkSuggestedLimits], "ERROR");
                                } else {
                                    rootParams.baseModel.showMessages(null, [self.payments.messages.payment.noNetworkSuggested], "ERROR");
                                }
                            }

                            ko.tasks.runEarly();
                            self.isNetworkTypesLoaded(true);
                        }
                    });
                }
            };
        };

        function setTaskAndSuggest(transferOn) {
            if (isTransferMode("DOMESTIC")) {
                self.networkSuggestionModel.taskCodes(transferOn === "now" ? "PC_F_CDFT" : "PC_F_CDFTI");
                suggestNetwork();
            }
        }

        const transferAmountSubscribe = self.transferAmount.subscribe(function(newValue) {
            if (newValue) {
                suggestNetwork();
            }
        });

        self.setPayee = function(data) {
            self.transferCurrency(self.transferCurrency() || "");
            self.groupId(data.groupId);
            self.customPayeeName(data.nickName);
            self.customPayeeId(data.payeeId ? data.payeeId : data.payeeData ? data.payeeData.id : data.id);
            self.transferMode(data.domesticPayeeType ? "DOMESTIC" : data.payeeType);
            self.domesticPayeeType(data.domesticPayeeType);

            if (data.payeeData) {
                if (data.payeeType.toUpperCase() === "INTERNAL") {
                    self.payeeDetails({
                        typeofAccount: null,
                        accountType: data.payeeType,
                        accountNumber: data.payeeData.accountNumber,
                        accountName: data.payeeData.accountName,
                        preview: data.preview,
                        initials: data.initials,
                        contentId: data.contentId
                    });
                } else if (data.payeeType.toUpperCase() !== "PEERTOPEER") {
                    self.payeeDetails({
                        typeofAccount: data.payeeType.toUpperCase() === "DOMESTIC" && data.domesticPayeeType && data.domesticPayeeType === "INDIA" ? getAccountTypeDescription(data.payeeData.accountType) : null,
                        accountType: data.payeeType,
                        accountNumber: data.payeeData.accountNumber || data.payeeData.iban || "",
                        accountName: data.payeeData.accountName,
                        accountBranch: data.payeeData.bankDetails,
                        preview: data.preview,
                        initials: data.initials,
                        contentId: data.contentId,
                        payeeAddress: data.payeeData.address && Object.keys(data.payeeData.address).length > 0 ? data.payeeData.address : null
                    });

                    self.networkSuggestionModel.bankCode(data.payeeData.bankDetails.code);
                } else if (data.payeeType.toUpperCase() === "PEERTOPEER") {
                    self.payeeDetails({
                        payeeNickName: data.payeeData.nickName,
                        accountType: data.payeeType,
                        transferMode: data.payeeData.transferMode,
                        transferValue: data.payeeData.transferValue,
                        preview: data.preview,
                        initials: data.initials
                    });
                }
            }

            if (!self.region() && data.domesticPayeeType === "INDIA") {
                self.region(data.domesticPayeeType);

                MoneyTransferModel.getNetworkTypes().then(function(data) {
                    for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                        self.domesticNetworkTypesObj[data.enumRepresentations[0].data[i].code] = {
                            text: data.enumRepresentations[0].data[i].description,
                            disabled: ko.observable(false),
                            suggested: ko.observable(false)
                        };

                        self.networkTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
                    }

                    self.network(self.network() || data.enumRepresentations[0].data[0].code);
                    self.isNetworkTypesLoaded(true);
                    setTaskAndSuggest(self.transferOn());
                });
            } else if (!initialExecution && Object.keys(self.domesticNetworkTypesObj).length) {
                const networks = Object.keys(self.domesticNetworkTypesObj);

                for (let i = 0; i < networks.length; i++) {
                    self.domesticNetworkTypesObj[networks[i]].disabled(false);
                    self.domesticNetworkTypesObj[networks[i]].suggested(false);
                }

                setTaskAndSuggest(self.transferOn());
            }

            if (Object.keys(self.domesticNetworkTypesObj).length && data.domesticPayeeType === "INDIA") {
                self.isNetworkTypesLoaded(true);
            }

            if (!self.transferOn()) {
                self.transferOn(data.startDate ? self.transferOnArray[1].id : self.transferOnArray[0].id);
            }

            transferModeDetails.INTERNAL.currencyUrl = "payments/currencies?type=INTERNALFT&currency=" + data.currency;
            self.customTransferComponent(transferModeDetails[self.transferMode().toUpperCase()].component || transferModeDetails[self.transferMode().toUpperCase()][self.domesticPayeeType().toUpperCase()].component);
            self.urlAttribute1(transferModeDetails[self.transferMode().toUpperCase()].attr1);
            self.urlAttribute2(transferModeDetails[self.transferMode().toUpperCase()].attr2);
            self.customCurrencyURL(transferModeDetails[self.transferMode().toUpperCase()].currencyUrl);

            if (isTransferMode("DOMESTIC")) {
                if (!data.nickName) {
                    self.customPayeeName(data[transferModeDetails.DOMESTIC[self.domesticPayeeType().toUpperCase()].payeeKey].nickName);
                }

                self.domesticPayeeSubType(data.payeeData[transferModeDetails.DOMESTIC[self.domesticPayeeType().toUpperCase()].payeeSubTypeKey]);
            } else if (isTransferMode("PEERTOPEER")) {
                if (self.transferOn() === "now") {
                    self.model(self.peerToPeerModel);
                }

                self.peerToPeerModel.transferValue(data.transferValue);
                self.peerToPeerModel.transferMode(data.transferMode);
                self.ispeerToPeer(true);
            }

            setTaskCode();
            self.dropDownActive(false);
        };

        self.multiCurrencySupportEnabled = ko.observable("Y");

        MoneyTransferModel.listOfProperties().done(function(data) {

            const propertyMultiSupport = data.configurationDetails.filter(function(data) {
                return data.propertyId === "MULTICURRENCY_SUPPORT";
            });

            if (propertyMultiSupport.length > 0) {
                if (propertyMultiSupport[0].propertyValue === "N") {
                    self.multiCurrencySupportEnabled("N");
                } else {
                    self.multiCurrencySupportEnabled("Y");
                }
            }

        });

        let accountsCount;

        self.accountsParser = function(data) {
            if (data.length) {
                accountsCount = data.length;

            } else {
                accountsCount = data.accounts.length;
            }

            const tempData = data;

            if (self.multiCurrencySupportEnabled() === "N") {
                if (tempData) {
                    const filteredAccounts = tempData.filter(function(account) {
                        return account.currencyCode === rootParams.dashboard.appData.localCurrency;
                    });

                    return filteredAccounts;
                }
            }

            return tempData;
        };

        self.networkTypeChanged = function(event) {
            if (event.detail.value) {
                self.nonSuggestedNetworkSelected(event.detail.originalEvent ? 1 : 0);
            }
        };

        self.loadSelf = function() {
            if ((accountsCount && accountsCount >= 2) || self.fromFavourites()) {
                self.transferMode("SELF");
                self.model(self.selfPaymentPayload);
                self.urlAttribute1("transfers");
                self.urlAttribute2("self");
                self.customTransferComponent("payment-self");
                self.customPayeeName("SELF");
                self.transactionType("SELFFT");
            } else if (accountsCount && accountsCount < 2) {
                self.stageOne(false);

                rootParams.baseModel.showMessages(null, [self.payments.selfError], "ERROR", function() {
                    self.transferTo("existing");
                    self.stageOne(true);
                });
            }
        };

        const customLimitType = {
            INTERNAL: "PC_F_INTRNL",
            INTERNATIONAL: "PC_F_IT",
            INDIA: "PC_F_DOM_",
            UK: "PC_F_UK_",
            SEPA: "PC_F_SEPA_",
            CAT: "CARD",
            CRT: "CREDIT",
            PEERTOPEER: "PC_F_PRTOPR"
        };

        self.viewLimitsModalId = Date.now().toString();

        self.viewLimits = function() {
            self.viewlimits(false);
            self.parentTaskCode("");
            self.customLimitType("");

            if (self.customPayeeName() && self.customPayeeName() !== null) {
                if (self.transferTo() === "self") {
                    self.customLimitType("PC_F_SELF");
                } else if (self.transferTo() === "existing") {
                    self.customLimitType(customLimitType[self.transferMode().toUpperCase()] || (customLimitType[self.domesticPayeeType()] + (customLimitType[self.domesticPayeeSubType()] || self.domesticPayeeSubType() || self.network())));
                }

                self.parentTaskCode(transferModeDetails[self.transferMode().toUpperCase()].parentTaskCode);
            }

            ko.tasks.runEarly();
            self.selectedChannelIndex(self.currentLoggedInAccessPointIndex());
            $("#" + self.viewLimitsModalId).trigger("openModal");
            self.viewlimits(true);
        };

        self.done = function() {
            ko.tasks.runEarly();
            $("#" + self.viewLimitsModalId).hide();
        };

        self.currentDateLoaded = ko.observable(false);

        let today, checkUpcomingPayment, checkUpcomingPaymentTill, checkUpcomingDays;

        function hostDateHandler(data) {

            self.requestPageLoad(false);
            today = new Date(data.currentDate.valueDate);
            self.formattedToday(today);
            self.currentDate(today);

            const newTomorrow = new Date(data.currentDate.valueDate),
                tomorrow = new Date(newTomorrow.setHours(0, 0, 0, 0));

            tomorrow.setDate(newTomorrow.getDate() + 1);
            self.formattedTomorrow(tomorrow);
            self.tomorrow(tomorrow);

            const newDayAfterTomorrow = new Date(data.currentDate.valueDate),
                dayAfterTomorrow = new Date(newDayAfterTomorrow.setHours(0, 0, 0, 0));

            dayAfterTomorrow.setDate(tomorrow.getDate() + 1);
            self.formattedDayAfterTomorrow(dayAfterTomorrow);
            self.dayAfterTomorrow(dayAfterTomorrow);
            self.currentDateLoaded(true);
            self.requestPageLoad(true);
        }

        self.transferOnChange = function(event) {
            if (event.detail.value === "now" && event.detail.value !== event.detail.previousValue) {
                self.transferLater(false);
                self.valuedate(self.formattedToday());
                setTaskAndSuggest(event.detail.value);
            } else {
                self.valuedate(null);
                self.transferLater(true);

                if (self.transferTo() === "self") {
                    self.model(self.selfPayLaterPayload);
                } else {
                    setTaskAndSuggest(event.detail.value);
                }
            }
        };

        self.getSubPayeeList = function(groupName) {
            for (i = 0; i < self.payeeListExpandAll().length; i++) {
                if (self.payeeListExpandAll()[i].payeeGroupName === groupName) {
                    return self.payeeListExpandAll()[i];
                }
            }
        };

        self.payeeChanged = function(event) {
            if ((event.detail && event.detail.value) || self.selectedPayee()) {
                self.payeeSubList().length = 0;

                let transactingPayeeIndex = -1;

                self.payeeSubListExpandAll(self.getSubPayeeList(event.detail ? event.detail.value : self.selectedPayee()));

                MoneyTransferModel.readPayeeGroup(self.payeeSubListExpandAll().groupId).done(function(responseData) {
                    if (responseData.listPayees) {
                        self.payeeSubListExpandAll().payeeList = responseData.listPayees;

                        for (i = 0; i < self.payeeSubListExpandAll().payeeList.length; i++) {
                            const payeeSublist = ko.toJS(self.payeeSubListExpandAll().payeeList[i]);

                            if (payeeSublist.id === self.customPayeeId() || (transferObject && transferObject.isFavoriteTransaction && payeeSublist.id === transferObject.payeeId)) {
                                transactingPayeeIndex = i;
                            }

                            const subList = payeeSublist.indiaDomesticPayee || payeeSublist.ukDomesticPayee || payeeSublist.sepaDomesticPayee || payeeSublist;

                            self.payeeSubList.push({
                                groupId: self.payeeSubListExpandAll().groupId,
                                payeeId: payeeSublist.id,
                                payeeData: payeeSublist.indiaDomesticPayee || payeeSublist.ukDomesticPayee || payeeSublist.sepaDomesticPayee || payeeSublist,
                                nickName: payeeSublist.nickName,
                                payeeType: payeeSublist.payeeType,
                                transferMode: payeeSublist.transferMode ? payeeSublist.transferMode : "",
                                transferValue: payeeSublist.transferValue ? payeeSublist.transferValue : "",
                                domesticPayeeType: payeeSublist.domesticPayeeType ? payeeSublist.domesticPayeeType : "",
                                currency: payeeSublist.currency ? payeeSublist.currency : "",
                                contentId: subList.contentId ? subList.contentId.value : null,
                                preview: subList.contentId ? self.contentIdMap()[subList.contentId.value] : self.payeeSubListExpandAll().contentId ? self.contentIdMap()[self.payeeSubListExpandAll().contentId.value] : ko.observable(null),
                                initials: oj.IntlConverterUtils.getInitials(payeeSublist.nickName.split(/\s+/)[0], payeeSublist.nickName.split(/\s+/)[1])
                            });
                        }

                        self.selectedPayeeName(event.detail ? event.detail.value : self.selectedPayee());
                        self.customPayeeName(self.selectedPayee());
                        self.dropDownActive(true);
                        self.dropdownLevelOne(false);

                        if (self.selectedPayee() && transactingPayeeIndex !== -1) {
                            self.setPayee(self.payeeSubList()[transactingPayeeIndex]);
                        }
                    }
                });
            }
        };

        self.refreshDropDown = function() {
            self.dropdownLevelOne(false);
            self.otherPurpose(false);
            self.customPayeeName(null);
            self.charges("");
            self.purpose("");
            self.srcAccount(undefined);
            self.frequency(undefined);
            self.refreshAccountInputTF(false);
            self.selectedPayee("");

            if (!(transferObject && transferObject.isFavoriteTransaction)) {
                self.emptyFields();
            }

            self.customTransferComponent(undefined);
            self.isNetworkTypesLoaded(false);
            self.model(null);
            self.dropDownActive(false);
            self.payeeDetails("");
            self.customPayeeId("");
            self.ispeerToPeer(false);
            self.customCurrencyURL(null);
            self.currentExchangeRate(null);
            self.transferMode(null);
            self.dealId(null);
            self.dealDetails(false);
            self.dealsAvailable();
            self.usePreBookedDeal([]);
            self.showList(false);
            ko.tasks.runEarly();
            self.dropdownLevelOne(true);
            self.refreshAccountInputTF(true);
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

        self.corporatePayeeChange = function(event) {
            if (event.detail.value) {
                self.refreshDropDown();

                for (let i = 0; i < self.payeeListExpandAll().length; i++) {
                    if (event.detail.value === self.payeeListExpandAll()[i].payeeGroupName) {
                        MoneyTransferModel.readPayeeGroup(self.payeeListExpandAll()[i].groupId).done(function(responseData) {
                            if (responseData.listPayees) {
                                if (self.corpPayeeList()[0] !== null) {
                                    self.corpPayeeList.removeAll();
                                }

                                if (responseData.listPayees[0] !== null) {
                                    self.corpPayeeList.push({
                                        groupId: self.payeeListExpandAll()[i].groupId,
                                        payeeGroupName: self.payeeListExpandAll()[i].payeeGroupName,
                                        nickName: responseData.listPayees[0].nickName,
                                        payeeId: responseData.listPayees[0].id,
                                        payeeData: responseData.listPayees[0].indiaDomesticPayee || responseData.listPayees[0].ukDomesticPayee || responseData.listPayees[0].sepaDomesticPayee || responseData.listPayees[0],
                                        payeeType: responseData.listPayees[0].payeeType,
                                        transferMode: responseData.listPayees[0].transferMode ? responseData.listPayees[0].transferMode : "",
                                        transferValue: responseData.listPayees[0].transferValue ? responseData.listPayees[0].transferValue : "",
                                        domesticPayeeType: responseData.listPayees[0].domesticPayeeType ? responseData.listPayees[0].domesticPayeeType : "",
                                        currency: responseData.listPayees[0].currency ? responseData.listPayees[0].currency : "",
                                        initials: oj.IntlConverterUtils.getInitials(responseData.listPayees[0].nickName.split(/\s+/)[0], responseData.listPayees[0].nickName.split(/\s+/)[1])
                                    });

                                    if (self.corpPayeeList()[0].payeeData.contentId) {
                                        self.contentIdMap()[self.corpPayeeList()[0].payeeData.contentId.value] = ko.observable();
                                        loadBatchRequest(self.corpPayeeList()[0].payeeData.contentId.value);
                                    }

                                    self.corpPayeeList()[0].contentId = self.corpPayeeList()[0].payeeData.contentId;
                                    self.corpPayeeList()[0].preview = self.corpPayeeList()[0].payeeData.contentId ? self.contentIdMap()[self.corpPayeeList()[0].payeeData.contentId.value] : ko.observable();

                                    self.selectedPayee(self.corpPayeeList()[0].payeeGroupName);
                                    self.setPayee(self.corpPayeeList()[0]);
                                }
                            }
                        });

                        break;
                    }
                }
            }
        };

        function loadBatchImages() {
            MoneyTransferModel.fireBatch(batchRequest).then(function(batchData) {
                for (let i = 0; i < batchData.batchDetailResponseDTOList.length; i++) {
                    const responseDTO = batchData.batchDetailResponseDTOList[i].responseObj;

                    self.contentIdMap()[responseDTO.contentDTOList[0].contentId.value]("data:image/gif;base64," + responseDTO.contentDTOList[0].content);
                }
            });
        }

        const configurationDetails = {};

        self.imageUploadFlag = ko.observable();

        MoneyTransferModel.getPayeeMaintenance().then(function(data) {
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

        function payeeListHandler(data) {
            batchRequest.batchDetailRequestList = [];

            for (let i = 0; i < data.payeeGroups.length; i++) {
                if (rootParams.dashboard.appData.segment === "CORP") {
                    if (transferObject && transferObject.isFavoriteTransaction && transferObject.groupId === data.payeeGroups[i].groupId) {
                        self.selectedPayee(data.payeeGroups[i].name);
                        self.selectedGroupName(data.payeeGroups[i].name);
                    }

                    self.payeeListExpandAll.push({
                        groupId: data.payeeGroups[i].groupId,
                        payeeGroupName: data.payeeGroups[i].name,
                        preview: ko.observable(null),
                        initials: oj.IntlConverterUtils.getInitials(data.payeeGroups[i].name.split(/\s+/)[0], data.payeeGroups[i].name.split(/\s+/)[1])
                    });

                } else {
                    if (data.payeeGroups[i].contentId) {
                        self.contentIdMap()[data.payeeGroups[i].contentId.value] = ko.observable();
                        loadBatchRequest(data.payeeGroups[i].contentId.value);
                    }

                    if (transferObject && transferObject.isFavoriteTransaction && transferObject.groupId === data.payeeGroups[i].groupId) {
                        self.selectedPayee(data.payeeGroups[i].name);
                    }

                    self.payeeListExpandAll.push({
                        payeeGroupName: data.payeeGroups[i].name,
                        payeeList: data.payeeGroups[i].listPayees,
                        groupId: data.payeeGroups[i].groupId,
                        contentId: data.payeeGroups[i].contentId ? data.payeeGroups[i].contentId : null,
                        preview: data.payeeGroups[i].contentId ? self.contentIdMap()[data.payeeGroups[i].contentId.value] : ko.observable(null),
                        initials: oj.IntlConverterUtils.getInitials(data.payeeGroups[i].name.split(/\s+/)[0], data.payeeGroups[i].name.split(/\s+/)[1])
                    });
                }
            }

            if (batchRequest.batchDetailRequestList.length) {
                loadBatchImages();
            }

            if (data.payeeGroups.length === 0) {
                self.isPayeeListEmpty(true);
            }

            ko.tasks.runEarly();
            self.dropdownLevelOne(true);
            self.requestPageLoad(true);

            if (self.selectedPayee()) {
                if (rootParams.dashboard.appData.segment !== "CORP") {
                    self.payeeChanged({}, {
                        option: "value",
                        optionMetadata: {
                            trigger: true
                        }
                    });
                } else if (transferObject && transferObject.isFavoriteTransaction) {
                    self.corporatePayeeChange({
                        detail: {
                            value: self.selectedGroupName()
                        }
                    });
                }
            }
        }

        self.emptyFields = function() {
            if (self.isStandingInstruction()) {
                self.frequencyLoaded(false);
            }

            self.transferAmount("");
            self.transferCurrency("");
            self.valuedate("");
            self.otherPurposeValue("");
            self.purpose("");
            self.siStartDate("");
            self.otherDetails("");
            self.siEndDate("");
            self.instances("");
            self.note("");
            self.internationalNote("");
            ko.tasks.runEarly();

            if (self.isStandingInstruction()) {
                self.frequencyLoaded(true);
            }

            self.networkTransferViaCode(null);
            self.networkTransferVia("SWI");
            self.additionalNetworkTransferViaBankDetails(null);
            self.paymentDetailsArray([]);
            self.networkTransferViaFlag("NO");
            self.networkTransferViaBankName(null);
            self.networkTransferViaBankAddress(null);
            self.networkTransferViaCountry(null);
            self.networkTransferViaCity(null);
        };

        function emptyPeertoPeer() {
            self.peerToPeerModel.amount.amount("");
            self.peerToPeerModel.transferValue("");
            self.confirmTransferValue("");
            self.peerToPeerModel.remarks("");
        }

        const transferCurrency = self.transferCurrency.subscribe(function(newValue) {
            if (newValue) {
                suggestNetwork();
            }

            if (rootParams.dashboard.appData.segment === "CORP" && !self.isMultiplePayment && !self.isStandingInstruction()) {
                self.dealsAvailable(true);
                self.usePreBookedDeal([]);
                self.showList(false);
            }
        });

        self.transferToChange = function(event) {
            if (event) {
                if (event.detail.value) {
                    self.transferOn("now");
                    self.noteComponentLoaded(false);
                    self.refreshDropDown();
                    self.betweenWalletAcc(false);

                    if (event.detail.value === "adhoc") {
                        self.adhoc(true);
                        emptyPeertoPeer();
                        self.betweenWalletAcc(false);
                    } else if (event.detail.value === "betweenWallets") {
                        self.betweenWalletAcc(true);
                        self.noWalletAcc(false);

                    } else {
                        self.adhoc(false);
                        self.betweenWalletAcc(false);

                        if (event.detail.value === "self") {
                            self.currentTask("PC_F_SELF");
                            self.loadSelf();
                        }
                    }

                    self.noteComponentLoaded(true);
                    self.transferOn(self.transferOnArray[0].id);
                }
            } else {
                self.adhoc(false);
                self.currentTask("PC_F_SELF");
                self.loadSelf();
                self.noteComponentLoaded(true);
                self.transferOn(self.transferOnArray[0].id);
            }
        };

        self.transferToModeChange = function() {
            if (self.params === "ownAccountTransfer" || (self.params && self.params.transferObject ? self.params.transferObject().payeeType === "SELF" : false)) {
                self.transferTo("self");

                self.transferToChange(null, {
                    option: "checked"
                });

                if (self.params.transferObject) {
                    self.transferAmount(self.params.transferObject().amount);
                    self.transferCurrency(self.params.transferObject().currency);
                    self.note(self.params.transferObject().note);
                }
            } else if (transferObject ? transferObject.transactionType === "PEER_TO_PEER" && transferObject.adhocPayment : false) {
                self.adhoc(true);
                self.transferTo("adhoc");
            } else {
                self.transferTo();
            }
        };

        self.getPayLoad = function(paymentMode) {
            let model;

            if (isTransferMode("INTERNAL")) {
                if (paymentMode === "now") {
                    model = self.internalPaymentPayload;
                    self.transactionType("INTERNALFT");
                } else {
                    model = self.internalPayLaterPayload;
                    self.transactionType("INTERNALFT_PAYLATER");
                }
            } else if (isTransferMode("INTERNATIONAL")) {
                if (paymentMode === "now") {
                    model = self.internationalPaymentPayload;
                    self.transactionType("INTERNATIONALFT");
                } else {
                    model = self.internationalPayLaterPayload;
                    self.transactionType("INTERNATIONALFT_PAYLATER");
                }
            } else if (isTransferMode("DOMESTIC")) {
                if (paymentMode === "now") {
                    model = self.domesticPaymentPayload;
                    self.transactionType("DOMESTICFT");
                } else {
                    model = self.domesticPayLaterPayload;
                    self.transactionType("DOMESTICFT_PAYLATER");
                }

                if (self.domesticPayeeType() === "INDIA") {
                    model.network = null;
                }

                if (self.domesticPayeeType() === "INDIA" || self.domesticPayeeType() === "UK") {
                    if (model.sepaDomestic) {
                        model.sepaDomestic = null;
                    }

                    if (model.sepaDomesticPayout) {
                        model.sepaDomesticPayout = null;
                    }
                } else if (self.domesticPayeeType() === "SEPA") {
                    if (model.sepaDomestic) {
                        model.sepaDomestic.oinNumber(self.oinNumber());
                        model.sepaDomestic.oinDescription(self.oinDescription());
                        model.sepaDomestic.amount.amount(self.transferAmount());
                        model.sepaDomestic.amount.currency(self.transferCurrency());
                        model.sepaDomestic.payeeId(self.customPayeeId());
                    }

                    if (model.sepaDomesticPayout) {
                        model.sepaDomesticPayout.oinNumber(self.oinNumber());
                        model.sepaDomesticPayout.oinDescription(self.oinDescription());
                        model.sepaDomesticPayout.amount.amount(self.transferAmount());
                        model.sepaDomesticPayout.amount.currency(self.transferCurrency());
                        model.sepaDomesticPayout.payeeId(self.customPayeeId());
                    }
                }
            } else if (isTransferMode("PEERTOPEER")) {
                model = self.peerToPeerModel;
                self.ispeerToPeer(true);
            } else if (self.transferMode("SELF")) {
                if (paymentMode === "now") {
                    model = self.selfPaymentPayload;
                    self.transactionType("SELFFT");
                } else {
                    model = self.selfPayLaterPayload;
                    self.transactionType("SELFFT_PAYLATER");
                }
            }

            return model;
        };

        if (self.isMultiplePayment) {
            hostDateHandler(self.supportingData.currentDate);

            MoneyTransferModel.getPayeeAccountType("INDIA").then(function(response) {
                self.payeeAccountTypeList(response.enumRepresentations[0].data);
                payeeListHandler(self.supportingData.payeeList);
                initialExecution = false;
            });
        } else {
            initialExecution = false;

            MoneyTransferModel.getHostDate().done(function(data) {
                hostDateHandler(data);

                if (rootParams.dashboard.appData.segment === "RETAIL") {
                    checkUpcomingPaymentTill = new Date(today);

                    MoneyTransferModel.getMaintenances().then(function(maintenances) {
                        checkUpcomingPayment = ko.utils.arrayFirst(maintenances.configurationDetails, function(config) {
                            return config.propertyId === "CHECK_UPCOMING_PAYMENT";
                        }).propertyValue === "Y";

                        if (checkUpcomingPayment) {
                            checkUpcomingDays = Number(ko.utils.arrayFirst(maintenances.configurationDetails, function(config) {
                                return config.propertyId === "CHECK_UPCOMING_PAYMENT_FOR_DAYS";
                            }).propertyValue);

                            checkUpcomingDays = 30;
                            checkUpcomingPaymentTill.setDate(checkUpcomingPaymentTill.getDate() + checkUpcomingDays);
                        }
                    });
                }
            });

            MoneyTransferModel.getPayeeList(self.isStandingInstruction()).done(function(data) {
                MoneyTransferModel.getPayeeAccountType("INDIA").then(function(response) {
                    self.payeeAccountTypeList(response.enumRepresentations[0].data);
                    payeeListHandler(data);
                });
            });
        }

        function multiplePaymentHandler(payload, makeAcopy) {
            self.referenceHandel.payload = payload;
            self.referenceHandel.uri.value = self.transferOn() === "now" ? "/payments/{paymentType}/{transferType}" : "/payments/instructions/{paymentType}/{transferType}";

            self.referenceHandel.uri.params = {
                paymentType: self.urlAttribute1(),
                transferType: self.urlAttribute2()
            };

            const sourceAccountDetails = self.additionalDetailsFrom().account;

            self.additionalNetworkTransferViaBankDetails(null);

            self.overviewDetails({
                nickName: self.customPayeeName(),
                dbtAccount: sourceAccountDetails.id.displayValue,
                contentId: self.payeeDetails().contentId,
                preview: self.payeeDetails().preview(),
                initials: self.payeeDetails().initials,
                typeofAccount: self.payeeDetails().typeofAccount ? self.payeeDetails().typeofAccount : null,
                amount: {
                    amount: self.transferAmount(),
                    currency: self.transferCurrency()
                },
                crtAccount: self.payeeDetails().accountNumber,
                valueDate: self.valuedate() || oj.IntlConverterUtils.dateToLocalIso(self.formattedToday())
            });

            self.showPaymentOverview(true);

            if (makeAcopy) {
                self.addPayment(self.referenceHandel.id);
            }
        }

        function setOtherDetails(model) {
            if (self.otherDetails() && self.otherDetails() !== "") {
                model.otherDetails = getNewKoModel().otherDetails;
                model.otherDetails.line1(self.otherDetails());
                model.otherDetails.line2(self.paymentDetailsArray()[0] ? self.paymentDetailsArray()[0] : null);
                model.otherDetails.line3(self.paymentDetailsArray()[1] ? self.paymentDetailsArray()[1] : null);
                model.otherDetails.line4(self.paymentDetailsArray()[2] ? self.paymentDetailsArray()[2] : null);
            } else if (model.otherDetails && isTransferMode("DOMESTIC")) {
                delete model.otherDetails;
            }
        }

        function prepareModel(model, isStandingInstruction) {
            model.accountType = self.debitAccountType();

            if (isTransferMode("INTERNATIONAL")) {
                self.chargesDescription(self.charges().split("_")[1]);
                model.charges(self.charges().split("_")[0]);
            } else if (isTransferMode("DOMESTIC") && self.domesticPayeeType() === "INDIA") {
                model.network = self.network();
            } else if (isTransferMode("DOMESTIC") && self.domesticPayeeType() === "UK") {
                self.chargesDescription(self.charges().split("_")[1]);
                model.charges(self.charges().split("_")[0]);
            }

            if (isTransferMode("INTERNATIONAL")) {
                if (self.networkTransferViaFlag() === "YES") {
                    model.intermediaryBankNetwork = self.networkTransferVia;

                    if (self.networkTransferVia() === "SPE") {
                        model.intermediaryBankDetails.name = self.networkTransferViaBankName;
                        model.intermediaryBankDetails.address = self.networkTransferViaBankAddress;
                        model.intermediaryBankDetails.country = self.networkTransferViaCountry;
                        model.intermediaryBankDetails.city = self.networkTransferViaCity;
                    } else {
                        model.intermediaryBankDetails.code = self.networkTransferViaCode;
                    }
                } else {
                    model.intermediaryBankNetwork = null;
                }
            }

            model.amount.amount(self.transferAmount());
            model.amount.currency(self.transferCurrency());

            if (self.otherPurpose()) {
                model.purpose("OTH");
                model.purposeText(self.otherPurposeValue());
                self.purposeDescription(self.otherPurposeValue());
            } else if (model.purpose && typeof self.purpose() === "undefined") {
                if (model.purpose() === null) {
                    self.purposeDescription("");
                } else if (self.purpose()) {
                    self.purposeDescription(self.purpose().split("_")[1]);
                }

                model.purpose(null);
            } else if (self.purpose()) {
                model.purpose(self.purpose().split("_")[0]);
            }

            if (self.srcAccount() && self.srcAccount() !== null) {
                model.debitAccountId.displayValue(self.srcAccount().split("-")[1]);
                model.debitAccountId.value(self.srcAccount().split("-")[0]);
            }

            if (model.payeeId) {
                model.payeeId(self.customPayeeId());
            }

            if (model.startDate) {
                model.startDate(self.valuedate());
            }

            if (model.endDate) {
                model.endDate(self.valuedate());
            }

            if (model.creditAccountId) {
                model.creditAccountId.value(self.customPayeeId());
                model.creditAccountId.displayValue(self.customPayeeName());
            }

            setOtherDetails(model);

            if (model.remarks) {
                if (isTransferMode("INTERNATIONAL")) {
                    model.remarks("/" + self.internationalNote() + "/" + self.note());
                } else {
                    model.remarks(self.note());
                }
            }

            if (isStandingInstruction) {
                model.type("REC");
                model.frequency(self.frequency().split("_")[0]);
                self.frequencyDescription(self.frequency().split("_")[1]);
                model.startDate(self.siStartDate());

                if (self.siEnd() === "PAYLATER") {
                    model.endDate(self.siEndDate());
                } else {
                    model.instances(self.instances());
                    model.endDate(null);
                }
            }

            if (self.dealId()) {
                model.dealId(self.dealId());
            }

            return model;
        }

        let paynowWithSIpaymentId;

        function checkUpcomingPaymentsList() {
            MoneyTransferModel.getUpcomingPaymentsList(oj.IntlConverterUtils.dateToLocalIso(today), oj.IntlConverterUtils.dateToLocalIso(checkUpcomingPaymentTill), self.payeeDetails().accountNumber).then(function(upcomingPaymentsList) {
                if (upcomingPaymentsList && upcomingPaymentsList.instructionsList && upcomingPaymentsList.instructionsList.length > 0) {
                    rootParams.baseModel.showMessages(null, [rootParams.baseModel.format(self.payments.warningMessage, {
                        X: checkUpcomingDays
                    })], "INFO");
                }
            });
        }

        function showMessages(status) {
            for (let i = 0; i < status.length; i++) {
                if (status[i].detail || status[i].errorMessage) {
                    rootParams.baseModel.showMessages(null, [status[i].detail || status[i].errorMessage], status[i].type || "ERROR");
                }
            }
        }

        function analyzeResponse(responseJSON) {
            if (responseJSON.message) {
                if (responseJSON.message.validationError) {
                    showMessages(responseJSON.message.validationError);
                } else {
                    showMessages([responseJSON.message]);
                }
            }

            if (responseJSON.status && responseJSON.status.message) {
                showMessages([responseJSON.status.message]);
            }
        }

        self.transferWallet = function() {
            if (self.walletAccBalance() === 0.00 || self.walletAccBalance() < self.amountToTransfer()) {
                rootParams.baseModel.showMessages(null, [self.payments.messages.payment.noWalletBalanceTotransfer], "ERROR");
            } else {
                if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("paymentsTracker"))) {
                    return;
                }

                self.WalletToWalletPayload.payeeAccount(self.mobileNumber());
                self.WalletToWalletPayload.amount.currency(self.walletLocalCurrency);
                self.WalletToWalletPayload.amount.amount(self.amountToTransfer());
                self.WalletToWalletPayload.remarks(self.note());

                if (self.accountList) {
                    for (let i = 0; i < self.accountList().length; i++) {
                        if (self.accountList()[i].productDTO && self.accountList()[i].productDTO.productId === "WALLET") {
                            self.WalletToWalletPayload.debitAccount.value(self.accountList()[i].id.value);
                        }
                    }
                }

                const payload = ko.toJSON(self.WalletToWalletPayload);

                MoneyTransferModel.transferToWallet(payload).done(function(data) {
                    self.customTransferComponent("payment-self");
                    self.paymentId(data.paymentId);
                    self.payeeId(data.creditAccountId);
                    self.stageTwo(true);
                }).fail(function() {
                    self.cancelPayment();
                });
            }
        };

        self.initiatePayment = function(makeAcopy) {
            if (self.transferTo() === "existing" && self.transferOn() === "later" && self.additionalDetailsFrom().account.id.displayValue === "Wallet") {
                rootParams.baseModel.showMessages(null, [self.payments.messages.payment.noWalletFutureTransaction], "ERROR");
            } else if (self.transferTo() === "existing" && (self.walletAccBalance() === 0.00 || self.walletAccBalance()) < self.transferAmount() && self.additionalDetailsFrom().account.id.displayValue === "Wallet") {
                rootParams.baseModel.showMessages(null, [self.payments.messages.payment.noWalletBalanceTotransfer], "ERROR");
            } else if (self.transferTo() === "self" && self.transferOn() === "later" && (self.additionalDetailsFrom().account.id.displayValue === "Wallet" || self.additionalDetails().account.id.displayValue === "Wallet")) {
                rootParams.baseModel.showMessages(null, [self.payments.messages.payment.noWalletFutureTransaction], "ERROR");
            } else if (self.transferTo() === "self" && (self.walletAccBalance() === 0.00 || self.walletAccBalance() < self.transferAmount()) && self.transferOn() === "later" && (self.additionalDetailsFrom().account.id.displayValue === "Wallet" || self.additionalDetails().account.id.displayValue === "Wallet")) {
                rootParams.baseModel.showMessages(null, [self.payments.messages.payment.noWalletBalanceTotransfer], "ERROR");
            } else {
                if (isTransferMode("DOMESTIC") && self.domesticPayeeType() === "INDIA" && !self.network()) {
                    document.getElementById("message-box").closeAll();
                    rootParams.baseModel.showMessages(null, [self.payments.messages.payment.noNetworkSuggested], "ERROR");

                    return;
                }

                if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("paymentsTracker" + (self.referenceHandel ? self.referenceHandel.id : "")))) {
                    return;
                }

                if (self.payeeDetails().typeofAccount) {
                    self.typeOfAccountDescription(self.payeeDetails().typeofAccount);
                }

                if (self.defaultData && self.defaultData.transferObject) {
                    delete self.defaultData.transferObject;
                }

                if (self.isStandingInstruction() !== null && self.isStandingInstruction()) {
                    self.transferOn("later");
                }

                self.model(prepareModel(self.getPayLoad(self.transferOn()), self.isStandingInstruction()));

                const payload = ko.toJSON(self.model());

                if (self.isMultiplePayment) {
                    multiplePaymentHandler(payload, makeAcopy);
                } else if (self.paynowWithSI().length) {
                    MoneyTransferModel.fireBatch({
                        batchDetailRequestList: [{
                            methodType: "POST",
                            uri: {
                                value: "/payments/instructions/{paymentType}/{transferType}",
                                params: {
                                    paymentType: self.urlAttribute1(),
                                    transferType: self.urlAttribute2()
                                }
                            },
                            payload: payload,
                            headers: {
                                "Content-Id": 1,
                                "Content-Type": "application/json"
                            }
                        }, {
                            methodType: "POST",
                            uri: {
                                value: "/payments/{paymentType}/{transferType}",
                                params: {
                                    paymentType: self.urlAttribute1(),
                                    transferType: self.urlAttribute2()
                                }
                            },
                            payload: ko.toJSON(prepareModel(self.getPayLoad("now"), false)),
                            headers: {
                                "Content-Id": 2,
                                "Content-Type": "application/json"
                            }
                        }]
                    }, transferModeDetails[self.transferMode().toUpperCase()].batchType.create).done(function(data) {
                        document.getElementById("message-box").closeAll();

                        let atLeastOneFailure;

                        for (let i = 0; i < data.batchDetailResponseDTOList.length; i++) {
                            switch (Number(data.batchDetailResponseDTOList[i].sequenceId)) {
                                case 1:
                                    self.paymentId(data.batchDetailResponseDTOList[i].responseObj.instructionId);
                                    break;
                                case 2:
                                    paynowWithSIpaymentId = data.batchDetailResponseDTOList[i].responseObj.paymentId;
                            }

                            if (!atLeastOneFailure) {
                                atLeastOneFailure = data.batchDetailResponseDTOList[i].status > 202;
                            }

                            analyzeResponse(data.batchDetailResponseDTOList[i].responseObj);
                        }

                        if (!atLeastOneFailure && checkUpcomingPayment && self.transferMode() !== "SELF") {
                            checkUpcomingPaymentsList();
                        }

                        self.stageOne(atLeastOneFailure);
                        self.stageTwo(!atLeastOneFailure);
                    });
                } else {
                    self.disableConfirmButton(false);

                    MoneyTransferModel.initiatePayment(payload, self.urlAttribute1(), self.urlAttribute2(), self.transferOn()).done(function(data) {
                        if (checkUpcomingPayment && self.transferMode() !== "SELF") {
                            checkUpcomingPaymentsList();
                        }

                        self.paymentId(data.paymentId ? data.paymentId : data.instructionId);
                        self.stageOne(false);
                        self.stageTwo(true);
                    }).fail(function() {
                        self.cancelPayment();
                    });
                }
            }
        };

        const masterBatchArray = [];

        self.viewPaymentStatus = function() {
            rootParams.baseModel.registerComponent("multiple-payments-status", "payments");

            rootParams.dashboard.loadComponent("multiple-payments-status", {
                statusData: masterBatchArray
            }, self);
        };

        self.paymentData = ko.observable();

        self.paymentData({
            SIexternalRefId: ko.observable(),
            payNowDate: ko.observable(),
            payeeDetails: ko.observable(),
            transferDetails: ko.observable(),
            payoutDetails: ko.observable(),
            payNowExternalRefId: ko.observable()
        });

        self.isInitAuth = ko.observable(false);

        self.verifyPayment = function() {
            self.disableConfirmButton(true);

            if (self.paynowWithSI().length) {
                MoneyTransferModel.fireBatch({
                    batchDetailRequestList: [{
                        methodType: "PATCH",
                        uri: {
                            value: "/payments/instructions/{paymentType}/{transferType}/{paymentId}",
                            params: {
                                paymentType: self.urlAttribute1(),
                                transferType: self.urlAttribute2(),
                                paymentId: self.paymentId()
                            }
                        },
                        headers: {
                            "Content-Id": 1,
                            "Content-Type": "application/json"
                        }
                    }, {
                        methodType: "PATCH",
                        uri: {
                            value: "/payments/{paymentType}/{transferType}/{paymentId}",
                            params: {
                                paymentType: self.urlAttribute1(),
                                transferType: self.urlAttribute2(),
                                paymentId: paynowWithSIpaymentId
                            }
                        },
                        headers: {
                            "Content-Id": 2,
                            "Content-Type": "application/json"
                        }
                    }, {
                        methodType: "GET",
                        uri: {
                            value: "/payments/{paymentType}/{transferType}/{paymentId}",
                            params: {
                                paymentType: self.urlAttribute1(),
                                transferType: self.urlAttribute2(),
                                paymentId: paynowWithSIpaymentId
                            }
                        },
                        headers: {
                            "Content-Id": 3,
                            "Content-Type": "application/json"
                        }
                    }, {
                        methodType: "GET",
                        uri: {
                            value: "/payments/instructions/{paymentType}/{transferType}/{paymentId}",
                            params: {
                                paymentType: self.urlAttribute1(),
                                transferType: self.urlAttribute2(),
                                paymentId: self.paymentId()
                            }
                        },
                        headers: {
                            "Content-Id": 4,
                            "Content-Type": "application/json"
                        }
                    }]
                }, transferModeDetails[self.transferMode().toUpperCase()].batchType.update).done(function(data, status, jqXHR) {
                    document.getElementById("message-box").closeAll();

                    for (let i = 0; i < data.batchDetailResponseDTOList.length; i++) {
                        if (data.batchDetailResponseDTOList[i].sequenceId === "4") {

                            self.paymentData().payeeDetails = self.payeeDetails();
                            self.paymentData().transferDetails = data.batchDetailResponseDTOList[i].responseObj.payoutDetails ? data.batchDetailResponseDTOList[i].responseObj.payoutDetails : data.batchDetailResponseDTOList[i].responseObj.transferDetails;
                            self.paymentData().payoutDetails = data.batchDetailResponseDTOList[i].responseObj.payoutDetails ? data.batchDetailResponseDTOList[i].responseObj.payoutDetails : data.batchDetailResponseDTOList[i].responseObj.transferDetails;
                        } else
                        if (data.batchDetailResponseDTOList[i].sequenceId === "3") {
                            self.paymentData().payNowDate = data.batchDetailResponseDTOList[i].responseObj.payoutDetails ? data.batchDetailResponseDTOList[i].responseObj.payoutDetails.valueDate : data.batchDetailResponseDTOList[i].responseObj.transferDetails.valueDate;
                            self.paymentData().payeeDetails = self.payeeDetails();
                        } else if (data.batchDetailResponseDTOList[i].sequenceId === "1") {
                            self.hostErrorMsg1 = data.batchDetailResponseDTOList[i].responseObj.message ? data.batchDetailResponseDTOList[i].responseObj.message.detail : self.payments.common.confirmScreen.SI.fail;
                            self.paymentData().SIexternalRefId = data.batchDetailResponseDTOList[i].responseObj.externalReferenceId;
                        } else if (data.batchDetailResponseDTOList[i].sequenceId === "2") {
                            self.hostErrorMsg2 = data.batchDetailResponseDTOList[i].responseObj.message ? data.batchDetailResponseDTOList[i].responseObj.message.detail : self.payments.common.confirmScreen.SI.fail;
                            self.paymentData().payNowExternalRefId = data.batchDetailResponseDTOList[i].responseObj.externalReferenceId;
                        }
                    }

                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        transactionName: self.payments.setstandinginstruction_header,
                        confirmScreenExtensions: {
                            confirmScreenMsgEval: function(data) {
                                if (data.sequenceId === "1") {
                                    return data.status > 202 ? rootParams.baseModel.format(self.payments.common.confirmScreen.SI.fail, {
                                        hostErrorMessage: self.hostErrorMsg1
                                    }) : self.payments.common.confirmScreen.SI.success;
                                } else if (data.sequenceId === "2") {
                                    return data.status > 202 ? rootParams.baseModel.format(self.payments.common.confirmScreen.paynow.fail, {
                                        hostErrorMessage: self.hostErrorMsg2
                                    }) : self.payments.common.confirmScreen.paynow.success;
                                }
                            },
                            isSet: true,
                            taskCode: self.currentTask(),
                            resource: self.payments,
                            data: self.paymentData(),
                            confirmScreenDetails: self.confirmScreenDetails(),
                            template: "confirm-screen/standing-instruction-" + self.transferMode().toLowerCase()
                        }
                    });
                });
            } else {
                MoneyTransferModel.verifyPayment(self.urlAttribute1(), self.urlAttribute2(), self.paymentId(), self.transferOn()).done(function(data, status, jqXHR) {
                    document.getElementById("message-box").closeAll();
                    self.externalReferenceId(data.externalReferenceId);
                    self.securityCode(data.securityCode);
                    self.transactionName = self.payments.moneytransfer.transactionMessage[self.urlAttribute2()];
                    self.stageTwo(false);
                    self.httpStatus = jqXHR.status;

                    let successMessage, statusMessages;

                    if (rootParams.dashboard.appData.segment === "CORP" && self.httpStatus && self.httpStatus !== 202) {
                        successMessage = self.payments.common.confirmScreen.successMessage;
                        statusMessages = self.payments.common.completed;
                    } else if (rootParams.dashboard.appData.segment === "CORP" && self.httpStatus && self.httpStatus === 202) {
                        successMessage = self.payments.common.confirmScreen.corpMaker;
                        statusMessages = self.payments.moneytransfer.pendingApproval;
                    } else if (rootParams.dashboard.appData.segment !== "CORP" && !self.isStandingInstruction()) {
                        successMessage = self.payments.common.confirmScreen.successMessage;
                        statusMessages = self.payments.common.success;
                    } else {
                        successMessage = self.payments.common.confirmScreen.successSI;
                        statusMessages = self.payments.common.success;
                    }

                    let header = self.payments.moneytransfer_header_retail;

                    if (self.isStandingInstruction()) {
                        header = self.payments.setstandinginstruction_header;
                    }

                    let shareMessage;

                    if ($.inArray(self.currentTask(), [
                            "PC_F_SELF",
                            "PC_F_IT",
                            "PC_F_DOM",
                            "PC_F_INTRNL"
                        ]) > -1) {
                        shareMessage = rootParams.baseModel.format(self.shareMessage(), {
                            transactionName: header,
                            referenceNumber: data.externalReferenceId
                        });
                    }

                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        hostReferenceNumber: data.externalReferenceId,
                        transactionName: header,
                        shareMessage: shareMessage,
                        isMoneyTransfer: true,
                        favorite: ko.observable(!self.isStandingInstruction() && !data.securityCode),
                        enableFavIcon: true,
                        paymentId: self.paymentId(),
                        groupId: self.groupId(),
                        payeeId: self.customPayeeId(),
                        transactionType: self.transactionType(),
                        addToFavorites: self.addToFavorites(),
                        model: self.model(),
                        network: self.network(),
                        setupRepeatTransfer: self.setupRepeatTransfer,
                        customPayeeName: self.customPayeeName,
                        domesticPayeeType: self.domesticPayeeType(),
                        payeeDetails: self.payeeDetails,
                        repeat: !self.isStandingInstruction() && (self.transferTo() === "self" || isTransferMode("INTERNAL") || (isTransferMode("DOMESTIC") && self.domesticPayeeType().toUpperCase() === "INDIA")),
                        uniqueEndToEndTxnReference: {
                            UetrLabel: self.payments.moneytransfer.internationalPayee.UetrLabel,
                            UetrNumber: data.uniqueEndToEndTxnReference ? data.uniqueEndToEndTxnReference : null
                        },
                        confirmScreenExtensions: {
                            successMessage: successMessage,
                            statusMessages: statusMessages,
                            isSet: true,
                            taskCode: self.currentTask(),
                            eReceiptRequired: true,
                            confirmScreenDetails: self.confirmScreenDetails(),
                            template: "confirm-screen/payments-template"
                        },
                        additionalDetails: data.securityCode ? {
                            items: [{
                                    label: self.payments.moneytransfer.securityCode,
                                    value: data.securityCode
                                },
                                {
                                    label: self.nls.PeerToPeerOther.payments.payvia,
                                    value: data.transferMode
                                },
                                {
                                    label: data.transferMode === "TWITTER" ? self.nls.PeerToPeerOther.payments.peertopeer.transferto : self.nls.PeerToPeerOther.payments.peertopeer.transferValue,
                                    value: data.transferMode === "TWITTER" ? data.transferValue.substring(20) : data.transferValue.replace("&#x40;", "@")
                                },
                                {
                                    label: self.nls.PeerToPeerOther.payments.peertopeer.amount,
                                    value: data.transferDetails.amount.amount,
                                    currency: data.transferDetails.amount.currency,
                                    isCurrency: true
                                },
                                {
                                    label: self.nls.PeerToPeerOther.payments.peertopeer.transferfrom,
                                    value: data.transferDetails.debitAccountId.displayValue
                                }
                            ]
                        } : false
                    }, self);
                }).fail(function() {
                    self.cancelPayment();
                });
            }
        };

        self.cancelPayment = function() {
            self.stageTwo(false);
            self.stageOne(true);
        };

        const payeetypesMap = {
            DEMANDDRAFT: "demandDraft",
            INTERNAL: "internal",
            DOMESTIC: "domestic",
            INTERNATIONAL: "international",
            PEERTOPEER: "peerToPeer"
        };

        function checkSI() {
            if ((self.data() && self.data().transferDataPayee) || (self.defaultData && self.defaultData.transferDataPayee)) {
                const payeeTransferData = self.data().transferDataPayee || self.defaultData.transferDataPayee,
                    payeeId = payeeTransferData.id,
                    groupId = payeeTransferData.groupId;

                self.selectedPayee(rootParams.dashboard.appData.segment === "CORP" ? payeeId : payeeTransferData.name);

                if ((payeeId && payeeId !== null) || (groupId && groupId !== null)) {
                    MoneyTransferModel.getPayeeData(payeeId, groupId, payeeTransferData.payeeType ? payeetypesMap[payeeTransferData.payeeType.toUpperCase()] : self.transferMode().toUpperCase()).done(function(data) {
                        let obj = {};

                        if (data.internalPayee) {
                            obj = ko.toJS(data.internalPayee);
                            obj.payeeType = self.payments.payee.type[obj.payeeType];
                            data.internalPayee.payeeData = obj;
                            data.internalPayee.startDate = transferObject ? transferObject.valueDate : null;
                            data.internalPayee.preview = payeeTransferData.preview;
                            data.internalPayee.initials = oj.IntlConverterUtils.getInitials(data.internalPayee.nickName.split(/\s+/)[0], data.internalPayee.nickName.split(/\s+/)[1]);
                            self.setPayee(data.internalPayee);
                        } else if (data.internationalPayee) {
                            obj = ko.toJS(data.internationalPayee);
                            obj.payeeType = self.payments.payee.type[obj.payeeType];
                            data.internationalPayee.payeeData = obj;
                            data.internationalPayee.startDate = transferObject ? transferObject.valueDate : null;
                            data.internationalPayee.preview = payeeTransferData.preview;
                            data.internationalPayee.initials = oj.IntlConverterUtils.getInitials(data.internationalPayee.nickName.split(/\s+/)[0], data.internationalPayee.nickName.split(/\s+/)[1]);
                            self.setPayee(data.internationalPayee);
                        } else if (data.domesticPayee) {
                            if (data.domesticPayee.indiaDomesticPayee) {
                                obj = ko.toJS(data.domesticPayee.indiaDomesticPayee);
                                data.domesticPayee = data.domesticPayee.indiaDomesticPayee;
                                data.domesticPayee.domesticPayeeType = "INDIA";
                            } else if (data.domesticPayee.ukDomesticPayee) {
                                obj = ko.toJS(data.domesticPayee.ukDomesticPayee);
                                data.domesticPayee = data.domesticPayee.ukDomesticPayee;
                                data.domesticPayee.domesticPayeeType = "UK";
                            } else if (data.domesticPayee.sepaDomesticPayee) {
                                obj = ko.toJS(data.domesticPayee.sepaDomesticPayee);
                                data.domesticPayee = data.domesticPayee.sepaDomesticPayee;
                                data.domesticPayee.domesticPayeeType = "SEPA";
                            }

                            obj.payeeType = self.payments.payee.type[obj.payeeType];
                            data.domesticPayee.payeeData = obj;
                            data.domesticPayee.startDate = transferObject ? transferObject.valueDate : null;
                            data.domesticPayee.preview = payeeTransferData.preview;
                            data.domesticPayee.initials = oj.IntlConverterUtils.getInitials(data.domesticPayee.nickName.split(/\s+/)[0], data.domesticPayee.nickName.split(/\s+/)[1]);
                            self.setPayee(data.domesticPayee);
                        } else if (data.peerToPeerPayee) {
                            obj = ko.toJS(data.peerToPeerPayee);
                            obj.payeeType = self.payments.payee.type[data.peerToPeerPayee.payeeType];
                            data.peerToPeerPayee.payeeData = obj;
                            data.peerToPeerPayee.preview = payeeTransferData.preview;
                            data.peerToPeerPayee.initials = oj.IntlConverterUtils.getInitials(data.peerToPeerPayee.nickName.split(/\s+/)[0], data.peerToPeerPayee.nickName.split(/\s+/)[1]);
                            self.setPayee(data.peerToPeerPayee);
                        }

                        self.dropdownLevelOne(false);
                    });
                }
            }
        }

        checkSI();

        /**
         * This function will help to load the exchangeRate.
         *
         * @memberOf payments-money-transfer
         * @function exchangeRate
         * @param {Object} exchangeCodes - Sets the Exchange Codes.
         * @param {Object} swap - Flag to swap currencies.
         * @returns {void}
         */
        self.exchangeRate = function(exchangeCodes, swap) {
            MoneyTransferModel.getExchangeRate(exchangeCodes).then(function(response) {
                if (response.exchangeRateDetails && self.transferCurrency() === response.exchangeRateKey.ccy2Code) {
                    self.currentExchangeRate({
                        amount: response.exchangeRateDetails[0].buyRate,
                        currency: self.transferCurrency()
                    });
                } else if (response.exchangeRateDetails && self.transferCurrency() === response.exchangeRateKey.ccy1Code) {
                    self.currentExchangeRate({
                        amount: response.exchangeRateDetails[0].sellRate,
                        currency: self.transferCurrency()
                    });
                } else if (swap) {
                    self.exchangeRate({
                        branchCode: exchangeCodes.branchCode,
                        ccy1Code: exchangeCodes.ccy2Code,
                        ccy2Code: exchangeCodes.ccy1Code
                    }, false);
                }
            });
        };

        function fromFavorite() {
            if ((transferObject && transferObject.isFavoriteTransaction) || (self.defaultData && ko.utils.unwrapObservable(self.defaultData.transferObject))) {
                const data = transferObject ? transferObject : self.defaultData.transferObject;

                self.fromFavourites(true);

                if (data.creditAccountId !== null) {
                    self.transferTo("self");
                    self.customPayeeId(data.creditAccountId);
                    self.creditAccountDisplayValue(data.creditAccountDisplayValue);
                    self.transferCurrency("");
                    self.loadSelf();
                    self.customCurrencyURL("payments/currencies?type=SELFFT&currency=" + data.currency);
                    setTaskCode();
                }

                if (data.transactionType.indexOf("PAYLATER") > -1) {
                    self.valuedate(null);
                    self.transferLater(true);
                    self.transferOn(self.transferOnArray[1].id);

                    if (self.transferTo() === "self") {
                        self.model(self.selfPayLaterPayload);
                    }
                } else {
                    self.transferLater(false);
                    self.transferOn(self.transferOnArray[0].id);
                }

                self.transferAmount(data.amount);
                self.transferCurrency(data.currency);
                self.srcAccount(data.debitAccountId);

                if (data.payeeType === "international") {
                    self.note(data.remarks.split("/")[2]);

                    if (self.remarksArray.length === 0) {
                        MoneyTransferModel.getRemarks().then(function(remarkData) {
                            self.remarksArray.removeAll();
                            ko.tasks.runEarly();

                            for (let z = 0; z < remarkData.enumRepresentations[0].data.length; z++) {
                                self.remarksArray.push({
                                    text: remarkData.enumRepresentations[0].data[z].description,
                                    value: remarkData.enumRepresentations[0].data[z].code
                                });
                            }

                            self.internationalNote(ko.utils.arrayFirst(self.remarksArray(), function(config) {
                                return config.value === data.remarks.split("/")[1];
                            }).text);

                            self.remarkLoaded(true);

                        });
                    } else {
                        self.internationalNote(ko.utils.arrayFirst(self.remarksArray(), function(config) {
                            return config.value === data.remarks.split("/")[1];
                        }).text);

                        self.remarkLoaded(true);

                    }

                } else {
                    self.note(data.remarks);
                }

                if (data.otherDetails) {
                    self.otherDetails(data.otherDetails.line1);

                    if (data.otherDetails.line2) {
                        self.paymentDetailsArray.push(data.otherDetails.line2);
                    }

                    if (data.otherDetails.line3) {
                        self.paymentDetailsArray.push(data.otherDetails.line3);
                    }

                    if (data.otherDetails.line4) {
                        self.paymentDetailsArray.push(data.otherDetails.line4);
                    }
                }

                if (data.intermediaryBankNetwork) {
                    self.networkTransferViaFlag("YES");
                    self.networkTransferVia(data.intermediaryBankNetwork);

                    if (self.networkTransferVia() === "SPE") {
                        self.networkTransferViaBankName(data.intermediaryBankDetails.name);
                        self.networkTransferViaBankAddress(data.intermediaryBankDetails.address);
                        self.networkTransferViaCountry(data.intermediaryBankDetails.country);
                        self.networkTransferViaCity(data.intermediaryBankDetails.city);
                    } else {
                        self.networkTransferViaCode(data.intermediaryBankDetails.code);
                    }
                }
            }
        }

        fromFavorite();

        if (self.isStandingInstruction()) {
            MoneyTransferModel.getRepeateIntervals().done(function(data) {
                if (data.enumRepresentations !== null) {
                    for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
                        self.frequencyArray.push({
                            code: data.enumRepresentations[0].data[i].code,
                            description: self.payments.moneytransfer.frequencyLabel[data.enumRepresentations[0].data[i].description]
                        });
                    }

                    self.frequencyLoaded(true);
                }
            });
        }

        self.cancel = function() {
            rootParams.dashboard.switchModule(true);
        };

        self.accountNumber.subscribe(function(newValue) {
            if (newValue !== "" && newValue !== null) {
                MoneyTransferModel.getPayeeName(newValue).done(function(data) {
                    self.accountName(rootParams.baseModel.format(self.payments.payee.fullAccName, {
                        firstName: data.firstName,
                        lastName: data.lastName
                    }));
                });
            }
        });

        let favoritePersistedSuccessfully = false;

        self.persistFavorites = function() {
            self.favoritesPayLoad.id(self.paymentId());
            self.favoritesPayLoad.transactionType(self.transactionType());
            self.favoritesPayLoad.payeeId(self.customPayeeId());
            self.favoritesPayLoad.amount.currency(self.model().amount.currency());
            self.favoritesPayLoad.amount.amount(self.model().amount.amount());
            self.favoritesPayLoad.debitAccountId.value(self.model().debitAccountId.value());
            self.favoritesPayLoad.accountType(self.debitAccountType());

            if (self.model().creditAccountId) {
                self.favoritesPayLoad.creditAccountId.value(self.model().creditAccountId.value());
            } else {
                self.favoritesPayLoad.creditAccountId = null;
            }

            if (self.domesticPayeeType() === "INDIA") {
                self.favoritesPayLoad.network(self.network());
            }

            self.favoritesPayLoad.purpose(self.model().purpose ? self.model().purpose() : null);
            self.favoritesPayLoad.remarks(self.model().remarks());
            self.favoritesPayLoad.payeeGroupId(self.groupId());
            self.favoritesPayLoad.valueDate(self.model().startDate);
            self.favoritesPayLoad.payeeAccountName(self.transactionType() === "SELFFT" || self.transactionType() === "SELFFT_PAYLATER" ? self.payments.selfPayeeName : self.payeeDetails().accountName);
            self.favoritesPayLoad.payeeNickName(self.transactionType() === "SELFFT" || self.transactionType() === "SELFFT_PAYLATER" ? null : self.customPayeeName());
            self.favoritesPayLoad.charges(self.model().charges ? self.model().charges() : null);

            if (self.transactionType() === "INTERNATIONALFT" || self.transactionType() === "INTERNATIONALFT_PAYLATER") {
                self.favoritesPayLoad.otherDetails = self.model().otherDetails;
                self.favoritesPayLoad.intermediaryBankNetwork = self.model().intermediaryBankNetwork;
                self.favoritesPayLoad.intermediaryBankDetails = self.model().intermediaryBankDetails;
            }

            self.favoritesPayLoad.otherPurposeText(self.otherPurposeValue());

            MoneyTransferModel.addFavorites(ko.toJSON(self.favoritesPayLoad)).done(function() {
                self.favoriteSuccess();
            }).fail(function() {
                self.closeFavoriteModal();
            });
        };

        self.stageFavoriteSuccess = ko.observable(false);
        self.stageFavoriteAdd = ko.observable(true);

        self.addToFavorites = function() {
            if (!favoritePersistedSuccessfully) {
                self.stageFavoriteAdd(true);
                $("#favoritesDialog").trigger("openModal");
            }
        };

        self.favoriteSuccess = function() {
            self.stageFavoriteAdd(false);
            self.stageFavoriteSuccess(true);
            favoritePersistedSuccessfully = true;
        };

        self.closeFavoriteModal = function() {
            $("#favoritesDialog").trigger("closeModal");
            self.stageFavoriteSuccess(false);
            self.stageFavoriteAdd(true);
        };

        self.currencyParser = function(data) {
            const output = {};

            output.currencies = [];

            if (data) {
                if (data.currencyList && data.currencyList !== null) {
                    for (let i = 0; i < data.currencyList.length; i++) {
                        output.currencies.push({
                            code: data.currencyList[i].code,
                            description: data.currencyList[i].code
                        });
                    }
                }
            }

            return output;
        };

        const additionalDetails = self.additionalDetails.subscribe(function(newValue) {
                if (self.transferTo() === "self") {
                    self.customPayeeId(newValue.account.id.value);
                    self.customCurrencyURL(null);

                    if (!self.dealDetails()) {
                        self.currentExchangeRate(null);
                        self.dealDetails(false);
                        self.usePreBookedDeal([]);
                        self.showList(false);
                    }

                    self.loadSelf();
                    self.customCurrencyURL("payments/currencies?type=SELFFT&currency=" + newValue.account.currencyCode);
                }

                if (newValue.account.id.displayValue === "Wallet") {
                    self.transferwhen(false);
                } else if (newValue.account.id.displayValue === "Wallet" || (self.additionalDetailsFrom() && self.additionalDetailsFrom().account.id.displayValue === "Wallet")) {
                    self.transferwhen(false);
                } else {
                    self.transferwhen(true);
                }

            }),
            additionalDetailsFrom = self.additionalDetailsFrom.subscribe(function(newValue) {
                if (self.transferTo() === "self") {
                    if (!self.dealDetails()) {
                        self.currentExchangeRate(null);
                        self.dealDetails(false);
                        self.dealsAvailable(true);
                        self.usePreBookedDeal([]);
                        self.showList(false);
                    }
                }

                if (newValue.account.type) {
                    self.debitAccountType(newValue.account.type);
                }

                if (newValue.account.id.displayValue === "Wallet") {
                    self.transferwhen(false);
                } else if (newValue.account.id.displayValue !== "Wallet" || (self.additionalDetails() && self.additionalDetails().account.id.displayValue !== "Wallet")) {
                    self.transferwhen(true);
                }

            });

        /**
         * This function will be triggered to cleanup the memory allocated to subscribed functions.
         *
         * @memberOf payments-money-transfer
         * @function dispose
         * @returns {void}
         */
        self.dispose = function() {
            transferCurrency.dispose();
            transferAmountSubscribe.dispose();
            additionalDetails.dispose();
            additionalDetailsFrom.dispose();
        };

        self.instanceOptionChangeHandler = function(event) {
            if (event.detail.value) {
                self.isEndDateRequired(event.detail.value === "PAYLATER");
            }
        };

        self.confirmDeleteFavourite = function() {
            MoneyTransferModel.deleteFavourite(transferObject.paymentId, transferObject.transactionType).done(function(data, status, jqXHR) {
                self.removeFavouriteFlag(false);

                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    template: "confirm-screen/payments-template",
                    transactionName: self.payments.moneytransfer.successmsg5
                }, self);
            });
        };

        self.removeFavourite = function() {
            self.stageOne(false);
            self.removeFavouriteFlag(true);
        };

        self.setupRepeatTransfer = function() {
            self.transferObject({
                isStandingInstruction: true,
                payeeId: self.customPayeeId(),
                nickName: self.customPayeeName(),
                payeeType: self.transferMode(),
                domesticPayeeType: self.domesticPayeeType(),
                amount: self.model().amount.amount(),
                currency: self.model().amount.currency(),
                srcAccount: self.model().debitAccountId.value(),
                purpose: ko.utils.unwrapObservable(self.model().purpose()),
                purposeDescription: self.purposeDescription(),
                note: self.note(),
                charges: self.charges(),
                otherPurpose: self.otherPurposeValue(),
                oinNumber: self.oinNumber(),
                oinDescription: self.oinDescription()
            });

            if (rootParams.dashboard.appData.segment === "CORP") {
                rootParams.dashboard.loadComponent("payments-money-transfer", {
                    isStandingInstruction: true,
                    transferObject: self.transferObject,
                    payeeDetails: self.payeeDetails,
                    retainedData: self
                }, self);
            } else {
                self.selectedTab = "";

                rootParams.dashboard.loadComponent("manage-accounts", {
                    applicationType: "standing-instructions",
                    defaultTab: "payments-money-transfer",
                    isStandingInstruction: true,
                    transferObject: self.transferObject,
                    payeeDetails: self.payeeDetails,
                    retainedData: self
                }, self);
            }
        };

        self.cancelDeletion = function() {
            self.removeFavouriteFlag(false);
            self.stageOne(true);
        };

        self.editSavedPayment = function() {
            self.showPaymentOverview(false);
        };

        self.filterBranchDetails = function(accountBranch) {
            const branchAddress = [ko.utils.unwrapObservable(accountBranch.code), ko.utils.unwrapObservable(accountBranch.name)].concat(ko.utils.unwrapObservable(accountBranch.name) === ko.utils.unwrapObservable(accountBranch.branch) ? [] : [ko.utils.unwrapObservable(accountBranch.branch)]).concat([ko.utils.unwrapObservable(accountBranch.address), ko.utils.unwrapObservable(accountBranch.city), ko.utils.unwrapObservable(accountBranch.country)]);

            return branchAddress.filter(function(n) {
                return n && n.trim() !== "";
            }).join(",");
        };

        self.filterPayeeAddressDetails = function(payeeAddress) {
            return [payeeAddress.line1, payeeAddress.line2, payeeAddress.city, payeeAddress.country].filter(function(n) {
                return n && n.trim() !== "";
            }).join(",");
        };
    };
});