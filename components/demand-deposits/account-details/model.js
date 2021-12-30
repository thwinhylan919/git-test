define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const AccountDetailsModel = function() {
    const baseService = BaseService.getInstance();
    let fetchAccountDetailsDeffered;
    const fetchAccountDetails = function(accNo, deffered) {
      const params = {
          accNo: accNo
        },options = {
        url: "accounts/demandDeposit/{accNo}",
        success: function(data) {
          deffered.resolve(data);
        },
        error: function(data) {
          deffered.reject(data);
        }
      };

      baseService.fetch(options, params);
    };

    return {
      fetchAccountDetails: function(accNo) {
        fetchAccountDetailsDeffered = $.Deferred();
        fetchAccountDetails(accNo, fetchAccountDetailsDeffered);

        return fetchAccountDetailsDeffered;
      }
    };
  };

  return new AccountDetailsModel();
});