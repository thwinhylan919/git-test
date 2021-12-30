define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    SystemConfigurationMenu = function() {
      let Deferred;
      const getHostList = function(deferred) {
        const options = {
          throttle: false,
          url: "enumerations/host",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let getEntitiesListDeferred;
      const getEntitiesList = function(deferred) {
        const options = {
          throttle: false,
          url: "entities",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let getHostSelectionDeferred;
      const getHostSelection = function(entity, deferred) {
        const options = {
          throttle: false,
          url: "configurations/variable/ConfigurationVariable/properties/BANK.DEFAULT.HOST?environmentId=OBDX",
          headers: {
            "X-Target-Unit": entity
          },
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let getSystemConfigurationDeferred;
      const getSystemConfiguration = function(entity, deferred) {
        const options = {
          throttle: false,
          url: "configurations/base/dayoneconfig/properties/SYSTEM_CONFIGURATION",
          headers: {
            "X-Target-Unit": entity
          },
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      };

      return {
        getHostList: function() {
          Deferred = $.Deferred();
          getHostList(Deferred);

          return Deferred;
        },
        getEntitiesList: function() {
          getEntitiesListDeferred = $.Deferred();
          getEntitiesList(getEntitiesListDeferred);

          return getEntitiesListDeferred;
        },
        getHostSelection: function(entity) {
          getHostSelectionDeferred = $.Deferred();
          getHostSelection(entity, getHostSelectionDeferred);

          return getHostSelectionDeferred;
        },
        getSystemConfiguration: function(entity) {
          getSystemConfigurationDeferred = $.Deferred();
          getSystemConfiguration(entity, getSystemConfigurationDeferred);

          return getSystemConfigurationDeferred;
        }
      };
    };

  return new SystemConfigurationMenu();
});