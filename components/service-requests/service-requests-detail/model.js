define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ServiceRequestsDetailModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * In case more than one instance of model is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf PreferenceFunctionsModel~PreferenceFunctionsModel
     */
    let
      approveRejectSRDeferred;
    const approveRejectSR = function(srID, remarks, status, deferred) {
      const params = {
          status: status,
          remarks: remarks
        },
        options = {
          url: "servicerequest/" + srID + "?status={status}&note={remarks}",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.patch(options, params);
    };
    let fetchProductsDetailDeferred;
    const fetchProductsDetail = function(srID, deferred) {
      const options = {
        url: "servicerequest/" + srID,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.fetch(options);
    };
    let fetchBranchDetailDeferred;
    const fetchBranchDetail = function(branchCode, deferred) {
      const options = {
        url: "locations/branches?branchCode=" + branchCode,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.fetch(options);
    };

    return {
      approveRejectSR: function(srID, remarks, status) {
        approveRejectSRDeferred = $.Deferred();
        approveRejectSR(srID, remarks, status, approveRejectSRDeferred);

        return approveRejectSRDeferred;
      },
      fetchProductsDetail: function(srID) {
        fetchProductsDetailDeferred = $.Deferred();
        fetchProductsDetail(srID, fetchProductsDetailDeferred);

        return fetchProductsDetailDeferred;
      },
      fetchBranchDetail: function(branchCode) {
        fetchBranchDetailDeferred = $.Deferred();
        fetchBranchDetail(branchCode, fetchBranchDetailDeferred);

        return fetchBranchDetailDeferred;
      }
    };
  };

  return new ServiceRequestsDetailModel();
});