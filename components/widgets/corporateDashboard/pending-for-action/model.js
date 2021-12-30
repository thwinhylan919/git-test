define([
    "baseService"
], function(BaseService) {
  "use strict";

  const pendingApprovalList = function() {
    const baseService = BaseService.getInstance();

    return {
      getCountForApproval: function(roleType) {
        const params = {
            roleType: roleType
          },
          options = {
            url: "transactions/count?countFor=approval&roleType={roleType}",
            mockedUrl: "framework/json/design-dashboard/corporateDashboard/pending-for-action/pending-for-action.json"
          };

        return baseService.fetchWidget(options, params);
      }
    };
  };

  return new pendingApprovalList();
});