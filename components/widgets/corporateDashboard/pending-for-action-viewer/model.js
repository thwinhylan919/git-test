define([
  "baseService"
], function (BaseService) {
  "use strict";

  const PendingActions = function () {
    const baseService = BaseService.getInstance();

    return {
      getCountForApproval: function (roleType) {
        const params = {
            roleType: roleType
          },
          options = {
            url: "transactions/count?countFor=approval&roleType={roleType}",
            mockedUrl: "framework/json/design-dashboard/corporateDashboard/pending-for-action/pending-for-action-viewer.json",
            showMessage: false
          };

        return baseService.fetchWidget(options, params);
      }
    };
  };

  return new PendingActions();
});