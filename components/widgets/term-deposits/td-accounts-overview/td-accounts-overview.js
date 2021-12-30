define([
  "knockout",
  "ojs/ojcore",
  "ojL10n!resources/nls/td-accounts-overview",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojchart",
  "ojs/ojlegend"
], function(ko, oj, resourceBundle, Model) {
  "use strict";

  return function(rootParams) {
    const self = this;

    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerElement("action-widget");
    self.nls = resourceBundle;
    self.totalCurrentBal = ko.observable(0);
    self.totalInvestment = ko.observable(0);
    self.totalMaturityAmount = ko.observable(0);
    self.baseCcy = ko.observable();

    let accountNumberCount = 0;

    self.orientationValue = ko.observable("horizontal");
    self.yAxisConverter = ko.observable();
    self.tdOverviewBarSeriesValue = ko.observableArray();
    self.tdOverviewGroupValue = ko.observableArray();
    self.count = ko.observable(0);
    self.barGapRatio = ko.observable(0.6);
    self.maxBarWidth = ko.observable(10);
    self.horizAlign = ko.observable("center");
    self.vertAlign = ko.observable("middle");
    self.accountsData = ko.observable();
    self.accountsLoaded = ko.observable(false);
    self.dataLoaded = ko.observable(false);
    self.dataList = ko.observable();
    self.chartData = ko.observable();

    if (!rootParams.baseModel.large()) {
      self.barGapRatio = ko.observable(0.4);
      self.maxBarWidth = ko.observable(8);
    }

    self.typeOfAccounts = [{
      id: "CON",
      label: self.nls.accountDetails.labels.conventionalAccount
    }, {
      id: "ISL",
      label: self.nls.accountDetails.labels.islamicAccount
    }];

    function getConventionalAccounts(accounts, data) {
      self.totalCurrentBal(accounts.items[0].totalActiveAvailableBalance.amount);
      self.totalInvestment(accounts.items[0].totalActiveInvestmentAmount.amount);
      self.totalMaturityAmount(accounts.items[0].totalActiveMaturityAmount.amount);
      self.baseCcy(accounts.items[0].totalActiveMaturityAmount.currency);

      for (let i = 0; i < data.accounts.length; i++) {
        if (data.accounts[i].status === "ACTIVE") {
          accountNumberCount += 1;
        }
      }

      self.count(accountNumberCount);

      const converterFactory = oj.Validation.converterFactory("number"),
       currencyConverter = converterFactory.createConverter({
        style: "currency",
        currency: self.baseCcy()
      });

      self.yAxisConverter(currencyConverter);
    }

    function getIslamicAccounts(accounts, data) {
      self.totalCurrentBal(accounts.items[0].totalISLActiveAvailableBalance.amount);
      self.totalInvestment(accounts.items[0].totalISLActiveInvestmentAmount.amount);
      self.totalMaturityAmount(accounts.items[0].totalISLActiveMaturityAmount.amount);
      self.baseCcy(accounts.items[0].totalISLActiveMaturityAmount.currency);

      for (let i = 0; i < data.accounts.length; i++) {
        if (data.accounts[i].status === "ACTIVE") {
          accountNumberCount += 1;
        }
      }

      self.count(accountNumberCount);

      const converterFactory = oj.Validation.converterFactory("number"),
       currencyConverter = converterFactory.createConverter({
        style: "currency",
        currency: self.baseCcy()
      });

      self.yAxisConverter(currencyConverter);
    }

    self.selectedAccountTypeChangedHandler = function(event) {
      self.dataLoaded(false);
      self.tdOverviewBarSeriesValue.removeAll();
      self.dataList(self.accountsData());

      if (event.detail.value === "CON") {
        getConventionalAccounts(self.dataList(), self.chartData());
      } else {
        getIslamicAccounts(self.dataList(), self.chartData());
      }

      self.tdOverviewGroupValue([
        rootParams.baseModel.format(self.nls.accountDetails.labels.investments, {
          amount: rootParams.baseModel.formatCurrency(self.totalInvestment(), self.baseCcy())
        }),
        rootParams.baseModel.format(self.nls.accountDetails.labels.currentBalance, {
          amount: rootParams.baseModel.formatCurrency(self.totalCurrentBal(), self.baseCcy())
        }),
        rootParams.baseModel.format(self.nls.accountDetails.labels.maturityAmount, {
          amount: rootParams.baseModel.formatCurrency(self.totalMaturityAmount(), self.baseCcy())
        })
      ]);

      self.tdOverviewBarSeriesValue.push({
        items: [{
          value: self.totalInvestment(),
          className: "totalInvestment",
          svgStyle: "styleLabel",
          labelStyle: "totalInvestment"
        }, {
          value: self.totalCurrentBal(),
          className: "totalCurrentBal",
          labelStyle: "totalCurrentBal",
          svgStyle: "styleLabel"
        }, {
          value: self.totalMaturityAmount(),
          className: "totalMaturityAmount",
          labelStyle: "totalMaturityAmount",
          svgStyle: "styleLabel"
        }]
      });

      self.legendSections = ko.observableArray([{
        items: [{
          text: rootParams.baseModel.format(self.nls.accountDetails.labels.investments, {
            amount: rootParams.baseModel.formatCurrency(self.totalInvestment(), self.baseCcy())
          }),
          color: "#007fd9"
        }, {
          text: rootParams.baseModel.format(self.nls.accountDetails.labels.currentBalance, {
            amount: rootParams.baseModel.formatCurrency(self.totalCurrentBal(), self.baseCcy())
          }),
          color: "#3ca241"
        }, {
          text: rootParams.baseModel.format(self.nls.accountDetails.labels.maturityAmount, {
            amount: rootParams.baseModel.formatCurrency(self.totalMaturityAmount(), self.baseCcy())
          }),
          color: "#f5b73d"
        }]
      }]);

      self.styleDefaults = ko.pureComputed(function() {
        return {
          barGapRatio: self.barGapRatio(),
          maxBarWidth: self.maxBarWidth()
        };
      });

      ko.tasks.runEarly();
      self.dataLoaded(true);
    };

    Model.fetchAccounts().then(function(data) {
      if (data && data.summary) {
        self.accountsData(data.summary);
        self.accountsLoaded(true);
        self.chartData(data);
      }
    });
  };
});
