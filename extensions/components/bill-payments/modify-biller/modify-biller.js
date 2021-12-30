define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/register-biller",
    "text!./modify-biller.json",
    "ojL10n!extensions/resources/nls/biller-labels",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton",
    "ojs/ojdatetimepicker",
    "ojs/ojknockout",
    "ojs/ojlabel",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojknockout-validation",
    "ojs/ojselectcombobox"
], function(oj, ko, $, ManageBillerRegistrationModel, resourceBundle, ModifyBillerJSON, billerLabels) {
    "use strict";

    let self;
    const vm = function(params) {
        self = this;

        const getNewKoModel = function() {
            const modifiedBillerModel = ko.mapping.fromJS(ManageBillerRegistrationModel.getNewModel());

            return modifiedBillerModel;
        };

        self.mode = ko.observable("CREATE");

        let today = params.baseModel.getDate();
        const fixDate = new Date(params.baseModel.getDate());

        fixDate.setDate(fixDate.getDate() + 1);
        self.fixedCurrentDate = ko.observable(fixDate);
        self.currentDate = ko.observable(today);
        self.minEndDate = ko.observable(today);
        self.dataLoaded = ko.observable(false);
        self.selectedBillerId = ko.observable();
        self.billerLabelsResource = billerLabels;

        self.selectedBiller = ko.observable().extend({
            loaded: false
        });

        self.registeredBillers = ko.observableArray();
        self.currenyConverter = ko.observable();
        self.frequency = ko.observable("ONE_TIME");
        self.autoPayLimit = ko.observable("billAmount");
        self.customURL = ko.observable();
        self.taskCodeValue=ko.observable("PC_F_INTRNL");
        self.taskCode = ko.observable(null);
        self.currentAccountType = ko.observable();
        self.accountsLoaded = ko.observable("false");
        self.additionalDetails = ko.observable("");

        const modifyBillerJSON = JSON.parse(ModifyBillerJSON);

        self.dropdownLabels = {
            category: ko.observable(),
            location: ko.observable(),
            biller: ko.observable(),
            currentAccountType: ko.observable()
        };

        if (params.options) {
            self.defaultData = params.options.data;
        }

        self.supportedAccounts = ko.observableArray();
        self.supportedAccountsLocale = ko.observableArray();
        self.disableStartDate = ko.observable(false);
        self.currentStage = ko.observable("CREATE");
        self.relationshipDetails = ko.observableArray([]);
        self.modifiedBillerDetails = getNewKoModel().ModifiedBillerDetails;
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = resourceBundle;
        params.dashboard.headerName(self.resourceBundle.heading.manageBillers);
        params.baseModel.registerElement("help");
        params.baseModel.registerElement("account-input");
        params.baseModel.registerComponent("review-register-biller", "bill-payments");
        self.billerValid = ko.observable();
        self.frequencyList = ko.observableArray();

        for (let i = 0; i < modifyBillerJSON.frequencyList.length; i++) {
            self.frequencyList.push({
                label: self.resourceBundle.labels[modifyBillerJSON.frequencyList[i]],
                value: modifyBillerJSON.frequencyList[i]
            });
        }

        /**
         * This function resets the attributes of the model.
         *
         * @function resetModel
         * @returns {void}
         */
        function resetModel() {
            self.modifiedBillerDetails.billerRegistrationId(false);
            self.modifiedBillerDetails.autopay("false");
            self.modifiedBillerDetails.schedulePayment("false");
            self.modifiedBillerDetails.billerNickName(null);
        }

        /**
         * This function displays location and category.
         *
         * @function fetchBillerDetails
         * @returns {void}
         */
        function fetchBillerDetails() {
            self.accountsLoaded("false");

            ManageBillerRegistrationModel.fetchCategory(self.selectedBiller().category.id).done(function(data) {
                self.dropdownLabels.category(data.category.name);
            });

            ManageBillerRegistrationModel.fetchLocationDetails(self.selectedBiller().location.id).done(function(response) {
                let location = null;
                const data = response.operationalArea;

                if (!data.areaName) {
                    location = data.city;

                    if (data.state) {
                        if (location.length > 0) {
                            location = location + ",";
                        }

                        location = location + data.state;
                    }

                    if (data.country) {
                        if (location.length > 0) {
                            location = location + ",";
                        }

                        location = location + data.country;
                    }
                } else {
                    location = data.areaName;
                }

                self.dropdownLabels.location(location);
            });

            ManageBillerRegistrationModel.fetchBillerDetails(self.selectedBiller().billerId).done(function(response) {
                self.supportedAccounts.removeAll();
                self.supportedAccountsLocale.removeAll();
                self.relationshipDetails.removeAll();
                self.modifiedBillerDetails.autopayInstructions.limitAmount.currency(response.biller.currency);

                if (response.biller) {
                    self.dropdownLabels.biller(response.biller.name);

                    self.currenyConverter({
                        type: "number",
                        options: {
                            style: "currency",
                            currency: response.biller.currency,
                            currencyDisplay: "symbol"
                        }
                    });

                    let i;
                    const specsArray = [];

                    for (i = 0; i < response.biller.paymentMethodsList.length; i++) {
                        if (params.dashboard.appData.segment === "CORP") {
                            if (response.biller.paymentMethodsList[i].paymentType && response.biller.paymentMethodsList[i].paymentType === "CASA") {
                                self.supportedAccounts.push(response.biller.paymentMethodsList[i].paymentType);
                                self.supportedAccountsLocale.push(self.resourceBundle.labels[response.biller.paymentMethodsList[i].paymentType]);
                            }
                        } else {
                            self.supportedAccounts.push(response.biller.paymentMethodsList[i].paymentType);
                            self.supportedAccountsLocale.push(self.resourceBundle.labels[response.biller.paymentMethodsList[i].paymentType]);
                        }
                    }

                    if (self.supportedAccounts().length > 0) {
                        if (self.selectedBiller().autopayInstructions && self.selectedBiller().autopayInstructions.paymentType) {
                            self.currentAccountType(self.selectedBiller().autopayInstructions.paymentType);
                        } else {
                            self.currentAccountType(self.supportedAccounts()[0]);
                        }

                        self.taskCode(null);

                        if (self.currentAccountType() === "CASA") {
                            self.customURL("demandDeposit");
                            self.taskCode(self.taskCodeValue());
                        } else if (self.currentAccountType() === "CREDITCARD") {
                            self.customURL("cards/credit?expand=ALL");
                        } else if (self.currentAccountType() === "DEBITCARD") {
                            self.customURL("demandDeposit?expand=DEBITCARDS");
                        }

                        self.dropdownLabels.currentAccountType(self.currentAccountType());
                        self.accountsLoaded("true");
                    }

                    for (i = 0; i < response.biller.specifications.length; i++) {
                        specsArray[response.biller.specifications[i].id] = response.biller.specifications[i].label;
                    }

                    for (i = 0; i < self.selectedBiller().relationshipDetails.length; i++) {
                        self.relationshipDetails.push({
                            label: specsArray[self.selectedBiller().relationshipDetails[i].labelId],
                            value: self.selectedBiller().relationshipDetails[i].value
                        });
                    }
                }
            });
        }

        self.selectedBillerSubscribe = self.selectedBillerId.subscribe(function(newValue) {
            resetModel();

            ManageBillerRegistrationModel.fetchRegisteredBillerDetails(newValue).done(function(response) {
                if (response.billerRegistration) {
                    self.selectedBiller(response.billerRegistration);
                    self.selectedBiller.loaded(true);
                    self.modifiedBillerDetails.billerRegistrationId(self.selectedBiller().id);
                    self.modifiedBillerDetails.billerNickName(self.selectedBiller().billerNickName);

                    if (self.selectedBiller().autopay !== undefined) {
                        self.modifiedBillerDetails.autopay("" + self.selectedBiller().autopay);
                    }

                    if (self.selectedBiller().autopay || self.selectedBiller().schedulePayment) {
                        self.modifiedBillerDetails.autopayInstructions.debitAccount.displayValue(self.selectedBiller().autopayInstructions.debitAccount.displayValue);
                        self.modifiedBillerDetails.autopayInstructions.debitAccount.value(self.selectedBiller().autopayInstructions.debitAccount.value);

                        if (self.selectedBiller().autopayInstructions.limitAmount && self.selectedBiller().autopayInstructions.limitAmount.amount) {
                            self.modifiedBillerDetails.autopayInstructions.limitAmount.currency(self.selectedBiller().autopayInstructions.limitAmount.currency);
                            self.modifiedBillerDetails.autopayInstructions.limitAmount.amount(self.selectedBiller().autopayInstructions.limitAmount.amount);
                            self.autoPayLimit("limitAmount");
                        } else {
                            self.autoPayLimit("billAmount");
                        }

                        if (self.selectedBiller().schedulePayment) {
                            const currentDate = oj.IntlConverterUtils.dateToLocalIso(new Date(today));

                            if (self.selectedBiller().autopayInstructions.endDate) {
                                if (currentDate <= self.selectedBiller().autopayInstructions.endDate) {
                                    if (currentDate >= self.selectedBiller().autopayInstructions.startDate) {
                                        self.disableStartDate(true);
                                    }

                                    self.frequency("RECURRING");
                                    self.modifiedBillerDetails.autopayInstructions.endDate(self.selectedBiller().autopayInstructions.endDate);
                                    self.modifiedBillerDetails.autopayInstructions.startDate(self.selectedBiller().autopayInstructions.startDate);
                                }
                            } else if (self.selectedBiller().autopayInstructions.startDate) {
                                if (currentDate <= self.selectedBiller().autopayInstructions.startDate) {
                                    self.frequency("ONE_TIME");
                                    self.modifiedBillerDetails.autopayInstructions.startDate(self.selectedBiller().autopayInstructions.startDate);
                                }
                            }

                            if (self.modifiedBillerDetails.autopayInstructions.startDate() !== null) {
                                self.modifiedBillerDetails.schedulePayment("" + self.selectedBiller().schedulePayment);
                                self.modifiedBillerDetails.autopayInstructions.frequency(self.selectedBiller().autopayInstructions.frequency);
                            } else {
                                self.modifiedBillerDetails.schedulePayment("" + false);
                            }

                            today = params.baseModel.getDate();
                        }
                    }

                    fetchBillerDetails();
                } else {
                    self.selectedBiller.loaded(false);
                }
            });
        });

        if (self.registeredBillers().length === 0) {
            ManageBillerRegistrationModel.fetchRegisteredBillers().done(function(data) {
                if (data.billerRegistrationDTOs) {
                    const registeredBillers = data.billerRegistrationDTOs.filter(function(registrationDetails) {
                        return registrationDetails.registrationStatus === "APPROVED";
                    }).sort(function(left, right) {
                        return left.billerNickName === right.billerNickName ? 0 : left.billerNickName < right.billerNickName ? -1 : 1;
                    });

                    self.registeredBillers(registeredBillers);

                    if (self.defaultData && self.defaultData.billerRegistrationId) {
                        self.selectedBillerId(self.defaultData.billerRegistrationId);
                        self.defaultData.billerRegistrationId = null;
                    } else if (self.registeredBillers().length > 0) {
                        self.selectedBillerId(self.registeredBillers()[0].id);
                    }

                    self.dataLoaded(true);
                }
            });
        }

        self.additionalDetailsSubscribe = self.additionalDetails.subscribe(function(newValue) {
            if (newValue) {
                self.modifiedBillerDetails.autopayInstructions.debitAccount.displayValue(newValue.label);
            } else {
                self.modifiedBillerDetails.autopayInstructions.debitAccount.displayValue(null);
            }
        });

        /**
         * This function clears autopay instruction data from the model.
         *
         * @function clearAutoPayInstructions
         * @returns {void}
         */
        function clearAutoPayInstructions() {
            self.modifiedBillerDetails.autopayInstructions.debitAccount.displayValue(null);
            self.modifiedBillerDetails.autopayInstructions.debitAccount.value(null);
            self.modifiedBillerDetails.autopayInstructions.limitAmount.amount(null);
            self.modifiedBillerDetails.autopayInstructions.frequency(null);
            self.modifiedBillerDetails.autopayInstructions.startDate(null);
            self.modifiedBillerDetails.autopayInstructions.endDate(null);
            self.frequency("ONE_TIME");
            self.minEndDate(today);
        }

        self.autopaySubscribe = self.modifiedBillerDetails.autopay.subscribe(function(newValue) {
            if (newValue !== "true") {
                clearAutoPayInstructions();
            }
        });

        self.schedulepaySubscribe = self.modifiedBillerDetails.schedulePayment.subscribe(function(newValue) {
            if (newValue !== "true") {
                clearAutoPayInstructions();
            }
        });

        self.autoPayLimitSubscribe = self.autoPayLimit.subscribe(function(newValue) {
            if (newValue !== "limitAmount") {
                self.modifiedBillerDetails.autopayInstructions.limitAmount.amount(null);
            }
        });

        self.frequencySubscribe = self.frequency.subscribe(function(newValue) {
            if (newValue !== "RECURRING") {
                self.modifiedBillerDetails.autopayInstructions.endDate(null);
            }
        });

        self.startDateSubscribe = self.modifiedBillerDetails.autopayInstructions.startDate.subscribe(function(newValue) {
            if (newValue) {
                const startDate = new Date(newValue);

                self.minEndDate(new Date(startDate.setHours(0, 0, 0, 0)));
            }
        });

        self.deleteBiller = function() {
            $("#deleteBiller").trigger("openModal");
        };

        self.confirmDelete = function() {
            $("#deleteBiller").hide();

            const confirmScreenDetailsArray = [
                [{
                        label: self.resourceBundle.labels.billerName,
                        value: self.dropdownLabels.biller()
                    },
                    {
                        label: self.resourceBundle.labels.billerNickname,
                        value: self.modifiedBillerDetails.billerNickName()
                    }
                ]
            ];

            if (self.modifiedBillerDetails.autopay === "true") {
                confirmScreenDetailsArray.push([{
                        label: self.resourceBundle.labels.billerCategory,
                        value: self.dropdownLabels.category()
                    },
                    {
                        label: self.resourceBundle.labels.autoPay,
                        value: self.resourceBundle.labels.yes
                    }
                ]);
            } else if (self.modifiedBillerDetails.schedulePayment === "true") {
                confirmScreenDetailsArray.push([{
                        label: self.resourceBundle.labels.billerCategory,
                        value: self.dropdownLabels.category()
                    },
                    {
                        label: self.resourceBundle.labels.scheduledPay,
                        value: self.resourceBundle.labels.yes
                    }
                ]);
            } else {
                confirmScreenDetailsArray.push([{
                    label: self.resourceBundle.labels.billerCategory,
                    value: self.dropdownLabels.category()
                }]);
            }

            ManageBillerRegistrationModel.deleteBiller(self.selectedBiller().id).done(function(data, status, jqXhr) {
                let successMessage, statusMessages;

                if (params.dashboard.appData.segment === "CORP" && jqXhr.status && jqXhr.status === 202) {
                    successMessage = self.resourceBundle.messages.corpMaker;
                    statusMessages = self.resourceBundle.messages.pendingApproval;
                } else {
                    successMessage = self.resourceBundle.messages.deleteSuccessMessage;
                    statusMessages = self.resourceBundle.messages.sucessfull;
                }

                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.resourceBundle.heading.deleteBiller,
                    confirmScreenExtensions: {
                        successMessage: successMessage,
                        statusMessages: statusMessages,
                        isSet: true,
                        confirmScreenDetails: confirmScreenDetailsArray,
                        taskCode: "EB_M_UBR",
                        template: "confirm-screen/bill-payments"
                    }
                }, self);
            });
        };

        self.update = function() {
            const tracker = document.getElementById("tracker");

            if (tracker.valid === "valid") {
                ManageBillerRegistrationModel.fetchNicknames().done(function(response) {
                    for (let i = 0; i < response.billerRegistrationDTOs.length; i++) {
                        if (self.modifiedBillerDetails.billerRegistrationId() !== response.billerRegistrationDTOs[i].id) {
                            if (self.modifiedBillerDetails.billerNickName() === response.billerRegistrationDTOs[i].billerNickName) {
                                const message = params.baseModel.format(self.resourceBundle.registerBillerError.validationErrors.uniqueNickname, {
                                    nickname: self.modifiedBillerDetails.billerNickName()
                                });

                                params.baseModel.showMessages(null, [message], "ERROR");

                                return;
                            }
                        }
                    }

                    if (self.modifiedBillerDetails.autopayInstructions.endDate() !== null && new Date(self.modifiedBillerDetails.autopayInstructions.endDate()) < new Date(self.modifiedBillerDetails.autopayInstructions.startDate())) {
                        const message2 = params.baseModel.format(self.resourceBundle.registerBillerError.validationErrors.invalidEndDate, {
                            startDate: self.modifiedBillerDetails.autopayInstructions.startDate()
                        });

                        params.baseModel.showMessages(null, [message2], "ERROR");

                        return;
                    }

                    if (self.frequency() === "ONE_TIME") {
                        self.modifiedBillerDetails.autopayInstructions.frequency(self.frequency());
                    }

                    self.modifiedBillerDetails.autopayInstructions.paymentType(self.currentAccountType());
                    self.currentStage("REVIEW");
                });
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        };

        self.validateAmount = [{
            validate: function(value) {
                if (value) {
                    if (value <= 0) {
                        throw new oj.ValidatorError("", self.resourceBundle.registerBillerError.validationErrors.invalidAmountErrorMessage);
                    }

                    const numberfractional1 = value.toString().split(".");

                    if (numberfractional1[0] && (numberfractional1[0].length > 13 || !/^[0-9]+$/.test(numberfractional1[0]))) {
                        throw new oj.ValidatorError("", self.resourceBundle.registerBillerError.validationErrors.amountError);
                    }

                    if (numberfractional1[1]) {
                        if (numberfractional1[1].length > 2 || !/^[0-9]+$/.test(numberfractional1[1])) {
                            throw new oj.ValidatorError("", self.resourceBundle.registerBillerError.validationErrors.amountError);
                        }
                    }
                }

                return true;
            }
        }];

        self.accountTypeChanged = function(data) {
            self.dropdownLabels.currentAccountType(data.detail.value);
            self.accountsLoaded("false");
            self.modifiedBillerDetails.autopayInstructions.debitAccount.displayValue(null);
            self.modifiedBillerDetails.autopayInstructions.debitAccount.value(null);
            self.taskCode(null);

            if (data.detail.value === "CASA") {
                self.customURL("demandDeposit");
                self.taskCode(self.taskCodeValue());
            } else if (data.detail.value === "CREDITCARD") {
                self.customURL("cards/credit?expand=ALL");
            } else if (data.detail.value === "DEBITCARD") {
                self.customURL("demandDeposit?expand=DEBITCARDS");
            }

            self.accountsLoaded("true");
        };

        self.creditCardParser = function(data) {
            const creditCardList = [];

            data.creditcards.forEach(function(item) {
                if (item.cardType === "PRIMARY" && item.cardStatus === "ACT") { creditCardList.push(item); }
            });

            data.accounts = creditCardList;

            data.accounts.map(function(creditCard) {
                creditCard.id = creditCard.creditCard;
                creditCard.partyName = creditCard.ownerName;
                creditCard.module = "CON";
                creditCard.partyId = data.associatedParty;
                creditCard.accountNickname = creditCard.cardNickname ? creditCard.cardNickname : "";
                creditCard.associatedParty = data.associatedParty;
                creditCard.currencyCode = creditCard.cardCurrency;

                return creditCard;
            });

            return data;
        };

        self.debitCardParser = function(data) {
            const debitCardList = [];

            if (data.accounts) {
                data.accounts.forEach(function(account) {
                    if (account.debitCards) {
                        account.debitCards.forEach(function(item) {
                            if (item.cardStatus === "ISSUED") { debitCardList.push(item); }
                        });
                    }
                });
            }

            data.accounts = debitCardList;

            data.accounts.map(function(debitCard) {
                debitCard.id = debitCard.cardNo;
                debitCard.partyName = debitCard.cardHolderName;
                debitCard.accountNickname = debitCard.cardNickname ? debitCard.cardNickname : "";
                debitCard.associatedParty = data.partyId;

                return debitCard;
            });

            return data;
        };

        self.viewBills = function() {
            params.dashboard.loadComponent("manage-accounts", {
                applicationType: "billPayments",
                defaultTab: "manage-bill-payments"
            });
        };

        self.paymentHistory = function() {
            params.dashboard.loadComponent("manage-accounts", {
                applicationType: "billPayments",
                defaultTab: "payment-history"
            });
        };

        self.registerBiller = function() {
            params.changeView("register-biller", null);
        };
    };

    vm.prototype.dispose = function() {
        self.autopaySubscribe.dispose();
        self.selectedBillerSubscribe.dispose();
        self.schedulepaySubscribe.dispose();
        self.frequencySubscribe.dispose();
        self.startDateSubscribe.dispose();
        self.autoPayLimitSubscribe.dispose();
        self.additionalDetailsSubscribe.dispose();
    };

    return vm;
});