define([

  "baseService"
], function(BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    DashboardListModel = function() {
      return {
        fetchDashboards: function(segment) {
          return baseService.fetch({
            url: "dashboards/default?segment={segment}"
          }, {
            segment: segment
          });
        },
        fetchDashboardDesign: function(segment, module) {
          return baseService.fetch({
            url: "dashboards/modules?module={module}&segment={segment}"
          }, {
            segment: segment,
            module: module
          });
        },
        getApplicationRoles: function(segment) {
          return baseService.fetch({
            url: "applicationRoles?enterpriseRole={segment}&accessPointType=INT&filterSegmentedRole=true"
          }, {
            segment: segment
          });
        },
        getEnterpriseRoles: function() {
          return baseService.fetch({
            url: "enterpriseRoles?isLocal=true"
          });
        },
        getSegmentRoles : function(role){
          return baseService.fetch({
            url: "segments?enterpriseRole={role}&status=ENABLED"
          }, {
            role: role
          });
        },
        getDashboardList: function (enterpriseRole) {
          return baseService.fetch({
            url: "dashboards?enterpriseRole={enterpriseRole}&authorType=administrator&class=MODULE"
          }, {
            enterpriseRole: enterpriseRole
          });
        }
      };
    };

  return new DashboardListModel();
});
