define([
  "baseService"
], function(BaseService) {
  "use strict";

  const TDAmmendModel = function() {
    const self = this;

    self.transactionId = null;
    self.trnsactionVersionId = null;

    const Model = function(transactionId, trnsactionVersionId) {
      self.transactionId = transactionId;
      self.trnsactionVersionId = trnsactionVersionId;

      this.amendData = {
        rollOverType: null,
        module: null,
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
        }],
        rollOverAmount: {
          currency: null,
          amount: null
        }
      };
    },
     baseService = BaseService.getInstance();

    return {
      fetchMaturityInstruction: function() {
        const options = {
          url: "enumerations/rollOverType"
        };

        return baseService.fetch(options);
      },
      amendTD: function(amendData, accountId) {
        const params ={
          accountId: accountId
        },
        options = {
          url: "accounts/deposit/{accountId}",
          data: amendData
        };

        options.headers = {};

        if (self.transactionId) {
          options.headers.TRANSACTION_REFERENCE_NO = self.transactionId + "#" + self.trnsactionVersionId;
        }

        return baseService.update(options, params);
      },
      getNewModel: function(transactionId, trnsactionVersionId) {
        return new Model(transactionId, trnsactionVersionId);
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

  return new TDAmmendModel();
});