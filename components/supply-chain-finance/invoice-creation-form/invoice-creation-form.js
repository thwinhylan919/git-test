define([
    "ojL10n!resources/nls/invoice-creation-form",
    "knockout",
    "./model",
    "ojs/ojcore",
    "jquery",
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
], function (resourceBundle, ko, Model, oj, $) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.counterPartiesgetVar = ko.observable();
        self.counterPartiesgetprogramCode = ko.observable();
        self.programsgetVar = ko.observable();
        self.programsgetprogramName = ko.observable();
        self.programsgetprogramType = ko.observable();
        self.programsgetprogramCode = ko.observable();
        self.programsgetsupplierId = ko.observable();
        self.programsgetbuyerId = ko.observable();
        self.programsgetspokeId = ko.observable();
        self.programsgetrole = ko.observable();
        params.baseModel.registerElement("amount-input");
        params.baseModel.registerElement("modal-window");
        self.iconClass = ko.observable("pull-right icon-display");
        self.showExpanded = ko.observable("show-icon");

        const getNewKoModel = function () {
            const KoModel = Model.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.modelInstance = params.rootModel.previousState ? params.rootModel.previousState.data : getNewKoModel();
        self.referenceData = params.referenceData;
        self.formId = self.referenceData.formId;
        self.validationTracker = self.referenceData.validationTracker;
        self.programNameList = ko.observableArray();
        self.showPrograms = ko.observable(true);
        self.buyerNameList = ko.observableArray();
        self.showBuyers = ko.observable(true);
        self.isCommodityAdded = ko.observable("N");
        self.invoiceAmount = ko.observable();
        self.totalAmount = ko.observable(0);
        self.poDateRequired = ko.observable(false);
        self.currencyList = params.currencyList;
        self.modelInstance.invoiceList.amount.currency(self.currencyList()[0].code);
        self.commodityId = 1;
        self.sortByParameter = ko.observableArray();
        self.count = ko.observable();

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

        const jsonDataProgramStatus = self.nls.ProgramStatus,
            programStatusArray = [];

        Object.keys(jsonDataProgramStatus).forEach(function (key) {
            programStatusArray.push(key);
        });

        self.queryParameter().criteria.push({
            operand: "status",
            operator: "EQUALS",
            value: programStatusArray
        });

        self.commodityList = ko.observableArray([{
            id: self.commodityId + "_" + self.formId,
            name: ko.observable(),
            description: ko.observable(),
            quantity: ko.observable(0),
            costPerUnit: ko.observable(0),
            totalCost: ko.observable(0)
        }]);

        self.currentDate = params.baseModel.getDate();
        self.currentDate.setDate(self.currentDate.getDate());
        self.startDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(self.currentDate));
        self.minInvoiceDueDate = ko.observable(self.startDate());

        if (self.modelInstance.invoiceList.discountPercentage() === null) {
            self.modelInstance.invoiceList.discountPercentage(0);
        }

        if (self.modelInstance.invoiceList.taxPercentage() === null) {
            self.modelInstance.invoiceList.taxPercentage(0);
        }

        if (self.referenceData.payload !== null) {
            self.invoiceAmount(self.referenceData.invoiceAmount);
            self.isCommodityAdded(self.referenceData.isCommodityAdded);

            if (!self.referenceData.payload.poNumber) {
                self.referenceData.payload.purchaseOrderDate = null;
                self.referenceData.payload.poNumber = null;
            }

            if (!self.referenceData.payload.taxPercentage || self.referenceData.payload.taxPercentage === "" || self.referenceData.payload.taxPercentage === null) {
                self.referenceData.payload.taxPercentage = 0;
            }

            if (!self.referenceData.payload.discountPercentage || self.referenceData.payload.discountPercentage === "" || self.referenceData.payload.discountPercentage === null) {
                self.referenceData.payload.discountPercentage = 0;
            }

            if (!self.referenceData.payload.shipmentDate) {
                self.referenceData.payload.shipmentDate = null;
            }

            if (self.referenceData.payload.associatedParty.id.value) {
                self.referenceData.payload.associatedParty.id = self.referenceData.payload.associatedParty.id.value;
            }

            if (!self.referenceData.payload.associatedParty.name) {
                self.referenceData.payload.associatedParty.name = "";
            }

            if (!self.referenceData.payload.program.programName) {
                self.referenceData.payload.program.programName = "";
            }

            if (self.referenceData.payload.commodities && self.referenceData.payload.commodities.length > 0) {
                self.commodityList([]);
                self.commodityId = 0;

                for (let i = 0; i < self.referenceData.payload.commodities.length; i++) {
                    self.commodityId = self.commodityId + 1;

                    self.commodityList.push({
                        id: self.commodityId + "_" + self.formId,
                        name: ko.observable(self.referenceData.payload.commodities[i].name),
                        description: ko.observable(self.referenceData.payload.commodities[i].description),
                        quantity: ko.observable(self.referenceData.payload.commodities[i].quantity),
                        costPerUnit: ko.observable(self.referenceData.payload.commodities[i].costPerUnit),
                        totalCost: ko.observable(self.referenceData.payload.commodities[i].totalCost)
                    });
                }
            } else {
                self.referenceData.payload.commodities = [];
            }

            self.modelInstance.invoiceList = ko.mapping.fromJS(self.referenceData.payload);

            if (self.modelInstance.invoiceList.purchaseOrderDate() !== null && self.modelInstance.invoiceList.purchaseOrderDate() !== "") {
                const poDate = new Date(self.modelInstance.invoiceList.purchaseOrderDate());

                if (poDate > self.currentDate) {
                    self.startDate(self.modelInstance.invoiceList.purchaseOrderDate());
                }
            }

            self.minInvoiceDueDate(self.modelInstance.invoiceList.invoiceDate());

            if (self.modelInstance.invoiceList.associatedParty.id) {
                self.queryParameter().criteria[1].value.length = 0;
                self.queryParameter().criteria[1].value.push(self.modelInstance.invoiceList.associatedParty.id());
            }

            Model.programsget(JSON.stringify(self.queryParameter()), JSON.stringify(self.sortByParameter()), self.count()).then(function (response) {
                self.programsgetVar(response.programs);
                self.showPrograms(false);
                self.programNameList([]);

                if (self.programsgetVar().length > 0) {
                    for (let i = 0; i < self.programsgetVar().length; i++) {
                        self.programNameList.push({
                            code: self.programsgetVar()[i].programCode,
                            label: self.programsgetVar()[i].programName
                        });

                        if (self.modelInstance.invoiceList.program.programCode() === self.programsgetVar()[i].programCode) {
                            self.modelInstance.invoiceList.program.programName(self.programsgetVar()[i].programName);
                        }
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
            self.showBuyers(false);
            self.buyerNameList(data.associatedParties);

            for (let i = 0; i < self.buyerNameList().length; i++) {
                if (self.modelInstance.invoiceList.associatedParty.id() === self.buyerNameList()[i].id.value) {
                    self.modelInstance.invoiceList.associatedParty.name(self.buyerNameList()[i].name);
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
            const validateInvoiceDate = document.getElementById("invoice_date_" + self.formId);

            validateInvoiceDate.validate();

            let validateCost, validateQuantity;

            if (self.isCommodityAdded() === "Y") {
                for (let i = 0; i < self.commodityList().length; i++) {
                    validateCost = document.getElementById("cost_" + self.commodityList()[i].id);
                    validateQuantity = document.getElementById("quantity_" + self.commodityList()[i].id);

                    validateCost.validate();
                    validateQuantity.validate();
                }
            }

            const tracker = document.getElementById("track_" + self.formId);

            if (params.baseModel.showComponentValidationErrors(tracker)) {
                $("#child_comp_" + self.formId).hide();
                $("#edit_" + self.formId).show();
                $("#edit_" + self.formId).parent().addClass("icon-border");
                self.referenceData.isNewInvoice = false;

                if (self.modelInstance.invoiceList.commodities) {
                    self.modelInstance.invoiceList.commodities([]);
                }

                if (self.isCommodityAdded() === "Y") {
                    for (let i = 0; i < self.commodityList().length; i++) {
                        self.modelInstance.invoiceList.commodities.push(self.commodityList()[i]);
                    }

                    self.modelInstance.invoiceList.amount.amount(self.totalAmount());
                } else {
                    self.modelInstance.invoiceList.amount.amount(self.invoiceAmount());
                }

                if (self.modelInstance.invoiceList.discountPercentage() === null || self.modelInstance.invoiceList.discountPercentage() === "") {
                    self.modelInstance.invoiceList.discountPercentage(0);
                }

                if (self.modelInstance.invoiceList.taxPercentage() === null || self.modelInstance.invoiceList.taxPercentage() === "") {
                    self.modelInstance.invoiceList.taxPercentage(0);
                }

                self.referenceData.isCommodityAdded = self.isCommodityAdded();
                self.referenceData.invoiceAmount = self.invoiceAmount();
                self.referenceData.totalAmount = self.totalAmount();
                self.referenceData.payload = ko.mapping.toJS(self.modelInstance.invoiceList);

                return true;
            }

            return false;
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
                if (value !== null && (isNaN(value) || value < 0)) {
                    throw new oj.ValidatorError("", self.nls.CreateInvoice.TaxPercentageError);
                }

                if (value) {
                    const numberfractional = value.toString().split(".");

                    if ((numberfractional[0] && (numberfractional[0].length > 3)) || (numberfractional[1] && (numberfractional[1].length > 2))) {
                        throw new oj.ValidatorError("", self.nls.CreateInvoice.TaxPercentageInvalid);
                    }
                }

                return true;
            }
        };

        self.validateDiscountPercent = {
            validate: function (value) {
                if (value !== null && (isNaN(value) || value < 0)) {
                    throw new oj.ValidatorError("", self.nls.CreateInvoice.DiscountPercentageError);
                }

                if (value) {
                    const numberfractional = value.toString().split(".");

                    if ((numberfractional[0] && (numberfractional[0].length > 3)) || (numberfractional[1] && (numberfractional[1].length > 2))) {
                        throw new oj.ValidatorError("", self.nls.CreateInvoice.DiscountPercentageInvalid);
                    }

                    if (parseInt(numberfractional[0]) > 100) {
                        throw new oj.ValidatorError("", self.nls.CreateInvoice.DiscountPercentageInvalid);
                    }

                    if (parseInt(numberfractional[0]) === 100 && parseInt(numberfractional[1]) > 0) {
                        throw new oj.ValidatorError("", self.nls.CreateInvoice.DiscountPercentageInvalid);
                    }
                }

                return true;
            }
        };

        if (!self.referenceData.isNewInvoice) {
            self.iconClass("pull-right show-icon");
            self.showExpanded("icon-display");
        }

        self.closeHandler = function () {
            $("#no-programs" + self.formId).hide();
        };

        self.closeHandlerPopUp = function () {
            $("#delete-confirm" + self.formId).hide();
        };

        self.showDeletePopup = function () {
            $("#delete-confirm" + self.formId).trigger("openModal");
        };

        self.dispose = function () {
            self.modelInstance.invoiceList.totalAmount.amount.dispose();
            self.calculateTotalAmount.dispose();
        };

        self.dataSource23 = new oj.ArrayTableDataSource(self.commodityList, {
            idAttribute: "id"
        });

        function NameofProgram21ValueChangeHook(newValue) {
            for (let i = 0; i < self.programNameList().length; i++) {
                if (self.programNameList()[i].code === newValue) {
                    self.modelInstance.invoiceList.program.programName(self.programNameList()[i].label);
                }
            }
        }

        const NameofProgram21Subscriber = self.modelInstance.invoiceList.program.programCode.subscribe(NameofProgram21ValueChangeHook);

        self.onClickEditIcon9 = function () {
            $("#child_comp_" + self.formId).show();
            $("#edit_" + self.formId).hide();
        };

        self.onClickDeleteIcon17 = function () {
            params.deleteInvoice(self.formId);
        };

        function BuyerName86ValueChangeHook(newValue) {
            self.queryParameter().criteria[1].value.length = 0;
            self.queryParameter().criteria[1].value.push(newValue);

            Model.programsget(JSON.stringify(self.queryParameter()), JSON.stringify(self.sortByParameter()), self.count()).then(function (response) {
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
                if (self.buyerNameList()[i].id.value === newValue) {
                    self.modelInstance.invoiceList.associatedParty.name(self.buyerNameList()[i].name);
                }
            }
        }

        function PurchaseOrderNo92ValueChangeHook(newValue) {
            if (newValue !== "") {
                self.poDateRequired(true);
            } else {
                self.poDateRequired(false);
            }
        }

        function PurchaseOrderDate9ValueChangeHook(newValue) {
            const newDate = new Date(newValue);

            if (newDate > self.currentDate) {
                self.startDate(newValue);
            }

            if (self.modelInstance.invoiceList.invoiceDate() !== null && self.modelInstance.invoiceList.invoiceDate() !== "") {
                const validateInvoiceDate = document.getElementById("invoice_date_" + self.formId);

                validateInvoiceDate.validate();
            }
        }

        function InvoiceDate36ValueChangeHook(newValue) {
            self.minInvoiceDueDate(newValue);

            if (self.modelInstance.invoiceList.invoiceDueDate() !== null && self.modelInstance.invoiceList.invoiceDueDate() !== "") {
                const validateInvoiceDueDate = document.getElementById("invoice_due_date_" + self.formId);

                validateInvoiceDueDate.validate();
            }

            if (self.modelInstance.invoiceList.shipmentDate() !== null && self.modelInstance.invoiceList.shipmentDate() !== "") {
                const validateShipmentDate = document.getElementById("ship_date_" + self.formId);

                validateShipmentDate.validate();
            }
        }

        function AddCommodityDetails42ValueChangeHook() {
            self.modelInstance.invoiceList.taxPercentage(0);
            self.modelInstance.invoiceList.discountPercentage(0);
        }

        function InvoiceAmount94ValueChangeHook(newValue) {
            self.modelInstance.invoiceList.discountAmount(self.modelInstance.invoiceList.discountPercentage() * newValue / 100);
            self.modelInstance.invoiceList.taxAmount(self.modelInstance.invoiceList.taxPercentage() * (newValue - self.modelInstance.invoiceList.discountAmount()) / 100);
        }

        function TaxPercentage19ValueChangeHook(newValue) {
            if (self.isCommodityAdded() === "N") {
                self.modelInstance.invoiceList.taxAmount(newValue * (self.invoiceAmount() - self.modelInstance.invoiceList.discountAmount()) / 100);
            } else {
                self.modelInstance.invoiceList.taxAmount(newValue * (self.totalAmount() - self.modelInstance.invoiceList.discountAmount()) / 100);
            }
        }

        function DiscountPercentage55ValueChangeHook(newValue) {
            if (self.isCommodityAdded() === "N") {
                self.modelInstance.invoiceList.discountAmount(newValue * self.invoiceAmount() / 100);
                self.modelInstance.invoiceList.taxAmount(self.modelInstance.invoiceList.taxPercentage() * (self.invoiceAmount() - self.modelInstance.invoiceList.discountAmount()) / 100);
            } else {
                self.modelInstance.invoiceList.discountAmount(newValue * self.totalAmount() / 100);
                self.modelInstance.invoiceList.taxAmount(self.modelInstance.invoiceList.taxPercentage() * (self.totalAmount() - self.modelInstance.invoiceList.discountAmount()) / 100);
            }
        }

        const BuyerName86Subscriber = self.modelInstance.invoiceList.associatedParty.id.subscribe(BuyerName86ValueChangeHook),
            PurchaseOrderNo92Subscriber = self.modelInstance.invoiceList.poNumber.subscribe(PurchaseOrderNo92ValueChangeHook),
            PurchaseOrderDate9Subscriber = self.modelInstance.invoiceList.purchaseOrderDate.subscribe(PurchaseOrderDate9ValueChangeHook),
            InvoiceDate36Subscriber = self.modelInstance.invoiceList.invoiceDate.subscribe(InvoiceDate36ValueChangeHook),
            AddCommodityDetails42Subscriber = self.isCommodityAdded.subscribe(AddCommodityDetails42ValueChangeHook),
            InvoiceAmount94Subscriber = self.invoiceAmount.subscribe(InvoiceAmount94ValueChangeHook),
            TaxPercentage19Subscriber = self.modelInstance.invoiceList.taxPercentage.subscribe(TaxPercentage19ValueChangeHook),
            DiscountPercentage55Subscriber = self.modelInstance.invoiceList.discountPercentage.subscribe(DiscountPercentage55ValueChangeHook);

        self.onClickAddRow14 = function () {
            self.commodityId = self.commodityId + 1;

            self.commodityList.push({
                id: self.commodityId + "_" + self.formId,
                name: ko.observable(),
                description: ko.observable(),
                quantity: ko.observable(0),
                costPerUnit: ko.observable(0),
                totalCost: ko.observable(0)
            });
        };

        self.onClickDuplicateInvoice55 = function () {
            if (self.saveData()) {
                params.copyInvoice(self.formId);
            }
        };

        self.onClickCopyCommodity97 = function (data) {
            self.commodityId = self.commodityId + 1;

            for (let i = 0; i < self.commodityList().length; i++) {
                if (self.commodityList()[i].id === data.id) {
                    self.commodityList.push({
                        id: self.commodityId + "_" + self.formId,
                        name: ko.observable(self.commodityList()[i].name()),
                        description: ko.observable(self.commodityList()[i].description()),
                        quantity: ko.observable(self.commodityList()[i].quantity()),
                        costPerUnit: ko.observable(self.commodityList()[i].costPerUnit()),
                        totalCost: ko.observable(self.commodityList()[i].totalCost())
                    });

                    break;
                }
            }
        };

        self.onClickDeleteCommodity92 = function (data) {
            self.commodityList.remove(function (element) {
                return data.id === element.id;
            });
        };

        self.dispose = function () {
            NameofProgram21Subscriber.dispose();
            BuyerName86Subscriber.dispose();
            PurchaseOrderNo92Subscriber.dispose();
            PurchaseOrderDate9Subscriber.dispose();
            InvoiceDate36Subscriber.dispose();
            AddCommodityDetails42Subscriber.dispose();
            InvoiceAmount94Subscriber.dispose();
            TaxPercentage19Subscriber.dispose();
            DiscountPercentage55Subscriber.dispose();
        };
    };
});