define([
    "knockout",

    "./model",
    "ojL10n!resources/nls/oracle-live"
], function (ko, OracleLiveModel, resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.nls = resourceBundle;

        let isHeaderData;

        ko.utils.extend(self, rootParams.rootModel);

        const subscriberFunction = function (headerData) {
                if (headerData) {
                    if (window.olive) {
                        window.olive.updateOracleLive({
                            screenName: headerData,
                            moduleName: rootParams.baseModel.currentPage.module
                        });
                    } else {
                        window.liveApi.controller.contextAttributes.set("screenName", headerData);
                        window.liveApi.controller.contextAttributes.set("moduleName", rootParams.baseModel.currentPage.module);
                    }
                }
            },
            startOracleLive = function () {
                OracleLiveModel.getPreference().then(function (preferences) {
                    if (preferences.liveEnabled) {
                        require(["thirdPartyLibs/oracle.live.web.api/js/oracle.live.api.all"], function () {
                            isHeaderData = rootParams.dashboard.headerName.subscribe(subscriberFunction);

                            OracleLiveModel.getAccessToken().then(function (accessInfo) {
                                if (window.olive) {
                                    window.olive.setupOracleLive({
                                        userID: self.userData ? self.userData.userProfile.emailId.displayValue : "anonymous@oracle.com",
                                        tenantID: accessInfo.tenantID,
                                        access_token: accessInfo.access_token
                                    });

                                    if (self.userData) {
                                        const name = rootParams.baseModel.format(self.nls.fullName, {
                                            firstName: self.userData.firstName,
                                            lastName: self.userData.lastName
                                        });

                                        window.olive.updateOracleLive({
                                            email: self.userData.emailId.value,
                                            fullName: name,
                                            phone: self.userData.phoneNumber.value
                                        });
                                    }

                                    window.olive.updateOracleLive({
                                        appLocation: preferences.engagementScenario
                                    });
                                } else {
                                    window.liveApi.controller.service.userID = self.userData ? self.userData.userProfile.emailId.displayValue : "anonymous@oracle.com";
                                    window.liveApi.controller.service.tenantID = accessInfo.tenantID;
                                    window.liveApi.controller.service.authToken = accessInfo.access_token;

                                    window.liveApi.controller.service.authRefresh(accessInfo.expires_in, function () {
                                        OracleLiveModel.getAccessToken().then(function (accessInfo) {
                                            window.liveApi.controller.service.authToken = accessInfo.access_token;
                                        });
                                    });

                                    if (self.userData) {
                                        window.liveApi.controller.contextAttributes.set("email", self.userData.emailId.displayValue);

                                        window.liveApi.controller.contextAttributes.set("fullName", rootParams.baseModel.format(self.nls.fullName, {
                                            firstName: self.userData.firstName,
                                            lastName: self.userData.lastName
                                        }));

                                        window.liveApi.controller.contextAttributes.set("phone", self.userData.phoneNumber.displayValue);
                                    }

                                    window.liveApi.controller.contextAttributes.set("appLocation", preferences.engagementScenario);
                                    window.liveApi.controller.addComponent();
                                    window.liveApi.controller.contextAttributes.set("appLocation", preferences.engagementScenario);
                                    window.liveApi.controller.addComponent();
                                }
                            });
                        });
                    }
                });
            };

        if (rootParams.dashboard.userData) {
            self.userData = rootParams.dashboard.userData.userProfile;
        }

        startOracleLive();

        self.dispose = function () {
            if (isHeaderData) {
                isHeaderData.dispose();
            }
        };
    };
});