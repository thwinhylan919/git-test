define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const pendingApprovalList = function() {
    const baseService = BaseService.getInstance();
    let getPendingApprovalsListDeferred;
    const getPendingApprovalsList = function(deferred) {
      const options = {
        url: "transactions/count?countFor=approved",
        mockedUrl:"framework/json/design-dashboard/approval/count.json",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetchWidget(options);
    };

    return {
      getPendingApprovalsList: function() {
        getPendingApprovalsListDeferred = $.Deferred();
        getPendingApprovalsList(getPendingApprovalsListDeferred);

        return getPendingApprovalsListDeferred;
      }
    };
  };

  return new pendingApprovalList();
});