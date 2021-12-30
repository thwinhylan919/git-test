define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const purposeCodeInquireModel = function() {
    const baseService = BaseService.getInstance();
    let fetchPurposeListDeferred;
    const fetchPurposeList = function(deferred) {
      const options = {
        url: "purposes/PC",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchLinkagesDeferred;
    const fetchLinkages = function(deferred) {
      const options = {
        url: "purposes/linkages",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let updateLinkageDeferred;
    const updateLinkage = function(payload, deferred) {
      const options = {
        url: "purposes/linkages",
        data: payload,
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };

      baseService.update(options);
    };

    return {
      fetchPurposeList: function() {
        fetchPurposeListDeferred = $.Deferred();
        fetchPurposeList(fetchPurposeListDeferred);

        return fetchPurposeListDeferred;
      },
      fetchLinkages: function() {
        fetchLinkagesDeferred = $.Deferred();
        fetchLinkages(fetchLinkagesDeferred);

        return fetchLinkagesDeferred;
      },
      updateLinkage: function(payload) {
        updateLinkageDeferred = $.Deferred();
        updateLinkage(payload, updateLinkageDeferred);

        return updateLinkageDeferred;
      }
    };
  };

  return new purposeCodeInquireModel();
});