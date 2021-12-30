define(["baseService", "jquery"], function(BaseService,$) {
  "use strict";

  const AccordionModel = function() {
    /* Extending predefined baseService to get ajax functions. */
    let params;
    const baseService = BaseService.getInstance();
    let subscribeEStatementDeferred;
    const subscribeEStatement = function(accountType, accountId, payload, deferred) {
      params = {
        accountType: accountType,
        accountId: accountId
      };

      const options = {
        url: "accounts/{accountType}/{accountId}/preferences/eStatement",
        data: payload,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.update(options, params);
    };
    let getInactiveAccountsDeferred;
    const getInactiveAccounts = function(url, deferred) {
      const options = {
        showMessage: false,
        url: url,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      subscribeEStatement: function(url, accountId, payload) {
        subscribeEStatementDeferred = $.Deferred();
        subscribeEStatement(url, accountId, payload, subscribeEStatementDeferred);

        return subscribeEStatementDeferred;
      },
      getInactiveAccounts: function(url) {
        getInactiveAccountsDeferred = $.Deferred();
        getInactiveAccounts(url, getInactiveAccountsDeferred);

        return getInactiveAccountsDeferred;
      }
    };
  };

  return new AccordionModel();
});
