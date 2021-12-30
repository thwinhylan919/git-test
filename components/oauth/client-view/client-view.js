define([

    "knockout",

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
], function(ko, ClientViewModel, resourceBundle) {
    "use strict";

    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);
        self.Nls = resourceBundle;
        self.clientData = ko.observable();
        self.clType = ko.observable();
        self.clientTypeMap = self.params.clientTypeMap || {};
        self.clientDataLoaded = ko.observable(false);
        Params.dashboard.headerName(self.Nls.clientHeading);
        Params.baseModel.registerElement("action-header");
        Params.baseModel.registerComponent("client-edit", "oauth");
        Params.baseModel.registerComponent("client-search", "oauth");

        self.scopesArray = ko.observableArray().extend({
            notify: "always"
        });

        self.redirectURLArray = ko.observableArray();
        self.ResourceServerMap = {};
        self.resourceServerList = ko.observableArray();
        self.resourceServerListLoaded = ko.observable(false);
        self.resourceScopeListLoaded = ko.observable(false);
        self.scopesList = ko.observableArray();
        self.identityDomain = self.params.identityDomain || ko.observable();
        self.defaultScopesList = ko.observableArray([]);
        self.defaultScopeListLoaded = ko.observable(false);

        ClientViewModel.fetchResourceServers(self.identityDomain()).then(function(data) {
            for (let i = 0; i < data.jsonNode.resourceServerListResponseDTO.length; i++) {
                self.resourceServerList.push(data.jsonNode.resourceServerListResponseDTO[i].resourceServerDTO);
                self.ResourceServerMap[data.jsonNode.resourceServerListResponseDTO[i].resourceServerDTO.name] = data.jsonNode.resourceServerListResponseDTO[i].resourceServerDTO.scopes;
            }

            self.resourceServerListLoaded(true);
            self.fetchClientDetails();
        });

        self.fetchClientDetails = function() {
            ClientViewModel.read(self.params.id).then(function(data) {
                const tempData = data.jsonNode.responseDTOList[0],
                params = {};

                params.id = tempData.client_id;
                params.name = tempData.client_name;
                params.idDomain = tempData.idDomain;
                params.description = tempData.description;
                params.url = tempData.redirect_uris;
                params.grant_types = tempData.grant_types;
                params.secret = tempData.secret;
                params.defaultScope = tempData.defaultScope;
                params.scopes = tempData.scopes;
                params.resMap = {};
                params.clientType = tempData.clientType;
                params.isHttps = tempData.isHttps;

                self.clType(self.clientTypeMap[tempData.clientType]);

                self.redirectURL = {
                    url: ko.observable("")
                };

                const defScope = {
                    name: tempData.defaultScope
                };

                for (let i = 0; i < tempData.redirect_uris.length; i++) {
                    const redUrl = {
                        url: tempData.redirect_uris[i]
                    };

                    self.redirectURLArray.push(redUrl);
                }

                for (let i = 0; i < tempData.scopes.length; i++) {
                    const splits = tempData.scopes[i].split(".");

                    if (params.resMap[splits[0]] !== null && params.resMap[splits[0]] !== undefined) {
                        if (!Array.isArray(params.resMap[splits[0]])) {
                            const tempObj = params.resMap[splits[0]];

                            params.resMap[splits[0]] = [tempObj];
                        }

                        params.resMap[splits[0]].push(splits[1]);
                    } else {
                        params.resMap[splits[0]] = [splits[1]];
                    }
                }

                let key;

                for (key in params.resMap) {
                    if (key !== undefined) {
                        self.scope = {
                            resourceServer: ko.observable(""),
                            scopes: ko.observableArray([]),
                            selectedScopes: ko.observableArray([])
                        };

                        self.scope.selectedScopes(params.resMap[key]);
                        self.scope.resourceServer(key);
                        self.scope.scopes(self.ResourceServerMap[key]);
                        self.scopesArray.push(self.scope);
                    }
                }

                self.resourceScopeListLoaded(true);
                self.defaultScopesList.push(defScope);
                self.defaultScopeListLoaded(true);
                self.clientData(params);
                self.clientDataLoaded(true);
                ko.tasks.runEarly();
            });
        };

        self.onClickEdit = function() {
            self.clientData = ko.mapping.toJS(self.clientData);

            const context = {};

            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            context.mode = "EDIT";

            Params.dashboard.loadComponent("client-edit", {
                ResourceServerMap : self.ResourceServerMap,
                resourceServerList : self.resourceServerList,
                resourceServerListLoaded : self.resourceServerListLoaded,
                resourceScopeListLoaded : self.resourceScopeListLoaded,
                clientTypeMap : self.clientTypeMap,
                defaultScopesList : self.defaultScopesList,
                defaultScopeListLoaded : self.defaultScopeListLoaded,
                scopesArray : self.scopesArray,
                redirectURLArray : self.redirectURLArray,
                clientData : self.clientData
            }, self);
        };

        self.onClickCancel = function() {
            Params.dashboard.openDashboard();
        };

        self.onClickBack = function() {
            history.go(-1);
        };
    };
});