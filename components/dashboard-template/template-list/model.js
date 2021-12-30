define([

    "baseService"
], function(BaseService) {
    "use strict";

    const baseService = BaseService.getInstance(),
        DashboardListModel = function() {
            return {
                getEnterpriseRoles: function() {
                    return baseService.fetch({
                        url: "enterpriseRoles?isLocal=true"
                    });
                },
                getDashboardList: function(enterpriseRole) {
                    return baseService.fetch({
                        url: "dashboards?enterpriseRole={enterpriseRole}&authorType=administrator"
                    }, {
                        enterpriseRole: enterpriseRole
                    });
                },
                applyDashboard: function(dashboardId) {
                    return baseService.fetch({
                        url: "dashboards/apply/{dashboardId}"
                    }, {
                        dashboardId: dashboardId
                    });
                },
                dashboardMapping: function(mappingType) {
                    return baseService.fetch({
                        url: "dashboards/mappings?mappingType={mappingType}"
                    }, {
                        mappingType: mappingType
                    });
                }
            };
        };

    return new DashboardListModel();
});