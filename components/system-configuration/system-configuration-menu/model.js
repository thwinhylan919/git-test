define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    logOut = function() {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage("logout");
      }

      const options = {
        url: "session",
        success: function() {
          const form = document.createElement("form");

          form.action = "/logout.";
          document.body.appendChild(form);
          form.submit();
        }
      };

      baseService.remove(options);
    },
    SystemConfigurationMenu = function() {
      const Model = function() {
        this.ConfigurationItem = {
          version: "",
          id: "",
          handler: "",
          inputDTOs: []
        };

        this.configuration = {
          id: "",
          name: "",
          configurationItemDTOs: []
        };

        this.finalPayLoad = {
          id: "",
          name: "",
          maxOccurance: 1,
          configurationDTOs: []
        };
      };
      let Deferred;
      const getMenuList = function(host, entityName, deferred) {
        const hostName = "DAY_0_" + host,
          options = {
            throttle: false,
            url: "configurations/wizard/" + hostName,
            headers: {
              "X-Target-Unit": entityName
            },
            success: function(data) {
              deferred.resolve(data);
            }
          };

        baseService.fetch(options);
      };
      let getDynamicModuleMenuDeferred;
      const getDynamicModuleMenu = function(determinantValue, deferred) {
        const options = {
          throttle: false,
          url: "configurations/variable/mandatory",
          headers: {
            "X-Target-Unit": determinantValue
          },
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let createConfigurationDeferred;
      const createConfiguration = function(host, entityName, entityFlag, data, deferred) {
        const hostName = "DAY_0_" + host,
          options = {
            url: "configurations/wizard/" + hostName,
            headers: {
              "X-Target-Unit": entityName
            },
            data: data,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          };

        data = JSON.parse(data);

        if (entityFlag) {
          baseService.add(options);
        } else {
          baseService.update(options);
        }
      };
      let createEntityDeferred;
      const createEntity = function(data, deferred) {
        const options = {
          url: "entities",
          headers: {
            "X-Target-Unit": data.businessUnitCode
          },
          data: data,
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.add(options);
      };
      let createEntityConfigurationDeferred;
      const createEntityConfiguration = function(payload, deferred) {
        const options = {
          url: "configurations/base/BaseConfig/properties",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

        baseService.update(options);
      };
      let fetchSystemConfigurationDetailsDeferred;
      const fetchSystemConfigurationDetails = function(entity, deferred) {
        const options = {
          url: "configurations/base/dayoneconfig/properties/SYSTEM_CONFIGURATION",
          headers: {
            "X-Target-Unit": entity
          },
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };

      return {
        logOut: function() {
          logOut();
        },
        getNewModel: function() {
          return new Model();
        },
        getMenuList: function(host, entityName) {
          Deferred = $.Deferred();
          getMenuList(host, entityName, Deferred);

          return Deferred;
        },
        getDynamicModuleMenu: function(host) {
          getDynamicModuleMenuDeferred = $.Deferred();
          getDynamicModuleMenu(host, getDynamicModuleMenuDeferred);

          return getDynamicModuleMenuDeferred;
        },
        createConfiguration: function(host, entityName, entityFlag, payload) {
          createConfigurationDeferred = $.Deferred();
          createConfiguration(host, entityName, entityFlag, payload, createConfigurationDeferred);

          return createConfigurationDeferred;
        },
        createEntityConfiguration: function(payload) {
          createEntityConfigurationDeferred = $.Deferred();
          createEntityConfiguration(payload, createEntityConfigurationDeferred);

          return createEntityConfigurationDeferred;
        },
        createEntity: function(payload) {
          createEntityDeferred = $.Deferred();
          createEntity(payload, createEntityDeferred);

          return createEntityDeferred;
        },
        fetchSystemConfigurationDetails: function(entity) {
          fetchSystemConfigurationDetailsDeferred = $.Deferred();
          fetchSystemConfigurationDetails(entity, fetchSystemConfigurationDetailsDeferred);

          return fetchSystemConfigurationDetailsDeferred;
        }
      };
    };

  return new SystemConfigurationMenu();
});