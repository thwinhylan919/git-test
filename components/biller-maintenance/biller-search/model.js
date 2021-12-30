define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    BillerSearchModel = function() {
      let fetchCategoryDeferred;
      const fetchCategory = function(deferred) {
        const options = {
          url: "categories",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let billerListDeferred;
      const getBillerList = function(billerName, categoryId, operationalAreaId, deferred) {
        const options = {
          url: "billers?billerName=" + billerName + "&categoryId=" + categoryId + "&operationalAreaId=" + operationalAreaId,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      };
      let fetchLocationDeferred;
      const fetchLocation = function(deferred) {
        const options = {
          url: "operationalareas",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let fetchBillerDetailsDeferred;
      const getBillerDetails = function(billerId, deferred) {
        const options = {
            url: "billers/{billerId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            billerId: billerId
          };

        baseService.fetch(options, params);
      };

      return {
        fetchCategory: function() {
          fetchCategoryDeferred = $.Deferred();
          fetchCategory(fetchCategoryDeferred);

          return fetchCategoryDeferred;
        },
        getBillerList: function(billerName, categoryId, operationalAreaId) {
          billerListDeferred = $.Deferred();
          getBillerList(billerName, categoryId, operationalAreaId, billerListDeferred);

          return billerListDeferred;
        },
        fetchLocation: function() {
          fetchLocationDeferred = $.Deferred();
          fetchLocation(fetchLocationDeferred);

          return fetchLocationDeferred;
        },
        getBillerDetails: function(billerId) {
          fetchBillerDetailsDeferred = $.Deferred();
          getBillerDetails(billerId, fetchBillerDetailsDeferred);

          return fetchBillerDetailsDeferred;
        }
      };
    };

  return new BillerSearchModel();
});