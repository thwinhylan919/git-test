define([
    "ojL10n!resources/nls/application-message-view",
    "./model",
    "knockout",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton",
    "ojs/ojlabel"
], function (resourceBundle, Model, ko) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        self.resourceBundle = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.applicationMessageslocalecodegetVar = ko.observable();
        self.applicationMessageslocalecodegetlocale = ko.observable(params.rootModel.params.locale);
        self.applicationMessageslocalecodegetcode = ko.observable(params.rootModel.params.code);
        params.baseModel.registerElement("help");
        params.baseModel.registerComponent("application-message-list", "application-message");
        params.baseModel.registerTransaction("application-message-edit", "application-message");

        self.dataLoaded = ko.observable(false);
        self.localeDescription = params.rootModel.params.localeDescription;

        Model.applicationMessageslocalecodeget(self.applicationMessageslocalecodegetlocale(), self.applicationMessageslocalecodegetcode()).then(function (response) {
            self.applicationMessageslocalecodegetVar(response);
            self.dataLoaded(true);
        });

        self.onClickBack51 = function () {
            params.dashboard.loadComponent("application-message-list", {});
        };

        self.onClickEdit50 = function (_event, data) {
            params.dashboard.loadComponent("application-message-edit", {
                data: ko.toJS(data)
            });
        };

        self.onClickCancel41 = function () {
            params.dashboard.switchModule();
        };
    };
});