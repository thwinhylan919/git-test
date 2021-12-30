define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/transactions",
  "ojs/ojcore",
  "ojs/ojknockout",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"
], function (oj, ko, $, TradeFinanceModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.Nls = resourceBundle;
    self.transactionListLoaded = ko.observable(false);
    self.countForHeader = rootParams.rootModel.params ? rootParams.rootModel.params.countForHeader : null;
    self.view = rootParams.rootModel.view || rootParams.rootModel.params.view;
    rootParams.baseModel.registerElement("date-time");
    rootParams.baseModel.registerComponent("transaction-detail", "approvals");

    if (rootParams.dashboard.isDashboard() === false) {
      rootParams.dashboard.headerName(self.Nls.labels.TRADE_FINANCE);
    }

    let transactionList;

    self.arrayDataSource = new oj.ArrayTableDataSource([], {
      idAttribute: "transactionId"
    });

    self.paginationDataSource = new oj.PagingTableDataSource(self.arrayDataSource);

    self.customList = function (data) {
      transactionList = data.transactionDTOs;

      transactionList = $.map(data.transactionDTOs, function (transaction) {
        transaction.type = transaction.taskDTO.name;
        transaction.noOfApprovalSteps = transaction.approvalDetails.countOfApprovals;
        transaction.processingStatus = transaction.approvalDetails.status === "EXPIRED" ? "E" : transaction.approvalDetails.status === "APPROVED" ? "S" : transaction.processingDetails.status;
        transaction.status = self.Nls.status[transaction.approvalDetails.status];

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

      TradeFinanceModel.getTransactionList(self.view, self.fromDate && self.fromDate(), self.toDate && self.toDate(), rootParams.dashboard.appData.segment === "ADMIN" ? "A" : rootParams.dashboard.appData.segment === "CORPADMIN" ? "PA" : "P").done(function (data) {
        self.customList(data);
        self.transactionListLoaded(true);

        self.arrayDataSource.reset(transactionList || [], {
          idAttribute: "transactionId"
        });
      });
    };

    self.fetchTransactionList();
  };
});