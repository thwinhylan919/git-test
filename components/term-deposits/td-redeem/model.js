define([
  "baseService"
], function(BaseService) {
  "use strict";

  const redeemModel = function() {
    const baseService = BaseService.getInstance(),
      Model = {
        redemptionId: null,
        partyId: null,
        module: null,
        accountId: {
          displayValue: null,
          value: null
        },
        date: null,
        maturityAmount: {
          currency: null,
          amount: null
        },
        netCreditAmt: {
          currency: null,
          amount: null
        },
        charges: {
          currency: null,
          amount: null
        },
        redemptionAmount: {
          currency: null,
          amount: null
        },
        revisedPrincipalAmount: {
          currency: null,
          amount: null
        },
        revisedMaturityAmount: {
          currency: null,
          amount: null
        },
        revisedInterestRate: 0,
        typeRedemption: "F",
        payoutInstructions: [{
          accountId: {
            displayValue: null,
            value: null
          },
          account: null,
          branchId: null,
          id: null,
          percentage: 100,
          type: null,
          beneficiaryName: null,
          bankName: null,
          address: {
            line1: null,
            line2: null,
            city: null,
            country: null
          },
          clearingCode: null,
          networkType: null,
          payoutComponentType: null
        }]
      };

    return {
      /**
       *Fetches Account transfer options
       */
      getPayOutOptions: function() {
        const options = {
          url: "enumerations/payOutOption"
        };

        return baseService.fetch(options);
      },

      /**
       *Fetches Network Type
       */
      getNetworkType: function() {
        const options = {
          url: "enumerations/networkType?REGION=INDIA"
        };

        return baseService.fetch(options);
      },
      /**
       *It is called when user clicks redeem.POST operation is performed on click.
       */
      redeem: function(redeemReviewData, accountId, simulation) {
        const params ={
          accountId: accountId,
          simulation: simulation
        },
        options = {
          url: "accounts/deposit/{accountId}/redemptions?simulation={simulation}",
          data: redeemReviewData
        };

        return baseService.add(options, params);
      },
      /**
       *It is called on load of redeemTd and fetches Total redeemable amount,Penalty/charges,etc
       */
      redeemDetails: function(accountId, data) {
        const params ={
          accountId: accountId
        },
        options = {
          url: "accounts/deposit/{accountId}/penalities",
          data: data
        };

        return baseService.add(options, params);
      },
      /**
       *It fetches CASA account of the user
       */
      fetchCASAAccountData: function() {
        const options = {
          url: "accounts/demandDeposit"
        };

        return baseService.fetch(options);
      },
      fetchPartyDetails: function() {
        const options = {
          url: "me"
        };

        return baseService.fetch(options);
      },
      getNewModel: function() {
        return Model;
      },
      fetchAccountDetails: function(accountId) {
        const params = {
          accountId: accountId
        },
        options = {
          url: "accounts/deposit/{accountId}"
        };

        return baseService.fetch(options, params);
      }
    };
  };

  return new redeemModel();
});