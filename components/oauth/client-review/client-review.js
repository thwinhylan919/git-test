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
], function(ko, ClientReviewModel, resourceBundle) {
    "use strict";

    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);
        self.Nls = resourceBundle;
        self.clientData = ko.observable();
        self.clientTypeMap = self.params.clientTypeMap || {};
        self.clType = ko.observable(self.clientTypeMap[self.params.clientDTO.clientType()]);
        self.clientDataLoaded = ko.observable(false);
        self.firstVisit = self.params.firstVisit || ko.observable(true);
        Params.dashboard.headerName(self.Nls.clientHeading);
        Params.baseModel.registerElement("confirm-screen");
        Params.baseModel.registerElement("action-header");
        Params.baseModel.registerComponent("client-edit", "oauth");
        self.transactionStatus = ko.observable();
        self.transactionName = ko.observable();
        self.httpStatus = ko.observable();

        self.onClickUpdate = function() {
            const payload = {};

            payload.id = self.params.clientDTO.id();
            payload.name = self.params.clientDTO.name();
            payload.idDomain = self.params.clientDTO.idDomain();
            payload.description = self.params.clientDTO.description();
            payload.redirect_uris = self.params.clientDTO.url();
            payload.grant_types = self.params.clientDTO.grant_types();
            payload.secret = self.params.clientDTO.secret();
            payload.defaultScope = self.params.clientDTO.defaultScope();
            payload.scopes = self.params.clientDTO.scopes();
            payload.clientType = self.params.clientDTO.clientType();
            payload.isHttps = self.params.clientDTO.isHttps();

            ClientReviewModel.updateClient(ko.mapping.toJSON(payload)).done(function(data, status, jqXhr) {
                self.httpStatus(jqXhr.status);
                self.transactionStatus(data.status);

                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName(),
                    template: "oauth/confirm-screen-template"
                }, self);
            });
        };

        self.onClickCreate = function() {
            const payload = {};

            payload.id = self.params.clientDTO.id();
            payload.name = self.params.clientDTO.name();
            payload.idDomain = self.params.clientDTO.idDomain();
            payload.description = self.params.clientDTO.description();
            payload.redirect_uris = self.params.clientDTO.redirect_uris();
            payload.grant_types = self.params.clientDTO.grant_types();
            payload.secret = self.params.clientDTO.secret();
            payload.defaultScope = self.params.clientDTO.defaultScope();
            payload.scopes = self.params.clientDTO.scopes();
            payload.clientType = self.params.clientDTO.clientType();
            payload.isHttps = self.params.clientDTO.isHttps();

            ClientReviewModel.createClient(ko.mapping.toJSON(payload)).done(function(data, status, jqXhr) {
                self.httpStatus(jqXhr.status);
                self.transactionStatus(data.status);

                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.Nls.resoureServerMt,
                    template: "oauth/confirm-screen-template"
                }, self);
            });
        };

        self.onClickCancel = function() {
            Params.dashboard.openDashboard();
        };

        self.onClickBack = function() {
            self.firstVisit(false);
            history.go(-1);
        };
    };
});