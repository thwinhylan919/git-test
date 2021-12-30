define([
    "ojL10n!resources/nls/invoice-update-form",
    "jquery",
    "knockout",
    "./model",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojradioset",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojbutton",
    "ojs/ojlabel"
], function (resourceBundle, $, ko, Model, oj) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.programsgetVar = ko.observable();
        self.programsgetprogramName = ko.observable();
        self.programsgetprogramType = ko.observable();
        self.programsgetprogramCode = ko.observable();
        self.programsgetsupplierId = ko.observable();
        self.programsgetbuyerId = ko.observable();
        self.programsgetspokeId = ko.observable();
        self.programsgetrole = ko.observable();
        self.counterPartiesgetVar = ko.observable();
        self.counterPartiesgetprogramCode = ko.observable();
        self.currencygetVar = ko.observable();
        self.currencygetmoduleType = ko.observable();
        self.mepartygetVar = ko.observable();
        self.invoiceinvoiceRefNoputinvoiceRefNo = ko.observable();
        params.baseModel.registerElement("amount-input");

        self.taxonomyDefinition = params.dashboard.getTaxonomyDefinition("com.ofss.digx.app.scf.dto.invoice.InvoiceDTO");

        const getNewKoModel = function () {
            const KoModel = Model.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.modelInstance = params.rootModel.previousState ? params.rootModel.previousState.data : getNewKoModel();

        self.currencyList = ko.observableArray();
        self.partyId = ko.observable();
        self.partyName = ko.observable();
        self.dataLoaded = ko.observable(false);

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

        self.programNameList = ko.observableArray();
        self.showPrograms = ko.observable(true);
        self.buyerNameList = ko.observableArray();
        self.showBuyers = ko.observable(true);
        self.programName = ko.observable();
        self.isCommodityAdded = ko.observable("N");
        self.invoiceAmount = ko.observable(0);
        self.totalAmount = ko.observable(0);
        self.poDateRequired = ko.observable(false);
        self.isEditDisabled = ko.observable(false);
        self.isPoNumberDisabled = ko.observable(true);
        self.isPoDateDisabled = ko.observable(true);
        self.isInvoiceDateDisabled = ko.observable(true);
        self.commodityId = 1;

        self.commodityList = ko.observableArray([{
            id: self.commodityId,
            name: ko.observable(),
            description: ko.observable(),
            quantity: ko.observable(0),
            costPerUnit: ko.observable(0),
            totalCost: ko.observable(0),
            invoiceNumber: ko.observable()
        }]);

        self.currentDate = params.baseModel.getDate();
        self.currentDate.setDate(self.currentDate.getDate());
        self.startDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(self.currentDate));
        self.minInvoiceDueDate = ko.observable(self.startDate());

        if (params.rootModel.params) {
            if (!params.rootModel.previousState) {
                if (!params.rootModel.params.invoiceData().discountAmount || params.rootModel.params.invoiceData().discountAmount === null || params.rootModel.params.invoiceData().discountAmount === "") {
                    params.rootModel.params.invoiceData().discountAmount = 0;
                }

                if (!params.rootModel.params.invoiceData().taxAmount || params.rootModel.params.invoiceData().taxAmount === null || params.rootModel.params.invoiceData().taxAmount === "") {
                    params.rootModel.params.invoiceData().taxAmount = 0;
                }

                if (!params.rootModel.params.invoiceData().taxPercentage || params.rootModel.params.invoiceData().taxPercentage === null || params.rootModel.params.invoiceData().taxPercentage === "") {
                    params.rootModel.params.invoiceData().taxPercentage = 0;
                }

                if (!params.rootModel.params.invoiceData().discountPercentage || params.rootModel.params.invoiceData().discountPercentage === null || params.rootModel.params.invoiceData().discountPercentage === "") {
                    params.rootModel.params.invoiceData().discountPercentage = 0;
                }

                if (!params.rootModel.params.invoiceData().purchaseOrderDate) {
                    params.rootModel.params.invoiceData().purchaseOrderDate = null;
                    params.rootModel.params.invoiceData().poNumber = null;
                }

                if (!params.rootModel.params.invoiceData().shipmentDate) {
                    params.rootModel.params.invoiceData().shipmentDate = null;
                }

                self.modelInstance.invoiceList = ko.mapping.fromJS(params.rootModel.params.invoiceData());
            }

            if (self.modelInstance.invoiceList.purchaseOrderDate() !== null && self.modelInstance.invoiceList.purchaseOrderDate() !== "") {
                const poDate = new Date(self.modelInstance.invoiceList.purchaseOrderDate());

                if (poDate >= self.currentDate) {
                    self.startDate(self.modelInstance.invoiceList.purchaseOrderDate());
                    self.isPoDateDisabled(false);
                    self.isPoNumberDisabled(false);
                } else {
                    self.isPoNumberDisabled(false);
                }
            }

            const invoiceDate = new Date(self.modelInstance.invoiceList.invoiceDate());

            if (invoiceDate >= self.currentDate) {
                self.isInvoiceDateDisabled(false);
            }

            self.invoiceAmount(self.modelInstance.invoiceList.amount.amount());

            if (self.modelInstance.invoiceList.commodities && self.modelInstance.invoiceList.commodities !== null && self.modelInstance.invoiceList.commodities().length > 0) {
                self.isCommodityAdded("Y");
                self.commodityList([]);
                self.commodityId = 0;

                for (let i = 0; i < self.modelInstance.invoiceList.commodities().length; i++) {
                    self.commodityId = self.commodityId + 1;

                    self.commodityList.push({
                        id: self.commodityId,
                        name: ko.observable(self.modelInstance.invoiceList.commodities()[i].name()),
                        description: ko.observable(self.modelInstance.invoiceList.commodities()[i].description()),
                        quantity: ko.observable(self.modelInstance.invoiceList.commodities()[i].quantity()),
                        costPerUnit: ko.observable(self.modelInstance.invoiceList.commodities()[i].costPerUnit()),
                        totalCost: ko.observable(self.modelInstance.invoiceList.commodities()[i].totalCost()),
                        invoiceNumber: ko.observable(self.modelInstance.invoiceList.commodities()[i].invoiceNumber())
                    });
                }
            }

            if (self.modelInstance.invoiceList.purchaseOrderDate() !== null && self.modelInstance.invoiceList.purchaseOrderDate() !== "") {
                const poDate = new Date(self.modelInstance.invoiceList.purchaseOrderDate());

                if (poDate > self.currentDate) {
                    self.startDate(self.modelInstance.invoiceList.purchaseOrderDate());
                }
            }

            self.minInvoiceDueDate(self.modelInstance.invoiceList.invoiceDate());

            self.queryParameter = ko.observable({
                criteria: []
            });

            self.queryParameter().criteria.push({
                operand: "role",
                operator: "ENUM",
                value: ["S"]
            });

            self.queryParameter().criteria.push({
                operand: "associatedPartyList.associatedPartyKey.id",
                operator: "EQUALS",
                value: []
            });

            if (self.modelInstance.invoiceList.associatedParty.id) {
                self.queryParameter().criteria[1].value.length = 0;
                self.queryParameter().criteria[1].value.push(self.modelInstance.invoiceList.associatedParty.id.value());
            }

            Model.programsget(JSON.stringify(self.queryParameter())).then(function (response) {
                self.programsgetVar(response.programs);
                self.showPrograms(false);
                self.programNameList([]);

                if (self.programsgetVar().length > 0) {
                    for (let i = 0; i < self.programsgetVar().length; i++) {
                        self.programNameList.push({
                            code: self.programsgetVar()[i].programCode,
                            label: self.programsgetVar()[i].programName
                        });
                    }
                } else {
                    $("#no-programs" + self.formId).trigger("openModal");
                }

                ko.tasks.runEarly();
                self.showPrograms(true);
            });

        }

        const queryParams = {
            criteria: [{
                operand: "relation",
                operator: "ENUM",
                value: ["BOTH"]
            }]
        };

        Model.counterPartiesget(JSON.stringify(queryParams)).then(function (data) {
            self.counterPartiesgetVar(data.associatedParties);
            self.showBuyers(false);
            self.buyerNameList([]);

            if (self.counterPartiesgetVar().length > 0) {
                for (let i = 0; i < self.counterPartiesgetVar().length; i++) {

                    self.buyerNameList.push({
                        code: self.counterPartiesgetVar()[i].id.value,
                        label: self.counterPartiesgetVar()[i].name
                    });
                }
            }

            ko.tasks.runEarly();
            self.showBuyers(true);
        });

        self.computeCommodityAmount = function (event, data) {
            data.totalCost($("#quantity_" + data.id).val() * $("#cost_" + data.id).val());
        };

        self.calculateTotalAmount = ko.computed(function () {
            let amount = 0;

            for (let i = 0; i < self.commodityList().length; i++) {
                amount += self.commodityList()[i].totalCost();
            }

            self.totalAmount(amount);

            if (self.isCommodityAdded() === "Y") {
                self.modelInstance.invoiceList.discountAmount(self.modelInstance.invoiceList.discountPercentage() * self.totalAmount() / 100);
                self.modelInstance.invoiceList.taxAmount(self.modelInstance.invoiceList.taxPercentage() * (self.totalAmount() - self.modelInstance.invoiceList.discountAmount()) / 100);
            }
        });

        self.modelInstance.invoiceList.totalAmount.amount = ko.computed(function () {
            if (self.isCommodityAdded() === "N") {
                return self.invoiceAmount() - self.modelInstance.invoiceList.discountAmount() + self.modelInstance.invoiceList.taxAmount();
            }

            return self.totalAmount() - self.modelInstance.invoiceList.discountAmount() + self.modelInstance.invoiceList.taxAmount();
        }, self);

        self.currencyParser = function (data) {
            const output = {};

            output.currencies = [];

            for (let i = 0; i < data.currencyList.length; i++) {
                output.currencies.push({
                    code: data.currencyList[i].code,
                    description: data.currencyList[i].code
                });
            }

            return output;
        };

        self.saveData = function () {
            if (self.modelInstance.invoiceList.taxPercentage() === null || self.modelInstance.invoiceList.taxPercentage() === "") {
                self.modelInstance.invoiceList.taxPercentage(0);
            }

            if (self.modelInstance.invoiceList.discountPercentage() === null || self.modelInstance.invoiceList.discountPercentage() === "") {
                self.modelInstance.invoiceList.discountPercentage(0);
            }

            if (ko.isObservable(self.modelInstance.invoiceList.commodities)) {
                self.modelInstance.invoiceList.commodities([]);
            } else {
                self.modelInstance.invoiceList.commodities = ko.observableArray([]);
            }

            if (self.isCommodityAdded() === "Y") {
                for (let i = 0; i < self.commodityList().length; i++) {
                    self.commodityList()[i].invoiceNumber(self.modelInstance.invoiceList.invoiceNumber());
                    self.modelInstance.invoiceList.commodities.push(self.commodityList()[i]);
                }

                self.modelInstance.invoiceList.amount.amount(self.totalAmount());
            } else {
                self.modelInstance.invoiceList.amount.amount(self.invoiceAmount());
            }
        };

        self.updateInvoice = function () {
            const payLoad = ko.mapping.toJS(self.modelInstance.invoiceList);

            if (payLoad.commodities && payLoad.commodities !== null && payLoad.commodities.length > 0) {
                for (let i = 0; i < payLoad.commodities.length; i++) {
                    delete payLoad.commodities[i].id;
                    delete payLoad.commodities[i].currency;
                }
            }

            return new Promise(function (resolve, reject) {
                Model.invoiceinvoiceRefNoput(self.modelInstance.invoiceList.invoiceId(), ko.toJSON(payLoad)).then(function (data) {
                    resolve(data);
                }).catch(function (err) {
                    reject(err);
                });
            });
        };

        self.validateInvoiceDate = {
            validate: function (value) {
                const invoiceDate = new Date(value);

                if (self.modelInstance.invoiceList.purchaseOrderDate() !== null && self.modelInstance.invoiceList.purchaseOrderDate() !== "") {
                    const poDate = new Date(self.modelInstance.invoiceList.purchaseOrderDate());

                    if (invoiceDate < poDate) {
                        throw new oj.ValidatorError("", self.nls.invalidInvoiceDate);
                    }
                }

                return true;
            }
        };

        self.validateInvoiceDueDate = {
            validate: function (value) {
                const invoiceDueDate = new Date(value),
                    invoiceDate = new Date(self.modelInstance.invoiceList.invoiceDate());

                if (invoiceDueDate < invoiceDate) {
                    throw new oj.ValidatorError("", self.nls.invalidInvoiceDueDate);
                }

                return true;
            }
        };

        self.validateShipmenteDate = {
            validate: function (value) {
                const shipmentDate = new Date(value),
                    invoiceDate = new Date(self.modelInstance.invoiceList.invoiceDate());

                if (shipmentDate < invoiceDate && value !== null) {
                    throw new oj.ValidatorError("", self.nls.invalidShipmentDate);
                }

                return true;
            }
        };

        self.validateCost = {
            validate: function (value) {
                if (value !== null && isNaN(value)) {
                    throw new oj.ValidatorError("", self.nls.invalidInputAmount);
                }

                if (value <= 0) {
                    throw new oj.ValidatorError("", self.nls.amountValidation);
                }

                if (value) {
                    const numberfractional = value.toString().split(".");

                    if ((numberfractional[0] && (numberfractional[0].length > 15)) || (numberfractional[1] && (numberfractional[1].length > 2))) {
                        throw new oj.ValidatorError("", self.nls.amountValidation);
                    }
                }

                return true;
            }
        };

        self.validateQuantity = {
            validate: function (value) {
                if (value !== null && isNaN(value)) {
                    throw new oj.ValidatorError("", self.nls.CreateInvoice.QuantityofcommodityError);
                }

                if (value <= 0) {
                    throw new oj.ValidatorError("", self.nls.quantityValidation);
                }

                if (value) {
                    if (value.toString().length > 15) {
                        throw new oj.ValidatorError("", self.nls.quantityValidation);
                    }
                }

                return true;
            }
        };

        self.validateTaxPercent = {
            validate: function (value) {
                if (value !== null && isNaN(value)) {
                    throw new oj.ValidatorError("", self.nls.EditInvoice.TaxPercentageError);
                }

                if (value) {
                    const numberfractional = value.toString().split(".");

                    if ((numberfractional[0] && (numberfractional[0].length > 3)) || (numberfractional[1] && (numberfractional[1].length > 2))) {
                        throw new oj.ValidatorError("", self.nls.EditInvoice.TaxPercentageInvalid);
                    }
                }

                return true;
            }
        };

        self.validateDiscountPercent = {
            validate: function (value) {
                if (value !== null && isNaN(value)) {
                    throw new oj.ValidatorError("", self.nls.EditInvoice.DiscountPercentageError);
                }

                if (value) {
                    const numberfractional = value.toString().split(".");

                    if ((numberfractional[0] && (numberfractional[0].length > 3)) || (numberfractional[1] && (numberfractional[1].length > 2))) {
                        throw new oj.ValidatorError("", self.nls.EditInvoice.DiscountPercentageInvalid);
                    }
                }

                return true;
            }
        };

        self.dispose = function () {
            self.modelInstance.invoiceList.totalAmount.dispose();
            self.calculateTotalAmount.dispose();
        };

        self.dataSource23 = new oj.ArrayTableDataSource(self.commodityList, {
            idAttribute: "id"
        });

        function NameofProgram58ValueChangeHook(newValue) {
            for (let i = 0; i < self.programNameList().length; i++) {
                if (self.programNameList()[i].code === newValue) {
                    self.modelInstance.invoiceList.program.programName(self.programNameList()[i].label);
                }
            }
        }

        function BuyerName80ValueChangeHook(newValue) {

            if (self.modelInstance.invoiceList.associatedParty.id) {
                self.queryParameter().criteria[1].value.length = 0;
                self.queryParameter().criteria[1].value.push(self.modelInstance.invoiceList.associatedParty.id.value());
            }

            Model.programsget(JSON.stringify(self.queryParameter())).then(function (response) {
                self.programsgetVar(response.programs);
                self.showPrograms(false);
                self.programNameList([]);

                if (self.programsgetVar().length > 0) {
                    for (let i = 0; i < self.programsgetVar().length; i++) {
                        self.programNameList.push({
                            code: self.programsgetVar()[i].programCode,
                            label: self.programsgetVar()[i].programName
                        });
                    }
                } else {
                    $("#no-programs" + self.formId).trigger("openModal");
                }

                ko.tasks.runEarly();
                self.showPrograms(true);
            });

            for (let i = 0; i < self.buyerNameList().length; i++) {
                if (self.buyerNameList()[i].code === newValue) {
                    self.modelInstance.invoiceList.associatedParty.name(self.buyerNameList()[i].label);
                }
            }
        }

        function PurchaseOrderNo58ValueChangeHook(newValue) {
            if (newValue !== "") {
                self.poDateRequired(true);
            } else {
                self.poDateRequired(false);
            }
        }

        function PurchaseOrderDate29ValueChangeHook(newValue) {
            const newDate = new Date(newValue);

            if (newDate > self.currentDate) {
                self.startDate(newValue);
            }

            if (self.modelInstance.invoiceList.invoiceDate() !== null && self.modelInstance.invoiceList.invoiceDate() !== "") {
                const validateInvoiceDate = document.getElementById("invoice_date");

                validateInvoiceDate.validate();
            }
        }

        function InvoiceDate99ValueChangeHook(newValue) {
            self.minInvoiceDueDate(newValue);

            if (self.modelInstance.invoiceList.invoiceDueDate() !== null && self.modelInstance.invoiceList.invoiceDueDate() !== "") {
                const validateInvoiceDueDate = document.getElementById("invoice_due_date");

                validateInvoiceDueDate.validate();
            }

            if (self.modelInstance.invoiceList.shipmentDate() !== null && self.modelInstance.invoiceList.shipmentDate() !== "") {
                const validateShipmentDate = document.getElementById("ship_date");

                validateShipmentDate.validate();
            }
        }

        function AddCommodityDetails2ValueChangeHook() {
            self.modelInstance.invoiceList.taxPercentage(0);
            self.modelInstance.invoiceList.discountPercentage(0);
        }

        function InvoiceAmount14ValueChangeHook(newValue) {
            self.modelInstance.invoiceList.discountAmount(self.modelInstance.invoiceList.discountPercentage() * newValue / 100);
            self.modelInstance.invoiceList.taxAmount(self.modelInstance.invoiceList.taxPercentage() * (newValue - self.modelInstance.invoiceList.discountAmount()) / 100);
        }

        function TaxPercentage69ValueChangeHook(newValue) {
            if (self.isCommodityAdded() === "N") {
                self.modelInstance.invoiceList.taxAmount(newValue * (self.invoiceAmount() - self.modelInstance.invoiceList.discountAmount()) / 100);
            } else {
                self.modelInstance.invoiceList.taxAmount(newValue * (self.totalAmount() - self.modelInstance.invoiceList.discountAmount()) / 100);
            }
        }

        function DiscountPercentage30ValueChangeHook(newValue) {
            if (self.isCommodityAdded() === "N") {
                self.modelInstance.invoiceList.discountAmount(newValue * self.invoiceAmount() / 100);
                self.modelInstance.invoiceList.taxAmount(self.modelInstance.invoiceList.taxPercentage() * (self.invoiceAmount() - self.modelInstance.invoiceList.discountAmount()) / 100);
            } else {
                self.modelInstance.invoiceList.discountAmount(newValue * self.totalAmount() / 100);
                self.modelInstance.invoiceList.taxAmount(self.modelInstance.invoiceList.taxPercentage() * (self.totalAmount() - self.modelInstance.invoiceList.discountAmount()) / 100);
            }
        }

        const NameofProgram58Subscriber = self.modelInstance.invoiceList.program.programCode.subscribe(NameofProgram58ValueChangeHook),
            BuyerName80Subscriber = self.modelInstance.invoiceList.associatedParty.id.value.subscribe(BuyerName80ValueChangeHook),
            PurchaseOrderNo58Subscriber = self.modelInstance.invoiceList.poNumber.subscribe(PurchaseOrderNo58ValueChangeHook),
            PurchaseOrderDate29Subscriber = self.modelInstance.invoiceList.purchaseOrderDate.subscribe(PurchaseOrderDate29ValueChangeHook),
            InvoiceDate99Subscriber = self.modelInstance.invoiceList.invoiceDate.subscribe(InvoiceDate99ValueChangeHook),
            AddCommodityDetails2Subscriber = self.isCommodityAdded.subscribe(AddCommodityDetails2ValueChangeHook),
            InvoiceAmount14Subscriber = self.invoiceAmount.subscribe(InvoiceAmount14ValueChangeHook),
            TaxPercentage69Subscriber = self.modelInstance.invoiceList.taxPercentage.subscribe(TaxPercentage69ValueChangeHook),
            DiscountPercentage30Subscriber = self.modelInstance.invoiceList.discountPercentage.subscribe(DiscountPercentage30ValueChangeHook);

        self.onClickAddRow98 = function onClickAddRow98() {
            self.commodityId = self.commodityId + 1;

            self.commodityList.push({
                id: self.commodityId,
                name: ko.observable(),
                description: ko.observable(),
                quantity: ko.observable(0),
                costPerUnit: ko.observable(0),
                totalCost: ko.observable(0),
                invoiceNumber: ko.observable()
            });
        };

        self.onClickSubmit5 = function (_event, data) {

            let validateCost, validateQuantity;

            if (self.isCommodityAdded() === "Y") {
                for (let i = 0; i < self.commodityList().length; i++) {
                    validateCost = document.getElementById("cost_" + self.commodityList()[i].id);
                    validateQuantity = document.getElementById("quantity_" + self.commodityList()[i].id);

                    validateCost.validate();
                    validateQuantity.validate();
                }
            }

            const tracker = document.getElementById("track_update");

            if (params.baseModel.showComponentValidationErrors(tracker)) {
                self.saveData();

                params.baseModel.registerComponent("review-invoice-form", "supply-chain-finance");

                params.dashboard.loadComponent("review-invoice-form", {
                    data: self.modelInstance,
                    updateInvoice: self.updateInvoice
                });
            }
        };

        self.onClickBack28 = function () {
            params.rootModel.params.fromEdit = true;
            history.back();
        };

        self.onClickCopyCommodity73 = function (data) {
            self.commodityId = self.commodityId + 1;

            for (let i = 0; i < self.commodityList().length; i++) {
                if (self.commodityList()[i].id === data.id) {
                    self.commodityList.push({
                        id: self.commodityId,
                        name: ko.observable(self.commodityList()[i].name()),
                        description: ko.observable(self.commodityList()[i].description()),
                        quantity: ko.observable(self.commodityList()[i].quantity()),
                        costPerUnit: ko.observable(self.commodityList()[i].costPerUnit()),
                        totalCost: ko.observable(self.commodityList()[i].totalCost()),
                        invoiceNumber: ko.observable()
                    });

                    break;
                }
            }
        };

        self.onClickDeleteCommodity53 = function (data) {
            self.commodityList.remove(function (element) {
                return data.id === element.id;
            });
        };

        self.onClickCancel88 = function () {
            params.dashboard.switchModule();
        };

        self.dispose = function () {
            NameofProgram58Subscriber.dispose();
            BuyerName80Subscriber.dispose();
            PurchaseOrderNo58Subscriber.dispose();
            PurchaseOrderDate29Subscriber.dispose();
            InvoiceDate99Subscriber.dispose();
            AddCommodityDetails2Subscriber.dispose();
            InvoiceAmount14Subscriber.dispose();
            TaxPercentage69Subscriber.dispose();
            DiscountPercentage30Subscriber.dispose();
        };
    };
});