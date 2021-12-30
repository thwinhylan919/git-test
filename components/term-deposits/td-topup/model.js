define([
  "baseService"
], function(BaseService) {
  "use strict";

  const topUpModel = function() {
    const baseService = BaseService.getInstance(),
      Model = function(currencyCode) {
        return {
          amount: {
            amount: "",
            currency: currencyCode
          },
          sourceAccountId: {
            value: null,
            displayValue: null
          },
          account: {
            displayValue: null,
            value: null
          },
          currentPrincipal: {
            currency: null,
            amount: null
          }
        };
      };

    return {
      topUp: function(accountId, simulation, data) {
        const params ={
          accountId: accountId,
          simulation: simulation
        },
        options = {
          url: "accounts/deposit/{accountId}/topUps?simulation={simulation}",
          data: data
        };

        return baseService.add(options, params);
      },
      fetchAccountDetails: function(accountId) {
        const params = {
          accountId: accountId
        },
        options = {
          url: "accounts/deposit/{accountId}"
        };

        return baseService.fetch(options, params);
      },
      getNewModel: function(currency) {
        return new Model(currency);
      }
    };
  };

  return new topUpModel();
});