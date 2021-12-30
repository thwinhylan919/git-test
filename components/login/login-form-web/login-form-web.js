define([
    "knockout",
    "jquery",
    "framework/js/configurations/config",
    "framework/js/plugins/encrypt",
    "./model",
    "ojs/ojbutton",
    "ojs/ojinputtext"
], function(ko, $, Configurations, Encrypt, Model) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.alternateLogin = ko.observable();

        if (rootParams.baseModel.small()) {
            rootParams.dashboard.headerName(self.nls.loginForm.labels.loginHeaderMobile);
        } else {
            rootParams.dashboard.headerName(self.nls.loginForm.labels.loginHeader);
        }

        rootParams.dashboard.headerCaption(self.nls.loginForm.labels.subHeader);
        rootParams.baseModel.registerComponent("user-credentials", "registration");

        let GenericViewModel = null;

        self.showPopup = false;

        if (rootParams.baseModel.large()) {
            rootParams.baseModel.preFetch(["ojs/ojchart", "ojs/ojtable", "ojs/ojconveyorbelt", "ojs/ojarraytabledatasource"]);
        }

        self.afterRender = function(genericViewModel) {
            GenericViewModel = genericViewModel;

            if (genericViewModel.queryMap) {
                if (genericViewModel.queryMap.p_error_code !== null && genericViewModel.queryMap.p_error_code === "OAM-10") {
                    self.message(self.nls.loginForm.validationMsgs.errrorOAM10);
                } else if (genericViewModel.queryMap.p_error_code !== null && genericViewModel.queryMap.p_error_code === "OAM-5") {
                    self.message(self.nls.loginForm.validationMsgs.errrorOAM5);
                } else if (genericViewModel.queryMap.p_error_code) {
                    self.message(self.nls.loginForm.validationMsgs.invalidCredentials);
                }
            }
        };

        function loginOAM(path, params, method) {
            method = method || "post";

            const form = document.createElement("form");

            form.setAttribute("method", method);
            form.setAttribute("action", path);

            let hiddenField,
                key;

            for (key in params) {
                if (params[key]) {
                    hiddenField = document.createElement("input");
                    hiddenField.setAttribute("type", "hidden");
                    hiddenField.setAttribute("name", key);
                    hiddenField.setAttribute("value", params[key]);
                    form.appendChild(hiddenField);
                }
            }

            hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", "username");
            hiddenField.setAttribute("value", self.username());
            form.appendChild(hiddenField);
            hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", "password");
            hiddenField.setAttribute("value", self.password());
            form.appendChild(hiddenField);
            document.body.appendChild(form);
            form.submit();
        }

        function loginOauth(genericViewModel) {

            Encrypt(self.password(),genericViewModel.queryMap.applicationType).then(function(password) {

                const form = document.createElement("form");

                form.setAttribute("method", "POST");
                form.setAttribute("action", "/" + genericViewModel.queryMap.applicationType + "/j_security_check");

                let hiddenField = document.createElement("input");

                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", "j_username");
                hiddenField.setAttribute("value", self.username());
                form.appendChild(hiddenField);
                hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", "j_password");
                hiddenField.setAttribute("value", password);
                form.appendChild(hiddenField);
                document.body.appendChild(form);
                form.submit();

            });

        }

        function loginDBAuthenticator(genericViewModel) {
            Encrypt(self.password()).then(function(password) {
                const params = "j_username=" + self.username() + "&j_password=" + encodeURIComponent(password[0]);

                Model.login(params).then(function(response) {
                    if (response.status === 404) {
                        genericViewModel.resetLayout(null, true);
                    } else {
                        const error = JSON.parse(response.headers.get("X-AUTH-FAILURE-RESPONSE"));

                        if (error.type === "INVALID_CRED") {
                            self.message(window.decodeURIComponent(error.errorMessage));

                        } else if (error.type === "FORCE_CHANGE") {
                            rootParams.baseModel.registerComponent("force-change-password", "force-change-password");

                            rootParams.dashboard.loadComponent("force-change-password", {
                                userName: error.username
                            });
                        }
                    }
                });
            });
        }

        $(window).keypress(function(e) {
            if (e.which === 13 && e.target.parentNode.id !== "login-button") {
                $("#login-button").focus();
                self.onLogin(GenericViewModel);
            }
        });

        self.onLogin = function(genericViewModel) {
            self.message(null);

            if (genericViewModel.queryMap && genericViewModel.queryMap.applicationType === "digx-auth") {
                loginOauth(genericViewModel);
            } else if (Configurations.authentication.type === "OBDXAuthenticator") {
                loginDBAuthenticator(genericViewModel);
            } else {
                loginOAM(Configurations.authentication.providerURL + "/auth_cred_submit", {
                    request_id: genericViewModel.queryMap.request_id
                });
            }
        };

        self.forgotPass = function() {
            rootParams.baseModel.registerComponent("user-information", "recovery");
            rootParams.dashboard.loadComponent("user-information", {});
        };

        self.forgotUserId = function() {
            rootParams.baseModel.registerComponent("user-recovery-info", "recovery");
            rootParams.dashboard.loadComponent("user-recovery-info", {});
        };

        $(document).on("blur", "#forgotPassword", function() {
            $("input[name='username']").focus();
        });

        self.registerUser = function() {
            rootParams.dashboard.loadComponent("user-credentials", {});
        };

        self.attachRegisterNowClick = function() {
            $("#registerNow").click(function() {
                self.registerUser();
            });
        };
    };
});