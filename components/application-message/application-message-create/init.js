define([
    "ojL10n!resources/nls/application-message-create",
    "knockout",
    "./model",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojlabel"
], function (resourceBundle, ko, Model) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.enumerationslocalegetVar = ko.observable();
        params.baseModel.registerElement("help");
        params.baseModel.registerComponent("application-message-list", "application-message");

        const getNewKoModel = function () {
            const KoModel = Model.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.modelInstance = params.rootModel.previousState ? params.rootModel.previousState.data : getNewKoModel();

        self.showLocale = ko.observable(false);

        Model.enumerationslocaleget().then(function (response) {
            self.enumerationslocalegetVar(response);
            self.showLocale(true);
        });

        self.onClickBack39 = function () {
            params.dashboard.loadComponent("application-message-list", {});
        };

        const confirmScreenExtensions = {};

        params.baseModel.registerElement(confirm - screen);

        self.onClickSave74 = function (event, data) {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            params.dashboard.loadComponent("review-application-message-create", {
                confirm: self.confirm,
                data: ko.toJS(self.modelInstance),
                mode: "review",
                confirmScreenExtensions: confirmScreenExtensions
            });
        };

        self.onClickCancel47 = function () {
            params.dashboard.switchModule();
        };

        self.confirm = function (event, data) {
            Model.applicationMessagespost(JSON.stringify(ko.mapping.toJS(self.modelInstance))).then(function (data) {
                params.dashboard.loadComponent("confirm-screen", {
                    transactionResponse: data,
                    hostReferenceNumber: data.referenceNumber
                });
            });
        };
    };
});