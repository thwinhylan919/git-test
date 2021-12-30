define([

    "knockout",
    "./model",
    "jquery",

    "ojL10n!resources/nls/transaction-group",
    "ojs/ojinputtext",
    "ojs/ojknockout-validation",
    "ojs/ojbutton",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup"
], function(ko, TransactionGroupCreateModel, $, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.dashboard.headerName(self.nls.headers.transactiongroupheader);
        self.selectedTransactionGroupValues = ko.observableArray();
        self.transactionList = ko.observableArray();
        self.createtransactionGroupCode = ko.observableArray();
        self.createtransactionGroupDesc = ko.observableArray();
        self.showTransactionList = ko.observable(false);
        self.createReviewFlag = ko.observable(false);
        self.createConfirmFlag = ko.observable(false);
        rootParams.baseModel.registerElement("confirm-screen");
        self.groupValid = ko.observable();
        self.transactionName = ko.observable(self.nls.headers.transactiongroupheader);
        self.validationTracker = ko.observable();
        self.tempArray = ko.observableArray();
        self.transactionStatus = ko.observable();
        self.httpStatus = ko.observable();
        rootParams.baseModel.registerComponent("transaction-group-search", "transaction-group");
        rootParams.baseModel.registerComponent("review-transaction-group-create", "transaction-group");

        self.cancel = function() {
            rootParams.dashboard.switchModule(true);
        };

        self.back = function() {
            history.back();
        };

        self.backOnCreateReview = function() {
            self.createReviewFlag(false);
        };

        self.reviewCreateTransactionGroup = function() {
            const tracker = document.getElementById("tracker");

            if (tracker.valid === "valid") {
                const data = {
                    description: self.createtransactionGroupDesc(),
                    name: self.createtransactionGroupCode(),
                    selectedTransactionGroupValues: self.selectedTransactionGroupValues()
                };

                self.setTaskList(data);

                $.extend(self.params, {
                    reviewData: data
                });

                self.createReviewFlag(true);
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        };

        self.createTransactionGroup = function() {
            const data = {
                description: self.createtransactionGroupDesc(),
                name: self.createtransactionGroupCode(),
                taskDTOs: [],
                taskAspect: "limit"
            };

            self.setTaskList(data);

            TransactionGroupCreateModel.createTransactionGroup(ko.toJSON(data)).done(function(data, status, jqXhr) {
                self.createReviewFlag(false);
                self.createConfirmFlag(true);
                self.httpStatus(jqXhr.status);
                self.transactionStatus(data);

                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName()
                });
            });
        };

        self.setTaskList = function(data) {
            data.taskDTOs = [];
            self.tempArray.removeAll();

            for (let i = 0; i < self.selectedTransactionGroupValues().length; i++) {
                for (let m = 0; m < self.transactionList().length; m++) {
                    if (self.transactionList()[m].name === self.selectedTransactionGroupValues()[i]) {
                        self.tempArray.push(self.transactionList()[m].id);
                        break;
                    }
                }
            }

            for (let j = 0; j < self.tempArray().length; j++) {
                data.taskDTOs.push({
                    id: self.tempArray()[j]
                });
            }
        };

        const promise1 = TransactionGroupCreateModel.fetchTransactionList();

        promise1.then(function(data) {
            self.transactionList(data.taskList);
            self.showTransactionList(true);
        });
    };
});