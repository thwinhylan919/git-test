define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const CardDetailModel = function() {
    const creditCardDetailsModel = function() {
      this.creditCard = null;
      this.isInternationalUsageAllowed = null;
    };
    let params, redeemRewardPointsDeferred;
    const baseService = BaseService.getInstance(),
      redeemRewardPoints = function(deferred) {
        const options = {
          url: "session",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

        baseService.remove(options);
      };
      let redeemRewardPointsFetchDeferred;
      const redeemRewardPointsFetch = function(creditCardId, deferred){
        params = {
          creditCardId: creditCardId
        };

        const options = {
          url: "accounts/cards/credit/{creditCardId}/rewards/redemption",
          success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
        };

        baseService.fetch(options, params);
      };
    let updateInternationalUsageDeferred;
    const updateInternationalUsage = function(creditCard, payload, deferred) {
      params = {
        creditCard: creditCard
      };

      const options = {
        url: "accounts/cards/credit/{creditCard}/internationalusage/",
        data: payload,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.update(options, params);
    };

    let fetchBillingsDaysDeferred;
    const fetchBillingsDays = function(deferred) {
      const options = {
        url: "enumerations/billcycles",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let updateBillCycleDeferred;
    const updateBillCycle = function(model, creditCardId, deferred) {
      params = {
        creditCardId: creditCardId
      };

      const options = {
        url: "accounts/cards/credit/{creditCardId}/billcycle",
        data: model,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.update(options, params);
    };
    let fetchCreditDetailsDeferred;
    const fetchCreditDetails = function(creditCardId, deferred) {
      params = {
        creditCardId: creditCardId
      };

      const options = {
        url: "accounts/cards/credit/{creditCardId}?expand=ALL",
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };

      baseService.fetch(options, params);
    };
    let fetchBillCycleDeferred;
    const fetchBillCycle = function(creditCardId, deferred) {
      params = {
        creditCardId: creditCardId
      };

      const options = {
        url: "accounts/cards/credit/{creditCardId}/billcycle",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, params);
    };
    let getActivateReasonsDeferred;
    const getActivateReasons = function(deferred) {
      const options = {
        url: "enumerations/cardActivateReasons",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      redeemRewardPoints: function() {
        redeemRewardPointsDeferred = $.Deferred();
        redeemRewardPoints(redeemRewardPointsDeferred);

        return redeemRewardPointsDeferred;
      },
      redeemRewardPointsFetch: function(creditCardId){
        redeemRewardPointsFetchDeferred = $.Deferred();
        redeemRewardPointsFetch(creditCardId, redeemRewardPointsFetchDeferred);

        return redeemRewardPointsFetchDeferred;
      },
      updateInternationalUsage: function(creditCard, payload) {
        updateInternationalUsageDeferred = $.Deferred();
        updateInternationalUsage(creditCard, payload, updateInternationalUsageDeferred);

        return updateInternationalUsageDeferred;
      },
      updateLimit: function(payload, creditCardId, type) {
        const params = {
          creditCardId: creditCardId,
          type: type
        },
        options = {
          url: "accounts/cards/credit/{creditCardId}/limit?type={type}",
          data: payload
        };

        return baseService.update(options, params);
      },
      fetchBillingsDays: function() {
        fetchBillingsDaysDeferred = $.Deferred();
        fetchBillingsDays(fetchBillingsDaysDeferred);

        return fetchBillingsDaysDeferred;
      },
      updateBillCycle: function(model, creditCardId) {
        updateBillCycleDeferred = $.Deferred();
        updateBillCycle(model, creditCardId, updateBillCycleDeferred);

        return updateBillCycleDeferred;
      },
      fetchCreditDetails: function(creditCardId) {
        fetchCreditDetailsDeferred = $.Deferred();
        fetchCreditDetails(creditCardId, fetchCreditDetailsDeferred);

        return fetchCreditDetailsDeferred;
      },
      fetchBillCycle: function(creditCardId) {
        fetchBillCycleDeferred = $.Deferred();
        fetchBillCycle(creditCardId, fetchBillCycleDeferred);

        return fetchBillCycleDeferred;
      },
      getNewCreditCardDetailsModel: function() {
        return new creditCardDetailsModel();
      },
      fetchActivateReasons: function() {
        getActivateReasonsDeferred = $.Deferred();
        getActivateReasons(getActivateReasonsDeferred);

        return getActivateReasonsDeferred;
      },
      activateCard: function(model, creditCardId) {
        const params = {
          creditCardId: creditCardId
        },
        options = {
          url: "accounts/cards/credit/{creditCardId}/status",
          data: model
        };

        return baseService.update(options, params);
      }
    };
  };

  return new CardDetailModel();
});
