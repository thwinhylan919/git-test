define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const RequestMoneyModel = function() {
    const Model = function() {
        this.RequestMoneyModel = {
          dictionaryArray: null,
          refLinks: null,
          type: "NONREC",
          frequency: "10",
          startDate: null,
          endDate: null,
          amount: {
            currency: null,
            amount: null
          },
          userReferenceNo: null,
          remarks: null,
          purpose: null,
          debitAccountId: null,
          statusType: null,
          payerId: null,
          payerType: null,
          sepaDomestic: {
            dictionaryArray: null,
            refLinks: null,
            nominatedAccount: {
              displayValue: null,
              value: null
            },
            oinNumber: null,
            oinDescription: null
          }
        };
      },
      baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let getTransferDataDeferred;
    const getTransferData = function(paymentId, deferred) {
      const options = {
          url: "payments/instructions/payins/domestic/{instructionId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          instructionId: paymentId
        };

      baseService.fetch(options, params);
    };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getTransferData: function(paymentId) {
        getTransferDataDeferred = $.Deferred();
        getTransferData(paymentId, getTransferDataDeferred);

        return getTransferDataDeferred;
      },
      retrieveImage: function(id) {
        return baseService.fetch({
          url: "contents/{id}"
        }, {
          id: id
        });
      },
      getPayeeMaintenance: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      }
    };
  };

  return new RequestMoneyModel();
});