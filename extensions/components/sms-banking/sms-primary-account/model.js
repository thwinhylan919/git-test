/**
 */
define([

  "baseService"
], function(BaseService) {
  "use strict";

  const SMSBankingViewModel = function() {
    const baseService = BaseService.getInstance();

    return {
      mePreference: function() {
        const options = {
          url: "me/preferences?userID"
        };

        return baseService.fetch(options);
      },
      updatePreference: function(payload) {
        const options = {
          data: payload,
          url: "me/preferences"
        };

        return baseService.update(options);
      },
      getDemandDeposits: function() {
        const options = {
          url: "accounts/demandDeposit"
        };

        return baseService.fetch(options);
      }
    };
  };

  return new SMSBankingViewModel();
});