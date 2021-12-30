define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "jquery",
    "ojL10n!resources/nls/activity-log",
    "ojs/ojcore",
    "ojs/ojknockout",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource"
], function(oj, ko, activityLogModel, $, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle;
        self.countForHeader = rootParams.rootModel.params ? rootParams.rootModel.params.countForHeader : "";
        rootParams.baseModel.registerElement("action-widget");
        rootParams.baseModel.registerElement("nav-bar");
        rootParams.baseModel.registerComponent("transaction-detail", "admin-approvals");
        self.transactionListLoaded = ko.observable(false);

        let transactionList;

        if (rootParams.dashboard.isDashboard() === false) {
            rootParams.dashboard.headerName(self.Nls.activityLogDetails.labels.PARTY_MAINTENANCE);
        }

        activityLogModel.getTransactionList(rootParams.rootModel.view, self.fromDate && self.fromDate(), self.toDate && self.toDate(), rootParams.dashboard.appData.segment === "ADMIN" ? "A" : rootParams.dashboard.appData.segment === "CORPADMIN" ? "PA" : "P").done(function(data) {
            transactionList = data.transactionDTOs;

            transactionList = $.map(data.transactionDTOs, function(transaction) {
                if (transaction.partyName) {
                    transaction.partyName = transaction.partyName.fullName;
                }

                transaction.description = transaction.taskDTO.name;
                transaction.noOfApprovalSteps = transaction.approvalDetails.countOfApprovals;
                transaction.processingStatus = transaction.approvalDetails.status === "EXPIRED" ? "E" : transaction.approvalDetails.status === "APPROVED" ? "S" : transaction.processingDetails.status;
                transaction.status = self.Nls.activityLogDetails.status[transaction.approvalDetails.status];
                transaction.type = transaction.taskDTO.name;

                return transaction;
            });

            self.arrayDataSource = new oj.ArrayTableDataSource(transactionList || [], {
                idAttribute: "status"
            });

            self.paginationDataSource = new oj.PagingTableDataSource(self.arrayDataSource);
            self.transactionListLoaded(true);
        });
    };
});