define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    DashboardListModel = function () {
      let deleteDesignDashboardDeferred,deleteUserDesignDashboardDeferred;
      const deleteDesignDashboard = function (dashboardId, deffered) {
        const params = {
            dashboardId: dashboardId
          },
          options = {
            url: "dashboards/{dashboardId}",
            success: function (data, status, jqXhr) {
              deffered.resolve(data, status, jqXhr);
            },
            error: function (data, status, jqXhr) {
              deffered.reject(data, status, jqXhr);
            }
          };

        baseService.remove(options, params);
      },deleteUserDesignDashboard = function (dashboardId, deffered) {
        const params = {
            dashboardId: dashboardId
          },
          options = {
            url: "dashboards/user/{dashboardId}",
            success: function (data, status, jqXhr) {
              deffered.resolve(data, status, jqXhr);
            },
            error: function (data, status, jqXhr) {
              deffered.reject(data, status, jqXhr);
            }
          };

        baseService.remove(options, params);
      };

      return {
        getTargetLinkageModel: function () {
          let dashboardObj = {};

          dashboardObj = {
            dashboardName: null,
            dashboardDescription: null,
            dashboardClass: null,
            dashboardClassValue: null,
            layout: {
              large: {
                topPanel: [],
                leftPanel: [],
                middlePanel: [],
                rightPanel: []
              },
              medium: {
                topPanel: [],
                leftPanel: [],
                middlePanel: [],
                rightPanel: []
              },
              small: {
                topPanel: [],
                leftPanel: [],
                middlePanel: [],
                rightPanel: []
              }
            },
            dashboardDesign: null
          };

          return dashboardObj;
        },
        deleteDesignDashboard: function (dashboardId) {
          deleteDesignDashboardDeferred = $.Deferred();
          deleteDesignDashboard(dashboardId, deleteDesignDashboardDeferred);

          return deleteDesignDashboardDeferred;
        },
        readDashboard: function (id) {
          return baseService.fetch({
            url: "dashboards/{id}"
          }, {
            id: id
          });
        },
        readUserDashboard: function (id) {
          return baseService.fetch({
            url: "dashboards/user/{id}"
          }, {
            id: id
          });
        },
        readDefaultDashboard: function (dashboardClass,dashboardValue) {
          return baseService.fetch({
            url: "dashboards/modules?class={dashboardClass}&value={dashboardValue}"
          }, {
            dashboardClass: dashboardClass,
            dashboardValue:dashboardValue
          });
        },
        getUserInformation: function () {
          return baseService.fetch({
            url: "me"
          });
        },
        deleteUserDesignDashboard: function (dashboardId) {
          deleteUserDesignDashboardDeferred = $.Deferred();
          deleteUserDesignDashboard(dashboardId, deleteUserDesignDashboardDeferred);

          return deleteUserDesignDashboardDeferred;
        }
      };
    };

  return new DashboardListModel();
});