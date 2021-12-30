define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    ReviewBillerRegistrationModel = function() {
      let fetchCategoryDeferred;
      const fetchCategory = function(categoryId, deferred) {
        const options = {
            url: "categories/{categoryId}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            categoryId: categoryId
          };

        baseService.fetch(options, params);
      };
      let fetchLocationDetailsDeferred;
      const fetchLocationDetails = function(operationalAreaId, deferred) {
        const options = {
            url: "operationalareas/{operationalAreaId}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            operationalAreaId: operationalAreaId
          };

        baseService.fetch(options, params);
      };
      let fetchBillerDetailsDeferred;
      const fetchBillerDetails = function(billerId, deferred) {
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
      let registerBillerDeferred;
      const registerBiller = function(model, deferred) {
        const options = {
          url: "registeredBillers",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

        baseService.add(options);
      };
      let updateBillerDeferred;
      const updateBiller = function(billerRegistrationId, model, deferred) {
        const options = {
            url: "registeredBillers/{billerRegistrationId}",
            data: model,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            }
          },
          params = {
            billerRegistrationId: billerRegistrationId
          };

        baseService.update(options, params);
      };
      let fetchRegisteredBillerDetailsDeferred;
      const fetchRegisteredBillerDetails = function(billerRegistrationId, deferred) {
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

      return {
        fetchCategory: function(categoryId) {
          fetchCategoryDeferred = $.Deferred();
          fetchCategory(categoryId, fetchCategoryDeferred);

          return fetchCategoryDeferred;
        },
        fetchLocationDetails: function(operationalAreaId) {
          fetchLocationDetailsDeferred = $.Deferred();
          fetchLocationDetails(operationalAreaId, fetchLocationDetailsDeferred);

          return fetchLocationDetailsDeferred;
        },
        fetchBillerDetails: function(billerId) {
          fetchBillerDetailsDeferred = $.Deferred();
          fetchBillerDetails(billerId, fetchBillerDetailsDeferred);

          return fetchBillerDetailsDeferred;
        },
        registerBiller: function(model) {
          registerBillerDeferred = $.Deferred();
          registerBiller(model, registerBillerDeferred);

          return registerBillerDeferred;
        },
        updateBiller: function(billerRegistrationId, model) {
          updateBillerDeferred = $.Deferred();
          updateBiller(billerRegistrationId, model, updateBillerDeferred);

          return updateBillerDeferred;
        },
        fetchRegisteredBillerDetails: function(billerRegistrationId) {
          fetchRegisteredBillerDetailsDeferred = $.Deferred();
          fetchRegisteredBillerDetails(billerRegistrationId, fetchRegisteredBillerDetailsDeferred);

          return fetchRegisteredBillerDetailsDeferred;
        }
      };
    };

  return new ReviewBillerRegistrationModel();
});