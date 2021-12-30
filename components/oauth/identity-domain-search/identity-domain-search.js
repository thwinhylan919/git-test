define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojL10n!resources/nls/identity-domain",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource"
], function(oj, ko, Model, resourceBundle) {
    "use strict";

    return function(params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);
        self.nls = resourceBundle;
        self.domainName = ko.observable();
        self.pagingdatasource = ko.observable();
        self.identityDomainList = ko.observableArray();
        self.updateDomain = ko.observable(false);
        self.isIdentityDomainListLoaded = ko.observable(false);
        params.dashboard.headerName(self.nls.IdentityDomain.IdentityDomainMaintenance);
        params.baseModel.registerComponent("identity-domain-create", "oauth");
        params.baseModel.registerComponent("identity-domain-view", "oauth");
        params.baseModel.registerElement("modal-window");

        self.openCreateIDomain = function() {
            let parameters;

            params.dashboard.loadComponent("identity-domain-create", parameters,
                self);
        };

        params.baseModel.registerElement("modal-window");

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

        self.search = function() {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            Model.fetchIdentityDomain(self.domainName()).then(function(data) {
                self.identityDomainList.removeAll();

                for (let i = 0; i < data.jsonNode.identityDomainDTO.length; i++) {
                    self.identityDomainList.push(data.jsonNode.identityDomainDTO[i]);
                }

                self.pagingdatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.identityDomainList(), {
                    idAttribute: "name"
                })));

                self.isIdentityDomainListLoaded(true);
            });
        };

        self.onIdentityDomainSelected = function(name) {
            const parameters = {
                domainName: name
            };

            params.dashboard.loadComponent("identity-domain-view", parameters,
                self);
        };

        self.cancel = function() {
            params.dashboard.openDashboard();
        };

        self.clear = function() {
            self.domainName("");
            self.isIdentityDomainListLoaded(false);
            self.identityDomainList("");
        };
    };
});