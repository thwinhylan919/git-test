define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/task-aspects",
    "ojs/ojselectcombobox",
    "ojs/ojcheckboxset",
    "ojs/ojswitch",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup"
], function (ko, TransactionAspectsModel, ResourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this,
            getNewKoModel = function () {
                const KoModel = ko.mapping.fromJS(TransactionAspectsModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.payload = getNewKoModel().payload;
        self.transactionsList = ko.observable();
        self.selectedTransaction = ko.observable();
        self.graceperiod = ko.observable();
        self.approvalValue = ko.observable();
        self.graceEnabled = ko.observable(true);
        self.mode = ko.observable(self.params.mode ? self.params.mode : self.mode());
        self.emptyList = ko.observable(false);
        self.validationTracker = ko.observable();
        self.switchEnabled = ko.observable(true);
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.dashboard.headerName(self.resource.header.transactionAspects);

        self.reviewTransactionMessage = {
            header: self.resource.common.reviewHeader,
            reviewHeader: self.resource.common.reviewHeader1
        };

        if (self.mode() === "REVIEW" || (self.params.mode === "approval" && self.transactionDetails() && self.transactionDetails().transactionSnapshot)) {

            self.selectedTransaction(self.params.selectedTransaction() ? self.params.selectedTransaction() : self.transactionDetails().transactionSnapshot.taskId);

        }

        if (self.mode() === "REVIEW") {

            self.taskName = ko.observable(self.params.taskName());
            self.taskList = ko.observableArray(self.params.taskList());
            self.supportedTaskList = ko.observableArray(self.params.supportedTaskList());
            self.dataLoaded = ko.observable(true);
        }

        if (self.params.mode === "approval") {
            self.taskName = ko.observable();
            self.taskList = ko.observableArray();
            self.supportedTaskList = ko.observableArray();
            self.dataLoaded = ko.observable(false);

            TransactionAspectsModel.getTransactions().done(function (data) {
                self.transactionsList(data.taskList);
                self.dataLoaded(true);
            });

            TransactionAspectsModel.searchTransactions(self.selectedTransaction()).done(function (data) {
                self.taskName(data.task.name);
                self.emptyList(false);
                self.taskList(data.task.aspects);
                self.supportedTaskList.removeAll();
                self.graceperiod("");

                for (let i = 0; i < self.taskList().length; i++) {
                    if (self.taskList()[i].taskAspect !== "grace-period") {
                        self.supportedTaskList.push(self.taskList()[i]);
                    } else {
                        self.graceperiod(self.taskList()[i]);
                    }

                    if (self.taskList()[i].taskAspect === "approval") {
                        self.approvalValue(self.taskList()[i].enabled);
                    }
                }

                if (!self.supportedTaskList().length) {
                    self.emptyList(true);
                    self.mode("NOASPECTS");
                } else {
                    self.switchEnabled(true);
                    self.mode(self.mode() === "REVIEW" ? self.mode() : "approval");
                    self.dataLoaded(false);
                    self.dataLoaded(true);
                    self.graceEnabled(true);
                }
            });
        }

        self.saveTransactions = function () {
            self.mode("REVIEW");
            self.switchEnabled(true);
            self.graceEnabled(true);
            self.dataLoaded(false);
            self.dataLoaded(true);
        };

        self.clearTransactions = function () {
            self.selectedTransaction("");
        };

        self.changeGrace = function () {
            for (let i = 0; i < self.taskList().length; i++) {
                if (self.taskList()[i].taskAspect === "approval") {
                    self.approvalValue(self.taskList()[i].enabled);
                }
            }

            if (self.approvalValue() === true) {
                self.graceEnabled(false);
            } else {
                self.graceEnabled(true);
            }

        };

        self.confirm = function () {
            self.payload = self.taskList();

            TransactionAspectsModel.setTaskAspects(self.selectedTransaction(), ko.toJSON(self.payload)).then(function (data) {
                self.httpStatus = data.getResponseStatus();

                rootParams.dashboard.loadComponent("confirm-screen", {
                    transactionResponse: data,
                    transactionName: self.resource.common.maintenance
                });
            });
        };
    };
});