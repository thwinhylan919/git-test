define([
    "knockout",
    "ojL10n!resources/nls/transaction-limit",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox"
], function(ko, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.validationObject = rootParams.validationObject;
        self.transactionLimitSelected = ko.observable(false);
        self.editable = rootParams.limitEditable;
        self.showTransactionSearchSection = ko.observable(rootParams.visibility() ? rootParams.visibility() : rootParams.limitEditable);
        self.linkageArrayId = ko.observable();
        self.selectedTransactionRecord = ko.observable();
        self.transactionLimitsData = ko.observableArray(rootParams.limitsData().transactionLimits());
        self.templateFlagData = rootParams.templateLoadingFlag;

        const transactionLimitsDispose = rootParams.limitsData().transactionLimits.subscribe(function(newValue) {
            ko.tasks.runEarly();
            self.transactionLimitsData(newValue);

            if (self.transactionLimitsData()) {
                self.transactionLimitsData().sort(function(left, right) {
                    return left.limitName.toLowerCase() === right.limitName.toLowerCase() ? 0 : left.limitName.toLowerCase() < right.limitName.toLowerCase() ? -1 : 1;
                });
            }

            self.showTransactionSearchSection(true);
            rootParams.visibility(true);
        });

        self.checkEdit = function() {
            if (!ko.isObservable(self.limitId)) {
                self.limitId = ko.observable(self.limitId);
            }

if (!ko.isObservable(self.limitName)) {
                self.limitName = ko.observable(self.limitName);
            }

             if (!ko.isObservable(self.limitDescription)) {
                self.limitDescription = ko.observable(self.limitDescription);
            }

             if (!ko.isObservable(self.currency)) {
                self.currency = ko.observable(self.currency);
            }

            if (self.limitId()) {
                self.selectedTransactionRecord(self.limitId());
            }
        };

        const selectedTransactionRecordDispose = self.selectedTransactionRecord.subscribe(function(newValue) {
            if (!newValue) {
                self.limitId(null);
                self.limitName(null);
                self.limitDescription(null);
                self.amountRange = null;
                self.currency(null);
                self.transactionLimitSelected(false);
            } else {
                const test = ko.utils.arrayFirst(self.transactionLimitsData(), function(item) {
                    return parseInt(item.limitId) === parseInt(newValue);
                });

                if (test) {
                    self.limitId(test.limitId);
                    self.limitName(test.limitName);
                    self.limitDescription(test.limitDescription);
                    self.amountRange = test.amountRange;
                    self.currency(test.currency);
                    self.transactionLimitSelected(false);
                }
            }
        });

        self.showTransactionDetails = function() {
            self.showTransactionLimitsSearch(true);
        };

        self.deleteCurrentSelection = function() {
            self.showTransactionSearchSection(false);
            self.limitId(null);
            self.limitName(null);
            self.limitDescription(null);
            self.amountRange = null;
            self.currency(null);
            self.transactionLimitSelected(false);
            self.selectedTransactionRecord(null);
        };

        self.dispose = function() {
            transactionLimitsDispose.dispose();
            selectedTransactionRecordDispose.dispose();
        };
    };
});