define([
    "ojs/ojcore",
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
], function(oj, ko, $, ClientSearchModel, resourceBundle) {
    "use strict";

    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);
        self.Nls = resourceBundle;
        self.identityDomains = ko.observable();
        self.clientTypes = ko.observableArray();
        self.isIdentityDomainListLoaded = ko.observable(false);
        self.isClientTypeListLoaded = ko.observable(false);
        self.showSearchData = ko.observable(false);
        self.firstVisit = ko.observable(true);
        self.pagingDatasource = ko.observable();
        self.clientId = ko.observable();
        self.clientName = ko.observable();
        self.identityDomain = ko.observable();
        self.clientType = ko.observable();
        self.clientTypeMap = {};
        Params.dashboard.headerName(self.Nls.clientHeading);
        Params.baseModel.registerComponent("client-view", "oauth");
        Params.baseModel.registerComponent("client-create", "oauth");

        self.clientTypeMap.CONFIDENTIAL_CLIENT = self.Nls.clientTypes.CONFIDENTIAL_CLIENT;
        self.clientTypeMap.PUBLIC_CLIENT = self.Nls.clientTypes.PUBLIC_CLIENT;
        self.clientTypeMap.MOBILE = self.Nls.clientTypes.MOBILE;

        self.headerText = [{
            headerText: self.Nls.clientId,
            field: "clientId",
            renderer: oj.KnockoutTemplateUtils.getRenderer("clientIdLink", true)
        }, {
            headerText: self.Nls.clientName,
            field: "clientName"
        }, {
            headerText: self.Nls.identityDomain,
            field: "identityDomain"
        }, {
            headerText: self.Nls.clientType,
            field: "clientType"
        }];

        self.searchData = {
            clientId: "",
            clientName: "",
            identityDomain: "",
            clientType: ""
        };

        self.searchData = ko.mapping.fromJS(self.searchData);
        self.isClientTypeListLoaded(true);

        ClientSearchModel.fetchIdentityDomains().then(function(data) {
            if (data.jsonNode.identityDomainDTO.length > 0) {
                self.identityDomains(data.jsonNode.identityDomainDTO);
                self.isIdentityDomainListLoaded(true);
            }
        });

        self.prepareDatasource = function(data) {
            self.pagingDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(data, {
                idAttribute: ["clientId"]
            })));
        };

        self.search = function() {
            if (!self.clientId() && !self.clientName() && !self.identityDomain() && !self.clientType()) {
                Params.baseModel.showMessages(null, [self.Nls.noDescription], "ERROR");

                return;
            }

            if (!self.identityDomain()) {
                Params.baseModel.showMessages(null, [self.Nls.invalidIdentityDomain], "ERROR");

                return;
            }

            self.searchData.clientId = self.clientId();
            self.searchData.clientName = self.clientName();
            self.searchData.identityDomain = self.identityDomain();
            self.searchData.clientType = self.clientType();

            ClientSearchModel.search(self.searchData).then(function(data) {
                const tempData = $.map(data.jsonNode.responseDTOList, function(v) {
                    const newObj = {};

                    newObj.clientId = v.client_id;
                    newObj.clientName = v.client_name;
                    newObj.identityDomain = v.idDomain;

                    if (v.clientType === "CONFIDENTIAL_CLIENT") {
                        newObj.clientType = self.Nls.confidential;
                    } else if (v.clientType === "PUBLIC_CLIENT") {
                        newObj.clientType = self.Nls.public;
                    } else if (v.clientType === "MOBILE_CLIENT") {
                        newObj.clientType = self.Nls.mobile;
                    }

                    return newObj;
                });

                self.prepareDatasource(tempData);
                self.showSearchData(true);
            });
        };

        self.view = function(data) {
            const parameters = {
                id: data.clientId,
                clientTypeMap : self.clientTypeMap,
                identityDomain : self.identityDomain

            };

            self.createClient = function() {
                Params.dashboard.loadComponent("create-client", {
                    mode: "create"
                }, self);
            };

            Params.dashboard.loadComponent("client-view", parameters, self);
        };

        self.create = function () {
            const params = {
                clientTypeMap: self.clientTypeMap,
                firstVisit : self.firstVisit,
                identityDomain: self.identityDomain,
                isClientTypeListLoaded: self.isClientTypeListLoaded
            };

            Params.dashboard.loadComponent("client-create", params);
        };

        self.clear = function() {
            self.clientId("");
            self.clientName("");
            self.identityDomain("");
            self.clientType("");
        };
    };
});