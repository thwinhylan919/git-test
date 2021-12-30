define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * @namespace AlertsMaintenance~Model
   * @class AlertsMaintenanceModel
   * @extends BaseService {@link BaseService}
   */
  const AlertsMaintenanceModel = function() {
    let params;
    const baseService = BaseService.getInstance();
    let fetchAlertsDeferred;
    const fetchAlerts = function(activityId, eventId, moduleId, deferred) {
      params = {
        activityId: activityId || "",
        eventId: eventId || "",
        moduleId: moduleId || "",
        actionId: "A"
      };

      const options = {
        url: "activityEventActions?activityId={activityId}&eventId={eventId}&moduleId={moduleId}&actionId={actionId}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };
    let fetchEventDescriptionListDeferred;
    const fetchEventDescriptionList = function(moduleType, deferred) {
      params = {
        moduleType: moduleType || ""
      };

      const options = {
        url: "activityEvents?moduleId={moduleType}",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options,params);
    };
    let fetchModuleTypeListDeferred;
    const fetchModuleTypeList = function(deferred) {
      const options = {
        url: "enumerations/moduleTypes",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      fetchAlerts: function(activityId, eventId, moduleId) {
        fetchAlertsDeferred = $.Deferred();
        fetchAlerts(activityId, eventId, moduleId, fetchAlertsDeferred);

        return fetchAlertsDeferred;
      },
      fetchEventDescriptionList: function(moduleType) {
        fetchEventDescriptionListDeferred = $.Deferred();
        fetchEventDescriptionList(moduleType, fetchEventDescriptionListDeferred);

        return fetchEventDescriptionListDeferred;
      },
      fetchModuleTypeList: function() {
        fetchModuleTypeListDeferred = $.Deferred();
        fetchModuleTypeList(fetchModuleTypeListDeferred);

        return fetchModuleTypeListDeferred;
      }
    };
  };

  return new AlertsMaintenanceModel();
});