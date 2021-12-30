define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const internalTransferModel = function() {
    const baseService = BaseService.getInstance();
    let getTransferDataDeferred;
    const getTransferData = function(paymentId, paymentType, transferType, transferNow, deferred) {
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
    let getFrequencyDescDeferred;
    const getFrequencyDesc = function(deferred) {
      const options = {
        url: "enumerations/paymentFrequency",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let getPurposeDescDeferred;
    const getPurposeDesc = function(deferred) {
      const options = {
        url: "purposes/PC",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchAccountsDescDeferred;
    const fetchAccounts = function(taskCode, deferred) {
      const options = {
        url: "accounts/demandDeposit?taskCode={taskCode}",
        success: function(data) {
          deferred.resolve(data);
        }
      },
        params = {
          taskCode: taskCode
        };

      baseService.fetch(options, params);
    };

    return {
      getTransferData: function(paymentId, paymentType, transferType, date) {
        getTransferDataDeferred = $.Deferred();
        getTransferData(paymentId, paymentType, transferType, date, getTransferDataDeferred);

        return getTransferDataDeferred;
      },
      getFrequencyDesc: function() {
        getFrequencyDescDeferred = $.Deferred();
        getFrequencyDesc(getFrequencyDescDeferred);

        return getFrequencyDescDeferred;
      },
      getPurposeDesc: function() {
        getPurposeDescDeferred = $.Deferred();
        getPurposeDesc(getPurposeDescDeferred);

        return getPurposeDescDeferred;
      },
      fetchAccounts: function(taskCode) {
        fetchAccountsDescDeferred = $.Deferred();
        fetchAccounts(taskCode, fetchAccountsDescDeferred);

        return fetchAccountsDescDeferred;
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
      getPayeeMaintenance: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      },
      getGroupDetails: function(payeeGroupId) {
        return baseService.fetch({
          url:  "payments/payeeGroup/{payeeGroupId}"
        },{
          payeeGroupId :payeeGroupId
        });
      },
      getPayeeDetails: function(payeeGroupId,payeeId) {
        return baseService.fetch({
          url:  "payments/payeeGroup/{payeeGroupId}/payees/internal/{payeeId}"
        },{
          payeeGroupId :payeeGroupId,
          payeeId :payeeId
        });
      }
    };
  };

  return new internalTransferModel();
});