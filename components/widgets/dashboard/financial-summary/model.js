define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const FinancialSummaryModel = function() {
    const baseService = BaseService.getInstance();
    let getAccountDetailsDeferred;
    const getAccountDetails = function(deferred) {
      const options = {
        url: "accounts",
        selfLoader: true,
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      getAccountDetails: function() {
        getAccountDetailsDeferred = $.Deferred();
        getAccountDetails(getAccountDetailsDeferred);

        return getAccountDetailsDeferred;
      }
    };
  };

  return new FinancialSummaryModel();
});