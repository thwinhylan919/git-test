define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "jquery",
  "ojL10n!resources/nls/transactions",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"
], function (oj, ko, AccountsNonFinancialModel, $, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.Nls = resourceBundle;
    self.transactionListLoaded = ko.observable(false);
    self.countForHeader = rootParams.rootModel.params ? rootParams.rootModel.params.countForHeader : "";
    self.view = rootParams.rootModel.view || rootParams.rootModel.params.view;
    rootParams.baseModel.registerElement("date-time");

    let transactionList;

    if (rootParams.dashboard.isDashboard() === false) {
      rootParams.dashboard.headerName(self.Nls.labels.ACCOUNT_NON_FINANCIAL);
    }

    self.arrayDataSource = new oj.ArrayTableDataSource([], {
      idAttribute: "transactionId"
    });

    self.paginationDataSource = new oj.PagingTableDataSource(self.arrayDataSource);

    self.customList = function (data) {
      transactionList = data.transactionDTOs;

      transactionList = $.map(data.transactionDTOs, function (transaction) {
        transaction.type = transaction.taskDTO.name;
        transaction.processingStatus = transaction.approvalDetails.status === "EXPIRED" ? "E" : transaction.approvalDetails.status === "APPROVED" ? "S" : transaction.processingDetails.status;
        transaction.status = self.Nls.status[transaction.approvalDetails.status];
        transaction.debitAccountNumber = transaction.accountId.displayValue;
        transaction.noOfApprovalSteps = transaction.approvalDetails.countOfApprovals;

        if (transaction.amount) {
          transaction.amount = rootParams.baseModel.formatCurrency(transaction.amount.amount, transaction.amount.currency);
        }

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
      AccountsNonFinancialModel.getTransactionList(self.view, self.fromDate && self.fromDate(), self.toDate && self.toDate(), rootParams.dashboard.appData.segment === "ADMIN" ? "A" : rootParams.dashboard.appData.segment === "CORPADMIN" ? "PA" : "P").done(function (data) {
        self.customList(data);

        self.arrayDataSource.reset(transactionList || [], {
          idAttribute: "transactionId"
        });

        self.transactionListLoaded(true);
      });
    };

    self.fetchTransactionList();
  };
});