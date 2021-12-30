define([
  "knockout",
  "ojL10n!resources/nls/mailbox",
  "ojs/ojinputtext",
  "ojs/ojnavigationlist"
], function (ko, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    self.nls = resourceBundle;
    ko.utils.extend(self, rootParams.rootModel);
    rootParams.baseModel.registerComponent("mailbox-base", "mailbox");
    rootParams.baseModel.registerComponent("alert-list", "mailbox");
    rootParams.baseModel.registerComponent("notification-list", "mailbox");
    rootParams.baseModel.registerElement("nav-bar");
    self.countUpdated = ko.observable(true);
    self.menuSelection = ko.observable();
    self.showNavBar = ko.observable(false);
    self.menuOptions = ko.observable();
    self.selectedMailBoxComponent = ko.observable(self.params.selectedMailBoxComponent);

    self.alertTab = ko.computed({
      read: function () {
        return self.params.mailbox.unreadAlertCount() ? rootParams.baseModel.format(self.nls.mailbox.alerts.alertTab, {
          alertUnreadCount: self.params.mailbox.unreadAlertCount()
        }) : self.nls.mailbox.headers.alerts;
      },
      write: function () {
        return undefined;
      }
    });

    self.mailTab = ko.computed({
      read: function () {
        return self.params.mailbox.unreadmailCount() ? rootParams.baseModel.format(self.nls.mailbox.alerts.mailTab, {
          mailUnreadCount: self.params.mailbox.unreadmailCount()
        }) : self.nls.mailbox.headers.mails;
      },
      write: function () {
        return undefined;
      }
    });

    self.notificationTab = ko.computed({
      read: function () {
        return self.params.mailbox.unreadNotificationCount() ? rootParams.baseModel.format(self.nls.mailbox.alerts.notificationTab, {
          notificationUnreadCount: self.params.mailbox.unreadNotificationCount()
        }) : self.nls.mailbox.headers.notifications;
      },
      write: function () {
        return undefined;
      }
    });

    rootParams.baseModel.registerElement("nav-bar");

    self.menuOptions = ko.observable([{
      id: "Mails",
      label: self.mailTab,
      disabled: false
    },
    {
      id: "Alerts",
      label: self.alertTab,
      disabled: false
    },
    {
      id: "Notifications",
      label: self.notificationTab,
      disabled: false
    }
    ]);

    self.uiOptions = {
      menuFloat: "right",
      fullWidth: false,
      defaultOption: self.menuSelection
    };

    self.menuSelection.subscribe(function (newValue) {
      if (newValue.toUpperCase() === "MAILS") {
        self.selectedMailBoxComponent("Mails");
        self.setComponentId("mailbox-base");
      } else if (newValue.toUpperCase() === "ALERTS") {
        self.selectedMailBoxComponent("Alerts");
        self.setComponentId("alert-list");
      } else if (newValue.toUpperCase() === "NOTIFICATIONS") {
        self.selectedMailBoxComponent("Notifications");
        self.setComponentId("notification-list");
      }

      self.showNavBar(false);
      self.showNavBar(true);
    });

    if (self.menuOptions) {
      if (self.selectedMailBoxComponent().toUpperCase() === "MAILS") {
        self.menuSelection(self.menuOptions()[0].id);
      } else if (self.selectedMailBoxComponent().toUpperCase() === "ALERTS") {
        self.menuSelection(self.menuOptions()[1].id);
      } else {
        self.menuSelection(self.menuOptions()[2].id);
      }
    }

    self.dispose = function () {
      self.alertTab.dispose();
      self.mailTab.dispose();
      self.notificationTab.dispose();
    };
  };
});