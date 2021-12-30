define([

    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/resource-server-create",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojtable",
    "ojs/ojlistview",
    "ojs/ojpopup",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function(ko,$, RSCreateModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("resource-server-review", "oauth");
        self.Nls = resourceBundle.resourceServerCreate;
        rootParams.dashboard.headerName(self.Nls.resoureServerMt);

        const getNewKoModel = function() {
            const KoModel = RSCreateModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.firstVisit = self.params.firstVisit || ko.observable(true);
        self.identityDomainList = self.params.identityDomainList || ko.observableArray();
        self.isIdentityDomainListLoaded = self.params.isIdentityDomainListLoaded || ko.observable(false);

        if (self.params.firstVisit() === true) {
            self.scopesArray = ko.observableArray();
            self.resourceServerPayload = getNewKoModel().resourceServerModel;
        } else {
            self.scopesArray = self.params.scopesArray || ko.observableArray();
            self.resourceServerPayload = self.params.resourceServerPayload || getNewKoModel().resourceServerModel;
        }

        self.scope = {
            scopeName: ko.observable(""),
            description: ko.observable("")
        };

        if (self.scopesArray().length === 0) {
            self.scopesArray.push(self.scope);
        }

        self.scopeName = ko.observable().extend({
            notify: "always"
        });

        self.description = ko.observable().extend({
            notify: "always"
        });

        self.save = function() {
            if (!self.resourceServerPayload.name()) {
                rootParams.baseModel.showMessages(null, [self.Nls.invalidResourceServerName], "INFO");

                return;
            }

            if (!self.resourceServerPayload.description()) {
                rootParams.baseModel.showMessages(null, [self.Nls.invalidResourceServerDesc], "INFO");

                return;
            }

            if (!self.resourceServerPayload.idDomain()) {
                rootParams.baseModel.showMessages(null, [self.Nls.selectIdentityDomain], "INFO");

                return;
            }

            for (let i = 0; i < self.scopesArray().length; i++) {
                self.resourceServerPayload.scopes.push(self.scopesArray()[i]);
            }

            self.resourceServerPayloadToSend = ko.mapping.toJS(self.resourceServerPayload);

            rootParams.dashboard.loadComponent("resource-server-review", {
                mode: "review",
                resourceServerPayloadToSend: self.resourceServerPayloadToSend,
                resourceServerPayload : self.resourceServerPayload
            }, self);
        };

        self.back = function() {
            history.go(-1);
        };

        self.cancel = function() {
            $("#reviewCancel").trigger("openModal");
        };

        self.no = function() {
            $("#reviewCancel").hide();
          };

        self.duplicate = function() {
            self.scope = {
                scopeName: ko.observable(""),
                description: ko.observable("")
            };

            if (self.scopesArray().length === 0) {
                self.scopesArray.push(self.scope);
            } else {
                for (let i = self.scopesArray().length - 1; i < self.scopesArray().length; i++) {
                    self.scopesArray()[i] = ko.mapping.fromJS(self.scopesArray()[i]);
                    self.scopeName = self.scopesArray()[i].scopeName();
                    self.description = self.scopesArray()[i].description();

                    if (!self.scopeName && !self.description) {
                        rootParams.baseModel.showMessages(null, [self.Nls.scopeCheck], "ERROR");

                        return;
                    }

                    if (!self.scopeName) {
                        rootParams.baseModel.showMessages(null, [self.Nls.invalidScopeName], "ERROR");

                        return;
                    }

                    if (!self.description) {
                        rootParams.baseModel.showMessages(null, [self.Nls.invalidScopeDesc], "ERROR");

                        return;
                    }

                    self.scopesArray()[i] = ko.mapping.toJS(self.scopesArray()[i]);
                }

                self.scopesArray.push(self.scope);
            }
        };

        self.delete = function(index) {
            self.scopesArray.remove(index);
        };
    };
});