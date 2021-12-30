define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojL10n!resources/nls/mini-mailbox",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function(oj, ko, MiniMailboxBaseModel, resourceBundle) {
    "use strict";

    return function(params) {
        const self = this;

        let unreadNotificationsCountCheck;

        self.unreadNotificationCount = ko.observable();

        self.isUnreadNotification = ko.observable(false);
        self.nls = resourceBundle;

        self.miniMailboxObj = ko.observable();
        params.baseModel.registerComponent("notification-list", "mailbox");
        params.baseModel.registerElement("date-time");
        self.notificationsArray = ko.observableArray();

        self.notificationDataSource = new oj.ArrayTableDataSource(self.notificationsArray, {
            idAttribute: "mapId"
        });

        self.formatNotificationsForCustomerID = function(messageUserMappings) {
            unreadNotificationsCountCheck = 0;

            for (let j = 0; j < messageUserMappings.length; j++) {
                const MessageUserMapping = messageUserMappings[j];

                if (params.dashboard.userData && MessageUserMapping.userId === params.dashboard.userData.userProfile.userName) {
                    if (MessageUserMapping.status === "U") {
                        unreadNotificationsCountCheck++;
                    }
                }
            }

            return messageUserMappings;
        };

        function setNotification(notificationData) {
            const notificationsRecord = self.formatNotificationsForCustomerID(notificationData.mailerUserMapDTOs);

            self.unreadNotificationCount(unreadNotificationsCountCheck);

            let x;

            for (x = 0; x < notificationsRecord.length; x++) {
                if (notificationsRecord[x].status === "U") {
                    self.notificationsArray.push(notificationsRecord[x]);
                }

                if (self.notificationsArray().length === 3) {
                    break;
                }
            }

            if (self.unreadNotificationCount()) {
                self.isUnreadNotification(true);
            }
        }

        function fetchData() {
            MiniMailboxBaseModel.getNotifications().then(function(notificationData) {
                setNotification(notificationData);
            });
        }

        fetchData();

        self.loadMailBoxComponent = function(token, data) {
            if (token === "T") {
                params.dashboard.loadComponent("notification-list", {
                    tab: "Notifications",
                    data: data
                });
            } else if (token === "F") {

                params.dashboard.loadComponent("notification-list");
            }
        };
    };
});