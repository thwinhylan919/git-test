define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/transaction-group",
    "ojs/ojinputtext",
    "ojs/ojknockout",
    "ojs/ojknockout-validation",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojselectcombobox"
], function(oj, ko, $, TransactionGroupReadModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.resource = resourceBundle;
        rootParams.dashboard.headerName(self.nls.headers.transactiongroupheader);
        self.flag = ko.observable(false);
        self.flagData = ko.observable(false);
        self.flagData = rootParams.flag ? ko.observable(rootParams.flag) : ko.observable(false);
        self.datasourceread = new oj.ArrayTableDataSource([]);
        self.readtransactionGroupCode = ko.observable();
        self.readtransactionGroupDesc = ko.observable();
        self.transactionGroupVersion = ko.observable();
        self.transactionGroupLoaded = ko.observable(false);
        self.transactionList = ko.observableArray();
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerElement("action-header");
        self.transactionName = ko.observable(self.nls.headers.transactiongroupheader);
        self.transactionStatus = ko.observable();
        self.httpStatus = ko.observable();
        rootParams.baseModel.registerComponent("transaction-group-search", "transaction-group");
        rootParams.baseModel.registerComponent("transaction-group-update", "transaction-group");
        self.showHeader = ko.observable(false);
        self.showHeaderText = "";

        if (rootParams.transactionGroupId) {
            self.transactionGroupId = ko.observable(rootParams.transactionGroupId);
        } else {
            self.transactionGroupId = ko.observable(rootParams.rootModel.params.transactionGroupId);
        }

        self.cancel = function() {
            rootParams.dashboard.switchModule(true);
        };

        self.back = function() {
            history.back();
        };

        self.edit = function() {
            rootParams.dashboard.loadComponent("transaction-group-update", {
                transactionList: self.transactionList(),
                readtransactionGroupCode: self.readtransactionGroupCode(),
                readtransactionGroupDesc: self.readtransactionGroupDesc(),
                transactionGroupId: self.transactionGroupId(),
                transactionGroupVersion: self.transactionGroupVersion()
            });
        };

        self.deleteTransactionGroup = function() {
            TransactionGroupReadModel.deleteTransactionGroup(self.transactionGroupId()).done(function(data, status, jqXhr) {
                self.httpStatus(jqXhr.status);
                self.transactionStatus(status);
                $("#deleteDialog").hide();

                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName()
                });
            }).fail(function() {
                self.closeDeleteDialog();
                self.back();
            });
        };

        self.deleteModal = function() {
            $("#deleteDialog").trigger("openModal");
        };

        self.closeDeleteDialog = function() {
            $("#deleteDialog").hide();
        };

        self.setGroupDetails = function() {
            let i = 1;

            self.transactionListArray = $.map(self.transactionList(), function(temp) {
                const obj = {
                    recordNo: i,
                    transaction: ""
                };

                if (typeof temp.name === "function") {
                    obj.transaction = temp.name();
                } else {
                    obj.transaction = temp.name;
                }

                i++;

                return obj;
            });

            self.datasourceread.reset(self.transactionListArray, {
                idAttribute: "recordNo"
            });

            ko.tasks.runEarly();

            if (self.showHeader) {
                self.showHeaderText = self.nls.fieldname.review;
            }

            self.transactionGroupLoaded(true);

        };

        const promise1 = TransactionGroupReadModel.readTransactionGroup(self.transactionGroupId());

        promise1.then(function(data) {
            self.readtransactionGroupCode(data.taskGroupDTO.name);
            self.readtransactionGroupDesc(data.taskGroupDTO.description);
            self.transactionList(data.taskGroupDTO.taskDTOs);
            self.transactionGroupVersion(data.taskGroupDTO.version);
            self.setGroupDetails();
        });
    };
});