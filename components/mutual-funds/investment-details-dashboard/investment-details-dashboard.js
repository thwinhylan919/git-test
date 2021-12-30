define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/investment-details-dashboard",
  "ojs/ojbutton",
  "ojs/ojselectcombobox",
  "ojs/ojnavigationlist",
  "ojs/ojcheckboxset",
  "ojs/ojmenu"
], function (ko, DashboardModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.pageHeader);

    params.baseModel.registerComponent("accounts-overview", "mutual-funds");
    params.baseModel.registerComponent("asset-distribution-widget", "mutual-funds");
    params.baseModel.registerComponent("risk-profile-widget", "mutual-funds");
    params.baseModel.registerComponent("recommended-allocation-widget", "mutual-funds");
    params.baseModel.registerComponent("recurring-summary", "mutual-funds");
    params.baseModel.registerComponent("holdings-summary", "mutual-funds");
    params.baseModel.registerComponent("dividends-summary", "mutual-funds");
    params.baseModel.registerComponent("performance-summary", "mutual-funds");
    params.baseModel.registerComponent("portfolio-summary", "mutual-funds");
    self.menuSelection = ko.observable("portfolio-summary");
    params.baseModel.registerElement("nav-bar");
    self.accountNumber = ko.observableArray();
    self.accountSummary = ko.observable();
    self.holdingsList = ko.observable();
    self.dividendsList = ko.observable();
    self.performanceList = ko.observable();
    self.nonRedeemedData = ko.observable();
    self.showSummary = ko.observable(false);
    self.recurringList = ko.observable();
    self.refreshedData = ko.observable(false);
    self.investmentDetails = ko.observable();
    self.accountsLoaded = ko.observable(false);
    self.profileLoaded = ko.observable(false);
    self.summaryLoaded = ko.observable(false);
    self.schemesList = ko.observableArray();
    self.schemeToSearch = ko.observable();
    self.moreOptions = ko.observableArray();

    self.investmentAccountYes = ko.observable(false);

    DashboardModel.getInvestmentAccounts().done(function (data) {
      if (data.investmentAccounts.length) {
        self.investmentAccountYes(true);

        self.moreOptions.push({
          code: "HND",
          value: self.resource.holderDetails
        });

        self.moreOptions.push({
          code: "DPR",
          value: self.resource.download
        });

        self.uiOptions = {
          menuFloat: "left",
          fullWidth: false,
          defaultOption: self.menuSelection
        };

        self.menuOptions = ko.observableArray([{
            id: "portfolio-summary",
            label: self.resource.summary.portfolioSummary
          },
          {
            id: "performance-summary",
            label: self.resource.summary.performanceSummary
          },
          {
            id: "holdings-summary",
            label: self.resource.summary.holdingsSummary
          },
          {
            id: "dividends-summary",
            label: self.resource.summary.dividendsSummary
          }, {
            id: "recurring-summary",
            label: self.resource.summary.recurringSummary
          }
        ]);

        const selectedItemSubscription = self.menuSelection.subscribe(function () {
          self.showSummary(false);
          self.holdingsList(self.nonRedeemedData());
          self.schemeToSearch("");
          self.showSummary(true);
        });
        let i;

        self.investmentAccount = ko.observable({
          value: ko.observable(),
          displayValue: ko.observable()
        });

        for (let i = 0; i < data.investmentAccounts.length; i++) {
          self.accountNumber.push({
            text: data.investmentAccounts[i].accountId.displayValue,
            value: data.investmentAccounts[i].accountId.value,
            primaryHolderName: data.investmentAccounts[i].primaryHolderName,
            holdingPattern: data.investmentAccounts[i].holdingPattern
          });
        }

        self.accountsLoaded(true);

        self.fetchComponents = function () {
          for (i = 0; i < self.accountNumber().length; i++) {
            if (self.investmentAccount().value() === self.accountNumber()[i].value) {
              self.investmentAccount().displayValue(self.accountNumber()[i].text);
            }
          }

          self.refreshedData(false);
          self.summaryLoaded(false);
          self.profileLoaded(false);

          DashboardModel.fetchAccountSummary(self.investmentAccount().value()).done(function (data) {
            self.accountSummary(data);
            ko.tasks.runEarly();
            self.summaryLoaded(true);
          });

          DashboardModel.fetchAccountDetails(self.investmentAccount().value()).done(function (data) {
            self.investmentDetails(data);
            ko.tasks.runEarly();
            self.profileLoaded(true);
          });

          DashboardModel.fetchHoldings(self.investmentAccount().value()).done(function (data) {
            self.holdingsList(data);
            self.nonRedeemedData(data);
            self.schemesList().splice(0, self.schemesList().length);

            self.schemesList().push({
              schemeName: self.resource.allSchemes,
              schemeCode: "ALL"
            });

            for (i = 0; i < data.accountHoldings.length; i++) {
              self.schemesList().push({
                schemeName: data.accountHoldings[i].scheme.schemeName,
                schemeCode: data.accountHoldings[i].scheme.schemeCode
              });
            }

            self.showSummary(true);
          });

          DashboardModel.fetchDividends(self.investmentAccount().value()).done(function (data) {
            self.dividendsList(data);
            self.nonRedeemedData(data);
            self.schemesList().splice(0, self.schemesList().length);

            self.schemesList().push({
              schemeName: self.resource.allSchemes,
              schemeCode: "ALL"
            });

            for (i = 0; i < data.accountHoldings.length; i++) {
              self.schemesList().push({
                schemeName: data.accountHoldings[i].scheme.schemeName,
                schemeCode: data.accountHoldings[i].scheme.schemeCode
              });
            }

            self.showSummary(true);
          });

          DashboardModel.fetchRecurring(self.investmentAccount().value()).done(function (data) {
            self.recurringList(data);
            self.nonRedeemedData(data);
            self.schemesList().splice(0, self.schemesList().length);

            self.schemesList().push({
              schemeName: self.resource.allSchemes,
              schemeCode: "ALL"
            });

            for (i = 0; i < data.accountHoldings.length; i++) {
              self.schemesList().push({
                schemeName: data.accountHoldings[i].scheme.schemeName,
                schemeCode: data.accountHoldings[i].scheme.schemeCode
              });
            }

            self.showSummary(true);
          });

          DashboardModel.fetchPerformanceList(self.investmentAccount().value()).done(function (data) {
            self.performanceList(data);
            self.nonRedeemedData(data);
            self.schemesList().splice(0, self.schemesList().length);

            self.schemesList().push({
              schemeName: self.resource.allSchemes,
              schemeCode: "ALL"
            });

            for (i = 0; i < data.accountHoldings.length; i++) {
              self.schemesList().push({
                schemeName: data.accountHoldings[i].scheme.schemeName,
                schemeCode: data.accountHoldings[i].scheme.schemeCode
              });
            }

            self.showSummary(true);
          });

          self.refreshedData(true);
        };

        self.portfolioReport = function () {
          DashboardModel.fetchPDF(self.investmentAccount().value());
        };

        self.dispose = function () {
          selectedItemSubscription.dispose();
        };

      } else {
        params.baseModel.registerComponent("open-investment-account-landing", "mutual-funds");
        params.dashboard.loadComponent("open-investment-account-landing", {});
      }
    });
  };
});