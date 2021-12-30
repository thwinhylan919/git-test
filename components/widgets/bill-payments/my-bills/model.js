define(["jquery", "baseService"], function($, BaseService) {
  "use strict";

  const DemandDepositAnalysisModel = function() {
    const baseService = BaseService.getInstance();
    let fetchBillersDeferred;
    const fetchBillers = function(deferred) {
      const options = {
        url: "registeredBillers",
        mockedUrl: "framework/json/design-dashboard/bill-payments/my-bills.json",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetchWidget(options);
    };
    let fireBatchDeferred;
    const fireBatch = function(deferred, subRequestList, type) {
      const options = {
        url: "batch",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.batch(options, {
        type: type
      }, subRequestList);
    };
    let fetchBillerDetailsDeferred;
    const fetchBillerDetails = function(billerRegistrationId, deferred) {
      const options = {
          url: "registeredBillers/{billerRegistrationId}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          billerRegistrationId: billerRegistrationId
        };

      baseService.fetch(options, params);
    };
    let fetchBillerValuesDeferred;
    const fetchBillerValues = function(billerId, deferred) {
      const options = {
          url: "billers/{billerId}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          billerId: billerId
        };

      baseService.fetch(options, params);
    };

    return {
      fetchBillers: function() {
        fetchBillersDeferred = $.Deferred();
        fetchBillers(fetchBillersDeferred);

        return fetchBillersDeferred;
      },
      fireBatch: function(subRequestList, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, subRequestList, type);

        return fireBatchDeferred;
      },
      fetchBillerDetails: function(billerRegistrationId) {
        fetchBillerDetailsDeferred = $.Deferred();
        fetchBillerDetails(billerRegistrationId, fetchBillerDetailsDeferred);

        return fetchBillerDetailsDeferred;
      },
      fetchBillerValues: function(billerId) {
        fetchBillerValuesDeferred = $.Deferred();
        fetchBillerValues(billerId, fetchBillerValuesDeferred);

        return fetchBillerValuesDeferred;
      }
    };
  };

  return new DemandDepositAnalysisModel();
});