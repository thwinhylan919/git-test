define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "jquery",
  "ojL10n!resources/nls/transactions",
  "ojL10n!resources/nls/beneficiary",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"
], function (oj, ko, BeneficiaryModel, $, resourceBundle, beneficiary) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.Nls = resourceBundle;
    self.beneficiaryNls = beneficiary;
    self.transactionListLoaded = ko.observable(false);
    self.countForHeader = rootParams.rootModel.params ? rootParams.rootModel.params.countForHeader : "";
    self.view = rootParams.rootModel.view || rootParams.rootModel.params.view;
    rootParams.baseModel.registerElement("date-time");

    let transactionList;

    self.arrayDataSource = new oj.ArrayTableDataSource([], {
      idAttribute: "transactionId"
    });

    self.paginationDataSource = new oj.PagingTableDataSource(self.arrayDataSource);

    if (rootParams.dashboard.isDashboard() === false) {
      rootParams.dashboard.headerName(self.Nls.labels.PAYEE_BILLER);
    }

    self.customList = function (data) {
      transactionList = data.transactionDTOs;

      transactionList = $.map(data.transactionDTOs, function (transaction) {
        transaction.beneficiaryName = transaction.name;
        transaction.type = transaction.taskDTO.name;
        transaction.noOfApprovalSteps = transaction.approvalDetails.countOfApprovals;
        transaction.processingStatus = transaction.approvalDetails.status === "EXPIRED" ? "E" : transaction.approvalDetails.status === "APPROVED" ? "S" : transaction.processingDetails.status;
        transaction.status = self.Nls.status[transaction.approvalDetails.status];
        transaction.category = self.beneficiaryNls.payeeCategory[transaction.category] || transaction.category;

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
      BeneficiaryModel.getTransactionList(self.view, self.fromDate && self.fromDate(), self.toDate && self.toDate(), rootParams.dashboard.appData.segment === "ADMIN" ? "A" : rootParams.dashboard.appData.segment === "CORPADMIN" ? "PA" : "P").done(function (data) {
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