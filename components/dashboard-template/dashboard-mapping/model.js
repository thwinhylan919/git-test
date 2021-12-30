define([

  "baseService"
], function (BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    CreateMappingModel = function () {
      return {
        getDashboardList: function (classValue, enterpriseRole) {
          return baseService.fetch({
            url: "dashboards?class={classValue}&enterpriseRole={enterpriseRole}"
          }, {
            classValue: classValue,
            enterpriseRole: enterpriseRole
          });
        },
        getTargetLinkageModel: function (dashboardId, mappedValue, mappedType) {
          return {
            dashboardId: dashboardId || null,
            mappedValue: mappedValue || null,
            mappedType: mappedType || null
          };
        },
        checkUserExists: function (userName, validationError) {
          return baseService.fetch({
            url: "users/{userName}",
            showMessage: false,
            validationError: validationError
          }, {
            userName: userName
          });
        },
        getEnterpriseRoles: function () {
          return baseService.fetch({
            url: "enterpriseRoles?isLocal=true"
          });
        },
        getEnterpriseSegmentRoles: function (enterpriseRole) {
          return baseService.fetch({
            url: "segments?enterpriseRole={enterpriseRole}&status=ENABLED"
          }, {
            enterpriseRole: enterpriseRole
          });
        }
      };
    };

  return new CreateMappingModel();
});