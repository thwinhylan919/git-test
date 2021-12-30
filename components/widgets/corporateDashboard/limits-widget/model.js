define(["baseService"], function (BaseService) {
  "use strict";

  const LimitsWigetModel = function () {
    const baseService = BaseService.getInstance();

    return {
      fetchCustomLimitPackages: function () {
        return baseService.fetchWidget({
          url: "me/customLimitPackage",
          mockedUrl: "framework/json/design-dashboard/corporateDashboard/limits-widget/customLimits.json"
        });
      },
      fetchUtilizationLimit: function (entityType, limitType) {
        return baseService.fetchWidget({
          url: "financialLimitUtilization?entityType={entityType}&limitType={limitType}",
          mockedUrl: "framework/json/design-dashboard/corporateDashboard/limits-widget/financialLimits.json"
        }, {
          entityType: entityType,
          limitType: limitType
        });
      },
      fetchAssignedLimitPackages: function (party) {
        return baseService.fetchWidget({
          url: party === "PARTY" ? "me/party/assignedLimitPackage" : "me/assignedLimitPackage",
          mockedUrl: "framework/json/design-dashboard/corporateDashboard/limits-widget/assignedLimits.json"
        });
      },
      getTransactionName: function () {
        return baseService.fetchWidget({
          url: "resourceTasks?aspects=limit&view=list",
          mockedUrl: "framework/json/design-dashboard/corporateDashboard/limits-widget/resourceTasks.json"
        });
      }
    };
  };

  return new LimitsWigetModel();
});