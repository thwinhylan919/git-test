define([
    "knockout",
    "./model",
    "jquery",
    "ojL10n!resources/nls/calculator",
    "ojs/ojknockout-validation",
    "ojs/ojbutton",
    "ojs/ojinputtext",
    "ojs/ojslider",
    "ojs/ojvalidationgroup"
], function(ko, LoanCalculatorModel, $, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.nls = resourceBundle;

        const getNewKoModel = function() {
            const KoModel = LoanCalculatorModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.rootModelInstance = getNewKoModel();

        rootParams.baseModel.registerElement([
            "page-section",
            "amount-input",
            "action-widget"
        ]);

        self.amount = ko.observable();
        self.years = ko.observable();
        self.months = ko.observable();
        self.dataLoaded1 = ko.observable(false);
        self.days = ko.observable();
        self.interest = ko.observable(0);
        self.principal_amount = ko.observable();
        self.interest_amount = ko.observable();
        self.currency = ko.observable();
        self.validAmount = ko.observable(false);
        self.response = ko.observable();
        self.showresponse = ko.observable(false);
        self.validationTracker = ko.observable();
        self.dataLoaded = ko.observable(false);

        if (rootParams.dashboard.isDashboard() === false && !rootParams.baseModel.isDashboardBuilderContext()) {
            rootParams.dashboard.headerName(self.nls.calculator.labels.pageHeader);
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

        function setData(data) {
            if (data.bankConfigurationDTO) {
                const configuration = data.bankConfigurationDTO;

                if (configuration.localCurrency) {
                    self.currency(configuration.localCurrency);
                    self.dataLoaded(true);
                }
            }
        }

        self.fetchCurrency = function() {
            LoanCalculatorModel.fetchLocalCurrency().done(function(data) {
                setData(data);
            });
        };

        const attributes = ["INTERESTRATE", "NOOFINSTALLMENTS", "PRINCIPALAMOUNT", "TENURE"];

        self.sliderData = {};

        let count = 0;

        for (let i = 0; i < attributes.length; i++) {
            LoanCalculatorModel.fetchCalculatorRange(i, "LOANCALCULATOR", attributes[i]).done(function(data, index) {
                self.sliderData[attributes[index]] = {
                    max: Number(data.maximumRange),
                    min: Number(data.minimumRange),
                    value: ko.observable(Number(data.defaultValue)),
                    step: 10
                };

                count++;

                if (count === attributes.length) {
                    self.sliderData.INTERESTRATE.min = self.sliderData.INTERESTRATE.min / 100;
                    self.sliderData.INTERESTRATE.max = self.sliderData.INTERESTRATE.max / 100;
                    self.sliderData.INTERESTRATE.value(self.sliderData.INTERESTRATE.value() / 100);
                    self.sliderData.INTERESTRATE.step = 0.01;
                    self.sliderData.TENURE.step = 1;
                    self.interest(self.sliderData.INTERESTRATE.value());
                    self.fetchCurrency();
                }
            });
        }

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

        self.installmentAmout = ko.observable();
        self.installmentCurrency = ko.observable();

        self.calculateLoan = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("loanCalculation"))) {
                return;
            }

            self.showresponse(false);
            self.rootModelInstance.principalAmount.amount = self.amount();
            self.rootModelInstance.principalAmount.currency = self.currency();
            self.rootModelInstance.tenure.year = Number(self.years());
            self.rootModelInstance.tenure.month = Number(self.months());
            self.rootModelInstance.tenure.day = Number(self.days());
            self.rootModelInstance.interestRate = Number(self.interest()) * 100;

            LoanCalculatorModel.calculateLoanAmount(ko.mapping.toJSON(self.rootModelInstance)).done(function(data) {
                if (data.loanScheduleDetails.length) {
                    self.installmentAmout(data.loanScheduleDetails[0].installmentAmount.amount);
                    self.installmentCurrency(data.loanScheduleDetails[0].installmentAmount.currency);
                }

                self.response(data);
                self.dataLoaded1(true);
                self.showresponse(true);
            });
        };

        self.calculateLoanInstallment = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("loanCalculation"))) {
                return;
            }

            self.showresponse(false);
            self.rootModelInstance.principalAmount.amount = self.sliderData.PRINCIPALAMOUNT.value();
            self.rootModelInstance.principalAmount.currency = self.currency();
            self.rootModelInstance.tenure.year = Number(self.sliderData.TENURE.value());
            self.rootModelInstance.interestRate = Number(self.sliderData.INTERESTRATE.value()) * 100;

            LoanCalculatorModel.calculateLoanAmount(ko.mapping.toJSON(self.rootModelInstance)).done(function(data) {
                if (data.loanScheduleDetails.length) {
                    self.installmentAmout(data.loanScheduleDetails[0].installmentAmount.amount);
                    self.installmentCurrency(data.loanScheduleDetails[0].installmentAmount.currency);
                }

                self.response(data);
                self.dataLoaded1(true);
                self.showresponse(true);
            });
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