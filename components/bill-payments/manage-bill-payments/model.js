define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const BillPaymentsModel = function() {
    const baseService = BaseService.getInstance();
    let fetchRegisteredBillersDeferred;
    const fetchRegisteredBillers = function(deferred) {
      const options = {
        url: "registeredBillers",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
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
    let fetchBillersDeferred;
    const fetchBillers = function(categoryId, locationId, deferred) {
      const options = {
          url: "billers?categoryId={categoryId}&operationalAreaId={operationalAreaId}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          categoryId: categoryId,
          operationalAreaId: locationId
        };

      baseService.fetch(options, params);
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
    let fetchBillerLogosDeferred;
    const fetchBillerLogos = function(billerId, deferred) {
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
    let deleteBillerDeferred;
    const deleteBiller = function(billerRegistrationId, deferred) {
      const options = {
          url: "registeredBillers/{billerRegistrationId}",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        },
        params = {
          billerRegistrationId: billerRegistrationId
        };

      baseService.remove(options, params);
    };

    return {
      fetchRegisteredBillers: function() {
        fetchRegisteredBillersDeferred = $.Deferred();
        fetchRegisteredBillers(fetchRegisteredBillersDeferred);

        return fetchRegisteredBillersDeferred;
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
      },
      fireBatch: function(subRequestList, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, subRequestList, type);

        return fireBatchDeferred;
      },
      fetchBillers: function(categoryId, locationId) {
        fetchBillersDeferred = $.Deferred();
        fetchBillers(categoryId, locationId, fetchBillersDeferred);

        return fetchBillersDeferred;
      },
      fetchBillerLogos: function(billerId) {
        fetchBillerLogosDeferred = $.Deferred();
        fetchBillerLogos(billerId, fetchBillerLogosDeferred);

        return fetchBillerLogosDeferred;
      },
      deleteBiller: function(billerRegistrationId) {
        deleteBillerDeferred = $.Deferred();
        deleteBiller(billerRegistrationId, deleteBillerDeferred);

        return deleteBillerDeferred;
      }
    };
  };

  return new BillPaymentsModel();
});