define([
    "knockout",
    "./model",
    "jquery",
    "ojL10n!resources/nls/calculator",
    "ojs/ojknockout-validation",
    "ojs/ojbutton",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup"
], function(ko, TDCalculatorModel, $, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.nls = resourceBundle;

        const getNewKoModel = function() {
            const KoModel = TDCalculatorModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.rootModelInstance = getNewKoModel();
        rootParams.baseModel.registerElement(["page-section", "amount-input", "action-widget", "help"]);
        self.amount = ko.observable();
        self.years = ko.observable();
        self.months = ko.observable();
        self.dataLoaded1 = ko.observable(false);
        self.days = ko.observable();
        self.interest = ko.observable(0.01);
        self.textareaValue = ko.observable();
        self.principal_amount = ko.observable();
        self.interest_amount = ko.observable();
        self.tax_amount = ko.observable();
        self.currency = ko.observable();
        self.response = ko.observable();
        self.showresponse = ko.observable(false);
        self.depositTenureCheck = ko.observable("Tenure");
        self.validAmount = ko.observable(false);
        self.validationTracker = ko.observable();

        if (rootParams.dashboard.isDashboard() === false && !rootParams.baseModel.isDashboardBuilderContext()) {
            rootParams.dashboard.headerName(self.nls.calculator.labels.tdCalcHeader);
        }

        $("inputMonths").attr({
            max: 12,
            min: 1
        });

        $("inputDays").attr({
            max: 31,
            min: 0
        });

        $("inputYears").attr({
            max: 120,
            min: 0
        });

        self.leftClick = function() {
            let value = self.interest();

            if(parseFloat(value).toFixed(4)>0.01){
            value -= 0.0025;
            self.interest(value);
            }
        };

        self.rightClick = function() {
            let value = self.interest();

            if(parseFloat(value).toFixed(4)<0.25){
            value = +value + 0.0025;
            self.interest(value);
            }
        };

        self.tenureChangeHandler = function() {
            if (self.depositTenureCheck() === "Tenure") {
                self.rootModelInstance().maturityData.tenure.days("");
                self.rootModelInstance().maturityData.tenure.months("");
                self.rootModelInstance().maturityData.tenure.years("");
            } else {
                self.rootModelInstance().maturityData.tenure.days(null);
                self.rootModelInstance().maturityData.tenure.months(null);
                self.rootModelInstance().maturityData.tenure.years(null);
            }
        };

        self.fetchCurrency = function() {
            TDCalculatorModel.fetchLocalCurrency().done(function(data) {
                if (data.bankConfigurationDTO) {
                    const configuration = data.bankConfigurationDTO;

                    if (configuration.localCurrency) {
                        self.currency(configuration.localCurrency);
                    }
                }
            });
        };

        self.fetchCurrency();

        self.calculate = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("calculateTD"))) {
                return;
            }

            if (!self.validateDateAndInterest()) {
                return;
            }

            self.showresponse(false);
            self.rootModelInstance.initialDepositAmount.amount = self.amount();
            self.rootModelInstance.initialDepositAmount.currency = self.currency();
            self.rootModelInstance.tenure.year = Number(self.years());
            self.rootModelInstance.tenure.month = Number(self.months());
            self.rootModelInstance.tenure.day = Number(self.days());
            self.rootModelInstance.interestRate = Number(self.interest()) * 100;

            TDCalculatorModel.calculateAmount(ko.mapping.toJSON(self.rootModelInstance)).done(function(data) {
                self.response(data);
                self.dataLoaded1(true);
                self.showresponse(true);
                self.flip();
            });
        };

        self.flip = function() {
            $(".flip-card").toggleClass("flipped");
        };

        self.validateDateAndInterest = function() {
            let error = true;

            if (self.years() && isNaN(self.years())) {
                rootParams.baseModel.showMessages(null, [self.nls.calculator.validate.year], "ERROR");
                error = false;
            } else if (!self.years()) {
                rootParams.baseModel.showMessages(null, [self.nls.calculator.validate.emptyYear], "ERROR");
                error = false;

                return error;
            }

            if (self.months() && isNaN(self.months())) {
                rootParams.baseModel.showMessages(null, [self.nls.calculator.validate.month], "ERROR");
                error = false;
            }

            if (self.days() && isNaN(self.days())) {
                rootParams.baseModel.showMessages(null, [self.nls.calculator.validate.day], "ERROR");
                error = false;
            }

            if (!self.interest()) {
                rootParams.baseModel.showMessages(null, [self.nls.calculator.validate.emptyInterest], "ERROR");
                error = false;
            }

            return error;
        };

        self.getTemplate = function() {
            if (rootParams.baseModel.isDashboardBuilderContext()) {
                return "corpTemplate";
            } else if (rootParams.dashboard.appData.segment !== "CORP") {
                return "retTemplate";
            }

            return "corpTemplate";
        };
    };
});