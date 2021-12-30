define([
  "baseService"
], function (BaseService) {
  "use strict";

  const pendingApprovalList = function () {
    const baseService = BaseService.getInstance();

    return {
      getCountForApproval: function (roleType) {
        return baseService.fetchWidget({
          url: "transactions/count?countFor=approval&roleType={roleType}",
          mockedUrl: "framework/json/design-dashboard/corporateDashboard/latest-pending-approvals/latest-pending-approvals.json"
        }, {
          roleType: roleType
        });
      },
      getTransactionData: function (discriminator, rejectPromise) {
        return new Promise(function (resolve, reject) {
          if (rejectPromise) {
            rejectPromise.call(reject, null);
          }

          baseService.fetchWidget({
            url: "transactions?view=approval&discriminator={discriminator}",
            mockedUrl: "framework/json/design-dashboard/corporateDashboard/latest-pending-approvals/transactionList.json"
          }, {
            discriminator: discriminator
          }).then(resolve, reject);
        });
      }
    };
  };

  return new pendingApprovalList();
});