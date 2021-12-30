define([
  "knockout",
  "jquery",
  "ojs/ojcore",
  "./model",
  "ojL10n!resources/nls/td-summary",
  "ojs/ojmodel",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojcollectiontabledatasource",
  "ojs/ojlistview",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource"
], function (ko, $, oj, AccountSummaryModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    self.nls = resourceBundle;
    self.tdSummaryLoaded = ko.observable(false);
    self.realData = [];
    self.ui = ko.observable();
    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerElement("action-widget");
    rootParams.baseModel.registerComponent("td-corporate-details", "term-deposits");
    self.selectedValue = ko.observable();
    self.conventionalAccountsAvailable = ko.observable(false);
    self.islamicAccountsAvailable = ko.observable(false);
    self.accountDataSource = ko.observableArray();
    self.accountDetailsLoaded = ko.observable(false);
    self.selectedValue = ko.observable();

    self.selectedAccountType = function () {
      if (self.selectedValue() === "ISL") {
        return self.nls.depositsSummary.profitRate;
      }

      return self.nls.depositsSummary.interestRate;

    };

    self.hideClass = function () {
      if (self.selectedValue() === "ISL") {
        return "hide";
      }

      return "";
    };

    const taskModel = oj.Model.extend({
      idAttribute: "accountId"
    });

    self.typeOfAccounts = [{
      id: "CON",
      label: self.nls.accountSummary.conventionalAccount
    }, {
      id: "ISL",
      label: self.nls.accountSummary.islamicAccount
    }];

    self.customSort = function () {
      if (self.ui()) {
        switch (self.ui().header) {
          case "partyName":
            self.realData = rootParams.baseModel.sortLib(self.realData, "partyName", self.ui().direction === "ascending" ? "asc" : "desc");
            break;
          case "id.displayValue":
            self.realData = rootParams.baseModel.sortLib(self.realData, "id.displayValue", self.ui().direction === "ascending" ? "asc" : "desc");
            break;
          case "interestRate":
            self.realData = rootParams.baseModel.sortLib(self.realData, "interestRate", self.ui().direction === "ascending" ? "asc" : "desc");
            break;
          case "maturityDate":
            self.realData = rootParams.baseModel.sortLib(self.realData, "maturityDate", self.ui().direction === "ascending" ? "asc" : "desc");
            break;
          case "principalAmount":
            self.realData = rootParams.baseModel.sortLib(self.realData, [
              "principalAmount.currency",
              "principalAmount.amount"
            ], self.ui().direction === "ascending" ? [
              "asc",
              "asc"
            ] : [
                "desc",
                "desc"
              ]);

            break;
          case "maturityAmount":
            self.realData = rootParams.baseModel.sortLib(self.realData, [
              "maturityAmount.currency",
              "maturityAmount.amount"
            ], self.ui().direction === "ascending" ? [
              "asc",
              "asc"
            ] : [
                "desc",
                "desc"
              ]);

            break;
          default:
            throw new Error("PLEASE_PASS_A_SORT_CASE_FOR_THE_HEADER:" + self.ui().header);
        }

        self.ui(null);
        // eslint-disable-next-line no-use-before-define
        collection.reset(self.realData);
      }
    };

    const taskCollection = oj.Collection.extend({
      sort: self.customSort,
      model: taskModel
    }),
      collection = new taskCollection();

    collection.set([]);
    self.datasource = new oj.PagingTableDataSource(new oj.CollectionTableDataSource(collection));

    self.selectedAccountTypeChangedHandler = function (event) {
      self.datasource = null;
      self.accountDataSource.removeAll();
      self.accountDetailsLoaded(false);

      ko.utils.arrayPushAll(self.accountDataSource, self.realData.filter(function (item) {
        return item.module.indexOf(event.detail.value) > -1;
      }));

      self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.accountDataSource()));
      ko.tasks.runEarly();
      self.accountDetailsLoaded(true);
    };

    function setData() {
      if (!(self.conventionalAccountsAvailable() && self.islamicAccountsAvailable())) {
        self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.realData, { idAttribute: "id" }));
        self.accountDetailsLoaded(true);
      }

    }

    if (!(rootParams.data && rootParams.data.accountList)) {
      AccountSummaryModel.getAccountDetails().then(function (data) {
        if (!rootParams.baseModel.isEmpty(data.accounts)) {
          self.realData = data.accounts;

          data.accounts.forEach(function (element) {
            element.rawPrincipalAmount = element.principalAmount.amount;
            element.rawDisplayValue = element.id.displayValue;
            element.rawMaturityAmount = element.maturityAmount.amount;

            if (element.module === "CON") {
              self.selectedValue("CON");
              self.conventionalAccountsAvailable(true);
            } else if (element.module === "ISL") {
              self.selectedValue("ISL");
              self.islamicAccountsAvailable(true);
            }
          });

          if (self.conventionalAccountsAvailable() && self.islamicAccountsAvailable()) {
            self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.realData));
            self.accountDetailsLoaded(true);
          }
        }

        setData();
      });

    } else {
      self.realData = rootParams.data.accountList;

      self.realData.forEach(function (element) {
        element.rawPrincipalAmount = element.principalAmount.amount;
        element.rawDisplayValue = element.id.displayValue;
        element.rawMaturityAmount = element.maturityAmount.amount;

        if (element.module === "CON") {
          self.selectedValue("CON");
          self.conventionalAccountsAvailable(true);
        } else if (element.module === "ISL") {
          self.selectedValue("ISL");
          self.islamicAccountsAvailable(true);
        }
      });

      if (self.conventionalAccountsAvailable() && self.islamicAccountsAvailable()) {
        self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.realData));
        self.accountDetailsLoaded(true);
      }

      collection.reset(self.realData);
      setData();
    }

    $(document).on("ojsort", "table#TDSummaryTable", function (_event, ui) {
      self.ui(ui);
    });

    self.showAccountDetails = function (data) {
      rootParams.dashboard.loadComponent("td-corporate-details", data);
    };

    self.downloadAccounts = function () {
      AccountSummaryModel.downloadAccounts();
    };
  };
});
