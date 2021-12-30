define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /* Extending predefined baseService to get ajax functions. */
  const baseService = BaseService.getInstance(),
    MiniMailboxModel = function() {
      let getMailsDeferred;
      const getMails = function(deferred) {
        const options = {
          url: "mailbox/mails?&msgFlag=T",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let getAlertsDeferred;
      const getAlerts = function(deferred) {
        const options = {
          url: "mailbox/alerts",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let getNotificationsDeferred;
      const getNotifications = function(deferred) {
        const options = {
          url: "mailbox/mailers",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let getMailCountDeferred;
      const getMailCount = function(deferred) {
        const options = {
          url: "mailbox/count",
          selfLoader: true,
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };

      return {
        getMails: function() {
          getMailsDeferred = $.Deferred();
          getMails(getMailsDeferred);

          return getMailsDeferred;
        },
        getAlerts: function() {
          getAlertsDeferred = $.Deferred();
          getAlerts(getAlertsDeferred);

          return getAlertsDeferred;
        },
        getNotifications: function() {
          getNotificationsDeferred = $.Deferred();
          getNotifications(getNotificationsDeferred);

          return getNotificationsDeferred;
        },
        getMailCount: function() {
          getMailCountDeferred = $.Deferred();
          getMailCount(getMailCountDeferred);

          return getMailCountDeferred;
        }
      };
    };

  return new MiniMailboxModel();
});