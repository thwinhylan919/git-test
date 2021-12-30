define([
  "baseService",
  "jquery"
], function (BaseService, $) {
  "use strict";

  let deleteDesignDashboardDeferred;
  const baseService = BaseService.getInstance(),
    deleteDesignDashboard = function (dashboardId, deffered) {
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
    },
    DashboardListModel = function () {
      return {
        getTargetLinkageModel: function (dashboardName, dashboardDescription, dashboardClassValue, dashboardClass, layout) {
          let dashboardObj = {};

          dashboardObj = {
            creationDate: null,
            dashboardName: dashboardName,
            dashboardDescription: dashboardDescription,
            dashboardClass: dashboardClass || null,
            dashboardClassValue: dashboardClassValue || null,
            enterpriseRole: null,
            layout: {
              layout: {
                large: layout ? layout.layout.large : [],
                medium: layout ? layout.layout.medium : [],
                small: layout ? layout.layout.small : []
              },
              name: null,
              titleName: null
            }
          };

          return dashboardObj;
        },
        fetchApplicationWidgets: function (url) {
          return baseService.fetch({
            url: url
          });
        },
        fetchApplicationRolesForSegment: function (code) {
          return baseService.fetch({
            url: "segments/{code}"
          }, {
            code: code
          });
        },
        fetchDefaultApplicationRoles: function (segment) {
          return baseService.fetch({
            url: "applicationRoles?enterpriseRole={segment}&accessPointType=INT&filterSegmentedRole=true"
          }, {
            segment: segment
          });
        },
        saveDashboard: function (payload) {
          return baseService.fetch({
            url: "dashboards"
          }, {
            payload: payload
          });
        },
        updateDashboard: function (payload, id) {
          return baseService.fetch({
            url: "dashboards"
          }, {
            payload: payload,
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
        getUserInformation: function () {
          return baseService.fetch({
            url: "me"
          });
        },
        readDefaultDashboard: function (dashboardClass, dashboardValue) {
          return baseService.fetch({
            url: "dashboards/modules?class={dashboardClass}&value={dashboardValue}"
          }, {
            dashboardClass: dashboardClass,
            dashboardValue: dashboardValue
          });
        },
        deleteUserDashboard: function (dashboardId) {
          deleteDesignDashboardDeferred = $.Deferred();
          deleteDesignDashboard(dashboardId, deleteDesignDashboardDeferred);

          return deleteDesignDashboardDeferred;
        }
      };
    };

  return new DashboardListModel();
});