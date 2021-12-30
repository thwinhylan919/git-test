define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!extensions/resources/nls/quick-payments",
    "load!/framework/json/biller-configuration/biller-configuration.json",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout",
    "ojs/ojlabel",
    "ojs/ojinputtext",
    "ojs/ojdatetimepicker",
    "ojs/ojselectcombobox",
    "ojs/ojradioset",
    "ojs/ojbutton",
    "ojs/ojavatar",
    "ojs/ojknockout-validation"
], function (oj, ko, $, QuickRechargeModel, locale, billerConfiguration) {
    "use strict";

    let self;
    const vm = function (params) {
        self = this;
        self.mode = ko.observable();

        const getNewKoModel = function () {
            const quickRechargeModel = ko.mapping.fromJS(QuickRechargeModel.getNewModel());

            return quickRechargeModel;
        };

        self.dropdownListLoaded = {
            categories: ko.observable(false)
        };

        self.dropdownLabels = {
            category: ko.observable(),
            location: ko.observable(),
            biller: ko.observable(),
            currentAccountType: ko.observable()
        };

        self.currenyConverter = ko.observable();

        const payLoad = {
            batchDetailRequestList: []
        };

        self.categoryList = ko.observableArray();
        self.locationList = ko.observableArray();
        self.viewLimitsFlag = ko.observable(false);
        self.loadAccessPointList = ko.observable(false);
        self.selectedChannelTypeName = ko.observable();
        self.sampleBillExist = ko.observable(false);
        self.selectedChannelType = ko.observable();
        self.selectedChannelIndex = ko.observable();
        self.selectedChannel = ko.observable(false);
        self.channelList = ko.observableArray();
        self.billerList = ko.observableArray();
        self.supportedAccounts = ko.observableArray();
        self.supportedAccountsLocale = ko.observableArray();
        self.relationshipDetails = ko.observableArray();
        self.accountsLoaded = ko.observable("false");
        self.additionalDetails = ko.observable("");
        self.currentAccountType = ko.observable();
        self.customURL = ko.observable();
        self.categoryId = ko.observable();
        self.locationId = ko.observable();
        self.categoryName = ko.observable();
        self.isLaterDateRequired = ko.observable(true);
        self.currentDate = ko.observable();
        self.currentDateLoaded = ko.observable(false);
        self.formattedTomorrow = ko.observable();
        self.billerValid = ko.observable();
        self.invalidTracker = ko.observable();
        self.tracker = ko.observable();
        self.expiryMonth = ko.observable("01");
        self.expiryYear = ko.observable();
        self.creditAccounts = ko.observable();
        self.planFlag = ko.observable(false);
        params.baseModel.registerComponent("register-biller", "bill-payments");
        params.baseModel.registerComponent("transfer-view-limits", "financial-limits");
        params.baseModel.registerComponent("available-limits", "financial-limits");
        params.baseModel.registerComponent("payment-history", "bill-payments");
        self.enquiryData = ko.observable({});
        self.transactionAmount = ko.observable();
        self.billerName = ko.observable();
        self.confirmScreenFields = ko.observableArray([]);
        self.enquiryRequired = ko.observable(true);

        if (params.baseModel.small()) {
            self.showCategoryAvatars = ko.observable(true);
        } else {
            self.showCategoryAvatars = ko.observable(false);
        }

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

        self.currentStage = ko.observable("CREATE");
        self.quickRechargeDetails = getNewKoModel().QuickRechargeDetails;
        self.planArray = ko.observableArray([]);
        self.rechargeFlag = ko.observable(false);
        self.resourceBundle = locale;
        params.dashboard.headerName(self.resourceBundle.heading.quickRecharge);
        params.baseModel.registerElement("account-input");
        params.baseModel.registerComponent("review-quick-recharge", "bill-payments");

        /**
         * This function sets the locations to be displayed on screen.
         *
         * @function populateLocationDropdown
         * @param {arrayList} locationList - Locations to be populated in the dropdown.
         * @returns {void}
         */
        function populateLocationDropdown(locationList) {
            self.locationList.removeAll();

            let location = null;

            for (let i = 0; i < locationList.length; i++) {
                location = null;

                if (!locationList[i].areaName) {
                    location = locationList[i].city;

                    if (locationList[i].state) {
                        if (location.length > 0) {
                            location = params.baseModel.format(self.resourceBundle.labels.location, {
                                location: location
                            });
                        }

                        location = location + locationList[i].state;
                    }

                    if (locationList[i].country) {
                        if (location.length > 0) {
                            location = params.baseModel.format(self.resourceBundle.labels.location, {
                                location: location
                            });
                        }

                        location = location + locationList[i].country;
                    }
                } else {
                    location = locationList[i].areaName;
                }

                self.locationList.push({
                    label: location,
                    value: locationList[i].id
                });
            }
        }

        /**
         * This function returns appropriate data validator for the field.
         *
         * @function getValidator
         * @param {string} datatype - Datatype against which validator need to be returned.
         * @param {boolean} required - Whether field is mandatory or not.
         * @param {int} maxlength - Maxlength of the field.
         * @returns {Object} Oj validator object.
         */
        function getValidator(datatype, required, maxlength) {
            let validaton, errorMessage, minlength = 0;

            if (required) {
                minlength = 1;
            }

            const extension = {
                type: "length",
                options: {
                    min: minlength,
                    max: maxlength
                }
            };

            switch (datatype) {
                case "ALPHANUMERIC":
                    validaton = "ALPHANUMERIC";
                    errorMessage = self.resourceBundle.registerBillerError.validationErrors.ALPHANUMERIC;
                    break;
                case "NUMERIC":
                    validaton = "NUMBERS";
                    errorMessage = self.resourceBundle.registerBillerError.validationErrors.NUMERIC;
                    break;
                case "TEXT":
                    validaton = "ALPHABETS";
                    errorMessage = self.resourceBundle.registerBillerError.validationErrors.TEXT;
                    break;
                default:
                    validaton = "ALPHANUMERIC_WITH_ALL_SPECIAL";
                    errorMessage = self.resourceBundle.registerBillerError.validationErrors.OTHERS;
            }

            return params.baseModel.getValidator(validaton, errorMessage, extension);
        }

        /**
         * This function populate category logos.
         *
         * @function fetchLogos
         * @returns {void}
         */
        function fetchLogos() {
            QuickRechargeModel.fireBatch(payLoad).done(function (batchData) {
                const contentMap = [];

                if (batchData && batchData.batchDetailResponseDTOList) {
                    for (let j = 0; j < batchData.batchDetailResponseDTOList.length; j++) {
                        const batchResponse = JSON.parse(batchData.batchDetailResponseDTOList[j].responseText);

                        if (batchResponse.contentDTOList) {
                            if (batchResponse.contentDTOList[0].contentId) {
                                contentMap[batchResponse.contentDTOList[0].contentId.value] = "data:image/gif;base64," + batchResponse.contentDTOList[0].content;
                            }
                        }
                    }
                }

                for (let i = 0; i < self.categoryList().length; i++) {
                    if (self.categoryList()[i].logo) {
                        self.categoryList()[i].logoImg(contentMap[self.categoryList()[i].logo.value]);
                    }
                }
            });
        }

        self.fetchCategories = function () {
            QuickRechargeModel.fetchCategory().done(function (data) {
                self.categoryList(data.categoryDTOs);
                payLoad.batchDetailRequestList = [];

                let id, i = 0;

                self.categoryList().forEach(function (category) {
                    category.initials = oj.IntlConverterUtils.getInitials(category.name);
                    category.logoImg = ko.observable();

                    if (params.baseModel.small() && category.logo) {
                        id = category.logo.value;

                        const contentURL = {
                                value: "/contents/{id}",
                                params: {
                                    id: id
                                }
                            },
                            obj = {
                                methodType: "GET",
                                uri: contentURL,
                                headers: {
                                    "Content-Id": ++i,
                                    "Content-Type": "application/json"
                                }
                            };

                        payLoad.batchDetailRequestList.push(obj);
                    }
                });

                if (payLoad.batchDetailRequestList.length > 0) {
                    fetchLogos();
                }

                self.categoryList().sort(function (left, right) {
                    return left.priority === right.priority ? 0 : left.priority < right.priority ? -1 : 1;
                });

                self.dropdownListLoaded.categories(true);
            });
        };

        self.fetchCategories();

        /**
         * This function fetches the list of billers from the service.
         *
         * @function fetchBillers
         * @returns {void}
         */
        function fetchBillers() {
            QuickRechargeModel.fetchBillers(self.categoryId(), self.locationId()).done(function (data) {
                const billers = data.billerDTOs;

                for (let i = 0; i < billers.length; i++) {
                    self.typeCasa = ko.observable(false);

                    if (billers[i].status === "ACTIVE" && billers[i].paymentOptions.quickRecharge === true) {
                        if (params.dashboard.appData.segment === "CORP") {
                            for (let m = 0; m < billers[i].paymentMethodsList.length; m++) {
                                if (billers[i].paymentMethodsList[m].paymentType === "CASA") {
                                    self.typeCasa(true);
                                }

                                if (self.typeCasa()) {
                                    self.billerList.push({
                                        label: billers[i].name,
                                        value: billers[i].id,
                                        billerType: billers[i].type,
                                        currency: billers[i].currency,
                                        sampleBill: billers[i].sampleBill,
                                        paymentMethodsList: billers[i].paymentMethodsList,
                                        specifications: billers[i].specifications
                                    });
                                }
                            }
                        } else {
                            self.billerList.push({
                                label: billers[i].name,
                                value: billers[i].id,
                                billerType: billers[i].type,
                                currency: billers[i].currency,
                                sampleBill: billers[i].sampleBill,
                                paymentMethodsList: billers[i].paymentMethodsList,
                                specifications: billers[i].specifications
                            });
                        }
                    }
                }

                if (self.billerList().length === 0) {
                    params.baseModel.showMessages(null, [self.resourceBundle.messages.checkDetails], "ERROR");
                }
            });
        }

        self.fetchLocations = function () {
            QuickRechargeModel.fetchLocation(self.categoryId()).done(function (data) {
                if (data.operationalAreaDTOs.length > 0) {
                    populateLocationDropdown(data.operationalAreaDTOs);
                    self.showCategoryAvatars(false);
                } else {
                    params.baseModel.showMessages(null, [self.resourceBundle.registerBiller.messages.noBillersMapped], "ERROR");
                }
            });
        };

        self.setCategory = function (data) {
            if (self.categoryId() !== data.id) {
                self.categoryId(data.id);
            } else {
                self.showCategoryAvatars(false);
            }
        };

        self.editCategory = function () {
            self.showCategoryAvatars(true);
        };

        self.categorySubscribe = self.categoryId.subscribe(function (newValue) {
            const category = self.categoryList().filter(function (data) {
                return data.id === newValue;
            });

            if (category && category.length > 0) {
                self.dropdownLabels.category(category[0].name);
            }

            self.quickRechargeDetails.category(self.dropdownLabels.category());
            self.quickRechargeDetails.categoryId(self.categoryId());
            self.locationList.removeAll();
            self.locationId(null);
            self.billerList.removeAll();
            self.quickRechargeDetails.billerId(null);
            self.fetchLocations();
        });

        self.locationSubscribe = self.locationId.subscribe(function (newValue) {
            if (newValue !== null) {
                const location = self.locationList().filter(function (data) {
                    return data.value === newValue;
                });

                if (location && location.length > 0) {
                    self.dropdownLabels.location(location[0].label);
                }

                self.quickRechargeDetails.location(self.dropdownLabels.location());
                self.billerList.removeAll();
                self.quickRechargeDetails.billerId(null);
                fetchBillers();
            }
        });

        self.billerSubscribe = self.quickRechargeDetails.billerId.subscribe(function (newValue) {
            self.supportedAccounts.removeAll();
            self.supportedAccountsLocale.removeAll();
            self.relationshipDetails.removeAll();

            if (newValue) {
                const billerId = newValue,
                    biller = self.billerList().filter(function (data) {
                        return data.value === billerId;
                    });

                if (biller && biller.length > 0) {
                    self.currenyConverter({
                        type: "number",
                        options: {
                            style: "currency",
                            currency: biller[0].currency,
                            currencyDisplay: "symbol"
                        }
                    });

                    self.dropdownLabels.biller(biller[0].label);
                    self.quickRechargeDetails.billerId(biller[0].value);
                    self.quickRechargeDetails.billAmount.currency(biller[0].currency);
                    self.getBillerValues();
                }
            }
        });

        self.planIdSubscribe = self.quickRechargeDetails.planId.subscribe(function (newValue) {
            if (newValue) {
                const planId = newValue;

                self.rechargeFlag(true);

                for (let i = 0; i < self.planArray().length; i++) {
                    if (self.planArray()[i].id === planId) {
                        self.quickRechargeDetails.planId(self.planArray()[i].id);
                        self.quickRechargeDetails.billAmount.amount(self.planArray()[i].amount);
                        self.quickRechargeDetails.billAmount.currency(self.planArray()[i].currency);
                    }
                }
            } else {
                self.quickRechargeDetails.billAmount.amount(null);
                self.rechargeFlag(false);
            }
        });

        self.fetchPlans = function () {
            self.planFlag(false);
            self.planArray.removeAll();

            for (let i = 0; i < self.billerList().length; i++) {
                if (self.billerList()[i].value === self.quickRechargeDetails.billerId()) {
                    self.billerName(self.billerList()[i].label);
                    break;
                }
            }

            QuickRechargeModel.listProductPlans(self.billerName()).done(function (data) {
                self.planArray.removeAll();

                if (data.billerProducts !== undefined && data.billerProducts.billerProduct.length > 0) {
                    for (let i = 0; i < data.billerProducts.billerProduct.length; i++) {
                        self.planArray.push({
                            id: data.billerProducts.billerProduct[i].code,
                            description: data.billerProducts.billerProduct[i].description,
                            amount: data.billerProducts.billerProduct[i].transactionamount,
                            currency: data.billerProducts.transactionCurrency
                        });
                    }
                }

                self.planFlag(true);
            });

            /* QuickRechargeModel.listRechargePlans(self.quickRechargeDetails.billerId()).done(function(data) {
                for (let i = 0; i < data.planDTOs.length; i++) {
                    self.planArray.push({
                        id: data.planDTOs[i].id,
                        description: data.planDTOs[i].description,
                        amount: data.planDTOs[i].amount.amount,
                        currency: data.planDTOs[i].amount.currency
                    });
                }

                self.planFlag(true);
            }); */
        };

        self.getBillerValues = function () {
            QuickRechargeModel.fetchBillerDetails(self.quickRechargeDetails.billerId()).done(function (response) {
                self.quickRechargeDetails.billerName(response.biller.name);
                self.supportedAccounts.removeAll();
                self.supportedAccountsLocale.removeAll();
                self.relationshipDetails.removeAll();

                let i;
                const specsArray = [];

                for (i = 0; i < response.biller.paymentMethodsList.length; i++) {
                    if (params.dashboard.appData.segment === "CORP") {
                        if (response.biller.paymentMethodsList[i].paymentType && response.biller.paymentMethodsList[i].paymentType === "CASA") {
                            self.supportedAccounts.push(response.biller.paymentMethodsList[i].paymentType);
                            self.supportedAccountsLocale.push(self.resourceBundle.registerBiller.labels[response.biller.paymentMethodsList[i].paymentType]);
                        }
                    } else {
                        self.supportedAccounts.push(response.biller.paymentMethodsList[i].paymentType);
                        self.supportedAccountsLocale.push(self.resourceBundle.registerBiller.labels[response.biller.paymentMethodsList[i].paymentType]);
                    }
                }

                if (self.supportedAccounts().length > 0) {
                    if (self.supportedAccounts()[0] === "CASA" || self.supportedAccounts()[1] === "CASA" || self.supportedAccounts()[2] === "CASA") {
                        self.currentAccountType("CASA");
                    } else {
                        self.currentAccountType(self.supportedAccounts()[0]);
                    }

                    if (self.currentAccountType() === "CASA") {
                        self.customURL("demandDeposit");
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

                for (i = 0; i < response.biller.specifications.length; i++) {
                    if (response.biller.specifications[i].label) {
                        self.relationshipDetails.push({
                            compId: "billerLabel_" + i,
                            id: response.biller.specifications[i].id,
                            label: response.biller.specifications[i].label,
                            required: response.biller.specifications[i].required,
                            datatype: response.biller.specifications[i].datatype,
                            maxLength: response.biller.specifications[i].maxLength,
                            validator: getValidator(response.biller.specifications[i].datatype, response.biller.specifications[i].required, response.biller.specifications[i].maxLength),
                            value: ko.observable()
                        });
                    }
                }
            });

            self.fetchPlans();
        };

        self.accountTypeChanged = function (data) {
            self.dropdownLabels.currentAccountType(data.detail.value);
            self.accountsLoaded("false");
            self.quickRechargeDetails.debitAccount.displayValue(null);
            self.quickRechargeDetails.debitAccount.value(null);

            if (data.detail.value === "CASA") {
                self.customURL("demandDeposit");
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
                if (item.cardType === "PRIMARY" && item.cardStatus === "ACT") {
                    creditCardList.push(item);
                }
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
                            if (item.cardStatus === "ISSUED") {
                                debitCardList.push(item);
                            }
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
                self.quickRechargeDetails.debitAccount.displayValue(newValue.label);

                self.currenyConverter({
                    type: "number",
                    options: {
                        style: "currency",
                        currency: self.quickRechargeDetails.billAmount.currency(),
                        currencyDisplay: "symbol"
                    }
                });
            } else {
                self.quickRechargeDetails.debitAccount.displayValue(null);
                self.currenyConverter(null);
            }
        });

        self.dataLoaded = ko.computed(function () {
            return self.dropdownListLoaded.categories();
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
                }

                return true;
            }
        }];

        self.viewBills = function () {
            params.dashboard.loadComponent("manage-accounts", {
                applicationType: "billPayments",
                defaultTab: "manage-bill-payments"
            });
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

        self.paymentHistory = function () {
            params.dashboard.loadComponent("manage-accounts", {
                applicationType: "billPayments",
                defaultTab: "payment-history"
            });
        };

        QuickRechargeModel.listAccessPoint().done(function (data) {
            self.channelList(data.accessPointListDTO);
            self.loadAccessPointList(true);

            for (let i = 0; i < data.accessPointListDTO.length; i++) {
                if (data.accessPointListDTO[i].currentLoggedIn === true) {
                    self.selectedChannelIndex(i);
                }
            }

            self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
            self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
            self.selectedChannel(true);
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

        self.closeLimitsModal = function () {
            $("#viewlimits-bill-payment" + self.incrementId).trigger("closeModal");
        };

        self.channelPopup = function () {
            const popup1 = document.querySelector("#channel-popup");

            if (popup1.isOpen()) {
                popup1.close();
            } else {
                popup1.open("#channel-disclaimer");
            }
        };

        self.createPayload = function () {

            for (let i = 0; i < billerConfiguration.length; i++) {
                if (billerConfiguration[i].BillerCode === self.billerName()) {

                    if (billerConfiguration[i].confirmScreenFields !== undefined) {
                        self.confirmScreenFields(billerConfiguration[i].confirmScreenFields);

                    }

                    self.enquiryRequired(billerConfiguration[i].enquiryRequired);
                    self.enquiryData().billerCode = self.quickRechargeDetails.billerName();

                    if (billerConfiguration[i].planMapping !== undefined) {

                        const item = {
                            label: billerConfiguration[i].planMapping.value,
                            value: self.quickRechargeDetails.planId()
                        };

                        self.enquiryData().billerSpecificationDetails.push(item);
                    }

                    if (billerConfiguration[i].amountMapping !== undefined) {

                        const item = {
                            label: billerConfiguration[i].amountMapping.value,
                            value: self.quickRechargeDetails.billAmount.amount()
                        };

                        self.enquiryData().billerSpecificationDetails.push(item);
                    }

                    break;
                }
            }

            if (self.relationshipDetails().length > 0) {
                for (let i = 0; i < self.relationshipDetails().length > 0; i++) {
                    if (self.relationshipDetails()[i].label !== "Note" && self.relationshipDetails()[i].label !== "Deno") {

                        const item = {
                            label: self.relationshipDetails()[i].label,
                            value: self.relationshipDetails()[i].value
                        };

                        self.enquiryData().billerSpecificationDetails.push(item);
                    }
                }
            }

        };

        self.doEnquiry = function () {

            self.enquiryData({
                token: "",
                partnerCode: "",
                billerCode: "",
                billerSpecificationDetails: []
            });

            self.transactionAmount(self.quickRechargeDetails.billAmount.amount);

            self.createPayload();

            if (self.enquiryRequired()) {

                QuickRechargeModel.doEnquiry(ko.toJSON(self.enquiryData())).done(function (data) {

                    if (data.billerPayment.errorCode !== "00") {
                        params.baseModel.showMessages(null, [self.resourceBundle.messages.checkDetails], "ERROR");

                    } else {

                        self.currentStage("REVIEW");
                    }
                });

                QuickRechargeModel.doEnquiry(ko.toJSON(self.enquiryData())).done(function (data) {

                    if (data.billerPayment.errorCode !== "00") {
                        params.baseModel.showMessages(null, [self.resourceBundle.messages.somethingWentWrong], "ERROR");
                    } else {

                        self.currentStage("REVIEW");
                    }
                });

            } else {

                self.currentStage("REVIEW");
            }
        };

        self.submit = function () {
            if (self.currentAccountType() === "CREDITCARD") {
                const date = params.baseModel.getDate();

                date.setMonth(self.expiryMonth() - 1);
                date.setYear(self.expiryYear());

                const y = date.getFullYear(),
                    m = date.getMonth(),
                    lastDay = new Date(y, m + 1, 0);

                self.quickRechargeDetails.cardExpiryDate(oj.IntlConverterUtils.dateToLocalIso(new Date(lastDay)));
            }

            self.quickRechargeDetails.customerName("CustomerName");

            if (self.quickRechargeDetails.payLater() === "false") {
                self.quickRechargeDetails.paymentDate(self.payNowDate());
            }

            if (self.quickRechargeDetails.payLater() === "true") {
                if (self.quickRechargeDetails.paymentDate()) {
                    self.quickRechargeDetails.paymentDate(oj.IntlConverterUtils.dateToLocalIso(new Date(self.quickRechargeDetails.paymentDate())));
                }
            }

            self.quickRechargeDetails.billPaymentRelDetails.removeAll();

            if (self.relationshipDetails().length > 0) {
                for (let i = 0; i < self.relationshipDetails().length; i++) {
                    self.quickRechargeDetails.billPaymentRelDetails.push({
                        labelId: self.relationshipDetails()[i].id,
                        value: self.relationshipDetails()[i].value()
                    });
                }
            }

            self.quickRechargeDetails.billerType("QUICK_RECHARGE");
            self.quickRechargeDetails.paymentType(self.currentAccountType());

            const tracker = document.getElementById("tracker");

            if (tracker.valid === "valid") {
                self.doEnquiry();
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        };
    };

    vm.prototype.dispose = function () {
        self.dataLoaded.dispose();
        self.categorySubscribe.dispose();
        self.locationSubscribe.dispose();
        self.billerSubscribe.dispose();
        self.additionalDetailsSubscribe.dispose();
        self.planIdSubscribe.dispose();
    };

    return vm;
});