define([
    "ojL10n!resources/nls/create-program-parameters",
    "ojs/ojcore",
    "knockout",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext",
    "ojs/ojdatetimepicker",
    "ojs/ojswitch",
    "ojs/ojinputnumber",
    "ojs/ojfilepicker",
    "ojs/ojbutton",
    "ojs/ojlabel",
    "ojs/ojpopup"
], function (resourceBundle, oj, ko) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        params.baseModel.registerElement("help");

        self.modelInstance = params.rootModel.modelInstance;
        self.fetchedProgramTypes = params.rootModel.fetchedProgramTypes;
        self.programTypesLoaded = params.rootModel.programTypesLoaded;
        self.fetchedDisbursementMode = params.rootModel.fetchedDisbursementMode;
        self.disbursementModeLoaded = params.rootModel.disbursementModeLoaded;
        self.currencyList = params.rootModel.currencyList;
        self.currencyLoaded = params.rootModel.currencyLoaded;
        self.autoAcceptInvoice = params.rootModel.autoAcceptInvoice;
        self.autoFinance = params.rootModel.autoFinance;
        self.showNumberPicker = params.rootModel.showNumberPicker;
        self.showDisbursementDetails = params.rootModel.showDisbursementDetails;
        self.invoiceSwitch = params.rootModel.invoiceSwitch;
        self.financeSwitch = params.rootModel.financeSwitch;
        self.taxonomyDefinition = params.rootModel.taxonomyDefinition;
        self.isDisabled = ko.observable(false);

        if (params.rootModel.isEditMode) {
            self.isEditMode = params.rootModel.isEditMode;
            self.isDisabled(true);
            params.dashboard.headerName(self.nls.editProgramHeader);
        }

        const currentDate = params.baseModel.getDate(),
            validityToDate = params.baseModel.getDate();

        currentDate.setDate(currentDate.getDate());
        validityToDate.setDate(validityToDate.getDate() + 1);
        self.startDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(currentDate));
        self.validityToStartDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(validityToDate));

        if (!params.rootModel.isEditMode && self.modelInstance.effectiveDate() === null) {
            self.modelInstance.effectiveDate(self.startDate());
        }

        self.dateToCompare = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(self.modelInstance.effectiveDate())));

        self.autoFinancePopup = function (open) {
            const popup = document.querySelector("#isAutoFinanced");

            if (open) {
                const listener = popup.open("#autofin-tooltip-holder");

                popup.addEventListener("ojOpen", listener);
            } else {
                popup.close();
            }
        };

        function TypeofProgramValueChangeHook(newValue) {
            let i = 0;

            for (i = 0; i < self.fetchedProgramTypes().length; i++) {
                if (newValue === self.fetchedProgramTypes()[i].productCode) {
                    self.modelInstance.programProduct.productDescription(self.fetchedProgramTypes()[i].productDescription);
                    self.modelInstance.role(self.fetchedProgramTypes()[i].productType);
                    break;
                }
            }
        }

        self.validateToDate = {
            validate: function (value) {
                const toDate = new Date(value),
                    fromDate = new Date(self.modelInstance.effectiveDate());

                if (toDate < fromDate) {
                    throw new oj.ValidatorError("", self.nls.CreateProgram.toDateError);
                }

                return true;
            }
        };

        function validityFromDateValueChange(newValue) {
            self.validityToStartDate(newValue);

            if (self.modelInstance.expiryDate() !== null && self.modelInstance.expiryDate() !== "") {
                const validateToDate = document.getElementById("ValidityTo");

                validateToDate.validate();
            }
        }

        function AutoAcceptInvoiceValueChangeHook(newValue) {
            if (newValue === true) {
                self.autoAcceptInvoice(self.nls.yes);
                self.modelInstance.autoAcceptance(true);
                self.showNumberPicker(true);
            } else {
                self.autoAcceptInvoice(self.nls.no);
                self.modelInstance.acceptanceDays(0);
                self.modelInstance.autoAcceptance(false);
                self.showNumberPicker(false);
            }
        }

        function AutoFinanceValueChangeHook(newValue) {
            if (newValue === true) {
                self.autoFinance(self.nls.yes);
                self.modelInstance.autoFinance(true);
                self.showDisbursementDetails(true);
            } else {
                self.autoFinance(self.nls.no);
                self.modelInstance.disbursementCurrency(null);
                self.modelInstance.disbursementMode(null);
                self.modelInstance.autoFinance(false);
                self.showDisbursementDetails(false);
            }
        }

        const TypeofProgramSubscriber = self.modelInstance.programProduct.productCode.subscribe(TypeofProgramValueChangeHook),
            effectiveFromDateSubscriber = self.modelInstance.effectiveDate.subscribe(validityFromDateValueChange),
            AutoAcceptInvoiceSubscriber = self.invoiceSwitch.subscribe(AutoAcceptInvoiceValueChangeHook),
            AutoFinanceSubscriber = self.financeSwitch.subscribe(AutoFinanceValueChangeHook);

        self.dispose = function () {
            TypeofProgramSubscriber.dispose();
            effectiveFromDateSubscriber.dispose();
            AutoAcceptInvoiceSubscriber.dispose();
            AutoFinanceSubscriber.dispose();
        };

        self.onClickNext = function () {
            const tracker = document.getElementById("form_tracker");

            if (params.baseModel.showComponentValidationErrors(tracker)) {
                params.rootModel.nextStep();
            }
        };

        self.onClickCancel = function () {
            params.dashboard.switchModule();
        };
    };
});