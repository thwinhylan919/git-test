define([
    "ojs/ojcore",
    "knockout",

    "./model",
    "ojL10n!resources/nls/resource-server-search",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojpopup",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojlistview"
], function(oj, ko, RSSearchModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("resource-server-create", "oauth");
        rootParams.baseModel.registerComponent("resource-server-view", "oauth");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("confirm-screen");
        self.Nls = resourceBundle.resourceServerSearch;
        rootParams.dashboard.headerName(self.Nls.resoureServerMt);

        const ResourceServerMap = {};

        self.selectedResourceServer = ko.observable();
        self.pagingdatasource = ko.observable();
        self.resServerName = ko.observable();
        self.resServerId = ko.observable();
        self.firstVisit = ko.observable(true);
        self.identityDomainName = ko.observable();
        self.isIdentityDomainListLoaded = ko.observable(false);
        self.identityDomainList = ko.observableArray();
        self.isResourceServerListLoaded = ko.observable(false);
        self.resourceServerList = ko.observableArray();
        self.scopesArray = ko.observableArray();

        self.generateURL = function() {
            let url = "";

            if (self.resServerId()) { url = url + "?id=" + self.resServerId(); } else { url = url + "?id="; }

            if (self.identityDomainName()) { url = url + "&identityDomainName=" + self.identityDomainName(); } else { url = url + "&identityDomainName="; }

            if (self.resServerName()) { url = url + "&name=" + self.resServerName(); } else { url = url + "&name="; }

            return "oauthpolicyadmin/listResourceServer" + url;
        };

        self.sortListener = function(event) {
            if (event.detail.header === "data.name") {
                self.pagingdatasource().sort({
                    key: "name",
                    direction: event.detail.direction
                });
            } else {
                self.pagingdatasource().sort({
                    key: "description",
                    direction: event.detail.direction
                });
            }
        };

        self.searchResourceServer = function() {
            if (!self.resServerName() && !self.resServerId() && !self.identityDomainName()) {
                rootParams.baseModel.showMessages(null, [self.Nls.noDescription], "ERROR");

                return;
            }

            if (!self.identityDomainName()) {
                rootParams.baseModel.showMessages(null, [self.Nls.selectIdentityDomain], "ERROR");

                return;
            }

            RSSearchModel.listResourceServer(self.generateURL()).done(function(data) {
                self.resourceServerList.removeAll();

                for (let i = 0; i < data.jsonNode.resourceServerListResponseDTO.length; i++) {
                    self.resourceServerList.push(data.jsonNode.resourceServerListResponseDTO[i].resourceServerDTO);
                    ResourceServerMap[data.jsonNode.resourceServerListResponseDTO[i].resourceServerDTO.name] = data.jsonNode.resourceServerListResponseDTO[i].resourceServerDTO;
                }

                self.pagingdatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.resourceServerList(), {
                    idAttribute: ["name"]
                })));

                self.isResourceServerListLoaded(true);
            });
        };

        self.onResourceServerSelected = function(name) {
            for (let i = 0; i < ResourceServerMap[name].scopes.length; i++) {
                if (ResourceServerMap[name].scopes[i].scopeName === "DefaultScope") { ResourceServerMap[name].scopes.splice(i, 1); }
            }

            self.scopesArray = ko.mapping.fromJS(ResourceServerMap[name].scopes);
            self.selectedResourceServer(ResourceServerMap[name]);

            rootParams.dashboard.loadComponent("resource-server-view", {
                selectedResourceServer : self.selectedResourceServer,
                isIdentityDomainListLoaded : self.isIdentityDomainListLoaded,
                scopesArray : self.scopesArray,
                identityDomainList : self.identityDomainList
            }, self);
        };

        self.reset = function() {
            self.resServerId("");
            self.resServerName("");
            self.identityDomainName("");
            self.isResourceServerListLoaded(false);
            self.identityDomainList("");
        };

        self.create = function() {
            rootParams.dashboard.loadComponent("resource-server-create", {
                firstVisit : self.firstVisit,
                identityDomainList : self.identityDomainList,
                isIdentityDomainListLoaded : self.isIdentityDomainListLoaded
            }, self);
        };

        self.renderDomainList = function() {
            RSSearchModel.listIdentityDomain().done(function(data) {
                for (let i = 0; i < data.jsonNode.identityDomainDTO.length; i++) {
                    self.identityDomainList.push(data.jsonNode.identityDomainDTO[i]);
                }

                self.isIdentityDomainListLoaded(true);
            });
        };
    };
});