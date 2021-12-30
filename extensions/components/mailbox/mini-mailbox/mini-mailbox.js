define([
        "ojs/ojcore",
        "knockout",
        "jquery",
        "./model",
        "ojL10n!resources/nls/mini-mailbox",
        "ojs/ojtoolbar",
        "ojs/ojlistview",
        "ojs/ojnavigationlist",
        "ojs/ojtabs",
        "ojs/ojpagingcontrol",
        "ojs/ojpagingtabledatasource",
        "ojs/ojarraytabledatasource",
        "ojs/ojvalidation"
    ],
    function (oj, ko, $, MiniMailboxBaseModel, resourceBundle) {
        "use strict";

        return function (params) {
            const self = this;

            self.nls = resourceBundle;

            self.mailbox = {
                unreadmailCount: ko.observable(0),
                unreadAlertCount: ko.observable(0),
                unreadNotificationCount: ko.observable(0)
            };

            params.baseModel.registerElement("nav-bar");
            params.baseModel.registerComponent("message-base", "mailbox");
            params.baseModel.registerComponent("updated-message-base", "mailbox");
            self.nls = resourceBundle;
            self.menuSelection = ko.observable();
            self.mailsArray = ko.observableArray();
            self.alertsArray = ko.observableArray();
            self.notificationsArray = ko.observableArray();
            self.mailDataSource = ko.observable();
            self.alertDatasource = ko.observable();
            self.notificationDataSource = ko.observable();
            self.showlist = ko.observable(false);
            self.menuselected = ko.observable("Mails");
            self.selectedRecord = ko.observable();
            self.isAdminMailBox = ko.observable(false);
            self.showSeeMore = ko.observable(false);
            self.updateMailDatasource = ko.observable(false);
            self.updateAlertDatasource = ko.observable(false);
            self.updateNotificationDatasource = ko.observable(false);
            self.displayNavBar = ko.observable(false);
            self.datasource = ko.observable();
            self.menuOptions = ko.observableArray([]);

            self.miniMailboxParamsObj = ko.observable({
                tab: "",
                data: ""
            });

            if (params.dashboard.appData.segment === "ADMIN" || params.dashboard.appData.segment === "CORPADMIN") {
                self.isAdminMailBox(true);
            }

            self.getRootContext = function (data, $root) {
                $root.userInfoPromise.then(function () {
                    ko.utils.extend(self, params.rootModel);
                });
            };

            self.formatMailsForCustomerID = function (mails, flag) {
                for (let i = 0; i < mails.length; i++) {
                    const MessageUserMappings = mails[i].messageUserMappings;

                    for (let j = 0; j < MessageUserMappings.length; j++) {
                        const messageUserMapping = MessageUserMappings[j];

                        if (messageUserMapping.msgFlag === flag) {
                            if (flag === "F") {
                                if (self.isAdminMailBox()) {
                                    mails[i].userName = messageUserMapping.username;
                                    mails[i].customerID = messageUserMapping.userId;
                                } else {
                                    mails[i].userName = messageUserMapping.userGroupName;

                                    if (!messageUserMapping.userGroupName) {
                                        mails[i].senderName = messageUserMapping.username;
                                    } else {
                                        mails[i].senderName = messageUserMapping.userGroupName;
                                    }

                                    mails[i].customerID = messageUserMapping.userId;
                                }
                            }
                        }

                        if (self.isAdminMailBox() && flag === "T") {
                            if (messageUserMapping.msgFlag === flag && !messageUserMapping.userGroupName) {
                                mails[i].customerID = messageUserMapping.userId;
                                mails[i].userName = messageUserMapping.username;
                            }
                        }

                        if (params.dashboard.userData && messageUserMapping.userId === params.dashboard.userData.userProfile.userName) {
                            if (messageUserMapping.status === "U") {
                                mails[i].readStatus = true;
                            } else {
                                mails[i].readStatus = false;
                            }
                        }

                        if (messageUserMapping.userGroupName) {
                            mails[i].userGroupName = messageUserMapping.userGroupName;
                        }
                    }

                    if (mails[i].customerID === undefined) {
                        mails[i].customerID = "";
                    }
                }

                return mails;
            };

            self.formatAlertForCustomerID = function (alerts) {
                for (let i = 0; i < alerts.length; i++) {
                    const MessageUserMappings = alerts[i].messageUserMappings;

                    for (let j = 0; j < MessageUserMappings.length; j++) {
                        const messageUserMapping = MessageUserMappings[j];

                        if (params.dashboard.userData && messageUserMapping.userId === params.dashboard.userData.userProfile.userName) {
                            if (messageUserMapping.status === "U") {
                                alerts[i].readStatus = true;
                            } else {
                                alerts[i].readStatus = false;
                            }
                        }
                    }
                }

                return alerts;
            };

            self.formatNotificationsForCustomerID = function (messageUserMappings) {
                for (let j = 0; j < messageUserMappings.length; j++) {
                    const MessageUserMapping = messageUserMappings[j];

                    if (params.dashboard.userData && MessageUserMapping.userId === params.dashboard.userData.userProfile.userName) {
                        if (MessageUserMapping.status === "U") {
                            messageUserMappings[j].readStatus = true;
                        } else {
                            messageUserMappings[j].readStatus = false;
                        }
                    }
                }

                return messageUserMappings;
            };

            $.when(MiniMailboxBaseModel.getMailCount(), MiniMailboxBaseModel.getMails(), MiniMailboxBaseModel.getAlerts(), MiniMailboxBaseModel.getNotifications()).done(function (mailboxCount, mailData, alertData, notificationData) {

                for (let i = 0; i < mailboxCount.summary.items.length; i++) {
                    switch (mailboxCount.summary.items[i].messageType) {
                        case "M":
                            self.mailbox.unreadmailCount(mailboxCount.summary.items[i].unReadCount);
                            break;
                        case "A":
                            self.mailbox.unreadAlertCount(mailboxCount.summary.items[i].unReadCount);
                            break;
                        case "B":
                            self.mailbox.unreadNotificationCount(mailboxCount.summary.items[i].unReadCount);
                            break;
                    }
                }

                params.baseModel.dispatchCustomEvent(document.getElementById("mailbox-holder"), "notificationUpdated", self.mailbox.unreadmailCount() + self.mailbox.unreadAlertCount() + self.mailbox.unreadNotificationCount());

                self.alertTab = ko.observable(self.mailbox.unreadAlertCount() !== 0 ? params.baseModel.format(self.nls.mailbox.alertTab, {
                    alertUnreadCount: self.mailbox.unreadAlertCount()
                }) : self.nls.mailbox.alerts);

                self.mailTab = ko.observable(self.mailbox.unreadmailCount() !== 0 ? params.baseModel.format(self.nls.mailbox.mailTab, {
                    mailUnreadCount: self.mailbox.unreadmailCount()
                }) : self.nls.mailbox.mails);

                self.notificationTab = ko.observable(self.mailbox.unreadNotificationCount() !== 0 ? params.baseModel.format(self.nls.mailbox.notificationTab, {
                    unreadNotificationCount: self.mailbox.unreadNotificationCount()
                }) : self.nls.mailbox.notificationTitle);

                const record = self.formatMailsForCustomerID(mailData.mails, "F", false);
                let x;

                for (x = 0; x < record.length; x++) {
                    if (record[x].readStatus === true) {
                        self.mailsArray.push(record[x]);
                    }
                }

                self.mailDataSource(new oj.ArrayTableDataSource(self.mailsArray(), {
                    idAttribute: "messageId"
                }));

                self.datasource(self.mailDataSource());
                self.showlist(true);

                const alertRecord = self.formatAlertForCustomerID(alertData.alertDTOs, "T");

                for (x = 0; x < alertRecord.length; x++) {
                    if (alertRecord[x].readStatus === true) {
                        self.alertsArray.push(alertRecord[x]);
                    }
                }

                self.alertDatasource(new oj.ArrayTableDataSource(self.alertsArray(), {
                    idAttribute: "messageId"
                }));

                const notificationsRecord = self.formatNotificationsForCustomerID(notificationData.mailerUserMapDTOs, "F", false);

                for (x = 0; x < notificationsRecord.length; x++) {
                    if (notificationsRecord[x].readStatus === true) {
                        self.notificationsArray.push(notificationsRecord[x]);
                    }
                }

                self.notificationDataSource(new oj.ArrayTableDataSource(self.notificationsArray(), {
                    idAttribute: "messageId"
                }));

                if (params.dashboard.appData.segment !== "RETAIL" && params.dashboard.appData.segment !== "CORP") {

                    self.menuOptions.push({
                        id: "miniMail",
                        label: self.mailTab(),
                        disabled: false
                    });

                }

                self.menuOptions.push({

                    id: "miniAlert",
                    label: self.alertTab(),
                    disabled: false
                });

                self.menuOptions.push({
                    id: "miniNotification",
                    label: self.notificationTab(),
                    disabled: false
                });

                self.displayNavBar(false);
                self.displayNavBar(true);
                self.menuSelection("miniMail");
            });

            self.mailsArray.subscribe(function () {
                if (self.updateMailDatasource() === true) {
                    self.mailDataSource(new oj.ArrayTableDataSource(self.mailsArray(), {
                        idAttribute: "messageId"
                    }));

                    self.datasource(self.mailDataSource());
                    self.showlist(false);
                    self.showlist(true);
                }
            });

            self.alertsArray.subscribe(function () {
                if (self.updateAlertDatasource() === true) {
                    self.alertDatasource(new oj.ArrayTableDataSource(self.alertsArray(), {
                        idAttribute: "messageId"
                    }));

                    self.datasource(self.alertDatasource());
                    self.showlist(false);
                    self.showlist(true);
                    self.updateAlertDatasource(false);
                }
            });

            self.notificationsArray.subscribe(function () {
                if (self.updateNotificationDatasource() === true) {
                    self.notificationDataSource(new oj.ArrayTableDataSource(self.notificationsArray(), {
                        idAttribute: "messageId"
                    }));

                    self.datasource(self.notificationDataSource());
                    self.showlist(false);
                    self.showlist(true);
                    self.updateNotificationDatasource(false);
                }
            });

            self.updateMailDatasource = ko.observable(false);

            self.uiOptions = {
                menuFloat: "right",
                fullWidth: false,
                defaultOption: self.menuSelection
            };

            self.menuSelection.subscribe(function (newValue) {
                self.showSeeMore(false);
                self.showlist(false);

                if (newValue === "miniMail") {
                    self.menuselected("Mails");
                    self.datasource(self.mailDataSource());
                } else if (newValue === "miniAlert") {
                    self.menuselected("Alerts");
                    self.datasource(self.alertDatasource());
                } else if (newValue === "miniNotification") {
                    self.menuselected("Notifications");
                    self.datasource(self.notificationDataSource());
                }

                oj.Context.getContext(document.querySelector("#miniMailbox")).getBusyContext().whenReady().then(function () {
                    self.showlist(true);

                    if (self.datasource().data.length > 0) {
                        self.showSeeMore(true);
                    }
                });
            });

            self.loadMailBoxComponent = function (token, data) {
                $("#popup1").hide();
                self.selectedRecord(data);
                self.miniMailboxParamsObj().tab = self.menuselected();
                self.miniMailboxParamsObj().data = self.selectedRecord();

                if (token === "F" && params.baseModel.QueryParams.get("page") === "message-base") {

                    params.dashboard.loadComponent("updated-message-base", {
                        miniMailboxParamsObj: null,
                        selectedMailBoxComponent: self.menuselected(),
                        mailbox: self.mailbox,
                        notificationsArray: self.notificationsArray,
                        updateAlertDatasource: self.updateAlertDatasource,
                        alertsArray: self.alertsArray
                    }, self);
                } else if (token === "T" || (token === "F" && params.baseModel.QueryParams.get("page") !== "message-base")) {
                    params.dashboard.loadComponent("message-base", {
                        miniMailboxParamsObj: self.miniMailboxParamsObj(),
                        selectedMailBoxComponent: self.menuselected(),
                        mailbox: self.mailbox,
                        notificationsArray: self.notificationsArray,
                        updateAlertDatasource: self.updateAlertDatasource,
                        alertsArray: self.alertsArray
                    });
                }
            };
        };
    });