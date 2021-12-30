define([
    "knockout",
    "jquery",
    "./model",
    "framework/js/constants/constants",
    "framework/js/plugins/encrypt",
    "baseLogger",
    "platform",
    "ojs/ojbutton",
    "ojs/ojinputtext",
    "ojs/ojswitch"
], function (ko, $, LoginModel, Constants, Encrypt, BaseLogger, Platform) {
    "use strict";

    return function (rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.alternateLogin = ko.observable(false);
        rootParams.baseModel.registerComponent("pin-login", "login");
        rootParams.baseModel.registerComponent("alternate-login", "login");
        rootParams.baseModel.registerComponent("login-options", "login");
        rootParams.dashboard.headerName(self.nls.loginForm.labels.loginHeader);
        rootParams.dashboard.headerCaption(self.nls.loginForm.labels.subHeader);

        if (self.landingComponent) {
            rootParams.dashboard.headerName(self.nls.loginForm.labels.login);
        }

        self.oam_url = self.server_url = null;
        self.encryptedPassword = ko.observable();

        let loginFns = null;

        Platform.getInstance().then(function (platform) {
            self.server_url = platform("getServerURL");
            self.oam_url = platform("getOAMURL");
            self.login_scope = platform("getLoginScope");
            self.offline_scope = platform("getOfflineScope");
            self.x_token_type = platform("getXTokenType");
            loginFns = platform("login", rootParams.baseModel.showMessages);
        });

        self.storedJWT = null;
        self.oamUserToken = null;
        self.user_token = null;
        self.contextId = null;
        self.userSegment = null;
        self.actionurl = null;
        self.actionAvailable = ko.observable(false);
        self.optForAlternateLogin = self.optForAlternateLogin || ko.observable(false);
        self.showAccountSnapshot = ko.observable(true);
        self.showLoginOptions = ko.observable(false);
        self.showAlternateLogin = ko.observable(false);
        self.showAlternativeSwitch = ko.observable(true);
        self.displayData = ko.observableArray();
        self.actionableUrl = ko.observable();
        self.notificationDataFetched = ko.observable(false);
        self.keysList = ["accountId", "amount"];

        window.plugins.appPreferences.fetch(function (value) {
            if (value) {
                const x = value;

                window.plugins.appPreferences.remove(function () {
                    BaseLogger.info("Actionable data deleted");
                }, function () {
                    BaseLogger.error("Error in deleting actionable data");
                }, "actionable_data");

                const actionResource = JSON.parse(x).url;

                self.actionurl = actionResource.replace("home.html", "index.html");

                self.actionAvailable(true);
            }
        }, function () {
            BaseLogger.error("Actionable data not available");
        }, "actionable_data");

        const genericViewModel = rootParams.root;

        if (self.landingModule) {
            self.showAccountSnapshot(false);
        }

        if (self.isPushoobAllowed()) {
            self.hideMobileLanding(true);

            const obj = JSON.parse(self.notificationData().SUMMARY_TEXT);

            ko.utils.arrayForEach(self.keysList, function (key) {
                const hasKey = {}.hasOwnProperty.call(obj.alertDTOs, key);

                if (hasKey && obj.alertDTOs[key]) {
                    self.displayData().push({
                        key: self.nls.loginForm.keys[key],
                        value: obj.alertDTOs[key]
                    });
                }
            });

            self.notificationDataFetched(true);
        }

        const dummyFunction = function () {
            BaseLogger.info("this is a dummy function");
        };

        if (rootParams.baseModel.cordovaDevice() === "IOS") {
            window.DeviceCompliance.check(dummyFunction, dummyFunction);
        }

        self.accept = function () {
            const status = "accept",
                obj = JSON.parse(self.notificationData().SUMMARY_TEXT);

            LoginModel.updateStatus(obj.referenceNumber, obj.token, status).then(function () {
                rootParams.baseModel.switchPage({
                    module: "login"
                }, false, true, null);
            });
        };

        self.reject = function () {
            const status = "reject",
                obj = JSON.parse(self.notificationData().SUMMARY_TEXT);

            LoginModel.updateStatus(obj.referenceNumber, obj.token, status).then(function () {
                rootParams.baseModel.switchPage({
                    module: "login"
                }, false, true, null);
            });
        };

        if (self.queryMap) {
            if (self.queryMap.p_error_code !== null && self.queryMap.p_error_code === "OAM-10") {
                self.message(self.nls.loginForm.validationMsgs.errrorOAM10);
            } else if (self.queryMap.p_error_code !== null && self.queryMap.p_error_code === "OAM-5") {
                self.message(self.nls.loginForm.validationMsgs.errrorOAM5);
            } else if (self.queryMap.p_error_code) {
                self.message(self.nls.loginForm.validationMsgs.invalidCredentials);
            }
        }

        self.afterRender = function (genericViewModel) {
            if (genericViewModel.queryMap) {
                if (genericViewModel.queryMap.p_error_code !== null && genericViewModel.queryMap.p_error_code === "OAM-10") {
                    self.message(self.nls.loginForm.validationMsgs.errrorOAM10);
                } else if (genericViewModel.queryMap.p_error_code !== null && genericViewModel.queryMap.p_error_code === "OAM-5") {
                    self.message(self.nls.loginForm.validationMsgs.errrorOAM5);
                } else if (genericViewModel.queryMap.p_error_code !== null && genericViewModel.queryMap.p_error_code === "OBDXIDM-0") {
                    self.message(genericViewModel.queryMap.p_error_message);
                } else if (genericViewModel.queryMap.p_error_code) {
                    self.message(self.nls.loginForm.validationMsgs.invalidCredentials);
                }
            }
        };

        self.onSnapshotClick = function () {
            const accountSnapshotSuccess = function (value) {
                if (value === "REGISTERED") {
                    window.plugins.auth.snapshot.fetch({
                        pin: "SNAPSHOT"
                    }, function (snapshotToken) {
                        self.landingComponent = "account-snapshot";

                        LoginModel.sessionCreate().then(function () {
                            Platform.getInstance().then(function (platform) {
                                const serverType = self[platform("getServerType")];

                                serverType.getAccessTokenForSnapshot(snapshotToken).then(function (tokens) {
                                    self.accessService({
                                        accessToken: tokens.accessToken,
                                        domain: "OBDXSnapshotDomain"
                                    });
                                });
                            });
                        });
                    }, dummyFunction);
                } else {
                    rootParams.baseModel.registerComponent("account-snapshot-registration", "accounts");
                    rootParams.dashboard.loadComponent("account-snapshot-registration", {});
                }
            };

            window.plugins.appPreferences.fetch(accountSnapshotSuccess, function () {
                BaseLogger.info("account snapshot failed");
            }, "account_snapshot_status");
        };

        if (document.getElementById("login_username")) {
            document.getElementById("login_username").onkeypress = function (e) {
                if (e.which === 13) {
                    $("#login_password").focus();
                }
            };
        }

        if (document.getElementById("login_password")) {
            document.getElementById("login_password").onkeypress = function (e) {
                if (e.which === 13) {
                    $("#login-button").focus();
                }
            };
        }

        self.onLogin = function () {
            Encrypt(self.password()).then(function (password) {
                self.encryptedPassword(encodeURIComponent(password));
                loginFns.getUserToken.call(self);
            });
        };

        const error = function () {
                self.showAlternativeSwitch(true);
            },
            get_login_preference = function (value) {
                if (value && (value.indexOf("pin") === 0 || value.indexOf("pattern") === 0 || value === "touchid" || value.indexOf("faceid") === 0)) {
                    self.alternateLogin(value);
                    self.showAlternativeSwitch(false);
                } else {
                    error();
                }
            };

        window.plugins.appPreferences.fetch(get_login_preference, error, "alternate_preference");

        self.openAlternateLogin = function () {
            self.showAlternateLogin(false);
            ko.tasks.runEarly();
            self.showAlternateLogin(true);
        };

        const getTheToken = function () {
            window.FCMPlugin.getToken(function (token) {
                if (token) {
                    window.plugins.appPreferences.store(dummyFunction, dummyFunction, "registration_token", token);
                } else {
                    setTimeout(getTheToken, 1000);
                }
            }, dummyFunction);
        };

        if (rootParams.baseModel.cordovaDevice() === "ANDROID") {
            let pushOptSelected = false;
            const push_status_success = function (value) {
                if (value === null || value === "") {
                    $("#customPopupforPushNotification").trigger("openModal");
                }
            };

            self.enablePush = function () {
                pushOptSelected = true;
                window.plugins.appPreferences.store(dummyFunction, dummyFunction, "push_status", "ALLOWED");
                setTimeout(getTheToken, 1000);
                $("#customPopupforPushNotification").trigger("closeModal");
            };

            self.disablePush = function () {
                pushOptSelected = true;
                window.plugins.appPreferences.store(dummyFunction, dummyFunction, "push_status", "DISALLOWED");
                $("#customPopupforPushNotification").trigger("closeModal");
            };

            self.showDialog = function () {
                window.plugins.appPreferences.fetch(push_status_success, dummyFunction, "push_status");
            };

            self.closeHandler = function () {
                if (!pushOptSelected) {
                    navigator.app.exitApp();
                }
            };
        }

        self.forceChange = function (username) {
            rootParams.baseModel.registerComponent("force-change-password", "force-change-password");

            rootParams.dashboard.loadComponent("force-change-password", {
                userName: username
            });
        };

        self.accessService = function (accessToken, isAlternateLogin, maxAttempts) {
            Platform.getInstance().then(function (platform) {
                loginFns = platform("login", rootParams.baseModel.showMessages);

                const headers = loginFns.accessServicePreHook(accessToken);

                LoginModel.me(headers).then(function (data) {
                    Constants.currentEntity = data.userProfile.homeEntity;

                    if (self.optForAlternateLogin()) {
                        self.showLoginOptions(true);
                        rootParams.dashboard.userData.userProfile = data.userProfile;
                    } else if (self.landingComponent === "account-snapshot") {
                        window.plugins.appPreferences.fetch(function (data) {
                            if (data === "PENDING") {
                                self.enableAccountSnapshotAccesspoint().then(function () {
                                    Platform.getInstance().then(function (platform) {
                                        const serverType = self[platform("getServerType")];

                                        serverType.getSnapshotJWTToken().then(function (tokens) {
                                            const refToken = tokens.refreshToken ? tokens.refreshToken : tokens.accessToken;

                                            window.plugins.auth.snapshot.save({
                                                pin: "SNAPSHOT",
                                                password: refToken
                                            }, function () {
                                                window.plugins.appPreferences.store(function () {
                                                    if (rootParams.rootModel.allowSnapshot()()) {
                                                        window.Wearable.onConnect(
                                                            function (resultData) {
                                                                let payload = {};

                                                                payload.secureDeviceId = resultData.wear_id;
                                                                payload.osVersion = resultData.wear_sdk;
                                                                payload.os = rootParams.baseModel.cordovaDevice() + "_WEAR";
                                                                payload.manufacturer = resultData.wear_manufacturer;
                                                                payload.model = resultData.wear_model;
                                                                payload = ko.mapping.toJSON(payload);

                                                                LoginModel.registerDevice(payload).done(function () {
                                                                    const wearablePayload = {};

                                                                    wearablePayload.snapshotJwt = tokens.refreshToken ? tokens.refreshToken : tokens.accessToken;

                                                                    LoginModel.updateSession().then(function () {
                                                                        window.Wearable.sendSnapshotToken(function () {
                                                                            const wearableEnabled = {};

                                                                            wearableEnabled.isRegistered = "REGISTERED";
                                                                            window.Wearable.watchRegistered(dummyFunction, dummyFunction, wearableEnabled);

                                                                            self.accessService({
                                                                                accessToken: tokens.accessToken,
                                                                                domain: "OBDXSnapshotDomain"
                                                                            });
                                                                        }, function (error) {
                                                                            rootParams.baseModel.showMessages(null, [self.nls.errors[error]], "ERROR");

                                                                            LoginModel.updateSession().then(function () {
                                                                                self.accessService({
                                                                                    accessToken: tokens.accessToken,
                                                                                    domain: "OBDXSnapshotDomain"
                                                                                });
                                                                            });
                                                                        }, wearablePayload);
                                                                    });
                                                                });
                                                            },
                                                            function (error) {
                                                                rootParams.baseModel.showMessages(null, [self.nls.errors[error]], "ERROR");

                                                                LoginModel.updateSession().then(function () {
                                                                    self.accessService({
                                                                        accessToken: tokens.accessToken,
                                                                        domain: "OBDXSnapshotDomain"
                                                                    });
                                                                });
                                                            });
                                                    } else {
                                                        LoginModel.updateSession().then(function () {
                                                            self.accessService({
                                                                accessToken: tokens.accessToken,
                                                                domain: "OBDXSnapshotDomain"
                                                            });
                                                        });
                                                    }
                                                }, dummyFunction, "account_snapshot_status", "REGISTERED");
                                            }, dummyFunction);
                                        });
                                    });
                                });
                            } else if (data === "REGISTERED") {
                                genericViewModel.isUserDataSet(true);

                                rootParams.baseModel.switchPage({
                                    homeComponent: "account-snapshot",
                                    homeModule: "accounts"
                                }, false, false, null, true);
                            }
                        }, dummyFunction, "account_snapshot_status");
                    } else if (self.landingModule && self.landingComponent) {
                        rootParams.baseModel.switchPage({
                            homeComponent: self.landingComponent,
                            homeModule: self.landingModule
                        }, false, false, null, true);
                    } else if (self.actionAvailable()) {
                        rootParams.dashboard.userData.userProfile = data.userProfile;

                        window.location.assign(self.actionurl);
                    } else {
                        genericViewModel.resetLayout(null, true);
                    }
                }).catch(function (data) {
                    if (data.status === 401) {
                        $(".message-box-message__item").ready(function () {
                            if (isAlternateLogin) {
                                if (!maxAttempts || maxAttempts > 0) {
                                    rootParams.baseModel.showMessages(null, [data.responseText], "ERROR");
                                }

                                const successCallBack = function () {
                                        BaseLogger.error("SUCCESS IN DELETING ALTERNATE LOGIN PREFERENCE");
                                    },
                                    failureCallBack = function () {
                                        BaseLogger.error("FAILURE IN DELETING ALTERNATE LOGIN PREFERENCE");
                                    };

                                self.alternateLogin(false);
                                self.showAlternativeSwitch(true);
                                window.plugins.appPreferences.remove(successCallBack, failureCallBack, "alternate_preference");
                            } else {
                                $(".message-box-message__item")[0].innerHTML = self.nls.loginForm.validationMsgs.invalidCredentials;
                            }
                        });
                    }

                });
            });
        };

        self.OAM = {
            getSnapshotJWTToken: function () {
                return new Promise(function (resolve, reject) {
                    Platform.getInstance().then(function (platform) {
                        const url = platform("getOAMURL") + "/oic_rest/rest/jwtoamauthentication/authenticate";

                        window.cordovaFetch(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "User-Agent": "OIC-Authentication",
                                "X-IDAAS-SERVICEDOMAIN": "Default"
                            },
                            body: JSON.stringify({
                                "X-Idaas-Rest-Subject-Type": "USERCREDENTIAL",
                                "X-Idaas-Rest-Subject-Username": self.username(),
                                "X-Idaas-Rest-Subject-Password": self.password(),
                                "X-Idaas-Rest-New-Token-Type-To-Create": "USERTOKEN::JWTUT"
                            })
                        }).then(function (response) {
                            if (response.status === 200) {
                                resolve({
                                    accessToken: JSON.parse(response.statusText)["X-Idaas-Rest-Token-Value"]
                                });
                            } else {
                                $(".se-pre-con").fadeOut();

                                if (response.status === 401) {
                                    rootParams.baseModel.showMessages(null, [self.resource.invalidCredentials], "ERROR");
                                    self.password("");
                                } else {
                                    rootParams.baseModel.showMessages(null, [self.resource.login_error], "ERROR");
                                }

                                reject();
                            }
                        }).catch(function (ex) {
                            BaseLogger.error(ex.message);
                            rootParams.baseModel.showMessages(null, [ex], "ERROR");
                            reject();
                        });
                    });
                });
            }
        };

        self.NONOAM = {
            getSnapshotJWTToken: function () {
                return new Promise(function (resolve, reject) {
                    let payload = {};

                    payload.accessPointId = "APSNAPSHOT";
                    payload.password = self.password();
                    payload = ko.toJSON(payload);

                    LoginModel.getJwtToken(payload).done(function (data) {
                        resolve({
                            accessToken: data.jwtoken
                        });
                    }).fail(function () {
                        $(".se-pre-con").fadeOut();
                        rootParams.baseModel.showMessages(null, [self.resource.login_error], "ERROR");
                        self.password("");
                        reject();
                    });
                });
            },
            getAccessTokenForSnapshot: function (token) {
                return new Promise(function (resolve) {
                    resolve({
                        accessToken: token
                    });
                });
            }
        };

        self.OAUTH = {
            getSnapshotJWTToken: function (refreshToken) {
                return new Promise(function (resolve, reject) {
                    Platform.getInstance().then(function (platform) {
                        const body = refreshToken ? "grant_type=refresh_token&refresh_token=" + encodeURIComponent(refreshToken) : "grant_type=password&username=" + self.username() + "&password=" + self.password() + "&scope=" + self.offline_scope;

                        window.plugins.appPreferences.fetch("SNAPSHOT_CLIENT_ID").then(function (clientID) {
                            const url = platform("getOAMURL");

                            window.cordovaFetch(url, {
                                method: "POST",
                                redirect: false,
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded",
                                    Authorization: rootParams.baseModel.format("Basic {clientId}", {
                                        clientId: clientID
                                    }),
                                    "X-OAUTH-IDENTITY-DOMAIN-NAME": "OBDXSnapshotDomain"
                                },
                                body: body
                            }).then(function (response) {
                                if (refreshToken) {
                                    resolve({
                                        accessToken: JSON.parse(response.statusText).access_token
                                    });
                                } else {
                                    resolve({
                                        accessToken: JSON.parse(response.statusText).access_token,
                                        refreshToken: JSON.parse(response.statusText).refresh_token
                                    });
                                }
                            }).catch(function (ex) {
                                $(".se-pre-con").fadeOut();
                                BaseLogger.error(ex.message);

                                reject({
                                    message: "GET REFRESH TOKEN FAILED"
                                });
                            });
                        });
                    }).catch(function (ex) {
                        $(".se-pre-con").fadeOut();
                        BaseLogger.error(ex.message);
                        rootParams.baseModel.showMessages(null, [ex], "ERROR");
                        reject();
                    });
                });
            },
            getAccessTokenForSnapshot: function (refreshToken) {
                return self.OAUTH.getSnapshotJWTToken(refreshToken);
            }
        };

        self.enableAccountSnapshotAccesspoint = function () {
            return new Promise(function (resolve, reject) {
                LoginModel.getMePreference().then(function (data) {
                    const mePreference = data;

                    delete mePreference.status;

                    ko.utils.arrayForEach(mePreference.userAccessPointRelationship, function (item) {
                        if (Constants.currentEntity === item.determinantValue && item.accessPointId === "APSNAPSHOT") {
                            item.status = true;
                        }
                    });

                    LoginModel.updateMePreference(ko.mapping.toJSON(mePreference)).then(function () {
                        Platform.getInstance().then(function (platform) {
                            platform("registerDevice").then(function () {
                                resolve();
                            }).catch(function () {
                                BaseLogger.error("REGISTER DEVICE FAILED");
                            });
                        });
                    }).catch(function () {
                        reject();
                    });
                }).catch(function () {
                    reject();
                });
            });
        };

        self.goToLogin = function () {
            rootParams.dashboard.switchModule("login");
            $("#firstTimeLoginNotCompleted").trigger("closeModal");
        };

        if (window.facebookConnectPlugin) {
            window.facebookConnectPlugin.logout();
        }

        self.forgotPass = function () {
            rootParams.baseModel.registerComponent("user-information", "recovery");
            rootParams.dashboard.loadComponent("user-information");
        };

        self.forgotUserId = function () {
            rootParams.baseModel.registerComponent("user-recovery-info", "recovery");
            rootParams.dashboard.loadComponent("user-recovery-info");
        };

        $(document).on("blur", "#login-button", function () {
            $("input[name='username']").focus();
        });

        $(".footer").addClass("white-background");

        function onBackKeyDown(e) {
            e.preventDefault();
            $("#exitModal").trigger("openModal");
        }

        if (rootParams.baseModel.cordovaDevice() === "ANDROID") {
            document.addEventListener("backbutton", onBackKeyDown, false);
        }

        self.closeModal = function () {
            $("#exitModal").hide();
        };

        self.exitApplication = function () {
            navigator.app.exitApp();
        };
    };
});