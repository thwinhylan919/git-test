define([
    "ojL10n!resources/nls/multiple-invoice-creation",
    "knockout",
    "./model",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojradioset",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojlabel"
], function (resourceBundle, ko, Model, oj) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.mepartygetVar = ko.observable();
        self.currencygetVar = ko.observable();
        self.currencygetmoduleType = ko.observable();
        params.baseModel.registerElement("nav-bar");

        const getNewKoModel = function () {
            const KoModel = Model.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.modelInstance = params.rootModel.previousState ? params.rootModel.previousState.data : getNewKoModel();
        self.currencyList = ko.observableArray();
        self.dataLoaded = ko.observable(false);
        self.partyId = ko.observable();
        self.partyName = ko.observable();
        self.batchDetailRequestList = ko.observableArray();
        self.showNewForm = ko.observable(true);
        self.formDataSaved = ko.observable(false);
        self.saveAsTemplate = ko.observable(false);
        self.showCheckAvailability = ko.observable(true);
        self.isTemplateNameAvailable = ko.observable(true);
        self.templateName = ko.observable();
        self.submitClicked = ko.observable(false);
        self.templateInvoiceList = ko.observableArray();
        self.clearData = ko.observable(false);
        params.baseModel.registerComponent("invoice-creation-form", "supply-chain-finance");
        params.baseModel.registerComponent("create-invoice-template", "supply-chain-finance");

        Model.currencyget(self.currencygetmoduleType()).then(function (response) {
            self.currencygetVar(response);

            for (let i = 0; i < self.currencygetVar().currencyList.length; i++) {
                self.currencyList.push({
                    code: self.currencygetVar().currencyList[i].code,
                    description: self.currencygetVar().currencyList[i].code
                });
            }

            self.dataLoaded(true);
        });

        Model.mepartyget().then(function (response) {
            self.mepartygetVar(response);
            self.partyId(self.mepartygetVar().party.id.displayValue);
            self.partyName(self.mepartygetVar().party.personalDetails.fullName);
        });

        self.menuSelection = ko.observable("new_invoice");
        self.id = 1;

        self.invoicesArray = ko.observableArray([{
            formId: self.id,
            validationTracker: "track_" + self.id,
            payload: null,
            isNewInvoice: true
        }]);

        if (params.rootModel.previousState) {
            self.invoicesArray(params.rootModel.previousState.invoicesArray);
            self.id = params.rootModel.previousState.id;
            self.templateName(params.rootModel.previousState.templateName);
            self.showCheckAvailability(params.rootModel.previousState.showCheckAvailability);
            self.isTemplateNameAvailable(params.rootModel.previousState.isTemplateNameAvailable);
            self.saveAsTemplate(params.rootModel.previousState.saveAsTemplate);
        }

        self.copyInvoice = function (id) {
            self.id = self.id + 1;

            for (let i = 0; i < self.invoicesArray().length; i++) {
                if (self.invoicesArray()[i].formId === id) {
                    self.invoicesArray.push({
                        formId: self.id,
                        validationTracker: "track_" + self.id,
                        invoiceAmount: self.invoicesArray()[i].invoiceAmount,
                        totalAmount: self.invoicesArray()[i].totalAmount,
                        isCommodityAdded: self.invoicesArray()[i].isCommodityAdded,
                        payload: self.invoicesArray()[i].payload,
                        isNewInvoice: true
                    });

                    break;
                }
            }
        };

        self.deleteInvoice = function (id) {
            self.invoicesArray.remove(function (data) {
                return data.formId === id;
            });
        };

        self.createInvoices = function () {
            return new Promise(function (resolve, reject) {
                Model.batchpost(self.batchPayload).then(function (data) {
                    resolve(data);
                }).catch(function (err) {
                    reject(err);
                });
            });
        };

        self.templateNameListener = function (event) {
            if (event.detail.value === event.detail.previousValue) {
                self.showCheckAvailability(false);
            } else {
                self.showCheckAvailability(true);
            }
        };

        const selectedItemSubscription = self.menuSelection.subscribe(function (newValue) {
            switch (newValue) {
                case "new_invoice": {
                    let isCommodityAdded;

                    if (self.templateInvoiceList().length > 0) {

                        if (self.clearData()) {
                            self.invoicesArray([]);
                        }

                        for (let i = 0; i < self.templateInvoiceList().length; i++) {
                            if (self.templateInvoiceList()[i].commodities) {
                                isCommodityAdded = "Y";
                            } else {
                                isCommodityAdded = "N";
                            }

                            delete self.templateInvoiceList()[i].invoiceId;

                            self.id = self.id + 1;

                            self.invoicesArray.push({
                                formId: self.id,
                                validationTracker: "track_" + self.id,
                                isCommodityAdded: isCommodityAdded,
                                totalAmount: self.templateInvoiceList()[i].amount.amount,
                                invoiceAmount: self.templateInvoiceList()[i].amount.amount,
                                payload: self.templateInvoiceList()[i],
                                isNewInvoice: true
                            });
                        }
                    }

                    self.showNewForm(true);
                    break;
                }
                case "template": {
                    let savedDataCount = 0;

                    for (let i = 0; i < self.invoicesArray().length; i++) {
                        if (self.invoicesArray()[i].payload !== null) {
                            savedDataCount++;
                        }
                    }

                    if (savedDataCount > 0) {
                        self.formDataSaved(true);
                    } else {
                        self.formDataSaved(false);
                    }

                    self.showNewForm(false);
                    break;
                }
                default: {
                    self.showNewForm(true);
                }
            }
        });

        self.validateTemplateName = {
            validate: function (value) {

                if (value === "" || value === null) {
                    self.submitClicked(false);
                    throw new oj.ValidatorError("", self.nls.CreateInvoice.invalidInput);
                }

                if (self.showCheckAvailability() && self.submitClicked()) {
                    self.submitClicked(false);
                    throw new oj.ValidatorError("", self.nls.CreateInvoice.checkAvailabilityError);
                }

                if (!self.isTemplateNameAvailable() && self.submitClicked()) {
                    self.submitClicked(false);
                    throw new oj.ValidatorError("", self.nls.CreateInvoice.UnavailableError);
                }

                self.submitClicked(false);

                return true;
            }
        };

        self.bulkUploadClick = function () {
            params.baseModel.registerComponent("file-upload", "file-upload");
            params.dashboard.loadComponent("file-upload");
        };

        self.dispose = function () {
            selectedItemSubscription.dispose();
        };

        self.uiOptions = {
            iconAvailable: false,
            defaultOption: self.menuSelection,
            menuFloat: "left",
            fullWidth: false,
            edge: "top"
        };

        self.onClickAddInvoice38 = function () {
            self.id = self.id + 1;

            self.invoicesArray.push({
                formId: self.id,
                validationTracker: "track_" + self.id,
                payload: null,
                isNewInvoice: true
            });
        };

        self.onClickCheckAvailability46 = function () {
            const validateTemplate = document.getElementById("TemplateName72");

            validateTemplate.validate();

            validateTemplate.refresh();

            const queryParams = {
                criteria: [{
                    operand: "templateName",
                    operator: "EQUALS",
                    value: [self.templateName()]
                }]
            };

            Model.readTemplate(JSON.stringify(queryParams)).then(function (data) {

                if (data.invoicetemplatedtos.length > 0) {
                    self.showCheckAvailability(false);
                    self.isTemplateNameAvailable(false);
                } else {
                    self.showCheckAvailability(false);
                    self.isTemplateNameAvailable(true);
                }
            });
        };

        self.onClickSubmit43 = function () {
            self.submitClicked(true);

            if (self.saveAsTemplate()) {
                const validateTemplate = document.getElementById("TemplateName72");

                validateTemplate.validate();
            }

            let tracker, validationErrorCount = 0,
                savedDataCount = 0;

            for (let i = 0; i < self.invoicesArray().length; i++) {
                tracker = document.getElementById("track_" + self.invoicesArray()[i].formId);

                if (!params.baseModel.showComponentValidationErrors(tracker)) {
                    validationErrorCount++;
                }
            }

            tracker = document.getElementById("validateTemplate");

            if (validationErrorCount === 0 && params.baseModel.showComponentValidationErrors(tracker)) {
                for (let i = 0; i < self.invoicesArray().length; i++) {
                    if (self.invoicesArray()[i].payload !== null && !self.invoicesArray()[i].isNewInvoice) {
                        savedDataCount++;
                    }
                }

                if (savedDataCount === 0) {
                    params.baseModel.showMessages(null, [self.nls.CreateInvoice.saveInvoices], "ERROR");
                } else {

                    self.batchDetailRequestList([]);

                    for (let i = 0; i < self.invoicesArray().length; i++) {
                        self.batchDetailRequestList.push({
                            headers: {
                                "Content-Id": i,
                                "Content-Type": "application/json"
                            },
                            uri: {
                                value: "/supplyChainFinance/invoices"
                            },
                            methodType: "POST",
                            payload: ko.toJSON(self.invoicesArray()[i].payload)
                        });
                    }

                    const payLoadArray = [];

                    for (let i = 0; i < self.batchDetailRequestList().length; i++) {
                        const payLoad = JSON.parse(self.batchDetailRequestList()[i].payload);

                        if (payLoad.commodities && payLoad.commodities.length > 0) {
                            for (let i = 0; i < payLoad.commodities.length; i++) {
                                delete payLoad.commodities[i].id;
                                delete payLoad.commodities[i].invoiceNumber;
                            }
                        }

                        payLoad.totalAmount.currency = payLoad.amount.currency;
                        payLoad.taxPercentage = parseFloat(payLoad.taxPercentage);
                        payLoad.discountPercentage = parseFloat(payLoad.discountPercentage);
                        self.batchDetailRequestList()[i].payload = ko.toJSON(payLoad);
                        payLoadArray[i] = payLoad;
                    }

                    if (self.saveAsTemplate()) {
                        self.batchDetailRequestList.push({
                            headers: {
                                "Content-Id": self.batchDetailRequestList().length,
                                "Content-Type": "application/json"
                            },
                            uri: {
                                value: "/supplyChainFinance/invoiceTemplates"
                            },
                            methodType: "POST",
                            payload: ko.toJSON({
                                templateName: self.templateName(),
                                invoices: payLoadArray
                            })
                        });
                    }

                    self.batchPayload = {
                        batchDetailRequestList: self.batchDetailRequestList()
                    };

                    params.baseModel.registerComponent("review-multiple-invoices", "supply-chain-finance");

                    params.dashboard.loadComponent("review-multiple-invoices", {
                        createInvoices: self.createInvoices,
                        invoicesArray: self.invoicesArray(),
                        id: self.id,
                        saveAsTemplate: self.saveAsTemplate(),
                        templateName: self.templateName(),
                        showCheckAvailability: self.showCheckAvailability(),
                        isTemplateNameAvailable: self.isTemplateNameAvailable(),
                        supplierName: self.partyName()
                    });
                }
            }
        };

        self.onClickCancel53 = function () {
            params.dashboard.switchModule();
        };

        self.onClickBack82 = function () {
            history.back();
        };
    };
});