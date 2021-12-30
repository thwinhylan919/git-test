define([
        "knockout",
        "baseLogger",
        "framework/js/configurations/config"
    ],
    function(ko, BaseLogger, Configuration) {
        "use strict";

        return function(rootParams) {
            const self = this;

            self.fbSdkNotLoaded = ko.observable(false);

            ko.utils.extend(self, rootParams.rootModel);

            require([Configuration.thirdPartyAPIs.facebook.sdkURL], function() {
                    self.apiMap = {
                        USER_PROFILE: {
                            url: "me",
                            fields: "name, first_name,last_name,email,gender",
                            scope: "public_profile,email"
                        },
                        USER_FRIENDS: {
                            url: "me/friends",
                            fields: "name,id,picture,first_name,last_name",
                            scope: "public_profile,email,user_friends"
                        }
                    };

                    self.currentAPI = self.customAPI ? self.customAPI : self.apiMap[self.api];

                    window.FB.init({
                        appId: Configuration.thirdPartyAPIs.facebook.apiKey,
                        cookie: true,
                        xfbml: true,
                        status: true,
                        version: "v2.9"
                    });

                    self.login = function() {
                        window.FB.login(function(response) {
                            if (response.authResponse) {
                                self.callFBApi();
                            }
                        }, {
                            scope: self.currentAPI.scope
                        });
                    };

                    self.checkLoginState = function() {
                        window.FB.getLoginStatus(function(response) {
                            if (response.status === "connected") {
                                self.callFBApi();
                            } else {
                                self.login();
                            }
                        });
                    };

                    self.callFBApi = function() {
                        const url = self.currentAPI.url,
                            fields = self.currentAPI.fields;

                        window.FB.api(url, {
                            locale: window.lang,
                            fields: fields
                        }, function(response) {
                            if (self.callback) {
                                self.callback(response);
                            }
                        });
                    };

                    if (self.autoLogin) { self.checkLoginState(); }
                },
                function() {
                    BaseLogger.info("Facebook SDK not found");
                    self.fbSdkNotLoaded(true);
                });
        };
    });