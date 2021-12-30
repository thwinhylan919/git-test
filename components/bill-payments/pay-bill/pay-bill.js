define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/register-biller",
    "text!./pay-bill.json",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout",
    "ojs/ojlabel",
    "ojs/ojinputtext",
    "ojs/ojdatetimepicker",
    "ojs/ojselectcombobox",
    "ojs/ojradioset",
    "ojs/ojbutton",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup"
], function (oj, ko, $, PayBillModel, locale, PayBillJSON) {
    "use strict";

    let self;
    const vm = function (params) {
        self = this;

        self.dropdownLabels = {
            currentAccountType: ko.observable()
        };

        const getNewKoModel = function () {
            const billerPaymentDetails = ko.mapping.fromJS(PayBillModel.getNewModel());

            return billerPaymentDetails;
        };

        self.supportedAccounts = ko.observableArray();
        self.supportedAccountsLocale = ko.observableArray();
        self.currentAccountType = ko.observable();
        self.customURL = ko.observable();
        self.taskCodeValue=ko.observable("PC_F_INTRNL");
        self.taskCode = ko.observable(null);
        self.accountsLoaded = ko.observable("false");
        self.additionalDetails = ko.observable("");
        self.currentDate = ko.observable();
        self.formattedTomorrow = ko.observable();
        self.currentDateLoaded = ko.observable(false);
        self.isLaterDateRequired = ko.observable(true);
        self.currenyConverter = ko.observable();
        self.relationshipDetails = ko.observableArray();
        self.excessPayment = ko.observable();
        self.partPayment = ko.observable();
        self.dueDate = ko.observable();
        self.groupValid = ko.observable();
        self.invalidTracker = ko.observable();
        self.tracker = ko.observable();
        self.expiryMonth = ko.observable("01");
        self.expiryYear = ko.observable();
        self.frequencyList = ko.observableArray();
        self.mode = ko.observable("CREATE");
        self.presentmentPayment = ko.observable(false);
        params.baseModel.registerComponent("transfer-view-limits", "financial-limits");
        params.baseModel.registerComponent("modify-biller", "bill-payments");
        params.baseModel.registerComponent("available-limits", "financial-limits");

        const payBillJSON = JSON.parse(PayBillJSON);

        self.resourceBundle = locale;
        self.creditAccounts = ko.observable();
        self.viewLimitsFlag = ko.observable(false);
        self.loadAccessPointList = ko.observable(false);
        self.selectedChannelTypeName = ko.observable();
        self.selectedChannelType = ko.observable();
        self.selectedChannelIndex = ko.observable();
        self.selectedChannel = ko.observable(false);
        self.channelList = ko.observableArray();
        self.billerDetails = params.rootModel.params.registerBillerDetails;
        params.dashboard.headerName(self.resourceBundle.heading.payBills);
        self.planArray = ko.observableArray([]);
        self.rechargeFlag = ko.observable(false);
        self.plansLoaded = ko.observable(false);

        if (params.rootModel.params.mode) {
            self.mode(params.rootModel.params.mode);
        }

        if (params.rootModel.params.billerDetails) {
            self.billerDetails = ko.mapping.toJS(params.rootModel.params.billerDetails);
        }

        PayBillModel.listRechargePlans(self.billerDetails.billerId).done(function (data) {
            self.planArray.removeAll();

            for (let i = 0; i < data.planDTOs.length; i++) {
                self.planArray.push({
                    id: data.planDTOs[i].id,
                    description: data.planDTOs[i].description,
                    amount: data.planDTOs[i].amount.amount,
                    currency: data.planDTOs[i].amount.currency
                });
            }

            self.plansLoaded(true);
        });

        self.getBillerValues = function () {
            PayBillModel.fetchBillerDetails(self.billerDetails.billerId).done(function (response) {
                self.billerPaymentDetails.billerName(response.biller.name);
                self.billerPaymentDetails.billerId(response.biller.id);
                self.excessPayment(response.biller.paymentOptions.excessPayment);
                self.partPayment(response.biller.paymentOptions.partPayment);
                self.supportedAccounts.removeAll();
                self.supportedAccountsLocale.removeAll();

                if (self.billerDetails.billerType === "RECHARGE") {
                    self.billerPaymentDetails.billAmount.currency(self.billerDetails.autopayInstructions.limitAmount.currency);

                    self.currenyConverter({
                        type: "number",
                        options: {
                            style: "currency",
                            currency: self.billerDetails.autopayInstructions.limitAmount.currency,
                            currencyDisplay: "symbol"
                        }
                    });
                }

                self.relationshipDetails.removeAll();

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
                    if (self.supportedAccounts()[0] === "CASA" || self.supportedAccounts()[1] === "CASA" || self.supportedAccounts()[2] === "CASA") {
                        self.currentAccountType("CASA");
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

                for (i = 0; i < self.billerDetails.relationshipDetails.length; i++) {
                    self.relationshipDetails.push({
                        label: specsArray[self.billerDetails.relationshipDetails[i].labelId],
                        value: self.billerDetails.relationshipDetails[i].value
                    });
                }
            });
        };

        if (self.mode() === "EDIT") {
            self.billerPaymentDetails = params.rootModel.params.billerPaymentDetails;
            self.billerDetails = ko.mapping.toJS(params.rootModel.params.billerDetails);
            self.accountsLoaded("true");
            self.supportedAccounts(params.rootModel.params.supportedAccounts);
            self.currentAccountType(params.rootModel.params.billerPaymentDetails.paymentType());

            PayBillModel.fetchBillerDetails(self.billerDetails.billerId).done(function (response) {
                const specsArray = [];

                for (let i = 0; i < response.biller.specifications.length; i++) {
                    specsArray[response.biller.specifications[i].id] = response.biller.specifications[i].label;
                }

                for (let i = 0; i < self.billerDetails.relationshipDetails.length; i++) {
                    self.relationshipDetails.push({
                        label: specsArray[self.billerDetails.relationshipDetails[i].labelId],
                        value: self.billerDetails.relationshipDetails[i].value
                    });
                }
            });
        } else {
            //for CREATE mode
            self.billerPaymentDetails = getNewKoModel().BillerPaymentDetails;
            self.getBillerValues();
            self.billerPaymentDetails.payLater("false");
            self.billerPaymentDetails.recurring("false");

            if (self.billerDetails.billerType === "PRESENTMENT_PAYMENT") {
                if (self.billerDetails.ebill) {
                    self.presentmentPayment(true);
                } else {
                    self.presentmentPayment(false);
                }
            }

            if (self.billerDetails.schedulePayment) {
                self.schedulePayFlag = ko.observable(self.billerDetails.schedulePayment);
            } else if (self.billerDetails.autopay === false) {
                self.schedulePayFlag = ko.observable(false);
            } else {
                self.schedulePayFlag = ko.observable(true);
            }
        }

        self.billerPaymentDetails.billerRegistrationId(self.billerDetails.id);
        self.billerPaymentDetails.customerName(self.billerDetails.customerName);
        self.billerPaymentDetails.billerRegistration.billerNickName(self.billerDetails.billerNickName);

        const today_date = params.baseModel.getDate(),
            currentYear = today_date.getFullYear();

        self.monthEnumList = ko.observableArray([{
            code: "01",
            description: "01"
        },
        {
            code: "02",
            description: "02"
        },
        {
            code: "03",
            description: "03"
        },
        {
            code: "04",
            description: "04"
        },
        {
            code: "05",
            description: "05"
        },
        {
            code: "06",
            description: "06"
        },
        {
            code: "07",
            description: "07"
        },
        {
            code: "08",
            description: "08"
        },
        {
            code: "09",
            description: "09"
        },
        {
            code: "10",
            description: "10"
        },
        {
            code: "11",
            description: "11"
        },
        {
            code: "12",
            description: "12"
        }
        ]);

        self.yearEnumList = ko.observableArray([{
            code: currentYear,
            description: currentYear
        },
        {
            code: currentYear + 1,
            description: currentYear + 1
        },
        {
            code: currentYear + 2,
            description: currentYear + 2
        },
        {
            code: currentYear + 3,
            description: currentYear + 3
        },
        {
            code: currentYear + 4,
            description: currentYear + 4
        },
        {
            code: currentYear + 5,
            description: currentYear + 5
        },
        {
            code: currentYear + 6,
            description: currentYear + 6
        },
        {
            code: currentYear + 7,
            description: currentYear + 7
        },
        {
            code: currentYear + 8,
            description: currentYear + 8
        }, {
            code: currentYear + 9,
            description: currentYear + 9
        }
        ]);

        if (self.billerDetails.ebill) {
            self.dueDate(self.billerDetails.ebill.dueDate);
            self.billerPaymentDetails.billId(self.billerDetails.ebill.id);

            if (self.billerDetails.ebill.status === "PARTIALPAID") {
                self.billerPaymentDetails.billAmount.amount(self.billerDetails.ebill.totalAmount.amount - self.billerDetails.ebill.amountPaid.amount);
            } else {
                self.billerPaymentDetails.billAmount.amount(self.billerDetails.ebill.totalAmount.amount);
            }
        }

        for (let i = 0; i < payBillJSON.frequencyList.length; i++) {
            self.frequencyList.push({
                label: self.resourceBundle.labels[payBillJSON.frequencyList[i]],
                value: payBillJSON.frequencyList[i]
            });
        }

        params.baseModel.registerComponent("review-bill-payment", "bill-payments");

        PayBillModel.fetchLocationDetails(self.billerDetails.location.id).done(function (response) {
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

            self.billerPaymentDetails.location(location);
        });

        self.accountTypeChanged = function (data) {
            self.dropdownLabels.currentAccountType(data.detail.value);
            self.accountsLoaded("false");
            self.billerPaymentDetails.debitAccount.displayValue(null);
            self.billerPaymentDetails.debitAccount.value(null);
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

        self.creditCardParser = function (data) {
            const creditCardList = [];

            data.creditcards.forEach(function (item) {
                if (item.cardType === "PRIMARY" && item.cardStatus === "ACT") { creditCardList.push(item); }
            });

            data.accounts = creditCardList;
            self.creditAccounts(creditCardList);

            data.accounts.map(function (creditCard) {
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

        self.debitCardParser = function (data) {
            const debitCardList = [];

            if (data.accounts) {
                data.accounts.forEach(function (account) {
                    if (account.debitCards) {
                        account.debitCards.forEach(function (item) {
                            if (item.cardStatus === "ISSUED") { debitCardList.push(item); }
                        });
                    }
                });
            }

            data.accounts = debitCardList;

            data.accounts.map(function (debitCard) {
                debitCard.id = debitCard.cardNo;
                debitCard.partyName = debitCard.cardHolderName;
                debitCard.accountNickname = debitCard.cardNickname ? debitCard.cardNickname : "";
                debitCard.associatedParty = debitCard.partyId.displayValue;

                return debitCard;
            });

            return data;
        };

        self.additionalDetailsSubscribe = self.additionalDetails.subscribe(function (newValue) {
            if (newValue) {
                if (newValue.account) {
                    self.billerPaymentDetails.debitAccount.displayValue(newValue.account.label);

                    if (self.billerDetails.billerType !== "RECHARGE") {
                        self.billerPaymentDetails.billAmount.currency(newValue.account.currencyCode);

                        self.currenyConverter({
                            type: "number",
                            options: {
                                style: "currency",
                                currency: newValue.account.currencyCode,
                                currencyDisplay: "symbol"
                            }
                        });
                    }
                } else {
                    self.billerPaymentDetails.debitAccount.displayValue(newValue.label);

                    if (self.billerDetails.billerType !== "RECHARGE") {
                        self.billerPaymentDetails.billAmount.currency(newValue.currencyCode);

                        self.currenyConverter({
                            type: "number",
                            options: {
                                style: "currency",
                                currency: newValue.currencyCode,
                                currencyDisplay: "symbol"
                            }
                        });
                    }
                }
            } else {
                self.billerPaymentDetails.debitAccount.displayValue(null);
                self.billerPaymentDetails.billAmount.currency(null);
                self.currenyConverter(null);
            }
        });

        self.goBack = function () {
            history.back();
        };

        if (self.currentDate() === undefined) {
            self.currentDateLoaded(false);

            const today = params.baseModel.getDate();

            self.payNowDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(params.baseModel.getDate())));
            self.currentDate(today);
            today.setDate(today.getDate() + 1);
            self.formattedTomorrow(today);
            self.currentDateLoaded(true);
        }

        self.submit = function () {
            if (self.currentAccountType() === "CREDITCARD") {
                const date = params.baseModel.getDate();

                date.setMonth(self.expiryMonth() - 1);
                date.setYear(self.expiryYear());

                const y = date.getFullYear(),
                    m = date.getMonth(),
                    lastDay = new Date(y, m + 1, 0);

                self.billerPaymentDetails.cardExpiryDate(oj.IntlConverterUtils.dateToLocalIso(new Date(lastDay)));
            }

            if (self.billerPaymentDetails.payLater() === "false") {
                self.billerPaymentDetails.paymentDate(self.payNowDate());
            }

            if (self.billerPaymentDetails.payLater() === "true") {
                if (self.billerPaymentDetails.paymentDate()) {
                    self.billerPaymentDetails.paymentDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.billerPaymentDetails.paymentDate())));
                }

                if (self.billerPaymentDetails.billerRegistration.autopayInstructions.endDate()) {
                    self.billerPaymentDetails.billerRegistration.autopayInstructions.endDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.billerPaymentDetails.billerRegistration.autopayInstructions.endDate())));
                }
            }

            self.billerPaymentDetails.billPaymentRelDetails.removeAll();

            if (self.relationshipDetails().length > 0) {
                for (let i = 0; i < self.billerDetails.relationshipDetails.length; i++) {
                    self.billerPaymentDetails.billPaymentRelDetails.push({
                        labelId: self.billerDetails.relationshipDetails[i].labelId,
                        label: self.billerDetails.relationshipDetails[i].label,
                        value: self.billerDetails.relationshipDetails[i].value
                    });
                }
            }

            self.billerPaymentDetails.paymentType(self.currentAccountType());
            self.billerPaymentDetails.billerType(self.billerDetails.billerType);

            const tracker = document.getElementById("tracker");

            if (tracker.valid === "valid") {
                const parameters = {
                    mode: "REVIEW",
                    billerPaymentDetails: ko.mapping.toJS(self.billerPaymentDetails),
                    billerDetails : self.billerDetails,
                    supportedAccounts : self.supportedAccounts(),
                    relationshipDetails : self.relationshipDetails()
                };

                params.dashboard.loadComponent("review-bill-payment", parameters, self);
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        };

        self.validateAmount = [{
            validate: function (value) {
                if (value <= 0) {
                    throw new oj.ValidatorError("", self.resourceBundle.registerBillerError.validationErrors.invalidAmountErrorMessage);
                }

                if (value) {
                    const numberfractional1 = value.toString().split(".");

                    if (numberfractional1[0] && (numberfractional1[0].length > 13 || !/^[0-9]+$/.test(numberfractional1[0]))) {
                        throw new oj.ValidatorError("", self.resourceBundle.registerBillerError.validationErrors.amountError);
                    }

                    if (numberfractional1[1]) {
                        if (numberfractional1[1].length > 2 || !/^[0-9]+$/.test(numberfractional1[1])) {
                            throw new oj.ValidatorError("", self.resourceBundle.registerBillerError.validationErrors.amountError);
                        }
                    }

                    if (self.billerDetails.ebill) {
                        if (self.partPayment() === true && self.excessPayment() === false) {
                            if (value > self.billerDetails.ebill.totalAmount.amount) { throw new oj.ValidatorError("", self.resourceBundle.registerBillerError.validationErrors.invalidpartPaymentErrorMessage); }
                        }

                        if (self.excessPayment() === true && self.partPayment() === false) {
                            if (value < self.billerDetails.ebill.totalAmount.amount) { throw new oj.ValidatorError("", self.resourceBundle.registerBillerError.validationErrors.invalidexcessPaymentErrorMessage); }
                        }
                    }
                }

                return true;
            }
        }];

        self.setAutoPay = function () {
            params.dashboard.loadComponent("manage-accounts", {
                applicationType: "billPayments",
                defaultTab: "modify-biller"
            });
        };

        PayBillModel.listAccessPoint().done(function (data) {
            self.channelList(data.accessPointListDTO);
            self.selectedChannel(true);

            for (let i = 0; i < data.accessPointListDTO.length; i++) {
                if (data.accessPointListDTO[i].currentLoggedIn === true) {
                    self.selectedChannelIndex(i);
                }
            }

            self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
            self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
            self.loadAccessPointList(true);
        });

        self.channelTypeChangeHandler = function () {
            if (self.selectedChannelIndex() !== null) {
                self.selectedChannel(false);
                ko.tasks.runEarly();
                self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
                self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
                self.selectedChannel(true);
            }
        };

        self.viewLimits = function () {
            $("#viewlimits-bill-payment" + self.incrementId).trigger("openModal");
            self.viewLimitsFlag(true);
        };

        self.channelPopup = function () {
            const popup1 = document.querySelector("#channel-popup");

            if (popup1.isOpen()) {
                popup1.close();
            } else {
                popup1.open("#channel-disclaimer");
            }
        };

        self.paymentTypeFunction = function () {
            if (self.supportedAccountsLocale().length === 1) {
                return self.supportedAccountsLocale();
            } else if (self.supportedAccountsLocale().length === 2) {
                return self.supportedAccountsLocale().join("and");
            } else if (self.supportedAccountsLocale().length > 2) {
                return self.supportedAccountsLocale().join(",").replace(/, ([^,]*)$/, "and $1");
            }
        };

        self.planIdSubscribe = self.billerPaymentDetails.planId.subscribe(function (newValue) {
            if (newValue) {
                const planId = newValue;

                self.rechargeFlag(true);

                for (let i = 0; i < self.planArray().length; i++) {
                    if (self.planArray()[i].id === planId) {
                        self.billerPaymentDetails.planId(self.planArray()[i].id);
                        self.billerPaymentDetails.billAmount.amount(self.planArray()[i].amount);
                        self.billerPaymentDetails.billAmount.currency(self.planArray()[i].currency);
                    }
                }
            } else {
                self.billerPaymentDetails.billAmount.amount(null);
                self.rechargeFlag(false);
            }
        });
    };

    return vm;
});