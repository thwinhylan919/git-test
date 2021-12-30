define(["baseService"], function (BaseService) {
  "use strict";

  const AccountActivity = function () {
    /* Extending predefined baseService to get ajax functions. */
    const baseService = BaseService.getInstance();

    /**
     * Method to fetch Accounts information data.
     *  deferred object is resolved once the accounts information list is successfully fetched
     */
    return {
      fetchTransactionDetails: function (accNo, type, count) {
        const parameters = {
            type: type,
            accNo: accNo,
            count: count
          },
          options = {
            url: "accounts/{type}/{accNo}/transactions?searchBy=LNT&noOfTransactions={count}",
            mockedUrl: "framework/json/design-dashboard/accounts/recent-account-transactions.json",
            showMessage: false,
            selfLoader: true
          };

        return baseService.fetchWidget(options, parameters);
      },
      fetchAccounts: function () {
        const options = {
          url: "accounts",
          mockedUrl: "framework/json/design-dashboard/accounts/demand-deposit.json",
          showMessage: false
        };

        return baseService.fetchWidget(options);
      }
    };
  };

  return new AccountActivity();
});