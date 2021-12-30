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
], function (oj, ko, ForexDealModel, $, resourceBundle) {
  "use strict";

  /** Forex Deal Transactions.
   *
   * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
   * @return {Function} Function.
   */
  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.transactionListLoaded = ko.observable(false);
    self.dataSourceLoaded = ko.observable(false);
    self.countForHeader = rootParams.rootModel.params ? rootParams.rootModel.params.countForHeader : "";
    self.view = rootParams.rootModel.view || rootParams.rootModel.params.view;
    rootParams.baseModel.registerElement("date-time");
    rootParams.baseModel.registerComponent("transaction-detail", "approvals");

    if (rootParams.dashboard.isDashboard() === false) {
      rootParams.dashboard.headerName(self.nls.labels.FOREX_DEAL);
    }

    self.forexDataSource = ko.observable();

    self.columnArray = [{
        headerText: self.nls.labels.date,
        template: "creation_Date"
      },
      {
        headerText: self.nls.labels.referenceNo,
        template: "reference_No"
      },
      {
        headerText: self.nls.labels.description,
        field: "type"
      },
      {
        headerText: self.nls.labels.dealType,
        field: "dealType"
      },
      {
        headerText: self.nls.labels.currencyCombination,
        field: "currencyCombination"
      },
      {
        headerText: self.nls.labels.amount,
        field: "amount"
      },
      {
        headerText: self.nls.labels.status,
        template: "approvalStatus"
      }
    ];

    ForexDealModel.getTransactionList(self.view, self.fromDate && self.fromDate(), self.toDate && self.toDate(), rootParams.dashboard.appData.segment === "ADMIN" ? "A" : rootParams.dashboard.appData.segment === "CORPADMIN" ? "PA" : "P").then(function (data) {
      const forexListArray = $.map(data.transactionDTOs, function (transaction) {
        return {
          date: transaction.creationDate,
          transactionId: transaction.transactionId,
          type: transaction.taskDTO.name,
          dealType: self.nls.labels.dealPatternType[transaction.dealType],
          noOfApprovalSteps: transaction.approvalDetails.countOfApprovals,
          currencyCombination: transaction.currency1 + "-" + transaction.currency2,
          amount: transaction.rateType === "B" ? rootParams.baseModel.format(self.nls.labels.dealAmountBuyCp, {
            rateType: self.nls.labels.buy,
            currency: rootParams.baseModel.formatCurrency(transaction.buyAmount.amount, transaction.buyAmount.currency)
          }) : rootParams.baseModel.format(self.nls.labels.dealAmountSellCp, {
            rateType: self.nls.labels.sell,
            currency: rootParams.baseModel.formatCurrency(transaction.sellAmount.amount, transaction.sellAmount.currency)
          }),
          processingStatus: transaction.approvalDetails.status === "EXPIRED" ? "E" : transaction.approvalDetails.status === "APPROVED" ? "S" : transaction.processingDetails.status,
          status: self.nls.status[transaction.approvalDetails.status]
        };
      });

      self.forexDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(forexListArray) || []));
      self.dataSourceLoaded(true);
    });

    /**
     * This function will load the forex transactions deal details.
     *
     * @memberOf forex-deal-transactions
     * @param {Object} event  - Contains the transaction Id.
     * @function onTransactionRowClicked
     * @returns {void}
     */
    self.onTransactionRowClicked = function (event) {
      rootParams.dashboard.loadComponent("transaction-detail", {
        event: event
      });
    };
  };
});