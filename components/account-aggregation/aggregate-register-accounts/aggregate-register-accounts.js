define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/aggregate-register-accounts",
  "promise",
  "ojs/ojlistview",
  "ojs/ojselectcombobox",
  "ojs/ojcheckboxset",
  "ojs/ojtable",
  "ojs/ojdatacollection-utils",
  "ojs/ojarraytabledatasource",
  "ojs/ojknockout-validation",
  "ojs/ojbutton"
], function(oj, ko, RegAccountBankModel, locale) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = locale;
    self.datasource = ko.observable();
    self.dataSourceCreated = ko.observable(true);
    self.productHeading = ko.observable(self.resourceBundle.labels.selectAccount);
    self.accountMapped = ko.observable(false);
    self.acctArray = ko.observableArray([]);
    params.baseModel.registerComponent("aggregate-accounts-list", "account-aggregation");
    params.baseModel.registerComponent("link-account-dashboard", "account-aggregation");
    self.dataSourceCreated(false);

    let countname = "";

    self.checkName = function(data) {
      let returndata = "";

      if (countname) {
        if (countname === data) {
          returndata = null;
        } else if (countname !== data) {
          countname = data;
          returndata = data;
        }
      } else {
        countname = data;

        return data;
      }

      return returndata;
    };

    self.onPageLoad = function(statedata) {
      if (statedata) {
        if (statedata.code) {
          if (statedata.state) {
            RegAccountBankModel.fetchAccessToken(statedata.state, statedata.code).done(function(data) {
              RegAccountBankModel.getAccountList(data.accessToken.bankCode, "").done(function(accounts) {
                const acctSelected = "false";

                if (accounts.externalBankAccountDTOs !== undefined) {
                  for (let i = 0; i < accounts.externalBankAccountDTOs.length; i++) {
                    if (accounts.externalBankAccountDTOs[i].type === "LON") {
                      self.acctArray.push({
                        acctSelected: ko.observable([acctSelected]),
                        acctNo: accounts.externalBankAccountDTOs[i].id.value,
                        acctNoDisplay: accounts.externalBankAccountDTOs[i].id.displayValue,
                        actType: accounts.externalBankAccountDTOs[i].type,
                        currency: accounts.externalBankAccountDTOs[i].outstandingAmount.currency,
                        amount: accounts.externalBankAccountDTOs[i].outstandingAmount.amount
                      });
                    } else {
                      self.acctArray.push({
                        acctSelected: ko.observable([acctSelected]),
                        acctNo: accounts.externalBankAccountDTOs[i].id.value,
                        acctNoDisplay: accounts.externalBankAccountDTOs[i].id.displayValue,
                        actType: accounts.externalBankAccountDTOs[i].type,
                        currency: accounts.externalBankAccountDTOs[i].availableBalance.currency,
                        amount: accounts.externalBankAccountDTOs[i].availableBalance.amount
                      });
                    }
                  }
                }

                self.datasource = new oj.ArrayTableDataSource(self.acctArray, {
                  idAttribute: "acctNo"
                });

                self.dataSourceCreated(true);

              });
            });
          }
        }
      }
    };

    self.backToView = function() {
      params.dashboard.loadComponent("aggregate-accounts-list", {});
    };

    self.GotoLinkAccount = function() {
      params.dashboard.loadComponent("aggregate-accounts-list", {});
    };

    self.GotoDashboard = function() {
      params.dashboard.switchModule();
    };

  };
});