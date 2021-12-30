define(["knockout", "jquery", "baseLogger", "baseModel", "baseService", "framework/js/configurations/config", "ojL10n!resources/nls/login-form"], function (ko, $, BaseLogger, BaseModel, BaseService, Configurations, resourceBundle) {
    "use strict";

    let behaviour, OAMURL, authorizationToken, serverType, chatbotId, chatbotUrl, loginScope, offlineScope, xTokenType, serverURL;
    const protectedPage = Configurations.authentication.pages.securePage,
        OAM = function (showMessages) {
            const getAccessToken = function () {
                    const self = this,
                        url = self.oam_url + "/oic_rest/rest/oamauthentication/access";

                    window.cordovaFetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "User-Agent": "OIC-Authentication",
                            "X-IDAAS-SERVICEDOMAIN": "Default"
                        },
                        body: JSON.stringify({
                            "X-Idaas-Rest-Subject-Type": "TOKEN",
                            "X-Idaas-Rest-Subject-Value": self.userToken,
                            "X-Idaas-Rest-New-Token-Type-To-Create": "ACCESSTOKEN",
                            "X-Idaas-Rest-Application-Context": self.accessContext,
                            "X-Idaas-Rest-Application-Resource": self.server_url + protectedPage + (behaviour === "IOS" ? "?" : "")
                        })
                    }).then(function (response) {
                        if (response.status === 200) {
                            const jsonObject = JSON.parse(response.statusText),
                                accessToken = jsonObject["X-Idaas-Rest-Token-Value"];

                            self.accessService({
                                accessToken: accessToken
                            });
                        } else if (status === 401) {
                            BaseLogger.error("ERROR IN GET ACCESS TOKEN - UNAUTHORIZED");
                            showMessages(self.nls.loginForm.validationMsgs.invalidCredentials);
                        } else if (status === 404) {
                            BaseLogger.error("ERROR IN GET ACCESS TOKEN - NOT FOUND");
                            showMessages(null, [response.status], "ERROR");
                        } else {
                            showMessages(null, [self.nls.loginForm.labels.login_error], "ERROR");
                        }
                    }).catch(function (ex) {
                        BaseLogger.error("ERROR IN GET ACCESS TOKEN");
                        showMessages(null, [ex.message], "ERROR");
                    });
                },
                getAccessContext = function () {
                    const self = this,
                        url = self.server_url + protectedPage;

                    window.cordovaFetch(url, {
                        method: "GET",
                        redirect: false
                    }).then(function (response) {
                        if (response.status === 404) {
                            BaseLogger.error("ERROR IN GET ACCESS CONTEXT - NOT FOUND");
                            showMessages(null, [response.statusText], "ERROR");
                        }

                        const jsonObject = JSON.parse(JSON.stringify(response.headers)),
                            accessContextString = jsonObject.Location;

                        if (typeof accessContextString !== "undefined" && accessContextString.length) {
                            self.accessContext = accessContextString.substr(accessContextString.indexOf("?") + 1);
                            getAccessToken.call(self);
                        }
                    }).catch(function (ex) {
                        BaseLogger.error("ERROR IN GET ACCESS CONTEXT");
                        showMessages(null, [ex.message], "ERROR");
                    });
                },
                getUserToken = function () {
                    const self = this,
                        url = self.oam_url + "/oic_rest/rest/oamauthentication/authenticate";

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
                            "X-Idaas-Rest-New-Token-Type-To-Create": "USERTOKEN"
                        })
                    }).then(function (response) {
                        if (response.status === 404) {
                            BaseLogger.error("ERROR IN GET USER TOKEN - NOT FOUND");
                            showMessages(null, [response.statusText], "ERROR");
                        }

                        if (response.status === 200) {
                            const jsonObject = JSON.parse(response.statusText);

                            self.userToken = jsonObject["X-Idaas-Rest-Token-Value"];
                            getAccessContext.call(self);
                        } else if (response.status === 401) {
                            BaseLogger.error("ERROR IN GET USER TOKEN - UNAUTHORIZED");
                            showMessages(self.nls.loginForm.validationMsgs.invalidCredentials);
                        } else {
                            showMessages(null, [self.nls.loginForm.labels.login_error], "ERROR");
                        }
                    }).catch(function (ex) {
                        BaseLogger.error("ERROR IN GET USER TOKEN");
                        showMessages(null, [ex.message], "ERROR");
                    });
                },
                accessServicePreHook = function (accessToken) {
                    // eslint-disable-next-line obdx-string-validations
                    accessToken = "OAM-Auth " + accessToken;
                    authorizationToken = accessToken;
                };

            return {
                getUserToken: getUserToken,
                accessServicePreHook: accessServicePreHook
            };
        },
        NONOAM = function () {
            const getUserToken = function () {
                    const self = this,
                        url = self.server_url + "/" + Configurations.apiCatalogue.base.contextRoot + "/j_security_check",
                        xhr = new XMLHttpRequest(),
                        options = {};

                    options.url = url;
                    options.type = "POST";
                    options.contentType = "application/x-www-form-urlencoded";
                    options.showMessage = true;

                    options.xhrFields = {
                        withCredentials: true
                    };

                    xhr.open(options.type, options.url, true);
                    xhr.setRequestHeader("Content-type", options.contentType);

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 404) {
                                self.accessService();
                            } else {
                                const error = JSON.parse(xhr.getResponseHeader("X-AUTH-FAILURE-RESPONSE"));

                                if (error.type === "FORCE_CHANGE") {
                                    self.forceChange(error.username);
                                } else if (error.type === "INVALID_CRED") {
                                    self.message(error.errorMessage);
                                }
                            }
                        }
                    };

                    xhr.send("j_username=" + self.username() + "&j_password=" + self.encryptedPassword());
                },
                accessServicePreHook = function (header) {
                    if (header) {
                        return {
                            // eslint-disable-next-line obdx-string-validations
                            Authorization: "Bearer " + header.accessToken,
                            "X-Token-Type": "JWT"
                        };
                    }
                };

            return {
                getUserToken: getUserToken,
                accessServicePreHook: accessServicePreHook
            };
        },
        OAUTH = function (showMessages) {
            const getUserToken = function () {
                    const self = this,
                        url = self.oam_url,
                        baseService = BaseService.getInstance();

                    window.plugins.appPreferences.fetch("APP_CLIENT_ID").then(function (clientID) {
                        window.cordovaFetch(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                                // eslint-disable-next-line obdx-string-validations
                                Authorization: "Basic " + clientID,
                                "X-OAUTH-IDENTITY-DOMAIN-NAME": "OBDXMobileAppDomain"
                            },
                            body: "grant_type=password&username=" + self.username() + "&password=" + encodeURIComponent(self.password()) + "&scope=" + self.login_scope
                        }).then(function (response) {
                            if (response.status === 404) {
                                BaseLogger.error("ERROR IN GET USER TOKEN - NOT FOUND");
                                showMessages(null, [response.statusText], "ERROR");
                            }

                            if (response.status === 200) {
                                const jsonObject = JSON.parse(response.statusText);

                                baseService.add({
                                    url: "session",
                                    method: "POST",
                                    data: ""
                                }).then(function () {
                                    self.accessService({
                                        accessToken: jsonObject.access_token,
                                        domain: "OBDXMobileAppDomain"
                                    });
                                }).catch(function (ex) {
                                    showMessages(null, [ex.message], "ERROR");
                                    BaseLogger.error("ERROR IN SESSION NONCE");
                                });
                            } else if (response.status === 401) {
                                BaseLogger.error("ERROR IN GET USER TOKEN - UNAUTHORIZED");
                                showMessages(self.nls.loginForm.validationMsgs.invalidCredentials);
                            } else {
                                showMessages(null, [self.nls.loginForm.labels.login_error], "ERROR");
                            }
                        }).catch(function (ex) {
                            BaseLogger.error("ERROR IN GET USER TOKEN");
                            showMessages(null, [ex.message], "ERROR");
                        });
                    });
                },
                accessServicePreHook = function (headers) {
                    if (headers) {
                        return {
                            // eslint-disable-next-line obdx-string-validations
                            Authorization: "Bearer " + headers.accessToken,
                            "X-OAUTH-IDENTITY-DOMAIN-NAME": headers.domain,
                            "X-Token-Type": "OAM"
                        };
                    }
                };

            return {
                getUserToken: getUserToken,
                accessServicePreHook: accessServicePreHook
            };
        },
        mobileExports = {
            init: function (platform, resolve) {
                function onDeviceReady() {
                    behaviour = window.device.platform.toUpperCase();

                    const prefPromise = function (key) {
                        return new Promise(function (resolve, reject) {
                            const success = function (val) {
                                    resolve(val);
                                },
                                error = function () {
                                    reject();
                                };

                            window.plugins.appPreferences.fetch(success, error, key);

                        });
                    };

                    Promise.all([prefPromise("KEY_SERVER_URL"), prefPromise("SERVER_TYPE"), prefPromise("CHATBOT_ID"), prefPromise("CHATBOT_URL")]).then(function (values) {
                        serverURL = values[0];
                        serverType = values[1];
                        chatbotId = values[2];
                        chatbotUrl = values[3];

                        if (mobileExports.getServerType() === "OAM") {
                            prefPromise("KEY_OAM_URL").then(function (value) {
                                OAMURL = value;
                                resolve(platform);
                            }, function () {
                                BaseLogger.error("Preference values are not loaded");
                            });
                        } else if (mobileExports.getServerType() === "NONOAM") {
                            resolve(platform);
                        } else if (mobileExports.getServerType() === "OAUTH") {
                            Promise.all([prefPromise("KEY_OAM_URL"), prefPromise("WEB_URL"), prefPromise("LOGIN_SCOPE"), prefPromise("OFFLINE_SCOPE"), prefPromise("X_TOKEN_TYPE")]).then(function (values) {
                                OAMURL = values[0];
                                serverURL = values[1];
                                loginScope = values[2];
                                offlineScope = values[3];
                                xTokenType = values[4];
                                resolve(platform);
                            }, function () {
                                BaseLogger.error("Preference values are not loaded");
                            });
                        } else {
                            BaseLogger.error("NO Valid Authentication Type Found");
                        }
                    }, function () {
                        BaseLogger.error("Preference values are not loaded");
                    });

                    navigator.globalization.getPreferredLanguage(
                        function (language) {
                            require.config.locale = language;
                        },
                        function () {
                            BaseLogger.error("Error getting language");
                        }
                    );
                }

                if (window.cordova) {
                    document.addEventListener("deviceready", onDeviceReady, false);
                } else {
                    require(["cordova"], function () {
                        document.addEventListener("deviceready", onDeviceReady, false);
                    });
                }

            },
            downloadFile: function (options, nonce) {
                const headers = {
                        "x-nonce": nonce,
                        Authorization: authorizationToken,
                        "User-Agent": "OIC-Authentication"
                    },
                    fileTransfer = new window.FileTransfer(),

                    uri = options.url;

                let fileURL = null;

                if (behaviour === "ANDROID") {
                    fileURL = window.cordova.file.externalRootDirectory + "download/";
                } else if (behaviour === "IOS") {
                    fileURL = window.cordova.file.documentsDirectory;
                }

                fileTransfer.download(uri, fileURL, function (entry) {
                    window.cordova.plugins.fileOpener2.open(entry.nativeURL, entry.mimeType, {
                        error: function () {
                            $(".se-pre-con").fadeOut();
                        },
                        success: function () {
                            $(".se-pre-con").fadeOut();
                        }
                    });
                }, null, false, {
                    headers: headers
                });
            },
            addHeader: function (headers) {
                if (authorizationToken) {
                    headers.Authorization = authorizationToken;
                }

                headers.deviceKey = window.device.uuid;
            },
            showSecuritySettings: function (userName, flag) {
                if (behaviour === "ANDROID") {
                    window.PinPatternAuth.decryptOwner().then(function (name) {
                        if (name === userName) {
                            flag(true);
                        }
                    });
                } else if (behaviour === "IOS") {
                    window.plugins.auth.owner.get().then(function (name) {
                        if (name === userName) {
                            flag(true);
                        }
                    });
                }
            },
            registerDevice: function () {
                return new Promise(function (resolve, reject) {
                    const baseService = BaseService.getInstance();
                    let payload = {};

                    if (behaviour === "ANDROID") {
                        payload.osVersion = window.device.version;
                        payload.os = window.device.platform.toUpperCase();
                        payload.manufacturer = window.device.manufacturer;
                        payload.model = window.device.model;
                        payload.secureDeviceId = window.device.uuid;
                        payload = JSON.stringify(payload);

                        baseService.add({
                            url: "mobileClient",
                            data: payload
                        }).then(function () {
                            resolve();
                        });
                    } else if (behaviour === "IOS") {
                        window.DeviceCompliance.getDeviceInfo(function (info) {
                            payload = JSON.stringify(info);

                            baseService.add({
                                url: "mobileClient",
                                data: payload
                            }).then(function () {
                                resolve();
                            });
                        }, function () {
                            reject();
                        });
                    }
                });
            },
            getServerURL: function () {
                return serverURL;
            },

            getImageBaseURL: function () {

                return serverURL + "/" + Configurations.sharding.imageResourcePath;
            },

            getOAMURL: function () {
                return OAMURL;
            },
            getServerType: function () {
                return serverType;
            },
            getLoginScope: function () {
                return loginScope;
            },
            getOfflineScope: function () {
                return offlineScope;
            },
            getXTokenType: function () {
                return xTokenType;
            },
            getChatbotConfig: function () {
                return {
                    chatbot_id: chatbotId,
                    chatbot_url: chatbotUrl
                };
            },
            setAuthToken: function (token) {
                authorizationToken = token;
            },
            logOut: function () {
                if (mobileExports.getServerType() === "OAM") {
                    $.ajax({
                        url: OAMURL + "/oam/server/logout",
                        headers: {
                            Authorization: authorizationToken
                        },
                        success: function () {
                            window.location.reload();
                        }
                    });
                } else if (mobileExports.getServerType() === "NONOAM" || mobileExports.getServerType() === "OAUTH") {
                    window.location.reload();
                }
            },
            login: function (showMessages) {
                if (mobileExports.getServerType() === "OAM") {
                    return OAM(showMessages);
                } else if (mobileExports.getServerType() === "NONOAM") {
                    return NONOAM(showMessages);
                } else if (mobileExports.getServerType() === "OAUTH") {
                    return OAUTH(showMessages);
                }
            },
            postLogin: function (userData) {
                ko.utils.arrayForEach(userData.roles, function (item) {
                    if (item === "CorporateAdminChecker" || item === "CorporateAdminMaker" || item === "Administrator" || item === "AuthAdmin") {
                        BaseModel.getInstance().showMessages(null, [resourceBundle.loginForm.labels.noAdminFunction], "INFO");
                    }
                });

                const baseService = BaseService.getInstance(),
                    pushRegistration = function (payload) {
                        const options = {
                            url: "mobileClient/pushRegistration",
                            data: payload
                        };

                        return baseService.add(options);
                    },
                    getPayeeList = function () {
                        const url = "payments/payeeGroup?expand=ALL&types=INTERNAL,INTERNATIONAL,INDIADOMESTIC,UKDOMESTIC,SEPADOMESTIC",
                            options = {
                                url: url
                            };

                        return baseService.fetch(options);
                    },
                    registerForPush = function (token) {
                        let payload = {};

                        if (behaviour === "IOS") {
                            window.DeviceCompliance.getDeviceInfo(function (info) {
                                info.registrationToken = token || "";
                                payload = JSON.stringify(info);

                                pushRegistration(payload).then(function () {
                                    window.plugins.appPreferences.store("push_status", "REGISTERED");
                                });
                            });
                        } else {
                            payload.osVersion = window.device.version;
                            payload.os = window.device.platform.toUpperCase();
                            payload.manufacturer = window.device.manufacturer;
                            payload.model = window.device.model;
                            payload.secureDeviceId = window.device.uuid;
                            payload.registrationToken = token || "";
                            payload = JSON.stringify(payload);

                            pushRegistration(payload).then(function () {
                                window.plugins.appPreferences.store("push_status", "REGISTERED");
                            });
                        }
                    },
                    getTheToken = function () {
                        window.FCMPlugin.getToken(function (token) {
                            if (token) {
                                window.plugins.appPreferences.store("registration_token", token);
                            } else {
                                setTimeout(getTheToken, 1000);
                            }
                        });
                    };

                window.plugins.appPreferences.fetch("push_status").then(function (status) {
                    if (status === "ALLOWED") {
                        window.plugins.appPreferences.fetch("registration_token").then(function (token) {
                            if (token) {
                                registerForPush(token);
                            } else if (behaviour === "ANDROID") {
                                setTimeout(getTheToken, 1000);
                            }
                        });
                    }
                });

                if (behaviour === "IOS") {
                    getPayeeList().then(function (data) {
                        const payeeArray = [];

                        for (let i = 0; i < data.payeeGroups.length; i++) {
                            for (let j = 0; j < data.payeeGroups[i].listPayees.length; j++) {
                                payeeArray.push(data.payeeGroups[i].listPayees[j].nickName);
                            }
                        }

                        window.plugins.auth.siri.savePayees(data, payeeArray);
                    });
                }
            }
        };

    return mobileExports;
});