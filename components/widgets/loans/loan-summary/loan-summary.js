define([
  "knockout",
  "ojs/ojcore",
  "./model",
  "ojL10n!resources/nls/loan-summary",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojlistview",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource"
], function (ko, oj, LoanSummaryModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    self.nls = resourceBundle;
    self.loanAccountDetaislLoaded = ko.observable(false);
    self.dataPassed = rootParams.data;
    self.selectedValue = ko.observable();
    self.conventionalAccountsAvailable = ko.observable(false);
    self.islamicAccountsAvailable = ko.observable(false);
    self.accountDataSource = ko.observableArray();
    self.refreshList = ko.observable(true);
    rootParams.baseModel.registerElement("search-box");
    self.searchData = ko.observable();
    self.isAutoPay = ko.observable(false);
    self.datasource = ko.observable();

    let accountsDetails = [];

    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerElement("action-widget");
    rootParams.baseModel.registerComponent("loan-details", "loans");

    self.typeOfAccounts = [{
      id: "CON",
      label: self.nls.accountSummary.conventionalAccount
    }, {
      id: "ISL",
      label: self.nls.accountSummary.islamicAccount
    }];

    self.selectedAccountType = function () {
      if (self.selectedValue() === "ISL") {
        return self.nls.accountSummary.profitRate;
      }

      return self.nls.accountSummary.interestRate;

    };

    self.selectedAccountTypeChangedHandler = function (event) {

      self.loanAccountDetaislLoaded(false);

      ko.utils.arrayPushAll(self.accountDataSource, accountsDetails.filter(function (item) {
        return item.module.indexOf(event.detail.value) > -1;
      }));

      self.datasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.accountDataSource, {
        idAttribute: "uniqueId"
      })));

      ko.tasks.runEarly();
      self.loanAccountDetaislLoaded(true);
    };

    function setData(data) {
      accountsDetails = data;

      let counter = 0;

      accountsDetails.forEach(function (element) {
        element.index = counter++;
      });

      self.searchData(accountsDetails);

      self.datasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(accountsDetails, {
        idAttribute: "index"
      })));

      self.datasource().sort({
        key: "maturityDate",
        direction: "ascending"
      });

      if (data[0].paymentType) {
        self.isAutoPay(true);
      }

      self.loanAccountDetaislLoaded(true);
    }

    if (!(rootParams.data && rootParams.data.accountList)) {
      LoanSummaryModel.getAccountDetails().then(function (data) {
        if (!rootParams.baseModel.isEmpty(data.accounts)) {
          accountsDetails = data.accounts;

          data.accounts.forEach(function (element) {
            element.productName = element.productDTO.description + element.id.displayValue;
            element.rawAvailableBalance = element.outstandingAmount.amount;

            if (element.module === "CON") {
              self.selectedValue("CON");
              self.conventionalAccountsAvailable(true);
            } else if (element.module === "ISL") {
              self.selectedValue("ISL");
              self.islamicAccountsAvailable(true);
            }

          });

          if (!(self.conventionalAccountsAvailable() && self.islamicAccountsAvailable())) {
            setData(accountsDetails);
          }
        }
      });
    } else {
      accountsDetails = rootParams.data.accountList;

      rootParams.data.accountList.forEach(function (element) {
        element.productName = element.productDTO.description + element.id.displayValue;
        element.rawAvailableBalance = element.outstandingAmount.amount;

        if (element.module === "CON") {
          self.selectedValue("CON");
          self.conventionalAccountsAvailable(true);
        } else if (element.module === "ISL") {
          self.selectedValue("ISL");
          self.islamicAccountsAvailable(true);
        }

      });

      if (!(self.conventionalAccountsAvailable() && self.islamicAccountsAvailable())) {
        setData(accountsDetails);
      }
    }

    self.showAccountDetails = function (data) {
      rootParams.dashboard.loadComponent("loan-details", data);
    };

    self.downloadAccounts = function () {
      LoanSummaryModel.downloadAccounts();
    };
  };
});
