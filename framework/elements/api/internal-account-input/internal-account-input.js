define(["ojs/ojcore", "knockout", "./model", "ojL10n!resources/nls/internal-account-input", "ojs/ojinputtext"], function (oj, ko, Model, resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.account = rootParams.account;
        self.showInline = rootParams.showInline;
        self.confirmStyleAccount = !!rootParams.confirmStyleAccount;
        self.hiddenAccountNumber = ko.observable(rootParams.account());
        self.branchList = ko.observableArray();
        self.branchId = ko.observable();
        self.branchLoaded = ko.observable(false);
        self.branchName = ko.observable();
        self.accountNo = ko.observable();
        self.label = rootParams.label;
        self.readOnly = rootParams.readOnly;
        self.resourceBundle = resourceBundle;
        self.id = "INTERNAL_ACCOUNT" + rootParams.baseModel.incrementIdCount();

        const taxonomyValidator = rootParams.taxonomyValidator;

        self.required = taxonomyValidator ? false : rootParams.required;

        if (rootParams.baseModel.getConstantsProp("bankConfig.accountUniqueness") === "BRANCH") {
            if (rootParams.account()) {
                const matches = rootParams.account().split(rootParams.baseModel.getConstantsProp("bankConfig.branchAccountDelimiter"));

                self.branchId(matches[0]);
                self.accountNo(matches[1]);
                self.hiddenAccountNumber(self.accountNo());
            }

            Model.getBranch().then(function (data) {
                ko.utils.arrayPushAll(self.branchList, data.branchAddressDTO);
                self.branchLoaded(true);

                if (self.readOnly) {
                    for (let i = 0; i < data.branchAddressDTO.length; i++) {
                        if (data.branchAddressDTO[i].id === self.branchId()) {
                            self.branchName(data.branchAddressDTO[i].branchName);
                            break;
                        }
                    }
                }
            });
        }

        oj.Validation.converterFactory("maskedAccountNumber", (function () {
            return {
                createConverter: function () {
                    return {
                        format: function (value) {
                            return value ? value.replace(/[a-zA-Z0-9]/g, "*") : value;
                        }
                    };
                }
            };
        }()));

        const converter = oj.Validation.converterFactory("maskedAccountNumber").createConverter();

        self.dummyAccount = ko.computed(function () {
            if (rootParams.baseModel.getConstantsProp("bankConfig.accountUniqueness") === "BRANCH") {
                return self.branchId() + rootParams.baseModel.getConstantsProp("bankConfig.branchAccountDelimiter") + self.accountNo();
            }

            return self.branchId() + self.accountNo();
        }, self);

        self.dummyAccount.subscribe(function (value) {
            self.account(value);
        });

        function accountNumberValidator(value) {
            self.account("");

            if (value && self.account()) {
                if (value !== self.account()) {
                    self.account("");
                    throw new oj.ValidatorError("ERROR", self.resourceBundle.errorMessage);
                }

                document.getElementById(self.id + "_confirm_account_number").validate();
            }
        }

        function confirmAccountNumberValidator(value) {
            if (self.hiddenAccountNumber() && value) {
                if (self.hiddenAccountNumber() !== value) {
                    self.hiddenAccountNumber("");
                    throw new oj.ValidatorError("ERROR", self.resourceBundle.errorMessage);
                }
            }
        }

        self.getTaxonomyValidatorForField = function (fieldSelector) {
            if (taxonomyValidator) {
                return rootParams.baseModel.getTaxonomyValidator(
                    rootParams.dashboard.getTaxonomyDefinition(taxonomyValidator.dto),
                    taxonomyValidator.idField,
                    fieldSelector);
            }

            return Promise.resolve();
        };

        self.accountNumberValidator = ko.observableArray();

        if (!taxonomyValidator) {
            self.accountNumberValidator = ko.observableArray(rootParams.baseModel.getValidator("ACCOUNT"));
        }

        if (self.confirmStyleAccount) {
            self.accountNumberValidator.push({
                validate: accountNumberValidator
            });
        }

        self.clearValue = function () {
            document.querySelector("#" + self.id + "_hidden_account_number").setProperty("converter", null);
            document.querySelector("#" + self.id + "_hidden_account_number").refresh();
        };

        self.resetValue = function () {
            setTimeout(function () {
                document.querySelector("#" + self.id + "_hidden_account_number").setProperty("converter", converter);

            }, 100);
        };

        self.confirmAccountNumberValidator = [{
            validate: confirmAccountNumberValidator
        }];

        self.dispose = function () {
            self.dummyAccount.dispose();
        };
    };
});