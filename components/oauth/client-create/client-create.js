define([

    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/client",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton",
    "ojs/ojknockout-validation",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojlistview"
], function(ko, $, ClientCreateModel, resourceBundle) {
    "use strict";

    return function(Params) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(ClientCreateModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, Params.rootModel);
        self.Nls = resourceBundle;

        let password = true;

        self.ResourceServerMap = self.params.ResourceServerMap || {};
        self.identityDomains = ko.observable();
        self.isIdentityDomainListLoaded = ko.observable(false);
        self.firstVisit = self.params.firstVisit || ko.observable(true);
        self.redURLCheck = ko.observable(false);

        self.url = ko.observable();
        self.clientTypeMap = self.params.clientTypeMap || {};
        self.resourceServer = ko.observable();
        self.duplicateResServerFound = ko.observable(false);
        self.selectedScopes = ko.observableArray([]);
        Params.dashboard.headerName(self.Nls.clientHeading);
        Params.baseModel.registerElement("action-header");
        Params.baseModel.registerComponent("client-view", "oauth");
        Params.baseModel.registerComponent("client-review", "oauth");

        if (self.firstVisit() === true) {
            self.redirectURLArray = ko.observableArray();

            self.scopesArray = ko.observableArray().extend({
                notify: "always"
            });

            self.resourceServerList = ko.observableArray();
            self.resourceServerListLoaded = ko.observable(false);

            self.resourceScopeListLoaded = ko.observable(false).extend({
                notify: "always"
            });

            self.defaultScopesList = ko.observableArray();
            self.defaultScopeListLoaded = ko.observable(false);
            self.clientDTO = getNewKoModel().clientDTO;

            self.scope = {
                resourceServer: ko.observable(""),
                scopes: ko.observableArray([]),
                selectedScopes: ko.observableArray([])
            };

            self.redirectURL = {
                url: ko.observable("")
            };

            if (self.redirectURLArray().length === 0) {
                self.redirectURLArray.push(self.redirectURL);
            }

            if (self.scopesArray().length === 0) {
                self.scopesArray.push(self.scope);
            }
        } else {
            self.scopesArray = self.params.scopesArray || ko.observableArray().extend({
                notify: "always"
            });

            self.redirectURLArray = self.params.redirectURLArray || ko.observableArray();
            self.resourceServerList = self.params.resourceServerList || ko.observableArray();
            self.resourceServerListLoaded = self.params.resourceServerListLoaded || ko.observable(false);

            self.resourceScopeListLoaded = self.params.resourceScopeListLoaded || ko.observable(false).extend({
                notify: "always"
            });

            self.defaultScopesList = self.params.defaultScopesList || ko.observableArray();
            self.defaultScopeListLoaded = self.params.defaultScopeListLoaded || ko.observable(false);
            self.clientDTO = self.params.clientDTO || getNewKoModel().clientDTO;
        }

        ClientCreateModel.fetchIdentityDomains().then(function(data) {
            if (data.jsonNode.identityDomainDTO.length > 0) {
                self.identityDomains(data.jsonNode.identityDomainDTO);
                self.isIdentityDomainListLoaded(true);
            }
        });

        $(".disable").prop("disabled", true);
        $(".disableDef").prop("disabled", true);

        self.identityDomainChanged = function(event) {
            self.resourceServerListLoaded(false);
            self.resourceScopeListLoaded(false);
            self.defaultScopeListLoaded(false);
            self.resourceServerList.removeAll();
            self.scopesArray.removeAll();
            self.defaultScopesList.removeAll();
            self.clientDTO.scopes.removeAll();
            self.clientDTO.defaultScope("");

            self.scope = {
                resourceServer: ko.observable(""),
                scopes: ko.observableArray([]),
                selectedScopes: ko.observableArray([])
            };

            self.scopesArray.push(self.scope);
            $(".disable").prop("disabled", true);
            $(".disableDef").prop("disabled", true);

            ClientCreateModel.fetchResourceServers(event.detail.value).then(function(data) {
                for (let i = 0; i < data.jsonNode.resourceServerListResponseDTO.length; i++) {
                    self.resourceServerList.push(data.jsonNode.resourceServerListResponseDTO[i].resourceServerDTO);
                    self.ResourceServerMap[data.jsonNode.resourceServerListResponseDTO[i].resourceServerDTO.name] = data.jsonNode.resourceServerListResponseDTO[i].resourceServerDTO.scopes;
                }

                ko.tasks.runEarly();
                self.resourceServerListLoaded(true);
            });
        };

        self.scopeChanged = function(event) {
            if (self.scopesArray()[self.scopesArray().length - 1].selectedScopes().length === 0) {
                $(".disable").prop("disabled", true);
                $(".disableDef").prop("disabled", true);
            } else {
                $(".disable").prop("disabled", false);
                $(".disableDef").prop("disabled", false);
            }
        };

        self.resourceServerChanged = function(event, index) {
            if (event.detail.value !== "") {
                self.resourceScopeListLoaded(false);
                self.duplicateResServerFound(false);

                for (let i = 0; i < self.scopesArray().length - 1; i++) {
                    if (self.scopesArray()[i].resourceServer() === event.detail.value) {
                        self.resourceScopeListLoaded(true);
                        self.delete(index);
                        self.duplicateResServerFound(true);
                        Params.baseModel.showMessages(null, [self.Nls.duplicateResourceServer], "INFO");
                        break;
                    }
                }

                if (self.duplicateResServerFound() === false) {
                    for (let i = self.scopesArray().length - 1; i < self.scopesArray().length; i++) {
                        self.scopesArray()[i].resourceServer(event.detail.value);
                        self.scopesArray()[i].scopes(self.ResourceServerMap[event.detail.value]);
                    }

                    ko.tasks.runEarly();
                    self.resourceScopeListLoaded(true);
                }
            }
        };

        self.duplicate = function() {
            self.scope = {
                resourceServer: ko.observable(""),
                scopes: ko.observableArray([]),
                selectedScopes: ko.observableArray([])
            };

            if (self.scopesArray().length === 0) {
                self.scopesArray.push(self.scope);
            } else {
                self.scopesArray.push(self.scope);
                self.resourceServerListLoaded(true);
                self.resourceScopeListLoaded(true);
                ko.tasks.runEarly();
            }

            $(".disable").prop("disabled", true);
            $(".disableDef").prop("disabled", true);
        };

        self.duplicateRedirectURL = function() {
            self.redirectURL = {
                url: ko.observable("")
            };

            if (self.redirectURLArray().length === 0) {
                self.redirectURLArray.push(self.redirectURL);
            } else {
                for (let i = self.redirectURLArray().length - 1; i < self.redirectURLArray().length; i++) {
                    self.redirectURLArray()[i] = ko.mapping.fromJS(self.redirectURLArray()[i]);
                    self.url = self.redirectURLArray()[i].url();

                    if (!self.url) {
                        Params.baseModel.showMessages(null, [self.Nls.urlCheck], "INFO");

                        return;
                    }

                    self.redirectURLArray()[i] = ko.mapping.toJS(self.redirectURLArray()[i]);
                }

                self.redirectURLArray.push(self.redirectURL);
            }
        };

        self.deleteURL = function(index) {
            if (self.redirectURLArray().length === 1) {
                self.redURLCheck(true);

                return;
            }

            self.redirectURLArray.remove(index);
        };

        self.delete = function(index) {
            if (self.defaultScopeListLoaded() === true) {
                return;
            }

            self.scopesArray.remove(index);

            if (self.scopesArray().length === 0) {
                $(".disable").prop("disabled", false);
                $(".disableDef").prop("disabled", true);
            } else {
                $(".disable").prop("disabled", false);
                $(".disableDef").prop("disabled", false);
            }
        };

        self.deleteDefScope = function() {
            $("#defScope").hide();
            self.defaultScopesList.removeAll();
            self.clientDTO.defaultScope("");
            self.defaultScopeListLoaded(false);
            $(".disable").prop("disabled", false);
            $(".disableDef").prop("disabled", false);
        };

        self.listDefaultScope = function() {
            for (let i = 0; i < self.scopesArray().length; i++) {
                for (let j = 0; j < self.scopesArray()[i].selectedScopes().length; j++) {
                    const scope = {
                        name: self.scopesArray()[i].resourceServer() + "." + self.scopesArray()[i].selectedScopes()[j]
                    };

                    self.defaultScopesList.push(scope);
                }
            }

            self.defaultScopeListLoaded(true);
            $(".disable").prop("disabled", true);
            $(".disableDef").prop("disabled", true);
        };

        self.togglePassword = function() {
            password = !password;

            const eye = $("#eyecon");

            eye.removeClass("icon-eye icon-eye-slash");

            if (password) {
                eye.addClass("icon-eye-slash");
                $(".oj-inputpassword-input").attr("type", "password");
            } else {
                eye.addClass("icon-eye");
                $(".oj-inputpassword-input").attr("type", "text");
            }
        };

        self.generateUUID = function() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };

        self.generateClientId = function() {
            self.clientDTO.id(self.generateUUID() + self.generateUUID() + "-" + self.generateUUID() + "-" + self.generateUUID() + "-" + self.generateUUID() + "-" + self.generateUUID() + self.generateUUID() + self.generateUUID());
        };

        self.generateSecret = function() {
            self.clientDTO.secret(Math.random().toString(36).substring(2, 10));
        };

        self.save = function() {
            self.clientDTO.redirect_uris.removeAll();
            self.clientDTO.scopes.removeAll();

            if (!self.clientDTO.name()) {
                Params.baseModel.showMessages(null, [self.Nls.invalidClientName], "INFO");

                return;
            }

            if (!self.clientDTO.description()) {
                Params.baseModel.showMessages(null, [self.Nls.invalidClientDesc], "INFO");

                return;
            }

            if (!self.clientDTO.idDomain()) {
                Params.baseModel.showMessages(null, [self.Nls.invalidIdentityDomain], "INFO");

                return;
            }

            if (!self.clientDTO.secret()) {
                Params.baseModel.showMessages(null, [self.Nls.invalidClientSecret], "INFO");

                return;
            }

            if (!self.clientDTO.clientType()) {
                Params.baseModel.showMessages(null, [self.Nls.invalidClientType], "INFO");

                return;
            }

            if (self.clientDTO.grant_types().length === 0) {
                Params.baseModel.showMessages(null, [self.Nls.invalidGrantType], "INFO");

                return;
            }

            if (self.clientDTO.grant_types().indexOf("REFRESH_TOKEN") !== -1) {
                if (self.clientDTO.grant_types().indexOf("PASSWORD") === -1 && self.clientDTO.grant_types().indexOf("AUTHORIZATION_CODE") === -1) {
                    Params.baseModel.showMessages(null, [self.Nls.invalidGrant], "INFO");

                    return;
                }
            }

            if (self.scopesArray().length === 0) {
                Params.baseModel.showMessages(null, [self.Nls.invalidScope], "INFO");

                return;
            }

            if (self.redirectURLArray().length === 0) {
                Params.baseModel.showMessages(null, [self.Nls.urlCheck], "INFO");

                return;
            }

            if (!self.clientDTO.defaultScope()) {
                Params.baseModel.showMessages(null, [self.Nls.invalidDefaultScope], "INFO");

                return;
            }

            for (let i = 0; i < self.redirectURLArray().length; i++) {
                if (i === self.redirectURLArray().length - 1) {
                    if (self.redURLCheck() === false) {
                        if (!self.redirectURLArray()[i].url) {
                            Params.baseModel.showMessages(null, [self.Nls.urlCheck], "INFO");

                            return;
                        }
                    } else if (!self.redirectURLArray()[i].url) {
                        Params.baseModel.showMessages(null, [self.Nls.urlCheck], "INFO");

                        return;
                    }
                }

                self.clientDTO.redirect_uris.push(self.redirectURLArray()[i].url);
            }

            for (let i = 0; i < self.scopesArray().length; i++) {
                for (let j = 0; j < self.scopesArray()[i].selectedScopes().length; j++) {
                    self.clientDTO.scopes.push(self.scopesArray()[i].resourceServer() + "." + self.scopesArray()[i].selectedScopes()[j]);
                }
            }

            self.isEdit = ko.observable(false);

            const parameters = {
                clientDTO: self.clientDTO,
                isEdit : self.isEdit,
                clientTypeMap : self.clientTypeMap,
                firstVisit : self.firstVisit,
                redirectURLArray: self.redirectURLArray,
                scopesArray: self.scopesArray
            };

            Params.dashboard.loadComponent("client-review", parameters, self);
        };

        self.onClickCancel = function() {
            Params.dashboard.openDashboard();
        };

        self.onClickBack = function() {
            history.go(-1);
        };
    };
});