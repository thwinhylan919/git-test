define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const internationalPayModel = function() {
    const baseService = BaseService.getInstance();
    let getPayoutDataDeferred;
    const getPayoutData = function(paymentId, paymentType, transferType, transferNow, deferred) {
      let url;

      if (transferNow) {
        url = "payments/{paymentType}/{transferType}/{paymentId}";
      } else {
        url = "payments/instructions/{paymentType}/{transferType}/{paymentId}";
      }

      const options = {
        url: url,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
        params = {
          paymentType: paymentType,
          transferType :transferType,
          paymentId : paymentId
        };

      baseService.fetch(options, params);
    };

    return {
      getPayoutData: function(paymentId, paymentType, transferType, date) {
        getPayoutDataDeferred = $.Deferred();
        getPayoutData(paymentId, paymentType, transferType, date, getPayoutDataDeferred);

        return getPayoutDataDeferred;
      },
      getBankDetailsBIC: function(code) {
        return baseService.fetch({
          url: "financialInstitution/bicCodeDetails/{BICCode}"
        }, {
          BICCode: code
        });
      },
      getBankDetailsNCC: function(code) {
        return baseService.fetch({
          url: "financialInstitution/nationalClearingDetails/{nationalClearingCodeType}/{nationalClearingCode}"
        }, {
          nationalClearingCodeType: "NCC",
          nationalClearingCode: code
        });
      },
      getCharges: function() {
        return baseService.fetch({
          url: "enumerations/correspondanceChargeType"
        });
      },
      /**
       * Fetches service charges maintenances.
       *
       * @returns {Promise}  Returns the promise object.
       */
      getChargesMaintenances: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      },
      /**
       * Fetches service charges.
       *
       * @returns {Promise}  Returns the promise object.
       */
      getServiceCharges: function(params) {
        return baseService.fetch({
          url: "charges?paymentType={paymentType}&transactionAmount={transactionAmount}&transactionCurrency={transactionCurrency}&debitAccountId={debitAccountId}"
        }, params);
      },
      /**
       * Fetches forex deals list for the user.
       *
       * @param {string} dealId - Contains selected currency for filter.
       * @returns {Promise}  Returns the promise object.
       */
      fetchForexDealList: function(dealId) {
        return baseService.fetch({
          url: "forexDeals?dealId={dealId}"
        }, {
          dealId: dealId
        });
      },
      retrieveImage: function(id) {
        return baseService.fetch({
          url: "contents/{id}"
        }, {
          id: id
        });
      },
      getPayeeDetails: function(payeeGroupId,payeeId) {
        return baseService.fetch({
          url:  "payments/payeeGroup/{payeeGroupId}/payees/international/{payeeId}"
        },{
          payeeGroupId :payeeGroupId,
          payeeId :payeeId
        });
      },
      getGroupDetails: function(payeeGroupId) {
        return baseService.fetch({
          url:  "payments/payeeGroup/{payeeGroupId}"
        },{
          payeeGroupId :payeeGroupId
        });
      },
       getRemarks: function() {
        return baseService.fetch({
          url: "enumerations/senderToReceiverInfo"
        });
      },
      getPayeeMaintenance: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      }
    };
  };

  return new internationalPayModel();
});