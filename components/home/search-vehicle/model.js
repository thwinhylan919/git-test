define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const SearchVehicle = function() {
    const Model = function(state) {
        this.vehicle = {
          state: state ? state : ""
        };
      },
      baseService = BaseService.getInstance();
    let fetchProductGroupsDeferred;
    const fetchProductGroups = function(url, deferred) {
      const options = {
        url: url,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let createSessionDeferred;
    const createSession = function(deferred) {
      const options = {
        url: "session",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.add(options);
    };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      fetchProductGroups: function(url) {
        fetchProductGroupsDeferred = $.Deferred();
        fetchProductGroups(url, fetchProductGroupsDeferred);

        return fetchProductGroupsDeferred;
      },
      createSession: function() {
        createSessionDeferred = $.Deferred();
        createSession(createSessionDeferred);

        return createSessionDeferred;
      }
    };
  };

  return new SearchVehicle();
});