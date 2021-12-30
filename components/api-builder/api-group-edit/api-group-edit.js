define([

    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/api-group-edit",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton",
    "ojs/ojknockout-validation",
    "ojs/ojradioset"
], function(ko, $, APIGroupEditModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(APIGroupEditModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("api-group-search", "api-builder");
        rootParams.baseModel.registerComponent("api-group-review", "api-builder");
        self.resource = resourceBundle;
        self.mode = ko.observable("EDIT");
        self.isauthorizationRequired = ko.observable();
        rootParams.dashboard.headerName(self.resource.headerName);
        self.updatedapiGroupDTO = self.params.apiGroupDTO;
        self.token = ko.observable(false);
        self.userCredentials = ko.observable(false);
        self.authorizationRequiredValue = ko.observable();
        self.authorizationTypeValue = ko.observable();

        let passwordValue = true;

        self.authorizationRequiredArray = ko.observable([{
            description: self.resource.yes,
            code: "Y"
        }, {
            description: self.resource.no,
            code: "N"
        }]);

        self.isauthorizationRequire = function() {
            if (self.authorizationRequiredValue() === "Y") {
                self.isauthorizationRequired(true);
                self.authorizationType();
            } else {
                self.isauthorizationRequired(false);
                self.userCredentials(false);
                self.token(false);
            }
        };

        self.authorizationTypeArray = ko.observable([{
            description: self.resource.basic,
            code: "BA"
        }, {
            description: self.resource.bearer,
            code: "BE"
        }]);

        if (self.updatedapiGroupDTO.authorizationType) {
            self.authorizationRequiredValue("Y");
            self.isauthorizationRequired(true);

            if (self.updatedapiGroupDTO.userName) {
                self.authorizationTypeValue("BA");
                self.userCredentials(true);
                self.token(false);
            } else {
                self.authorizationTypeValue("BE");
                self.userCredentials(false);
                self.token(true);
            }
        } else {
            self.authorizationRequiredValue("N");
            self.isauthorizationRequired(false);
            self.userCredentials(false);
            self.token(false);
        }

        self.authorizationType = function() {
            if (self.authorizationTypeValue() === "BA") {
                self.userCredentials(true);
                self.token(false);
            } else {
                self.userCredentials(false);
                self.token(true);
            }
        };

        self.togglePassword = function() {
            passwordValue = !passwordValue;

            const eye = $("#eyecon");

            eye.removeClass("icon-eye icon-eye-slash");

            if (passwordValue) {
                eye.addClass("icon-eye-slash");
                $(".oj-inputpassword-input").attr("type", "password");
            } else {
                eye.addClass("icon-eye");
                $(".oj-inputpassword-input").attr("type", "text");
            }
        };

        self.onClickCancel = function() {
            rootParams.dashboard.switchModule();
        };

        self.onClickBack = function() {
            rootParams.dashboard.loadComponent("api-group-search");
        };

        self.save = function() {
            self.apiGroupDTO = getNewKoModel().apiGroupDTO;
            self.apiGroupDTO.groupCode = self.updatedapiGroupDTO.groupCode;
            self.apiGroupDTO.groupDescription = self.updatedapiGroupDTO.groupDescription;
            self.apiGroupDTO.endPointConfig = self.updatedapiGroupDTO.endPointConfig;
            self.apiGroupDTO.ip = self.updatedapiGroupDTO.ip;
            self.apiGroupDTO.port = self.updatedapiGroupDTO.port;

            if (self.isauthorizationRequired()) {
                if (self.authorizationTypeValue() === "BA") {
                    self.apiGroupDTO.authorizationType(self.resource.basic);
                    self.apiGroupDTO.userName = self.updatedapiGroupDTO.userName;
                    self.apiGroupDTO.password = self.updatedapiGroupDTO.password;
                } else {
                    self.apiGroupDTO.authorizationType(self.resource.bearer);
                    self.apiGroupDTO.password = self.updatedapiGroupDTO.password;
                }
            }

            rootParams.dashboard.loadComponent("api-group-review", self);
        };
    };
});