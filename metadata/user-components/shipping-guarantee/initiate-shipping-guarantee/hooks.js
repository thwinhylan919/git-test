define([
    "./model",
    "jquery",
    "knockout",
    "ojs/ojcore"
], function (Model, $, ko, oj) {
    "use strict";

    return function () {
        let self,
         params;

                function tradeIncotermsgetCall(q, sortBy, count, payload, config) {
            return Model.tradeIncotermsget(q, sortBy, count, payload, config);
        }

                function tradeGoodsgetCall(queryParams, sortBy, count, payload, config) {
            return Model.tradeGoodsget(queryParams, sortBy, count, payload, config);
        }

                function productsshippingGuaranteegetCall(paymentType, revolving, payload, config) {
            return Model.productsshippingGuaranteeget(paymentType, revolving, payload, config);
        }

                function productsshippingGuaranteeproductIdgetCall(productId, productType, payload, config) {
            return Model.productsshippingGuaranteeproductIdget(productId, productType, payload, config);
        }

                function beneficiariesgetCall(beneName, transactionType, nickName, payload, config) {
            return Model.beneficiariesget(beneName, transactionType, nickName, payload, config);
        }

                function mepartygetCall(payload, config) {
            return Model.mepartyget(payload, config);
        }

                function mepartyrelationsgetCall(payload, config) {
            return Model.mepartyrelationsget(payload, config);
        }

                function locationscountrycountrycitycitybranchCodegetCall(country, city, payload, config) {
            return Model.locationscountrycountrycitycitybranchCodeget(country, city, payload, config);
        }

                function enumerationscountrygetCall(payload, config) {
            return Model.enumerationscountryget(payload, config);
        }

                function accountsdemandDepositgetCall(status, taskCode, module, expand, excludeBaseCurrency, lmEnabled, accountCurrency, productType, accountType, payload, config) {
            return Model.accountsdemandDepositget(status, taskCode, module, expand, excludeBaseCurrency, lmEnabled, accountCurrency, productType, accountType, payload, config);
        }

                function financialInstitutionbicCodeDetailsBICCodegetCall(BICCode, payload, config) {
            return Model.financialInstitutionbicCodeDetailsBICCodeget(BICCode, payload, config);
        }

                function shippingGuaranteespostCall(payload, config) {
            return Model.shippingGuaranteespost(payload, config);
        }

                function shippingGuaranteestemplateidputCall(id, payload, config) {
            return Model.shippingGuaranteestemplateidput(id, payload, config);
        }

                function onClickInitiateShippingGuarantee61() {
            if (self.acceptTermsAndConditions().length > 0) {
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

                self.triggerAction("INITIATE");
            } else {
                const s = [];

                s.push(self.nls.labels.termsAndConditions);
                params.baseModel.showMessages(null, s, "ERROR");
            }
        }

                function SaveAs36ValueChangeHook(event) {
            const menuId = event.target.value ? event.target.value.id : "";

            if (menuId === "draftSave") {
                self.saveAsDraft();
            } else if (menuId === "templateSave") {
                self.saveAsTemplate();
            }
        }

                function onClickYes20() {
            $("#initiateDraftOrTemplate").trigger("closeModal");
        }

                function onClickNo3() {
            delete self.letterOfCreditDetails;
            params.dashboard.loadComponent("shipping-guarantee-nav-bar", self);
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;

            self.pageRendered = function () {
                return true;
            };

            let i, j = 0;

            self.transactionType = "SHIPPING_GUARANTEE";
            self.products = ko.observable();
            self.menuButtonEnabled = ko.observable(true);
            self.mode = ko.observable("CREATE");
            self.flow = params.rootModel.params.flow ? params.rootModel.params.flow : "SG";
            self.resourceBundle = self.nls;
            self.lcDetails = ko.observable();
            self.partyId = ko.observable();
            self.draweeCountry = ko.observable();
            self.productId = ko.observable();
            self.goodsCode = ko.observable("");
            self.branchId = ko.observable("");
            self.branchLoaded = ko.observable(true);
            self.isBranchDisable = ko.observable(false);
            self.additionalBankDetails = ko.observable(null);
            self.docArray = ko.observableArray([]);
            self.attachedDocuments = ko.observableArray([]);
            self.deletedDocuments = ko.observableArray([]);
            self.attachDocList = self.attachedDocuments;
            self.showDocuments = ko.observable(false);
            self.applicantName = ko.observable();
            self.isBranchDisable = ko.observable(false);
            self.creditAvailableWithSelected = ko.observable("SWIFTCODE");
            self.partyIDoptions = ko.observable([]);
            self.shipmentDatePeriodRadioSetValue = ko.observable("latestdateofShipment");
            self.lcGroupValid = ko.observable();
            self.filterGroupValid = ko.observable();
            self.minEffectiveDate = ko.observable();
            self.shipmentGroupValid = ko.observable();
            self.documentGroupValid = ko.observable();
            self.instructionsGroupValid = ko.observable();
            self.tncGroupValid = ko.observable();
            self.saveTempDraftGroupValid = ko.observable();
            self.goodsTypeOptions = ko.observable();
            self.multiGoodsSupported = ko.observable(true);
            self.productTypeOptions = ko.observable();
            self.incotermTypeOptions = ko.observable();
            self.datasourceForGoods = ko.observableArray();
            self.currencyListOptions = ko.observableArray();
            self.additionalBankDetails = ko.observable(null);
            self.availableWithDetails = ko.observable(null);
            self.bankAddressOne = ko.observable(null);
            self.bankAddressTwo = ko.observable(null);
            self.bankAddressThree = ko.observable(null);
            self.beneIdOptions = ko.observable();
            self.beneCountryoptions = ko.observable();
            self.branchIDoptions = ko.observable();
            self.clauseTableArray = ko.observableArray();
            self.beneVisibility = ko.observable();
            self.bicCodeError = ko.observable(false);
            self.clearingCodeType = ko.observable("SWI").extend({ notify: "always" });
            self.dataLoaded = ko.observable(false);
            self.lcPresent = params.rootModel.params.flow === "FROMIMPORTLC" ? ko.observable(true) : ko.observable(false);
            self.lcId = ko.observable();
            self.saveAsModalHeader = ko.observable();
            self.visibility = ko.observable();
            self.isLCLookupRequired = ko.observable(true);
            self.transportationModes = ko.observableArray([]);

            function currencyList() {
                if (params.rootModel.params.currencyListOptions) {
                    self.currencyListOptions = params.rootModel.params.currencyListOptions;
                }
            }

            currencyList();

            self.menuItemOptions = ko.observableArray([
                {
                    value: "draftSave",
                    label: self.nls.labels.draftSave
                },
                {
                    value: "templateSave",
                    label: self.nls.labels.templateSave
                }
            ]);

            self.goodsArray = ko.observableArray([{
                    id: ko.observable(1),
                    code: ko.observable(""),
                    description: ko.observable(""),
                    units: ko.observable(""),
                    pricePerUnit: ko.observable("")
                }]);

            self.acceptTermsAndConditions = ko.observableArray([]);
            self.modalMessage = ko.observable("");
            self.modalHeader = ko.observable("");
            self.templateName = ko.observable("");
            self.draftName = ko.observable("");
            self.beneficiariesgettransactionType("SHIPPINGGUARANTEE");
            self.updateTemplate = params.rootModel.params.updateTemplate ? params.rootModel.params.updateTemplate : ko.observable(false);
            self.updateDraft = params.rootModel.params.updateDraft ? params.rootModel.params.updateDraft : ko.observable(false);

            function setletterOfCreditDetails() {
                if (params.rootModel.params.flow && params.rootModel.params.flow === "FROMIMPORTLC") {
                    self.letterOfCreditDetails.letterOfCredit(self.letterOfCreditDetails.id());
                }

                if (self.letterOfCreditDetails.shipmentDetails) {
                    self.shipmentDatePeriodRadioSetValue = self.letterOfCreditDetails.shipmentDetails.period ? ko.observable("latestperiodofShipment") : ko.observable("latestdateofShipment");
                }

                if (self.letterOfCreditDetails.multiGoodsSupported && self.letterOfCreditDetails.multiGoodsSupported() === "Y") {
                    self.multiGoodsSupported(true);
                }

                if (self.letterOfCreditDetails.swiftId && self.letterOfCreditDetails.swiftId() !== "" && self.letterOfCreditDetails.swiftId() !== null) {
                    self.financialInstitutionbicCodeDetailsBICCodegetBICCode(self.letterOfCreditDetails.swiftId());
                }

                if (self.letterOfCreditDetails.goods && self.letterOfCreditDetails.goods().length > 0) {
                    self.goodsArray.removeAll();

                    for (i = 0; i < self.letterOfCreditDetails.goods().length; i++) {
                        self.goodsArray.push({
                            id: ko.observable(i + 1),
                            code: ko.observable(self.letterOfCreditDetails.goods()[i].code()),
                            description: ko.observable(self.letterOfCreditDetails.goods()[i].description()),
                            units: self.letterOfCreditDetails.goods()[i].noOfUnits ? ko.observable(self.letterOfCreditDetails.goods()[i].noOfUnits()) : ko.observable(null),
                            pricePerUnit: self.letterOfCreditDetails.goods()[i].pricePerUnit ? ko.observable(self.letterOfCreditDetails.goods()[i].pricePerUnit()) : ko.observable(null)
                        });
                    }

                    self.datasourceForGoods = new oj.ArrayTableDataSource(self.goodsArray, { idAttribute: "id" });
                }
            }

            if (params.rootModel.params.letterOfCreditDetails) {
                self.letterOfCreditDetails = ko.mapping.fromJS(params.rootModel.params.letterOfCreditDetails, {
                    include: [
                        "letterOfCredit",
                        "period",
                        "date",
                        "amount",
                        "expiryDate",
                        "productId"
                    ]
                });

                self.letterOfCreditDetails.attachedDocuments = ko.observable();
                self.letterOfCreditDetails.paymentClause = ko.observable();
                self.letterOfCreditDetails.paymentType = ko.observable();
                self.letterOfCreditDetails.visibility = ko.observable(ko.utils.unwrapObservable(self.letterOfCreditDetails.visibility));
                self.letterOfCreditDetails.id = ko.observable(ko.utils.unwrapObservable(self.letterOfCreditDetails.id()));
                self.letterOfCreditDetails.letterOfCredit = ko.observable(ko.utils.unwrapObservable(self.letterOfCreditDetails.letterOfCredit));
                self.letterOfCreditDetails.swiftId = self.letterOfCreditDetails.swiftId ? self.letterOfCreditDetails.swiftId : ko.observable("");
                self.letterOfCreditDetails.productId = self.letterOfCreditDetails.productId ? self.letterOfCreditDetails.productId : ko.observable("");
                setletterOfCreditDetails();

                if (self.updateTemplate() || self.updateDraft()) {
                    self.letterOfCreditDetails.shipmentDetails.period = self.letterOfCreditDetails.shipmentDetails.period ? ko.observable(ko.mapping.toJS(ko.mapping.fromJS(self.letterOfCreditDetails.shipmentDetails.period))) : ko.observable(null);
                    self.letterOfCreditDetails.shipmentDetails.date = self.letterOfCreditDetails.shipmentDetails.date ? ko.observable(ko.mapping.toJS(ko.mapping.fromJS(self.letterOfCreditDetails.shipmentDetails.date))) : ko.observable(null);
                } else {
                    self.letterOfCreditDetails.shipmentDetails.period = self.letterOfCreditDetails.shipmentDetails.period ? ko.observable(ko.mapping.toJS(ko.mapping.fromJS(self.letterOfCreditDetails.shipmentDetails.period))) : ko.observable(null);
                    self.letterOfCreditDetails.shipmentDetails.date = self.letterOfCreditDetails.shipmentDetails.date ? ko.observable(ko.mapping.toJS(ko.mapping.fromJS(self.letterOfCreditDetails.shipmentDetails.date))) : ko.observable(null);
                }

                delete self.letterOfCreditDetails.lcType;
                delete self.letterOfCreditDetails.swiftMessages;
                delete self.letterOfCreditDetails.totalAvailments;
                delete self.letterOfCreditDetails.advices;
                delete self.letterOfCreditDetails.allowAmendment;
                delete self.letterOfCreditDetails.availableWith;
                delete self.letterOfCreditDetails.expiryPlace;
                delete self.letterOfCreditDetails.draftsRequired;
                delete self.letterOfCreditDetails.exposure;
                delete self.letterOfCreditDetails.irRevocable;
                delete self.letterOfCreditDetails.outstandingAmount;
                delete self.letterOfCreditDetails.revolving;
                delete self.letterOfCreditDetails.revolvingDetails;
                delete self.letterOfCreditDetails.toleranceAbove;
                delete self.letterOfCreditDetails.toleranceUnder;
                delete self.letterOfCreditDetails.toleranceType;
                delete self.letterOfCreditDetails.transferableType;

                if (!self.letterOfCreditDetails.amount) {
                    self.letterOfCreditDetails.amount = {
                        currency: ko.observable(null),
                        amount: ko.observable(null)
                    };
                }

                if (self.letterOfCreditDetails.letterOfCredit()) {
                    self.lcPresent(true);
                    self.lcId(self.letterOfCreditDetails.letterOfCredit());
                } else if (self.letterOfCreditDetails.id()) {
                    self.lcPresent(false);
                } else if (self.mode() === "CREATE") {
                    self.lcId(self.letterOfCreditDetails.letterOfCredit());
                }
            } else {
                self.letterOfCreditDetails = ko.mapping.fromJS({
                    amount: {
                        currency: null,
                        amount: null
                    },
                    availableWith: null,
                    letterOfCredit: null,
                    attachedDocuments: [],
                    applicationDate: null,
                    versionNo: null,
                    counterPartyName: null,
                    counterPartyAddress: {
                        line1: null,
                        line2: null,
                        line3: null,
                        country: null,
                        zipCode: null
                    },
                    chargesFromBeneficiary: null,
                    beneId: null,
                    beneRefNo: null,
                    branchId: null,
                    bankAddress: null,
                    bankRefNo: null,
                    chargingAccountId: {
                        displayValue: null,
                        value: null
                    },
                    confirmationInstruction: null,
                    confirmingBankCode: null,
                    confirmed: true,
                    customerReferenceNo: null,
                    deliveryMode: "SWIFT",
                    document: [],
                    documentPresentationDays: null,
                    draftsRequired: "false",
                    drawingStatus: null,
                    expiryDate: null,
                    id: "",
                    incoterm: {
                        code: null,
                        description: null
                    },
                    instructionDescription: null,
                    name: null,
                    partyId: {
                        displayValue: null,
                        value: null
                    },
                    paymentClause: null,
                    paymentType: null,
                    productId: null,
                    shipmentDetails: {
                        date: null,
                        description: null,
                        destination: null,
                        dischargePort: null,
                        goodsCode: null,
                        id: null,
                        loadingPort: null,
                        partial: "false",
                        period: null,
                        source: null,
                        transShipment: "false",
                        mode: null
                    },
                    swiftId: "",
                    goods: [],
                    state: "TEMPLATE",
                    status: null,
                    visibility: "PRIVATE"
                });
            }

            self.mapping = {
                partyId: {
                    displayValue: "displayValue",
                    value: "value"
                },
                id: "id",
                beneRefNo: "beneRefNo",
                bankRefNo: "bankRefNo",
                counterPartyName: "counterPartyName"
            };

            self.applicantAddress = {
                line1: ko.observable(),
                line2: ko.observable(),
                line3: ko.observable(),
                country: ko.observable()
            };

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
                product: ko.observable(),
                incoterm: ko.observable(),
                baseDateDescription: ko.observable()
            };

            self.datasourceForGoods = new oj.ArrayTableDataSource(self.goodsArray, { idAttribute: "code" });
            self.currency = ko.observable(null);
            self.goodsCode = ko.observable("");
            self.baseDateCode = ko.observable();
            self.isShippingGuarantee = ko.observable(true);
            params.baseModel.registerElement("bank-look-up");
            params.baseModel.registerComponent("attach-documents", "trade-finance");
            params.baseModel.registerComponent("document-details", "letter-of-credit");
            params.baseModel.registerComponent("instructions-details", "letter-of-credit");
            params.baseModel.registerComponent("lc-details", "letter-of-credit");
            params.baseModel.registerComponent("shipment-details", "letter-of-credit");
            params.baseModel.registerComponent("collection-filter", "collection");
            params.baseModel.registerComponent("lc-lookup", "trade-finance");
            params.baseModel.registerComponent("review-shipping-guarantee", "shipping-guarantee");
            params.baseModel.registerComponent("shipping-guarantee-nav-bar", "shipping-guarantee");

            self.filterValues = {
                paymentType: ko.observable("SIGHT"),
                docAttached: ko.observable("false"),
                lcLinked: ko.observable("false"),
                lcNumber: ko.observable()
            };

            self.stages = [
                {
                    stageName: self.nls.accordionHeading.shippingGuaranteeDetails,
                    expanded: ko.observable(true),
                    editable: ko.observable(true),
                    validated: ko.observable(),
                    moduleName: "lc-details",
                    disabled: ko.observable(false)
                },
                {
                    stageName: self.nls.accordionHeading.shipmentDetails,
                    expanded: ko.observable(false),
                    editable: ko.observable(true),
                    validated: ko.observable(),
                    moduleName: "shipment-details",
                    disabled: ko.observable(false)
                },
                {
                    stageName: self.nls.accordionHeading.instructions,
                    expanded: ko.observable(false),
                    editable: ko.observable(true),
                    validated: ko.observable(),
                    moduleName: "instructions-details",
                    disabled: ko.observable(false)
                },
                {
                    stageName: self.nls.accordionHeading.attachments,
                    expanded: ko.observable(false),
                    editable: ko.observable(true),
                    validated: ko.observable(),
                    moduleName: "attach-documents",
                    disabled: ko.observable(false)
                }
            ];

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

            self.getDisplayText = function (accountNumber, nickName) {
                if (nickName) {
                    return params.baseModel.format(self.resourceBundle.labels.accountsDropdown, {
                        displayValue: accountNumber,
                        nickname: nickName
                    });
                }

                return accountNumber;
            };

            self.createModelFromArray = function () {
                self.letterOfCreditDetails.attachedDocuments(self.attachedDocuments());
                self.letterOfCreditDetails.document.removeAll();

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

                self.letterOfCreditDetails.goods.removeAll();

                if (self.multiGoodsSupported() === false) {
                    if (self.letterOfCreditDetails.shipmentDetails.goodsCode()) {
                        self.letterOfCreditDetails.goods.push({
                            id: self.letterOfCreditDetails.shipmentDetails.goodsCode(),
                            description: self.letterOfCreditDetails.shipmentDetails.description(),
                            noOfUnits: null,
                            pricePerUnit: null
                        });
                    }
                } else {
                    for (i = 0; i < self.goodsArray().length; i++) {
                        if (ko.utils.unwrapObservable(self.goodsArray()[i].code)) {
                            self.letterOfCreditDetails.goods.push({
                                code: ko.utils.unwrapObservable(self.goodsArray()[i].code),
                                description: self.goodsArray()[i].description(),
                                noOfUnits: self.goodsArray()[i].units() !== "" ? self.goodsArray()[i].units() : null,
                                pricePerUnit: self.goodsArray()[i].pricePerUnit() !== "" ? self.goodsArray()[i].pricePerUnit() : null
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

                self.stages[4].validated(true);

                return validationFlag;
            }

            self.openlcLookup = function () {
                self.clearingCodeType("SWI");
                $("#openlclookup").trigger("openModal");
            };

            self.openinstructionLookup = function () {
                self.clearingCodeType("SWI");
                $("#openinstructionLookup").trigger("openModal");
            };

            self.triggerAction = function (actionType, modalName) {
                if (actionType === "DRAFT" && self.updateDraft && self.updateDraft()) {
                    self.update();
                } else if (actionType === "TEMPLATE" || actionType === "DRAFT") {
                    $(modalName).trigger("openModal");
                } else {
                    const parameters = {
                        mode: "REVIEW",
                        data: ko.mapping.toJS(self.letterOfCreditDetails),
                        multiGoodsSupported: self.multiGoodsSupported,
                        dropdownLabels: self.dropdownLabels,
                        confirmScreenDetails: self.confirmScreenDetails,
                        additionalBankDetails: self.additionalBankDetails,
                        transportationModes: self.transportationModes,
                        currencyListOptions: self.currencyListOptions
                    };

                    params.dashboard.loadComponent("review-shipping-guarantee", parameters);
                }
            };

            function validateBICCodes(actionType, modalName) {
                self.triggerAction(actionType, modalName);
            }

            self.initiateShippingGuarantee = function () {
                if (self.multiGoodsSupported() === true) {
                    for (i = 0; i < self.goodsArray().length - 1; i++) {
                        for (j = i + 1; j < self.goodsArray().length; j++) {
                            if (self.goodsArray()[i].code() === self.goodsArray()[j].code()) {
                                const s = [];

                                s.push(self.resourceBundle.labels.duplicateError);
                                params.baseModel.showMessages(null, s, "ERROR");

                                return;
                            }
                        }
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

                    const input = self.letterOfCreditDetails.bankAddress(), splitStringArray = input.split("_");

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
                        self.goodsArray.push({
                            id: ko.observable(i + 1),
                            code: ko.observable(self.letterOfCreditDetails.goods()[i].code()),
                            description: ko.observable(self.letterOfCreditDetails.goods()[i].description()),
                            units: self.letterOfCreditDetails.goods()[i].noOfUnits ? ko.observable(self.letterOfCreditDetails.goods()[i].noOfUnits()) : ko.observable(null),
                            pricePerUnit: self.letterOfCreditDetails.goods()[i].pricePerUnit ? ko.observable(self.letterOfCreditDetails.goods()[i].pricePerUnit()) : ko.observable(null)
                        });
                    }

                    self.datasourceForGoods = new oj.ArrayTableDataSource(self.goodsArray, { idAttribute: "id" });
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
                if (self.multiGoodsSupported() === true) {
                    for (i = 0; i < self.goodsArray().length - 1; i++) {
                        for (j = i + 1; j < self.goodsArray().length; j++) {
                            if (self.goodsArray()[i].code() === self.goodsArray()[j].code()) {
                                const s = [];

                                s.push(self.resourceBundle.labels.duplicateError);
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
                self.saveAsModalHeader(self.resourceBundle.common.labels.saveTemplate);
                self.letterOfCreditDetails.state("TEMPLATE");
                self.letterOfCreditDetails.paymentClause("RED");

                let modalName = "#saveAsDialog";

                if (self.updateTemplate && self.updateTemplate()) {
                    modalName = "#updateTemplate";
                    self.modalMessage(self.resourceBundle.common.labels.templateUpdate);
                    self.templateName(self.letterOfCreditDetails.name());
                } else {
                    self.templateName("");
                }

                validateBICCodes("TEMPLATE", modalName);
            };

            self.saveAsDraft = function () {
                if (self.multiGoodsSupported() === true) {
                    for (i = 0; i < self.goodsArray().length - 1; i++) {
                        for (j = i + 1; j < self.goodsArray().length; j++) {
                            if (self.goodsArray()[i].code() === self.goodsArray()[j].code()) {
                                const s = [];

                                s.push(self.resourceBundle.labels.duplicateError);
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

                $("#saveAsDialog").hide();

                shippingGuaranteespostCall(ko.mapping.toJSON(self.letterOfCreditDetails)).then(function () {
                    if (self.letterOfCreditDetails.state() === "TEMPLATE") {
                        self.modalHeader(self.resourceBundle.common.labels.templateSaveHeader);
                        self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.templateSaveMsg, { tempName: self.letterOfCreditDetails.name() }));
                        $("#initiateDraftOrTemplate").trigger("openModal");
                    } else {
                        self.modalHeader(self.resourceBundle.common.labels.draftSaveHeader);
                        self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.draftSaveMsg, { draftName: self.letterOfCreditDetails.name() }));
                        $("#initiateDraftOrTemplate").trigger("openModal");
                    }
                });
            };

            self.update = function () {
                $("#updateTemplate").hide();

                shippingGuaranteestemplateidputCall(ko.utils.unwrapObservable(self.letterOfCreditDetails.id), ko.mapping.toJSON(self.letterOfCreditDetails)).then(function () {
                    if (self.letterOfCreditDetails.state() === "TEMPLATE") {
                        self.modalHeader(self.resourceBundle.common.labels.templateSaveHeader);
                        self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.templateSaveMsg, { tempName: self.letterOfCreditDetails.name() }));
                        $("#initiateDraftOrTemplate").trigger("openModal");
                    } else {
                        self.modalHeader(self.resourceBundle.common.labels.draftSaveHeader);
                        self.modalMessage(params.baseModel.format(self.resourceBundle.common.labels.draftSaveMsg, { draftName: self.letterOfCreditDetails.name() }));
                        $("#initiateDraftOrTemplate").trigger("openModal");
                    }
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
            };

            self.cancel = function () {
                $("#saveAsDialog").trigger("closeModal");
            };

            self.goBack = function () {
                delete self.letterOfCreditDetails;
                history.back();
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

            self.menuItemSelect = function (data, event) {
                data = event.target.value;

                const menuId = data;

                if (menuId === "draftSave") {
                    self.saveAsDraft();
                } else if (menuId === "templateSave") {
                    self.saveAsTemplate();
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

            Promise.all([
                tradeIncotermsgetCall(),
                tradeGoodsgetCall(),
                productsshippingGuaranteegetCall(),
                beneficiariesgetCall(self.beneficiariesgetbeneName(), self.beneficiariesgettransactionType(), self.beneficiariesgetnickName()),
                mepartygetCall(),
                mepartyrelationsgetCall(),
                locationscountrycountrycitycitybranchCodegetCall("all", "all"),
                enumerationscountrygetCall(),
                financialInstitutionbicCodeDetailsBICCodegetCall(self.financialInstitutionbicCodeDetailsBICCodegetBICCode())
            ]).then(function (response) {
                if (response[2].products.length > 0) {
                    if (response[2].products[0]) {
                        self.multiGoodsSupported(true);
                    }
                }

                const products = response[2].products.map(function (data) {
                    return {
                        value: data.id,
                        label: data.name
                    };
                });

                self.productTypeOptions(products);

                if (self.letterOfCreditDetails.productId()) {
                    const productLabel = self.productTypeOptions().filter(function (data) {
                        return data.value === self.letterOfCreditDetails.productId();
                    });

                    if (productLabel && productLabel.length > 0) {
                        self.dropdownLabels.product(productLabel[0].label);
                    }
                }

                const goods = response[1].goods.map(function (data) {
                    return {
                        description: data.description,
                        value: data.code,
                        label: data.code
                    };
                });

                self.goodsTypeOptions(goods);

                const incotermList = response[0].incotermList.map(function (data) {
                    return {
                        value: data.code,
                        label: data.description
                    };
                });

                self.incotermTypeOptions(incotermList);

                const parties = [];

                parties.push({
                    label: response[4].party.id.displayValue,
                    value: response[4].party.id.value
                });

                const mappedParties = response[5].partyToPartyRelationship;

                for (i = 0; i < mappedParties.length; i++) {
                    parties.push({
                        value: mappedParties[i].relatedParty.value,
                        label: mappedParties[i].relatedParty.displayValue
                    });
                }

                self.partyIDoptions(parties);

                const beneficiary = response[3].beneficiaryDTOs.map(function (data) {
                    return {
                        value: data.id,
                        label: data.nickName
                    };
                });

                self.beneIdOptions(beneficiary);

                const countries = response[7].enumRepresentations[0].data.map(function (data) {
                    return {
                        value: data.code,
                        label: data.description
                    };
                }).filter(function (data) {
                    return data.label && data.value;
                });

                self.beneCountryoptions(countries);

                const branches = response[6].branchAddressDTO.map(function (data) {
                    return {
                        value: data.id,
                        label: data.branchName
                    };
                });

                self.branchIDoptions(branches);
                self.dataLoaded(true);

                if (self.letterOfCreditDetails.swiftId && self.letterOfCreditDetails.swiftId() !== "" && self.letterOfCreditDetails.swiftId() !== null) {
                    self.additionalBankDetails(response[8]);
                }
            });

            return true;
        }

        return {
            tradeIncotermsgetCall: tradeIncotermsgetCall,
            tradeGoodsgetCall: tradeGoodsgetCall,
            productsshippingGuaranteegetCall: productsshippingGuaranteegetCall,
            productsshippingGuaranteeproductIdgetCall: productsshippingGuaranteeproductIdgetCall,
            beneficiariesgetCall: beneficiariesgetCall,
            mepartygetCall: mepartygetCall,
            mepartyrelationsgetCall: mepartyrelationsgetCall,
            locationscountrycountrycitycitybranchCodegetCall: locationscountrycountrycitycitybranchCodegetCall,
            enumerationscountrygetCall: enumerationscountrygetCall,
            accountsdemandDepositgetCall: accountsdemandDepositgetCall,
            financialInstitutionbicCodeDetailsBICCodegetCall: financialInstitutionbicCodeDetailsBICCodegetCall,
            shippingGuaranteespostCall: shippingGuaranteespostCall,
            shippingGuaranteestemplateidputCall: shippingGuaranteestemplateidputCall,
            onClickInitiateShippingGuarantee61: onClickInitiateShippingGuarantee61,
            SaveAs36ValueChangeHook: SaveAs36ValueChangeHook,
            onClickYes20: onClickYes20,
            onClickNo3: onClickNo3,
            init: init
        };
    };
});