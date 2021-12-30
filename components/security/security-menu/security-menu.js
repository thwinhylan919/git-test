define([

    "knockout",
    "jquery",
    "ojL10n!resources/nls/security-menu",
    "baseLogger",
    "ojs/ojswitch",
    "ojs/ojnavigationlist",
    "baseLogger"
], function (ko, $, ResourceBundle, BaseLogger) {
    "use strict";

    return function (rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        rootParams.dashboard.headerName(self.resource.header);
        rootParams.baseModel.registerComponent("view-user-security-question", "user-security-question");
        self.menuSelection = ko.observable("view-user-security-question");
        self.selectedSecurityItem = ko.observable();
        self.refresh = ko.observable(true);
        self.password = ko.observable();
        self.dataLoaded = ko.observable(false);

        if (self.params.data) {
            self.selectedSecurityItem(self.params.data.id);
            self.menuSelection(self.params.data.module);
        }

        if (!rootParams.baseModel.small()) {
            self.selectedSecurityItem("setSecurityQuestion");
        }

        self.listItem = [{
            id: "setSecurityQuestion",
            module: "view-user-security-question",
            parentModule: "user-security-question",
            iconImage: "security/security-question.svg"
        }];

        if (rootParams.dashboard.appData.segment.indexOf("ADMIN") >= 0) {
            self.listItem.push({
                id: "changePassword",
                module: "change-password",
                parentModule: "change-password",
                iconImage: "security/change-password.svg"
            });
        }

        if (rootParams.dashboard.appData.segment.indexOf("ADMIN") < 0) {
            self.listItem.push({
                id: "smsAndMissedCallBanking",
                module: "sms-and-missed-call-banking",
                parentModule: "security",
                iconImage: "security/push-notifications.svg"
            });
        }

        if (rootParams.baseModel.cordovaDevice()) {
            if (rootParams.dashboard.appData.segment.indexOf("ADMIN") < 0) {

                self.listItem.push({
                    id: "patternVisiblity",
                    module: "pattern-visibility",
                    parentModule: "security",
                    iconImage: "security/visible-pattern.svg"
                });

                self.listItem.push({
                    id: "wearableSetPin",
                    module: "wearable-instructions",
                    parentModule: "security",
                    iconImage: "security/wearable-set.svg"
                });

                self.listItem.push({
                    id: "wearableResetPin",
                    module: "security-landing",
                    parentModule: "security",
                    iconImage: "security/reset-wearable.svg",
                    data: {
                        type: "wearableResetPin"
                    }
                });
            }

            self.listItem.push({
                id: "managePin",
                module: "security-landing",
                parentModule: "security",
                iconImage: "security/manage-pin.svg",
                data: {
                    type: "pin"
                }
            });

            self.listItem.push({
                id: "managePattern",
                module: "security-landing",
                parentModule: "security",
                iconImage: "security/manage-pattern.svg",
                data: {
                    type: "pattern"
                }
            });

            window.plugins.auth.touchid.isAvailable(function (data) {
                if (data.biometryType === "faceid") {
                    self.listItem.push({
                        id: "manageFaceID",
                        module: "security-landing",
                        parentModule: "security",
                        iconImage: "security/face-id.svg",
                        data: {
                            type: "faceID"
                        }
                    });
                } else {
                    self.listItem.push({
                        id: "manageTouchID",
                        module: "security-landing",
                        parentModule: "security",
                        iconImage: "security/touchID.svg",
                        data: {
                            type: "touchID"
                        }
                    });
                }

                self.dataLoaded(true);
            }, function () {
                self.dataLoaded(true);
            });
        } else {
            self.dataLoaded(true);
        }

        self.processMenuoption = function (selectedItem) {
            return new Promise(function (resolve, reject) {
                if (selectedItem && selectedItem.id === "wearableResetPin") {
                    window.Wearable.onConnect(resolve, reject);
                } else {
                    resolve();
                }
            });
        };

        self.selectedSecurityItem.subscribe(function (menuOption) {
            const selectedItem = self.listItem.filter(function (item) {
                return item.id === menuOption;
            })[0];

            self.processMenuoption(selectedItem).then(function () {
                rootParams.baseModel.registerComponent(selectedItem.module, selectedItem.parentModule);

                if (!rootParams.baseModel.small()) {
                    self.refresh(false);
                    ko.tasks.runEarly();
                    self.showDetailParams = selectedItem.data || {};
                    self.menuSelection(selectedItem.module);
                    self.refresh(true);
                } else {
                    rootParams.dashboard.loadComponent(selectedItem.module, selectedItem.data || {});
                }
            }, function () {
                rootParams.baseModel.showMessages(null, [self.resource.errors.WATCH_NOT_CONNECTED], "ERROR");
            });
        });

        const dummyFunction = function () {
            BaseLogger.info("this is a dummy function");
        };

        function setCheckMark(type) {
            let id;

            if (type.indexOf("pin") === 0) {
                id = "managePin";
            } else if (type.indexOf("pattern") === 0) {
                id = "managePattern";
            } else if (type === "touchid") {
                id = "manageTouchID";
            } else if (type === "faceid") {
                id = "manageFaceID";
            } else {
                return true;
            }

            $("#confirmPin").ready(function () {
                $("#" + id + "-currently-present")[0].innerHTML = $("#check-mark")[0].innerHTML;
            });
        }

        if (rootParams.baseModel.cordovaDevice()) {
            window.plugins.appPreferences.fetch(setCheckMark, dummyFunction, "alternate_preference");
        }
    };
});