define([

  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/recent-account-activity",
  "ojs/ojbutton",
  "ojs/ojfilmstrip",
  "ojs/ojmenu",
  "ojs/ojselectcombobox"
], function(ko, $, AccountActivity, ResourceBundle) {
  "use strict";

  /** View tabular structure.
   * It allows user to view structure details in a tree format inside table.
   *
   * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
   * @return {Function} Function.
   * @return {Object} GetNewKoModel.
   *
   */
  return function(rootParams) {
    const self = this;

    self.detailsFetched = ko.observable(false);
    self.resource = ResourceBundle;
    self.selectedAccountType = ko.observable();
    self.items = ko.observableArray();
    self.externalAccounts = ko.observableArray();
    self.accountsMatched = {};
    self.accountsLoaded = ko.observable(false);
    self.accountsMatchedLoaded = ko.observable(false);
    self.accountList = ko.observableArray();
    self.aAsetUpDone = ko.observable(false);

    self.allItems = [];
    self.selectedFilmStripAccount = ko.observable();

    self.accountTypeList = ko.observableArray([
      "CSA",
      "TRD",
      "LON"
    ]);

    const typeMap = {
        CSA: "demandDeposit",
        TRD: "deposit",
        LON: "loan"
      },
      transactionCount = 3;

    rootParams.baseModel.registerElement("account-input");
    rootParams.baseModel.registerElement("date-box");

    /**
     * This function set the page data for any recent activity done through user's account.
     *
     * @function setPageData
     * @param {Object} data - User data.
     * @returns {void}
     * @memberOf RecentAccountActivity
     **/
    function setPageData(data) {
      const tempData = $.map(data, function(v) {
        const newObj = {};

        newObj.date = v.transactionDate ? v.transactionDate : "";
        newObj.narration = v.narration || v.description;
        newObj.tempCurrency = v.transactionAmount ? v.transactionAmount.currency : v.amountInAccountCurrency ? v.amountInAccountCurrency.currency : "";
        newObj.amount = v.transactionAmount ? v.transactionAmount.amount : v.amountInAccountCurrency ? v.amountInAccountCurrency.amount : "";
        newObj.amountClass = v.transactionType === "C" ? "" : "debit";
        newObj.id = v.accountId;
        newObj.transactionType = v.transactionType;

        return newObj;
      });

      return tempData;
    }

    /**
     * This function fetches the data of user account on the basis on input specified by the user.
     *
     * @function fetchData
     * @param {Object} account - User account.
     * @param {Object} bankId - Bank Id.
     * @param {Object} fetchIndex - Is index.
     * @returns {void}
     * @memberOf RecentAccountActivity
     **/
    function fetchData(account, bankId, fetchIndex) {
      self.items.removeAll();

      if (self.allItems.length) {

        self.allItems[fetchIndex].transactions.removeAll();
      }

      if (bankId) {
        AccountActivity.fetchExternalTransactionDetails(ko.utils.unwrapObservable(account), self.selectedAccountType(), bankId).then(function(data) {
          if (!rootParams.baseModel.small()) {
            ko.utils.arrayPushAll(self.items, setPageData(data.items));
          } else if (self.allItems.length) {
            self.allItems[fetchIndex].loaded(false);
            ko.utils.arrayPushAll(self.allItems[fetchIndex].transactions, setPageData(data.items));
            self.allItems[fetchIndex].loaded(true);
          }
        });
      } else {
        AccountActivity.fetchLocalTransactionDetails(ko.utils.unwrapObservable(account), typeMap[self.selectedAccountType()], transactionCount).then(function(data) {
          if (!rootParams.baseModel.small()) {
            ko.utils.arrayPushAll(self.items, setPageData(data.items));
          } else if (self.allItems.length) {
            self.allItems[fetchIndex].loaded(false);
            ko.utils.arrayPushAll(self.allItems[fetchIndex].transactions, setPageData(data.items));
            self.allItems[fetchIndex].loaded(true);
          }
        });
      }

      self.detailsFetched(true);
    }

    const fetchExternalBankAccounts = function(accData) {

      self.accountsMatched = {};
      self.accountsMatchedLoaded(false);

      if (self.accountsLoaded()) {
        ko.utils.arrayForEach(self.externalAccounts(), function(item) {
          if (item.type === accData) {
            item.bankName = item.bankName || self.resource.myBankName;

            if (!self.accountsMatched[item.bankName]) {
              self.accountsMatched[item.bankName] = [];
            }

            self.accountsMatched[item.bankName].push(item);
          }
        });

        ko.tasks.runEarly();
        self.accountsMatchedLoaded(true);
      }
    };

    function fetchExtAccountsForMobile(accData) {

      self.accountsLoaded(false);

      ko.tasks.runEarly();

      Promise.all([AccountActivity.fetchAccesstoken(), AccountActivity.fetchAccounts()]).then(function(response) {

        const tokens = response[0].accessTokenDTOs;

        self.allItems = [];

        if (tokens) {
          self.aAsetUpDone(true);

          for (let i = 0; i < tokens.length; i++) {

            AccountActivity.fetchexternalbankAccounts(tokens[i].bankCode).then(function(data) {

              ko.tasks.runEarly();

              ko.utils.arrayForEach(data.externalBankAccountDTOs, function(item) {

                if (item.type === accData) {
                  self.allItems.push({
                    account: item,
                    transactions: ko.observableArray(),
                    loaded: ko.observable(false)
                  });
                }

              });

              if (self.allItems.length > 0) {

                if (self.selectedFilmStripAccount()) {

                  self.selectedFilmStripAccount().index = 0;
                }

                fetchData(self.allItems[0].account.id.value, self.allItems[0].account.bankId, 0);
              }

              self.accountsLoaded(true);

            });
          }
        }

        ko.utils.arrayForEach(response[1].accounts, function(item) {

          if (item.type === accData) {

            item.bankName = item.bankName || self.resource.myBankName;

            self.allItems.push({
              account: item,
              transactions: ko.observableArray(),
              loaded: ko.observable(false)
            });
          }
        });

        ko.tasks.runEarly();

      });
    }

    self.selectedAccountTypeChangedHandler = function(event) {

      self.selectedAccountType(event.detail.value);

      if (!rootParams.baseModel.small()) {
        fetchExternalBankAccounts(event.detail.value);
      } else {
        fetchExtAccountsForMobile(event.detail.value);
      }
    };

    self.selectedExternalAccountTypeChangedHandler = function(event) {
      let selectedID = event.detail.value,
        code = "";

      ko.utils.arrayForEach(self.externalAccounts(), function(item) {
        if (item.id.value === event.detail.value) {
          code = item.bankId;
          selectedID = item.id.value;
        }
      });

      fetchData(selectedID, code);
    };

    self.selectedFilmStripAccount.subscribe(function() {
      fetchData(self.allItems[self.selectedFilmStripAccount().index].account.id.value, self.allItems[self.selectedFilmStripAccount().index].account.bankId, self.selectedFilmStripAccount().index);
    });

    if (!rootParams.baseModel.small()) {
      Promise.all([AccountActivity.fetchAccesstoken(), AccountActivity.fetchAccounts()]).then(function(response) {
        const tokens = response[0].accessTokenDTOs;

        if (tokens) {
          self.aAsetUpDone(true);

          for (let i = 0; i < tokens.length; i++) {
            AccountActivity.fetchexternalbankAccounts(tokens[i].bankCode).then(function(data) {
              ko.utils.arrayPushAll(self.externalAccounts, data.externalBankAccountDTOs);
              self.accountsLoaded(true);
            });
          }
        }

        const localAccounts = response[1].accounts;

        ko.utils.arrayPushAll(self.externalAccounts, localAccounts);
      });
    }
  };
});