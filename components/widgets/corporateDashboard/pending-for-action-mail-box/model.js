define([
  "baseService"
], function (BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    MiniMailboxModel = function () {
      return {
        getMails: function () {
          const options = {
            url: "mailbox/mails?msgFlag=T",
            mockedUrl: "framework/json/design-dashboard/corporateDashboard/pending-for-action/pending-for-action-mailbox.json"
          };

          return baseService.fetchWidget(options);
        },
        getAlerts: function () {
          const options = {
            url: "mailbox/alerts",
            mockedUrl: "framework/json/design-dashboard/corporateDashboard/pending-for-action/pending-for-action-mailbox-alerts.json"
          };

          return baseService.fetchWidget(options);
        },
        getNotifications: function () {
          const options = {
            url: "mailbox/mailers",
            mockedUrl: "framework/json/design-dashboard/corporateDashboard/notification/notification-mailers.json"
          };

          return baseService.fetchWidget(options);
        }
      };
    };

  return new MiniMailboxModel();
});