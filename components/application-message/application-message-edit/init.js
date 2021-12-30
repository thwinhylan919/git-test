define([
    "ojL10n!resources/nls/application-message-edit",
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
        self.resourceBundle = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.enumerationslocalegetVar = ko.observable();
        self.localeDescription = params.rootModel.params.data.localeDescription;
        params.baseModel.registerElement("help");

        const getNewKoModel = function () {
            const KoModel = Model.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.taxonomyDefinition = params.dashboard.getTaxonomyDefinition("com.ofss.digx.app.common.dto.message.ApplicationMessageDTO");
        self.modelInstance = getNewKoModel();

        self.showLocale = ko.observable(false);

        self.modelInstance.code = params.rootModel.params.data.applicationMessageslocalecodegetVar.applicationMessageDTO.code;

        if (params.rootModel.params.context) {
            self.modelInstance.message = ko.observable(params.rootModel.params.context.message);
        } else {
            self.modelInstance.message = ko.observable(params.rootModel.params.data.applicationMessageslocalecodegetVar.applicationMessageDTO.message);
        }

        self.modelInstance.summaryText = params.rootModel.params.data.applicationMessageslocalecodegetVar.applicationMessageDTO.summaryText;
        self.modelInstance.locale = params.rootModel.params.data.applicationMessageslocalecodegetVar.applicationMessageDTO.locale;
        self.modelInstance.version = params.rootModel.params.data.applicationMessageslocalecodegetVar.applicationMessageDTO.version;

        self.onClickBack68 = function () {
            params.dashboard.loadComponent("application-message-view", {
                code: self.modelInstance.code,
                locale: self.modelInstance.locale,
                localeDescription: self.localeDescription
            });
        };

        const confirmScreenExtensions = {};

        params.baseModel.registerElement(confirm - screen);

        self.onClickSave10 = function () {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            params.dashboard.loadComponent("review-application-message-edit", {
                confirm: self.confirm,
                backReview: self.backReview,
                data: ko.toJS(self.modelInstance),
                localeDescription: self.localeDescription,
                mode: "review",
                confirmScreenExtensions: confirmScreenExtensions
            });
        };

        self.onClickCancel8 = function () {
            params.dashboard.switchModule();
        };

        self.backReview = function () {
            const context = {};

            context.message = self.modelInstance.message;

            params.dashboard.loadComponent("application-message-edit", {
                context: ko.toJS(context),
                data: ko.toJS(params.rootModel.params.data)
            });
        };

        self.confirm = function () {
            Model.applicationMessagescodeput(self.modelInstance.code, JSON.stringify(ko.mapping.toJS(self.modelInstance))).then(function (data) {
                params.dashboard.loadComponent("confirm-screen", {
                    transactionResponse: data,
                    transactionName: self.nls.componentHeader,
                    hostReferenceNumber: data.referenceNumber
                });
            });
        };
    };
});