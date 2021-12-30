define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  const physicalStatement = function() {
    /* Extending predefined baseService to get ajax functions. */
    let params;
    const baseService = BaseService.getInstance();
    let requestPhysicalStatementDeferred;
    const requestPhysicalStatement = function(accountType, accountId, payload, module, deferred) {
      params = {
        accountType: accountType,
        accountId: accountId,
        module: module
      };

      let url;

      if (accountType === "deposit")
        {url = "accounts/{accountType}/{accountId}/adhocStatement;module={module}";}
      else
        {url = "accounts/{accountType}/{accountId}/adhocStatement";}

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

      baseService.add(options, params);
    };

    return {
      requestPhysicalStatement: function(accountType, accountId, payload, module) {
        requestPhysicalStatementDeferred = $.Deferred();
        requestPhysicalStatement(accountType, accountId, payload, module, requestPhysicalStatementDeferred);

        return requestPhysicalStatementDeferred;
      }
    };
  };

  return new physicalStatement();
});