define([
  "baseService"
], function(BaseService) {
  "use strict";

  const TDdetailsModel = function() {
    const baseService = BaseService.getInstance();

    return {
      fetchTdDetails: function(accountId) {
        const params ={
          accountId: accountId
        },
        options = {
          url: "accounts/deposit/{accountId}"
        };

        return baseService.fetch(options, params);
      },
      fetchpayoutInstructions: function(accountId) {
        const params ={
          accountId: accountId
        },
        options = {
          url: "accounts/deposit/{accountId}/payOutInstructions"
        };

        return baseService.fetch(options, params);
      },
      fetchBankDetails: function(url) {
        const options = {
          url: url
        };

        return baseService.fetch(options);
      },
      fetchClosedTDdetails: function(accountId) {
        const params ={
          accountId: accountId
        },
        options = {
          url: "accounts/deposit/{accountId}/redemptions"
        };

        return baseService.fetch(options, params);
      }
    };
  };

  return new TDdetailsModel();
});