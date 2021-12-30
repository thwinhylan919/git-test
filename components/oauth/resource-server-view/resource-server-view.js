define([

    "knockout",
    "jquery",
    "ojL10n!resources/nls/resource-server-view",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojtable",
    "ojs/ojlistview",
    "ojs/ojpopup",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function(ko, $, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("resource-server-edit", "oauth");
        self.Nls = resourceBundle.resourceServerView;
        self.selectedResourceServer = ko.mapping.toJS(self.params.selectedResourceServer) || ko.observable();
        rootParams.dashboard.headerName(self.Nls.resoureServerMt);

        self.edit = function() {
            rootParams.dashboard.loadComponent("resource-server-edit", {
                selectedResourceServer : self.selectedResourceServer,
                scopesArray : self.params.scopesArray,
                isIdentityDomainListLoaded : self.params.isIdentityDomainListLoaded,
                identityDomainList : self.params.identityDomainList
            }, self);
        };

        self.cancel = function() {
            $("#reviewCancel").trigger("openModal");
        };

        self.back = function() {
            history.go(-1);
        };

        self.no = function() {
            $("#reviewCancel").hide();
        };
    };
});