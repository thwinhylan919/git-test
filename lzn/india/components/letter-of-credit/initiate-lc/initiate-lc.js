define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/initiate-lc",
    "ojs/ojaccordion",
    "ojs/ojcollapsible",
    "ojs/ojvalidation",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojknockout-validation",
    "ojs/ojdatetimepicker",
    "ojs/ojcheckboxset",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup",
    "ojs/ojmenu",
    "ojs/ojoption",
    "ojs/ojbutton"
], function (oj, ko, $, LetterOfCreditModel, locale) {
    "use strict";

    let self;
    const vm = function (params) {
        let i, j, totalGoodsAmount = 0;

        self = this;
        self.mode = ko.observable("CREATE");
        self.confirmScreenDetails = ko.observable();
        self.additionalBankDetails = ko.observable(null);
        self.availableWithDetails = ko.observable(null);
        self.creditAvailableWithSelected = ko.observable("SWIFTCODE");
        self.bankAddressOne = ko.observable(null);
        self.bankAddressTwo = ko.observable(null);
        self.bankAddressThree = ko.observable(null);
        self.applicationTracker = ko.observable(false);
        self.tradeApplicationScreenData = ko.observable();
        self.tradeApplicationScreenData(params.rootModel.params);
        self.updateTemplate = params.rootModel.params.updateTemplate ? params.rootModel.params.updateTemplate : ko.observable(false);
        self.updateDraft = params.rootModel.params.updateDraft ? params.rootModel.params.updateDraft : ko.observable(false);
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = locale;
        self.saveAsModalHeader = ko.observable("");
        self.modalHeader = ko.observable("");
        self.modalMessage = ko.observable("");
        self.deleteModalHeader = ko.observable("");
        self.deleteModalMessage = ko.observable("");
        self.beneIdOptions = ko.observable();
        self.templateName = ko.observable("");
        self.draftName = ko.observable("");
        self.tncValue = ko.observable([]);
        self.bicCodeError = ko.observable(false);
        params.dashboard.headerName(self.resourceBundle.heading.initiateLC);
        params.baseModel.registerElement("bank-look-up");
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("document-details", "letter-of-credit");
        params.baseModel.registerComponent("instructions-details", "letter-of-credit");
        params.baseModel.registerComponent("lc-details", "letter-of-credit");
        params.baseModel.registerComponent("shipment-details", "letter-of-credit");
        params.baseModel.registerComponent("review-lc", "letter-of-credit");
        params.baseModel.registerElement("floating-panel");
        params.baseModel.registerComponent("trade-finance-application-tracker", "trade-finance");
        params.baseModel.registerElement("modal-window");
        self.multiGoodsSupported = ko.observable(false);
        self.lcGroupValid = ko.observable();
        self.lcTracker = ko.observable();
        self.shipmentGroupValid = ko.observable();
        self.shipmentTracker = ko.observable();
        self.documentGroupValid = ko.observable();
        self.documentTracker = ko.observable();
        self.insturctionsValidationTracker = ko.observable();
        self.instructionsGroupValid = ko.observable();
        self.tncTracker = ko.observable();
        self.tncGroupValid = ko.observable();
        self.saveTempDraft = ko.observable();
        self.saveTempDraftGroupValid = ko.observable();
        self.confirmationInstructionBankCode = ko.observable();
        self.advisingThroughBankCode = ko.observable();
        self.confirmingBankCode = ko.observable();
        self.confirmationInstruction = ko.observable();
        self.requestedConfirmationParty = ko.observable();
        self.requestedConfirmationPartyMode = ko.observable();
        self.confirmationInstructionOptions = ko.observableArray([]);
        self.requestedConfirmationPartyOptions = ko.observableArray([]);
        self.requestedConfirmationPartyDetails = ko.observable();
        self.datasourceForGoods = ko.observableArray();
        self.requestedConfirmationPartyLoaded = ko.observable(false);
        self.bankDetailsLoaded = ko.observable(false);

        if (self.params.letterOfCreditDetails) {
            self.confirmationInstruction(self.params.letterOfCreditDetails.confirmationInstruction);
            self.requestedConfirmationParty(self.params.letterOfCreditDetails.requestedConfirmationParty);
            self.requestedConfirmationPartyMode(self.params.requestedConfirmationPartyMode);
            self.requestedConfirmationPartyDetails(self.params.requestedConfirmationPartyDetails);
            self.requestedConfirmationPartyMode(self.params.requestedConfirmationPartyMode);
            self.confirmationInstructionOptions = self.params.confirmationInstructionOptions;
            self.requestedConfirmationPartyOptions = self.params.requestedConfirmationPartyOptions;
            self.requestedConfirmationPartyLoaded(true);
            self.bankDetailsLoaded(true);
        }

        self.goodsArray = ko.observableArray([{
            id: ko.observable(1),
            code: ko.observable(""),
            description: ko.observable(""),
            units: ko.observable(""),
            pricePerUnit: ko.observable(""),
            licenseDetails: ko.observableArray([]),
            underLicense: ko.observable(),
            datasourceForLicense: ko.observable()
        }]);

        self.datasourceForGoods = new oj.ArrayTableDataSource(self.goodsArray, {
            idAttribute: "id"
        });

        self.menuItems = [{
            id: "draftSave",
            label: self.resourceBundle.common.labels.draftSave
        }, {
            id: "templateSave",
            label: self.resourceBundle.common.labels.templateSave
        }];

        self.menuClose = function () {
            $("#mediaFormatLauncher").removeClass("bold");
        };

        self.stages = [{
            stageName: self.resourceBundle.heading.lcDetails,
            expanded: ko.observable(true),
            editable: ko.observable(true),
            validated: ko.observable(),
            moduleName: "lc-details",
            disabled: ko.observable(false)
        },
        {
            stageName: self.resourceBundle.heading.shipmentDetails,
            expanded: ko.observable(false),
            editable: ko.observable(true),
            validated: ko.observable(),
            moduleName: "shipment-details",
            disabled: ko.observable(false)
        },
        {
            stageName: self.resourceBundle.heading.documents,
            expanded: ko.observable(false),
            editable: ko.observable(true),
            validated: ko.observable(),
            moduleName: "document-details",
            disabled: ko.observable(false)
        },
        {
            stageName: self.resourceBundle.heading.instructions,
            expanded: ko.observable(false),
            editable: ko.observable(true),
            validated: ko.observable(),
            moduleName: "instructions-details",
            disabled: ko.observable(false)
        }
        ];

        self.applicantName = ko.observable();

        self.applicantAddress = {
            line1: ko.observable(),
            line2: ko.observable(),
            line3: ko.observable(),
            country: ko.observable()
        };

        self.lookup = ko.observable(false);

        self.clearingCodeType = ko.observable("SWI").extend({
            notify: "always"
        });

        self.networkCode = ko.observable();
        self.docArray = ko.observableArray([]);
        self.attachedDocuments = ko.observableArray();
        self.deletedDocuments = ko.observableArray();
        self.showDocuments = ko.observable(false);
        self.shipmentDatePeriodRadioSetValue = ko.observable("latestdateofShipment");

        if (self.params && self.params.applicationTracker) {
            self.applicationTracker(self.params.applicationTracker);
        }

        if (self.params && self.params.mode) {
            self.mode(self.params.mode);
        }

        self.beneVisibility = ko.observable();

        const getNewKoModel = function () {
            const KoModel = LetterOfCreditModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.rootModelInstance = ko.observable(getNewKoModel());
        self.letterOfCreditDetails = self.rootModelInstance().TradeFinanceDetails;

        function mergeObject(obj1, obj2) {
            let element;

            for (element in obj2) {
                if (obj2[element] !== null && obj2[element]) {
                    if (obj2[element].constructor === Object) {
                        obj1[element] = mergeObject(obj1[element], obj2[element]);
                    } else if (element === "draftsRequired" || element === "transferable" || element === "partial" || element === "transShipment" || element === "revolving" || element === "cumulativeFrequency" || element === "autoReinstatement") {
                        obj1[element] = obj2[element].toString();
                    } else {
                        obj1[element] = obj2[element];
                    }
                }
            }

            return obj1;
        }

        self.draftArray = ko.observableArray([{
            id: 1,
            draftAmount: ko.observable(""),
            draftName: ko.observable(""),
            draweeBank: ko.observable(""),
            specifyOthers: ko.observable(""),
            tenor: ko.observable("0")
        }]);

        self.dropdownLabels = {
            branch: ko.observable(),
            country: ko.observable(),
            incoterm: ko.observable(),
            product: ko.observable(),
            counterPartyName: ko.observable()
        };

        self.dropdownListLoaded = {
            branches: ko.observable(false),
            chargingAccounts: ko.observable(false),
            countries: ko.observable(false),
            goods: ko.observable(false),
            incoterm: ko.observable(false),
            parties: ko.observable(false),
            products: ko.observable(false),
            counterPartyNames: ko.observable(false)
        };

        self.tncValidationTracker = ko.observable();
        self.templateNameValidationTracker = ko.observable();
        self.lcDetailsValidationTracker = ko.observable();
        self.shipmentDetailsValidationTracker = ko.observable();
        self.documentsValidationTracker = ko.observable();
        self.insturctionsValidationTracker = ko.observable();
        self.branchIDoptions = ko.observable();
        self.chargesAccountType = ko.observableArray();
        self.chargesAccountList = [];
        self.productTypeOptions = ko.observable();
        self.goodsTypeOptions = ko.observable();
        self.incotermTypeOptions = ko.observable();
        self.beneCountryoptions = ko.observable();
        self.partyIDoptions = ko.observable();
        self.templateType = null;
        self.currencyListOptions = ko.observableArray();
        self.clauseTableArray = ko.observableArray();
        self.minEffectiveDate = ko.observable();

        self.remainingDays = ko.computed(function () {
            if (self.letterOfCreditDetails.applicationDate() !== null && self.letterOfCreditDetails.expiryDate() !== null) {
                const curDate = new Date(self.letterOfCreditDetails.applicationDate()),
                    expiryDate = new Date(self.letterOfCreditDetails.expiryDate());
                let daysBeforeExpiryDate = parseInt((expiryDate - curDate) / (1000 * 60 * 60 * 24));

                daysBeforeExpiryDate = daysBeforeExpiryDate + 1;

                return daysBeforeExpiryDate;
            }

            return 365;
        });

        self.dataLoaded = ko.computed(function () {
            return self.dropdownListLoaded.branches() && self.dropdownListLoaded.chargingAccounts() && self.dropdownListLoaded.goods() && self.dropdownListLoaded.incoterm() && self.dropdownListLoaded.parties() && self.dropdownListLoaded.counterPartyNames() && self.dropdownListLoaded.products();
        });

        self.fetchLists = function () {
            LetterOfCreditModel.fetchProduct().done(function (productData) {

                if (productData.lcProductDTOList.length > 0) {
                    if (productData.lcProductDTOList[0].multiGoodsConfig && productData.lcProductDTOList[0].multiGoodsConfig === "Y") {
                        self.multiGoodsSupported(true);
                    }
                }

                const products = productData.lcProductDTOList.map(function (data) {
                    return {
                        value: data.id,
                        label: data.name
                    };
                });

                self.productTypeOptions(products);
                self.dropdownListLoaded.products(true);
            });

            LetterOfCreditModel.fetchBeneName().done(function (beneData) {
                const beneficiary = beneData.beneficiaryDTOs.map(function (data) {
                    return {
                        value: data.id,
                        label: data.nickName
                    };
                });

                self.beneIdOptions(beneficiary);
                self.dropdownListLoaded.counterPartyNames(true);
            });

            LetterOfCreditModel.fetchGoods().done(function (goodsData) {
                const goods = goodsData.goodsList.map(function (data) {
                    return {
                        description: data.description,
                        value: data.code,
                        label: data.code,
                        underLicense: data.underLicense
                    };
                });

                self.goodsTypeOptions(goods);
                self.dropdownListLoaded.goods(true);
            });

            LetterOfCreditModel.getAccountDetail().done(function (accountData) {
                self.chargesAccountType.removeAll();

                if (accountData.accounts) {
                    accountData.accounts = params.baseModel.sortLib(accountData.accounts, "accountNickname");

                    accountData.accounts.map(function (item) {
                        item.label = self.getDisplayText(item.id.displayValue, item.accountNickname);
                        item.value = item.id.value;

                        return item;
                    });

                    self.chargesAccountList = accountData.accounts;

                    let result = params.baseModel.groupBy(accountData.accounts, [
                        "partyId.value",
                        "module"
                    ], function (item) {
                        return [
                            item.partyName,
                            self.resourceBundle.labels[item.module]
                        ];
                    });

                    if (result.length === 1 && result[0].children.length === 1) {
                        result = [result[0].children[0]];
                    }

                    ko.utils.arrayPushAll(self.chargesAccountType, result);
                }

                self.dropdownListLoaded.chargingAccounts(true);
            });

            LetterOfCreditModel.fetchIncoterm().done(function (incotermData) {
                const incotermList = incotermData.incotermList.map(function (data) {
                    return {
                        value: data.code,
                        label: data.description
                    };
                });

                self.incotermTypeOptions(incotermList);
                self.dropdownListLoaded.incoterm(true);
            });

            LetterOfCreditModel.fetchBeniCountry().done(function (taskData) {
                const countries = taskData.enumRepresentations[0].data.map(function (data) {
                    return {
                        value: data.code,
                        label: data.description
                    };
                }).filter(function (data) {
                    return data.label && data.value;
                });

                self.beneCountryoptions(countries);
                self.dropdownListLoaded.countries(true);
            });

            LetterOfCreditModel.fetchBranch().done(function (branchData) {
                const branches = branchData.branchAddressDTO.map(function (data) {
                    return {
                        value: data.id,
                        label: data.branchName
                    };
                });

                self.branchIDoptions(branches);
                self.dropdownListLoaded.branches(true);
            });

            LetterOfCreditModel.fetchParty().done(function (data) {
                LetterOfCreditModel.fetchPartyRelations().done(function (partyData) {
                    const parties = [];

                    parties.push({
                        label: data.party.id.displayValue,
                        value: data.party.id.value
                    });

                    const mappedParties = partyData.partyToPartyRelationship;

                    for (i = 0; i < mappedParties.length; i++) {
                        parties.push({
                            value: mappedParties[i].relatedParty.value,
                            label: mappedParties[i].relatedParty.displayValue
                        });
                    }

                    self.partyIDoptions(parties);
                    self.dropdownListLoaded.parties(true);
                });
            });
        };

        self.fetchLists();

        self.getDisplayText = function (accountNumber, nickName) {
            if (nickName) {
                return params.baseModel.format(self.resourceBundle.labels.accountsDropdown, {
                    displayValue: accountNumber,
                    nickname: nickName
                });
            }

            return accountNumber;
        };

        self.changeTemplateType = function (event) {
            if (event.detail.value === "PUBLIC") {
                self.letterOfCreditDetails.visibility("PUBLIC");
            } else {
                self.letterOfCreditDetails.visibility("PRIVATE");
            }
        };

        self.createModelFromArray = function () {
            self.letterOfCreditDetails.attachedDocuments(self.attachedDocuments());

            if (self.deletedDocuments().length > 0) {
                for (j = 0; j < self.deletedDocuments().length; j++) {
                    LetterOfCreditModel.deleteDocument(self.deletedDocuments()[j].contentId.value);
                }
            }

            self.letterOfCreditDetails.billingDrafts.removeAll();
            self.letterOfCreditDetails.document.removeAll();

            if (self.letterOfCreditDetails.draftsRequired() === "true") {
                for (i = 0; i < self.draftArray().length; i++) {
                    self.letterOfCreditDetails.billingDrafts.push({
                        tenor: self.draftArray()[i].tenor(),
                        amount: {
                            currency: self.letterOfCreditDetails.amount.currency(),
                            amount: self.draftArray()[i].draftAmount()
                        },
                        otherInformation: self.draftArray()[i].specifyOthers(),
                        draweeBankId: self.draftArray()[i].draweeBank()
                    });
                }
            }

            for (i = 0; i < self.docArray().length; i++) {
                const selectedClauses = [];

                if (self.docArray()[i].docSelected()[0] === "true") {
                    for (j = 0; j < self.docArray()[i].clause.length; j++) {
                        if (self.docArray()[i].clause[j].selected()[0] === "true") {
                            selectedClauses.push({
                                id: self.docArray()[i].clause[j].id,
                                description: self.docArray()[i].clause[j].description(),
                                name: self.docArray()[i].clause[j].name
                            });
                        }
                    }

                    if (selectedClauses.length > 0) {
                        self.letterOfCreditDetails.document.push({
                            id: self.docArray()[i].id,
                            name: self.docArray()[i].name,
                            originals: self.docArray()[i].originals() + "/" + self.docArray()[i].originalsOutOff(),
                            copies: self.docArray()[i].copies(),
                            clause: selectedClauses,
                            docType: self.docArray()[i].docType
                        });
                    } else {
                        self.letterOfCreditDetails.document.push({
                            id: self.docArray()[i].id,
                            name: self.docArray()[i].name,
                            originals: self.docArray()[i].originals() + "/" + self.docArray()[i].originalsOutOff(),
                            copies: self.docArray()[i].copies(),
                            docType: self.docArray()[i].docType
                        });
                    }
                }
            }

            self.letterOfCreditDetails.goods = [];

            const licenseDetailsList = [];

            for (i = 0; i < self.goodsArray().length; i++) {
                const goodsArray = [];

                for (j = 0; j < self.goodsArray()[i].licenseDetails().length; j++) {
                    goodsArray.push({
                        licenseNumber: self.goodsArray()[i].licenseDetails()[j].licenseNumber(),
                        type: self.goodsArray()[i].licenseDetails()[j].type(),
                        currency: self.goodsArray()[i].licenseDetails()[j].currency(),
                        amount: self.goodsArray()[i].licenseDetails()[j].amount(),
                        balance: self.goodsArray()[i].licenseDetails()[j].balance(),
                        issueDate: self.goodsArray()[i].licenseDetails()[j].issueDate(),
                        expiryDate: self.goodsArray()[i].licenseDetails()[j].expiryDate()
                    });
                }

                licenseDetailsList.push({ goods: goodsArray });
            }

            if (self.multiGoodsSupported() === false) {
                if (self.letterOfCreditDetails.shipmentDetails.goodsCode()) {
                    self.letterOfCreditDetails.goods.push({
                        code: self.letterOfCreditDetails.shipmentDetails.goodsCode(),
                        description: self.letterOfCreditDetails.shipmentDetails.description(),
                        noOfUnits: null,
                        pricePerUnit: null,
                        underLicense: self.goodsArray()[0].underLicense() ? self.goodsArray()[0].underLicense() : ko.observable(false),
                        licenseDetails: licenseDetailsList[0].goods !== "" ? licenseDetailsList[0].goods : null
                    });
                }
            } else {
                for (i = 0; i < self.goodsArray().length; i++) {
                    if (self.goodsArray()[i].code()) {
                        self.letterOfCreditDetails.goods.push({
                            code: self.goodsArray()[i].code(),
                            description: self.goodsArray()[i].description(),
                            noOfUnits: self.goodsArray()[i].units() !== "" ? self.goodsArray()[i].units() : null,
                            pricePerUnit: self.goodsArray()[i].pricePerUnit() !== "" ? self.goodsArray()[i].pricePerUnit() : null,
                            underLicense: self.goodsArray()[i].underLicense() ? self.goodsArray()[i].underLicense() : ko.observable(false),
                            licenseDetails: licenseDetailsList[i].goods !== "" ? licenseDetailsList[i].goods : null
                        });
                    }
                }
            }
        };

        function validate() {
            let validationFlag = true;
            const lcTracker = document.getElementById("lcTracker");

            if (lcTracker.valid === "valid") {
                self.stages[0].validated(true);
            } else {
                self.stages[0].validated(false);
                validationFlag = false;
                lcTracker.showMessages();
                lcTracker.focusOn("@firstInvalidShown");
            }

            const shipmentTracker = document.getElementById("shipmentTracker");

            if (shipmentTracker.valid === "valid") {
                self.stages[1].validated(true);
            } else {
                self.stages[1].validated(false);
                validationFlag = false;
                shipmentTracker.showMessages();
                shipmentTracker.focusOn("@firstInvalidShown");
            }

            const documentTracker = document.getElementById("documentTracker");

            if (documentTracker.valid === "valid") {
                self.stages[2].validated(true);
            } else {
                self.stages[2].validated(false);
                validationFlag = false;
                documentTracker.showMessages();
                documentTracker.focusOn("@firstInvalidShown");
            }

            const insturctionsValidationTracker = document.getElementById("insturctionsValidationTracker");

            if (insturctionsValidationTracker.valid === "valid") {
                self.stages[3].validated(true);
            } else {
                self.stages[3].validated(false);
                validationFlag = false;
                insturctionsValidationTracker.showMessages();
                insturctionsValidationTracker.focusOn("@firstInvalidShown");
            }

            return validationFlag;
        }

        self.validateInterCode = {
            validate: function (value) {
                if (value.length < 1) {
                    self.bicCodeError(true);
                } else if (value.length > 20 || !/^[a-zA-Z0-9]+$/.test(value)) {
                    self.bicCodeError(true);
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resourceBundle.tradeFinanceErrors.instructionDetails.invalidSwiftId));
                } else {
                    self.bicCodeError(false);
                }
            }
        };

        self.openlcLookup = function () {
            self.clearingCodeType("SWI");
            $("#openlclookup").trigger("openModal");
        };

        self.openinstructionLookup = function () {
            self.clearingCodeType("SWI");
            $("#openinstructionLookup").trigger("openModal");
        };

        self.openConfirmationinstructionLookup = function () {
            self.clearingCodeType("SWI");
            $("#openConfirmationinstructionLookup").trigger("openModal");
        };

        function triggerAction(actionType, modalName) {
            if (actionType === "DRAFT" && self.updateDraft && self.updateDraft()) {
                self.update();
            } else if (actionType === "TEMPLATE" || actionType === "DRAFT") {
                $(modalName).trigger("openModal");
            } else {

                const parameters = {
                    mode: "REVIEW",
                    letterOfCreditDetails: ko.mapping.toJS(self.letterOfCreditDetails),
                    multiGoodsSupported: self.multiGoodsSupported,
                    dropdownLabels: self.dropdownLabels,
                    confirmScreenDetails: self.confirmScreenDetails,
                    requestedConfirmationPartyMode: self.requestedConfirmationPartyMode(),
                    confirmationInstructionOptions: self.confirmationInstructionOptions,
                    requestedConfirmationPartyOptions: self.requestedConfirmationPartyOptions,
                    requestedConfirmationPartyDetails: self.requestedConfirmationPartyDetails()
                };

                params.dashboard.loadComponent("review-lc", parameters);
            }
        }

        function validateBICCodes(actionType, modalName) {
            if (self.bankAddressOne() === null && self.letterOfCreditDetails.availableWith() !== null && self.letterOfCreditDetails.availableWith() !== "" && self.availableWithDetails() === null) {
                LetterOfCreditModel.getBankDetailsBIC(self.letterOfCreditDetails.availableWith()).done(function (data) {
                    self.availableWithDetails(data);
                    self.letterOfCreditDetails.availableWith(self.availableWithDetails().code);

                    if (self.letterOfCreditDetails.swiftId() !== null && self.letterOfCreditDetails.swiftId() !== "" && self.additionalBankDetails() === null) {
                        LetterOfCreditModel.getBankDetailsBIC(self.letterOfCreditDetails.swiftId()).done(function (data) {
                            self.additionalBankDetails(data);
                            self.letterOfCreditDetails.swiftId(self.additionalBankDetails().code);
                            triggerAction(actionType, modalName);
                        }).fail(function () {
                            self.letterOfCreditDetails.swiftId(null);
                        });
                    } else {
                        triggerAction(actionType, modalName);
                    }
                }).fail(function () {
                    self.letterOfCreditDetails.availableWith(null);
                });
            } else if (self.letterOfCreditDetails.swiftId() !== null && self.letterOfCreditDetails.swiftId() !== "" && self.additionalBankDetails() === null) {
                LetterOfCreditModel.getBankDetailsBIC(self.letterOfCreditDetails.swiftId()).done(function (data) {
                    self.additionalBankDetails(data);
                    self.letterOfCreditDetails.swiftId(self.additionalBankDetails().code);
                    triggerAction(actionType, modalName);
                }).fail(function () {
                    self.letterOfCreditDetails.swiftId(null);
                });
            } else {
                triggerAction(actionType, modalName);
            }
        }

        self.initiateLC = function () {

            if (self.multiGoodsSupported() === true) {
                for (i = 0; i < self.goodsArray().length - 1; i++) {

                    for (j = i + 1; j < self.goodsArray().length; j++) {
                        if (self.goodsArray()[i].code() === self.goodsArray()[j].code()) {
                            const s = [];

                            s.push(self.resourceBundle.shipmentDetails.labels.duplicateError);
                            params.baseModel.showMessages(null, s, "ERROR");

                            return;
                        }

                    }
                }

                totalGoodsAmount = 0;

                for (i = 0; i < self.goodsArray().length; i++) {
                    totalGoodsAmount = totalGoodsAmount + (self.goodsArray()[i].units() * self.goodsArray()[i].pricePerUnit());
                }

                if (totalGoodsAmount > 0 && (totalGoodsAmount !== self.letterOfCreditDetails.amount.amount())) {
                    params.baseModel.showMessages(null, [self.resourceBundle.tradeFinanceErrors.shipmentDetails.invalidGoodsAmount], "ERROR");

                    return;
                }
            }

            self.createModelFromArray();
            self.letterOfCreditDetails.state("INITIATED");
            self.letterOfCreditDetails.paymentClause("RED");
            self.letterOfCreditDetails.visibility("PRIVATE");

            if (self.bankAddressOne() !== null && self.bankAddressOne() !== "") {
                let final = self.bankAddressOne();

                if (self.bankAddressTwo() !== null && self.bankAddressTwo() !== "") {
                    final = final + "_" + self.bankAddressTwo();
                }

                if (self.bankAddressThree() !== null && self.bankAddressThree() !== "") {
                    final = final + "_" + self.bankAddressThree();
                }

                self.letterOfCreditDetails.bankAddress(final);
            }

            if (validate()) {
                const tncTracker = document.getElementById("tncTracker");

                if (tncTracker.valid === "valid") {
                    validateBICCodes(self.resourceBundle.labels.initiateLC);
                } else {
                    tncTracker.showMessages();
                    tncTracker.focusOn("@firstInvalidShown");
                }
            }
        };

        if (self.mode() === "EDIT") {
            self.letterOfCreditDetails = ko.mapping.fromJS(mergeObject(ko.toJS(self.letterOfCreditDetails), ko.toJS(self.params.letterOfCreditDetails)));

            for (i = 0; i < self.stages.length; i++) {
                self.stages[i].editable(true);
                self.stages[i].expanded(true);
                self.stages[i].disabled(true);
            }

            self.deletedDocuments.removeAll();

            if (self.letterOfCreditDetails.bankAddress() === null) {
                self.creditAvailableWithSelected("SWIFTCODE");
            } else {
                self.creditAvailableWithSelected("BANKADDRESS");

                const input = self.letterOfCreditDetails.bankAddress(),
                    splitStringArray = input.split("_");

                self.bankAddressOne(splitStringArray[0]);

                if (splitStringArray[1]) {
                    self.bankAddressTwo(splitStringArray[1]);
                }

                if (splitStringArray[2]) {
                    self.bankAddressThree(splitStringArray[2]);
                }
            }

            if (self.letterOfCreditDetails.attachedDocuments() && self.letterOfCreditDetails.attachedDocuments().length > 0) {
                self.attachedDocuments(ko.mapping.toJS(self.letterOfCreditDetails.attachedDocuments()));
            }

            if (self.letterOfCreditDetails.goods && self.letterOfCreditDetails.goods().length > 0) {
                self.goodsArray.removeAll();

                for (i = 0; i < self.letterOfCreditDetails.goods().length; i++) {
                    const licenseArray = ko.observableArray([]);

                    if (self.letterOfCreditDetails.goods()[i].licenseDetails && self.letterOfCreditDetails.goods()[i].licenseDetails().length > 0 &&
                        self.letterOfCreditDetails.goods()[i].underLicense() === true) {
                        for (j = 0; j < self.letterOfCreditDetails.goods()[i].licenseDetails().length; j++) {
                            licenseArray.push({
                                id: ko.observable(j + 1),
                                licenseNumber: self.letterOfCreditDetails.goods()[i].licenseDetails()[j].licenseNumber,
                                type: self.letterOfCreditDetails.goods()[i].licenseDetails()[j].type,
                                currency: self.letterOfCreditDetails.goods()[i].licenseDetails()[j].currency,
                                amount: self.letterOfCreditDetails.goods()[i].licenseDetails()[j].amount,
                                balance: self.letterOfCreditDetails.goods()[i].licenseDetails()[j].balance,
                                issueDate: self.letterOfCreditDetails.goods()[i].licenseDetails()[j].issueDate,
                                expiryDate: self.letterOfCreditDetails.goods()[i].licenseDetails()[j].expiryDate
                            });
                        }
                    }

                    self.goodsArray.push({
                        id: ko.observable(i + 1),
                        code: self.letterOfCreditDetails.goods()[i].code,
                        description: self.letterOfCreditDetails.goods()[i].description,
                        units: self.letterOfCreditDetails.goods()[i].noOfUnits ? self.letterOfCreditDetails.goods()[i].noOfUnits : ko.observable(null),
                        pricePerUnit: self.letterOfCreditDetails.goods()[i].pricePerUnit ? self.letterOfCreditDetails.goods()[i].pricePerUnit : ko.observable(null),
                        licenseDetails: licenseArray ? licenseArray : ko.observableArray([]),
                        underLicense: self.letterOfCreditDetails.goods()[i].underLicense ? self.letterOfCreditDetails.goods()[i].underLicense : ko.observable(true),
                        datasourceForLicense: ko.observable(new oj.ArrayTableDataSource(licenseArray, { idAttribute: "id" }))
                    });
                }

                self.datasourceForGoods = new oj.ArrayTableDataSource(self.goodsArray, {
                    idAttribute: "id"
                });
            }
        }

        self.hideInitiateLC = function () {
            $("#initiateLC").hide();
        };

        self.hideDeleteTemplate = function () {
            $("#deleteTemplate").hide();
        };

        self.createNewTemplate = function () {
            $("#updateTemplate").hide();
            self.templateName("");
            $("#saveAsDialog").trigger("openModal");
        };

        self.saveAsTemplate = function () {
            if (self.letterOfCreditDetails.confirmationInstruction() === "WITHOUT") {
                self.letterOfCreditDetails.requestedConfirmationPartyDetails = null;
            } else if (self.letterOfCreditDetails.confirmationInstruction() !== "WITHOUT" && self.requestedConfirmationPartyDetails()) {
                if (self.letterOfCreditDetails.requestedConfirmationParty() === "ATB" && self.requestedConfirmationPartyDetails().code) {
                    self.letterOfCreditDetails.advisingThroughBankCode(self.requestedConfirmationPartyDetails().code);
                    self.letterOfCreditDetails.requestedConfirmationPartyDetails = null;
                }
                else if (self.letterOfCreditDetails.requestedConfirmationParty() === "COB" && self.requestedConfirmationPartyDetails().code) {
                    self.letterOfCreditDetails.confirmingBankCode(self.requestedConfirmationPartyDetails().code);
                    self.letterOfCreditDetails.requestedConfirmationPartyDetails = null;
                }
            }

            if (self.multiGoodsSupported() === true) {
                for (i = 0; i < self.goodsArray().length - 1; i++) {

                    for (j = i + 1; j < self.goodsArray().length; j++) {
                        if (self.goodsArray()[i].code() === self.goodsArray()[j].code()) {
                            const s = [];

                            s.push(self.resourceBundle.shipmentDetails.labels.duplicateError);
                            params.baseModel.showMessages(null, s, "ERROR");

                            return;
                        }

                    }
                }

                totalGoodsAmount = 0;

                for (i = 0; i < self.goodsArray().length; i++) {
                    totalGoodsAmount = totalGoodsAmount + (self.goodsArray()[i].units() * self.goodsArray()[i].pricePerUnit());
                }

                if (totalGoodsAmount > 0 && (totalGoodsAmount !== self.letterOfCreditDetails.amount.amount())) {
                    params.baseModel.showMessages(null, [self.resourceBundle.tradeFinanceErrors.shipmentDetails.invalidGoodsAmount], "ERROR");

                    return;
                }
            }

            if (params.baseModel.small()) {
                document.querySelector("#panelDD").dispatchEvent(new CustomEvent("closeFloatingPanel"));
            }

            if (validate()) {
                self.createModelFromArray();
                self.saveAsModalHeader(self.resourceBundle.common.labels.saveTemplate);
                self.letterOfCreditDetails.state("TEMPLATE");
                self.letterOfCreditDetails.paymentClause("RED");

                let modalName = "#saveAsDialog";

                if (self.updateTemplate && self.updateTemplate()) {
                    modalName = "#updateTemplate";
                    self.templateName(self.letterOfCreditDetails.name());
                } else {
                    self.templateName("");
                }

                validateBICCodes("TEMPLATE", modalName);
            }
        };

        self.saveAsDraft = function () {
            if (self.letterOfCreditDetails.confirmationInstruction() === "WITHOUT") {
                self.letterOfCreditDetails.requestedConfirmationPartyDetails = null;
            } else if (self.letterOfCreditDetails.confirmationInstruction() !== "WITHOUT" && self.requestedConfirmationPartyDetails()) {
                if (self.letterOfCreditDetails.requestedConfirmationParty() === "ATB" && self.requestedConfirmationPartyDetails().code) {
                    self.letterOfCreditDetails.advisingThroughBankCode(self.requestedConfirmationPartyDetails().code);
                    self.letterOfCreditDetails.requestedConfirmationPartyDetails = null;
                }
                else if (self.letterOfCreditDetails.requestedConfirmationParty() === "COB" && self.requestedConfirmationPartyDetails().code) {
                    self.letterOfCreditDetails.confirmingBankCode(self.requestedConfirmationPartyDetails().code);
                    self.letterOfCreditDetails.requestedConfirmationPartyDetails = null;
                }
            }

            if (self.multiGoodsSupported() === true) {
                for (i = 0; i < self.goodsArray().length - 1; i++) {

                    for (j = i + 1; j < self.goodsArray().length; j++) {
                        if (self.goodsArray()[i].code() === self.goodsArray()[j].code()) {
                            const s = [];

                            s.push(self.resourceBundle.shipmentDetails.labels.duplicateError);
                            params.baseModel.showMessages(null, s, "ERROR");

                            return;
                        }

                    }
                }
            }

            if (params.baseModel.small()) {
                document.querySelector("#panelDD").dispatchEvent(new CustomEvent("closeFloatingPanel"));
            }

            self.createModelFromArray();
            self.saveAsModalHeader(self.resourceBundle.common.labels.saveDraft);
            self.letterOfCreditDetails.state("DRAFT");

            if (!(self.updateDraft && self.updateDraft())) {
                self.draftName("");
            }

            const modalName = "#saveAsDialog";

            validateBICCodes("DRAFT", modalName);
        };

        self.save = function () {
            if (params.baseModel.small()) {
                document.querySelector("#panelDD").dispatchEvent(new CustomEvent("closeFloatingPanel"));
            }

            const saveTempDraft = document.getElementById("saveTempDraft");

            if (saveTempDraft.valid === "valid") {
                $("#saveAsDialog").hide();

                if (self.letterOfCreditDetails.state() === "TEMPLATE") {
                    self.letterOfCreditDetails.name(self.templateName());
                } else {
                    self.letterOfCreditDetails.name(self.draftName());
                }

                if (self.bankAddressOne() !== null && self.bankAddressOne() !== "") {
                    let final = self.bankAddressOne();

                    if (self.bankAddressTwo() !== null && self.bankAddressTwo() !== "") {
                        final = final + "_" + self.bankAddressTwo();
                    }

                    if (self.bankAddressThree() !== null && self.bankAddressThree() !== "") {
                        final = final + "_" + self.bankAddressThree();
                    }

                    self.letterOfCreditDetails.bankAddress(final);
                }

                LetterOfCreditModel.initiateLC(ko.mapping.toJSON(self.letterOfCreditDetails)).done(function () {
                    if (self.letterOfCreditDetails.state() === "TEMPLATE") {
                        self.modalHeader(self.resourceBundle.common.labels.templateSaveHeader);

                        self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.templateSaveMsg, {
                            tempName: self.letterOfCreditDetails.name()
                        }));

                        $("#initiateLC").trigger("openModal");
                    } else {
                        self.modalHeader(self.resourceBundle.common.labels.draftSaveHeader);

                        self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.draftSaveMsg, {
                            draftName: self.letterOfCreditDetails.name()
                        }));

                        $("#initiateLC").trigger("openModal");
                    }
                });
            } else {
                saveTempDraft.showMessages();
                saveTempDraft.focusOn("@firstInvalidShown");
            }
        };

        self.update = function () {
            $("#updateTemplate").hide();

            if (self.bankAddressOne() !== null && self.bankAddressOne() !== "") {
                let final = self.bankAddressOne();

                if (self.bankAddressTwo() !== null && self.bankAddressTwo() !== "") {
                    final = final + "_" + self.bankAddressTwo();
                }

                if (self.bankAddressThree() !== null && self.bankAddressThree() !== "") {
                    final = final + "_" + self.bankAddressThree();
                }

                self.letterOfCreditDetails.bankAddress(final);
            }

            LetterOfCreditModel.updateTemplate(self.letterOfCreditDetails.id(), ko.mapping.toJSON(self.letterOfCreditDetails)).done(function () {
                if (self.letterOfCreditDetails.state() === "TEMPLATE") {
                    self.modalHeader(self.resourceBundle.common.labels.templateUpdateHeader);

                    self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.templateUpdateMsg, {
                        tempName: self.letterOfCreditDetails.name()
                    }));

                    $("#initiateLC").trigger("openModal");
                } else {
                    self.modalHeader(self.resourceBundle.common.labels.draftUpdateHeader);

                    self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.draftUpdateMsg, {
                        draftName: self.letterOfCreditDetails.name()
                    }));

                    $("#initiateLC").trigger("openModal");
                }
            });
        };

        self.confirm = function () {
            let hostReferenceNumber = null;

            LetterOfCreditModel.initiateLC(ko.mapping.toJSON(self.letterOfCreditDetails)).done(function (data, status, jqXhr) {
                if (data.letterOfCredit && data.letterOfCredit.applicationNumber) {
                    hostReferenceNumber = data.letterOfCredit.applicationNumber;
                }
                else if (data.letterOfCredit && data.letterOfCredit.id) {
                    hostReferenceNumber = data.letterOfCredit.id;
                } else {
                    hostReferenceNumber = null;
                }

                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    hostReferenceNumber: hostReferenceNumber,
                    transactionName: self.resourceBundle.heading.initiateLC,
                    confirmScreenExtensions: {
                        isSet: true,
                        taskCode: "TF_N_CLC",
                        confirmScreenDetails: self.confirmScreenDetails(),
                        template: "confirm-screen/trade-finance"
                    }
                });
            });
        };

        self.confirmDelete = function () {
            if (params.baseModel.small()) {
                document.querySelector("#panelDD").dispatchEvent(new CustomEvent("closeFloatingPanel"));
            }

            if (self.letterOfCreditDetails.state() === "TEMPLATE") {
                self.deleteModalHeader(self.resourceBundle.common.labels.deleteTemplateHeader);
                self.deleteModalMessage(self.resourceBundle.common.labels.deleteTemplateMessage);
            } else if (self.letterOfCreditDetails.state() === "DRAFT") {
                self.deleteModalHeader(self.resourceBundle.common.labels.deleteDraftHeader);
                self.deleteModalMessage(self.resourceBundle.common.labels.deleteDraftMessage);
            } else if (self.letterOfCreditDetails.state() === "INITIATED" && self.compName() === "template-list") {
                self.deleteModalHeader(self.resourceBundle.common.labels.deleteTemplateHeader);
                self.deleteModalMessage(self.resourceBundle.common.labels.deleteTemplateMessage);
            } else if (self.letterOfCreditDetails.state() === "INITIATED" && self.compName() !== "template-list") {
                self.deleteModalHeader(self.resourceBundle.common.labels.deleteDraftMessage);
                self.deleteModalMessage(self.resourceBundle.common.labels.deleteDraftMessage);
            }

            $("#deleteTemplate").trigger("openModal");
        };

        self.delete = function () {
            $("#deleteTemplate").hide();

            LetterOfCreditModel.deleteLC(self.params.letterOfCreditDetails.id).done(function (data) {
                if (data.status.result === "SUCCESSFUL") {
                    let message;

                    if (self.letterOfCreditDetails.state() === "TEMPLATE") {
                        message = params.baseModel.format(self.resourceBundle.common.labels.templateDeleteMsg, {
                            tempName: self.letterOfCreditDetails.name()
                        });
                    } else if (self.letterOfCreditDetails.state() === "DRAFT") {
                        message = params.baseModel.format(self.resourceBundle.common.labels.draftDeleteMsg, {
                            draftName: self.letterOfCreditDetails.name()
                        });
                    }

                    params.baseModel.showMessages(null, [message], "SUCCESS", self.goBack());
                }
            });
        };

        self.menuItemSelect = function (data, event) {
            data = event.target.value;

            const menuId = data.id;

            if (menuId === "draftSave") {
                self.saveAsDraft();
            } else if (menuId === "templateSave") {
                self.saveAsTemplate();
            }
        };

        self.cancel = function () {
            $("#saveAsDialog").hide();
        };

        self.goBack = function () {
            delete self.letterOfCreditDetails;
            params.dashboard.loadComponent("lc-nav-bar", self);
        };

        self.expandChangeHandler = function (event) {
            if (event.detail.value === true) {
                for (i = 0; i < self.stages.length; i++) {
                    if (event.currentTarget.firstElementChild.innerText.trim() === self.stages[i].stageName) {
                        self.stages[i].expanded(true);
                    }
                }
            } else {
                for (i = 0; i < self.stages.length; i++) {
                    if (event.currentTarget.firstElementChild.innerText.trim() === self.stages[i].stageName) {
                        self.stages[i].expanded(false);
                    }
                }
            }
        };

        self.goBackToApplicationTracker = function () {
            const parameters = {
                tradeApplicationScreenData: self.tradeApplicationScreenData(),
                selectedItem: self.tradeApplicationScreenData().selectedItem,
                selectedCustomerName: self.tradeApplicationScreenData().selectedCustomerName,
                selectedCustomerId: self.tradeApplicationScreenData().selectedCustomerId,
                selectedApplicationType: self.tradeApplicationScreenData().selectedApplicationType,
                selectedApplicationDuration: self.tradeApplicationScreenData().selectedApplicationDuration,
                tradeApplications: self.tradeApplicationScreenData().tradeApplications,
                dataAvailable: self.tradeApplicationScreenData().dataAvailable
            };

            params.dashboard.loadComponent("trade-finance-application-tracker", parameters);
        };

        self.termsAndConditions = function () {
            $("#tncDialog").trigger("openModal");
        };

        self.close = function () {
            $("#tncDialog").hide();
        };

        self.showFloatingPanel = function () {
            $("#panelDD")[0].dispatchEvent(new CustomEvent("openFloatingPanel"));
        };
    };

    vm.prototype.dispose = function () {
        self.remainingDays.dispose();
        self.dataLoaded.dispose();
    };

    return vm;
});
