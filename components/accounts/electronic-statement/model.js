define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  const eStatementModel = function() {
    /* Extending predefined baseService to get ajax functions. */
    let params;
    const baseService = BaseService.getInstance();
    let subscribeEStatementDeferred;
    const subscribeEStatement = function(accountType, accountId, payload, module, deferred) {
      params = {
        accountType: accountType,
        accountId: accountId,
        module: module
      };

      let url;

      if (accountType === "deposit")
        {url = "accounts/{accountType}/{accountId}/preferences/eStatement;module={module}";}
      else
        {url = "accounts/{accountType}/{accountId}/preferences/eStatement";}

      const options = {
        url: url,
        data: payload,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.update(options, params);
    };
    let getEmailForSubscriptionDeferred;
    const getEmailForSubscription = function(partyId, deferred) {
      params = {
        partyId: partyId
      };

      const options = {
        url: "parties/{partyId}/contactPoints",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };

    return {
      subscribeEStatement: function(url, accountId, payload, module) {
        subscribeEStatementDeferred = $.Deferred();
        subscribeEStatement(url, accountId, payload, module, subscribeEStatementDeferred);

        return subscribeEStatementDeferred;
      },
      getEmailForSubscription: function(partyId) {
        getEmailForSubscriptionDeferred = $.Deferred();
        getEmailForSubscription(partyId, getEmailForSubscriptionDeferred);

        return getEmailForSubscriptionDeferred;
      }
    };
  };

  return new eStatementModel();
});