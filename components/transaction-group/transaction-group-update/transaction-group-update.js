define([

    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/transaction-group",
    "ojs/ojinputtext",
    "ojs/ojknockout",
    "ojs/ojknockout-validation",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup"
], function(ko, $, TransactionGroupUpdateModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.resource = resourceBundle;
        rootParams.baseModel.registerComponent("review-transaction-group-update", "transaction-group");
        rootParams.dashboard.headerName(self.nls.headers.transactiongroupheader);
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("action-header");
        self.updateReviewFlag = ko.observable(false);
        self.groupValid = ko.observable();
        self.updateConfirmFlag = ko.observable(false);
        self.transactionGroupCode = ko.observable(rootParams.rootModel.params.readtransactionGroupCode);
        self.transactionGroupDesc = ko.observable(rootParams.rootModel.params.readtransactionGroupDesc);
        self.transactionName = ko.observable(self.nls.headers.transactiongroupheader);
        self.validationTracker = ko.observable();
        self.transactionStatus = ko.observable();
        self.httpStatus = ko.observable();
        self.selectedTransactionGroupValues = ko.observableArray();
        rootParams.baseModel.registerComponent("transaction-group-read", "transaction-group");
        self.tempArray = ko.observableArray();

        if (!ko.isObservable(rootParams.rootModel.params.transactionList)) {
            rootParams.rootModel.params.transactionList = ko.observable(rootParams.rootModel.params.transactionList);
        }

        if (!ko.isObservable(self.transactionGroupId)) {
            self.transactionGroupId = ko.observable(self.params.transactionGroupId);
        }

        if (!ko.isObservable(self.transactionGroupVersion)) {
            self.transactionGroupVersion = ko.observable(rootParams.rootModel.params.transactionGroupVersion);
        }

        for (let i = 0; i < rootParams.rootModel.params.transactionList().length; i++) {
            self.selectedTransactionGroupValues.push(rootParams.rootModel.params.transactionList()[i].name);
        }

        self.transactionList = ko.observableArray();
        self.showTransactionList = ko.observable(false);

        self.cancel = function() {
            rootParams.dashboard.switchModule(true);
        };

        self.back = function() {
            history.back();
        };

        self.backOnUpdateReview = function() {
            self.updateReviewFlag(false);
        };

        self.updateTransactionGroup = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }

            const data = {
                description: self.transactionGroupDesc(),
                id: self.transactionGroupId(),
                name: self.transactionGroupCode(),
                taskDTOs: [],
                taskAspect: "limit",
                version: self.transactionGroupVersion()
            };

            self.setTaskList(data);

            const promise = TransactionGroupUpdateModel.updateTransactionGroup(ko.toJSON(data), self.transactionGroupId());

            promise.done(function(data, status, jqXhr) {
                self.updateReviewFlag(false);
                self.httpStatus(jqXhr.status);
                self.transactionStatus(data);
                self.updateConfirmFlag(true);

                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName()
                });
            });
        };

        self.updateReviewTransactionGroup = function() {
            const tracker = document.getElementById("tracker");

            if (tracker.valid === "valid") {
                const data = {
                    description: self.transactionGroupDesc(),
                    id: self.transactionGroupId(),
                    name: self.transactionGroupCode(),
                    taskDTOs: [],
                    taskAspect: "limit",
                    version: self.transactionGroupVersion(),
                    selectedTransactionGroupValues: self.selectedTransactionGroupValues()
                };

                self.setTaskList(data);

                $.extend(self.params, {
                    reviewData: data
                });

                self.updateReviewFlag(true);
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
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

        const promise1 = TransactionGroupUpdateModel.fetchTransactionList();

        promise1.then(function(data) {
            self.transactionList(data.taskList);
            self.showTransactionList(true);
        });
    };
});