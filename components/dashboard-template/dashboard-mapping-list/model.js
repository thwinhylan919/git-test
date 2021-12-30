define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    DashboardListModel = function () {
      let Deferred, params;
      const getDashboardList = function (deferred) {
        const options = {
          url: "dashboards",
          success: function (data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let dashboardMappingDeferred;
      const dashboardMapping = function (mappingType, deferred) {
        params = {
          mappingType: mappingType
        };

        const options = {
          url: "dashboards/mappings?mappingType={mappingType}",
          success: function (data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options, params);
      };
      let deleteDesignMappingDeferred;
      const deleteDesignMapping = function (mappingId, deffered) {
        baseService.remove({
          url: "dashboards/mappings/{mappingId}",
          success: function (data, status, jqXhr) {
            deffered.resolve(data, status, jqXhr);
          },
          error: function (data, status, jqXhr) {
            deffered.reject(data, status, jqXhr);
          }
        }, {
          mappingId: mappingId
        });
      };

      return {
        getDashboardList: function () {
          Deferred = $.Deferred();
          getDashboardList(Deferred);

          return Deferred;
        },
        getMappings: function (mappingType) {
          dashboardMappingDeferred = $.Deferred();
          dashboardMapping(mappingType, dashboardMappingDeferred);

          return dashboardMappingDeferred;
        },
        deleteDesignMapping: function (mappingId) {
          deleteDesignMappingDeferred = $.Deferred();
          deleteDesignMapping(mappingId, deleteDesignMappingDeferred);

          return deleteDesignMappingDeferred;
        }
      };
    };

  return new DashboardListModel();
});