define(["baseService"], function(BaseService) {
  "use strict";

  const AccountActivity = function() {
    /* Extending predefined baseService to get ajax functions. */
    const baseService = BaseService.getInstance();

    /**
     * Method to fetch Accounts information data.
     *  deferred object is resolved once the accounts information list is successfully fetched
     */
    return {
      fetchExternalTransactionDetails: function(accNo,accType,bankId) {
        const parameters = {
          accNo: accNo,
          bankId: bankId,
          accountType: accType
        },options = {
          url: "externalBankAccounts/{accNo}/transactions?externalBankCode={bankId}&locale=en&accountType={accountType}",
          mockedUrl:"framework/json/design-dashboard/accounts/recent-account-activity.json",
          showMessage: false,
          selfLoader: true
        };

        return baseService.fetchWidget(options, parameters);
      },
      fetchLocalTransactionDetails: function(accNo, type, count) {
        const parameters = {
          type: type,
          accNo: accNo,
          count: count
        },options = {
          url: "accounts/{type}/{accNo}/transactions?noOfTransactions={count}&searchBy=LNT&locale=en",
          mockedUrl:"framework/json/design-dashboard/accounts/recent-account-transactions.json",
          showMessage: false,
          selfLoader: true
        };

        return baseService.fetchWidget(options,parameters);

      },
      fetchexternalbankAccounts :  function(bankCode) {
        const options = {
          url: "externalBankAccounts?bankCode=" + bankCode,
          mockedUrl:"framework/json/design-dashboard/external-bank/external-accounts.json",
          showMessage: false
        };

        return baseService.fetchWidget(options);
      },
      fetchAccesstoken : function() {
        const options = {
          url: "accesstokens",
          mockedUrl:"framework/json/design-dashboard/external-bank/access-tokens.json",
          showMessage: false
        };

        return baseService.fetchWidget(options);
      },
      fetchAccounts: function() {
        const options = {
          url: "accounts",
          mockedUrl:"framework/json/design-dashboard/accounts/demand-deposit.json",
          showMessage: false
        };

        return baseService.fetchWidget(options);

      }
    };
  };

  return new AccountActivity();
});
