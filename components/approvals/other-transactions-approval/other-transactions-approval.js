define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "jquery",
  "ojL10n!resources/nls/transactions",
  "ojs/ojknockout",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"
], function (oj, ko, BulkModel, $, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.countForHeader = rootParams.rootModel.params ? rootParams.rootModel.params.countForHeader : "";
    self.Nls = resourceBundle;
    self.transactionListLoaded = ko.observable(false);
    self.view = rootParams.rootModel.view || rootParams.rootModel.params.view;

    let transactionList;

    rootParams.baseModel.registerElement("date-time");

    if (rootParams.dashboard.isDashboard() === false) {
      rootParams.dashboard.headerName(self.Nls.labels.OTHER_TRANSACTION);
    }

    self.arrayDataSource = new oj.ArrayTableDataSource([], {
      idAttribute: "referenceNo"
    });

    self.paginationDataSource = new oj.PagingTableDataSource(self.arrayDataSource);

    self.customList = function (data) {
      transactionList = data.transactionDTOs;

      transactionList = $.map(data.transactionDTOs, function (transaction) {
        transaction.processingStatus = transaction.approvalDetails.status === "EXPIRED" ? "E" : transaction.approvalDetails.status === "APPROVED" ? "S" : transaction.processingDetails.status;
        transaction.status = self.Nls.status[transaction.approvalDetails.status];
        transaction.valueDate = transaction.creationDate;
        transaction.noOfApprovalSteps = transaction.approvalDetails.countOfApprovals;
        transaction.referenceNo = transaction.transactionId;
        transaction.transactionType = transaction.taskDTO.transactionName;
        transaction.description = transaction.taskDTO.name;
        transaction.type = transaction.taskDTO.name;

        transaction.initiatedBy = rootParams.baseModel.format(self.Nls.labels.createdBy, {
          FName: transaction.createdByDetails.firstName,
          LName: transaction.createdByDetails.lastName
        });

        return transaction;
      });
    };

    self.onTransactionRowClicked = function (event) {
      rootParams.dashboard.loadComponent("transaction-detail", {
        event: event
      });
    };

    self.fetchTransactionList = function () {
      BulkModel.getTransactionList(self.view, self.fromDate && self.fromDate(), self.toDate && self.toDate(), rootParams.dashboard.appData.segment === "ADMIN" ? "A" : rootParams.dashboard.appData.segment === "CORPADMIN" ? "PA" : "P").done(function (data) {
        self.customList(data);

        self.arrayDataSource.reset(transactionList || [], {
          idAttribute: "referenceNo"
        });

        self.transactionListLoaded(true);
      });
    };

    self.fetchTransactionList();
  };
});