define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    SystemConfigurationMenu = function() {
      let getEntitiesListDeferred;
      const getEntitiesList = function(deferred) {
        const options = {
          url: "entities",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let fetchTimezonesDeferred;
      const fetchTimezones = function(deferred) {
        const options = {
          url: "timezone",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
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
      let saveTimeZoneDeferred;
      const saveTimeZone = function(payload, entityId, deferred) {
        const options = {
          url: "configurations/variable/dayoneconfig/properties",
          headers: {
            "X-Target-Unit": entityId
          },
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.update(options);
      };
      let saveEntitiesDeferred;
      const saveEntities = function(data, entityId, deferred) {
        const params = {
            entityId: entityId
          },
          options = {
            url: "entities/{entityId}",
            headers: {
              "X-Target-Unit": entityId
            },
            data: data,
            success: function(data) {
              deferred.resolve(data);
            }
          };

        data = JSON.parse(data);

        if (data.auditSequence) {
          baseService.update(options, params);
        } else {
          options.url = "entities";
          baseService.add(options);
        }
      };
      let replicateEntityDeferred;
      const replicateEntity = function(determinantValue, deferred) {
        const options = {
          url: "configurations/multiEntity",
          headers: {
            "X-Target-Unit": determinantValue
          },
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let fetchSystemConfigurationDetailsDeferred;
      const fetchSystemConfigurationDetails = function(deferred) {
        const options = {
          url: "configurations/base/dayoneconfig/properties/SYSTEM_CONFIGURATION",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let createEntityDeferred;
      const createEntity = function(data, deferred) {
        const options = {
          url: "entities",
          data: data,
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.add(options);
      };

      return {
        getEntitiesList: function() {
          getEntitiesListDeferred = $.Deferred();
          getEntitiesList(getEntitiesListDeferred);

          return getEntitiesListDeferred;
        },
        saveEntities: function(data, entityId) {
          saveEntitiesDeferred = $.Deferred();
          saveEntities(data, entityId, saveEntitiesDeferred);

          return saveEntitiesDeferred;
        },
        saveTimeZone: function(payload, entityId) {
          saveTimeZoneDeferred = $.Deferred();
          saveTimeZone(payload, entityId, saveTimeZoneDeferred);

          return saveTimeZoneDeferred;
        },
        getTimezones: function() {
          fetchTimezonesDeferred = $.Deferred();
          fetchTimezones(fetchTimezonesDeferred);

          return fetchTimezonesDeferred;
        },
        fireBatch: function(subRequestList, type) {
          fireBatchDeferred = $.Deferred();
          fireBatch(fireBatchDeferred, subRequestList, type);

          return fireBatchDeferred;
        },
        replicateEntity: function(determinantValue) {
          replicateEntityDeferred = $.Deferred();
          replicateEntity(determinantValue, replicateEntityDeferred);

          return replicateEntityDeferred;
        },
        fetchSystemConfigurationDetails: function() {
          fetchSystemConfigurationDetailsDeferred = $.Deferred();
          fetchSystemConfigurationDetails(fetchSystemConfigurationDetailsDeferred);

          return fetchSystemConfigurationDetailsDeferred;
        },
        createEntity: function(payload) {
          createEntityDeferred = $.Deferred();
          createEntity(payload, createEntityDeferred);

          return createEntityDeferred;
        }
      };
    };

  return new SystemConfigurationMenu();
});