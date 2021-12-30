define([

    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/api-group-create",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton",
    "ojs/ojknockout-validation",
    "ojs/ojradioset"
], function(ko, $, APIGroupCreateModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(APIGroupCreateModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("api-group-search", "api-builder");
        rootParams.baseModel.registerComponent("api-group-review", "api-builder");
        self.resource = resourceBundle;
        rootParams.dashboard.headerName(self.resource.headerName);
        self.apiGroupDTO = getNewKoModel().apiGroupDTO;
        self.authorizationRequired = ko.observable();
        self.authorizationType = ko.observable();
        self.mode = ko.observable("CREATE");
        self.tokenValue = ko.observable();
        self.groupCode = ko.observable();
        self.groupDesc = ko.observable();
        self.endPointConfig = ko.observable();
        self.hostIP = ko.observable();
        self.hostPort = ko.observable();
        self.userName = ko.observable();
        self.password = ko.observable();

        let passwordValue = true;

        if (self.params.apiGroupDTO) {
            const details = self.params.apiGroupDTO;

            self.groupCode(details.groupCode());
            self.groupDesc(details.groupDescription());
            self.endPointConfig(details.endPointConfig());
            self.hostIP(details.ip());
            self.hostPort(details.port());

            if (self.params.authorizationType()) {
                self.authorizationRequired("Y");

                if (details.userName()) {
                    self.authorizationType("BA");
                    self.userName(self.params.userName());
                    self.password(self.params.password());
                } else {
                    self.authorizationType("BE");
                    self.tokenValue(self.params.tokenValue());
                }
            } else {
                self.authorizationRequired("N");
                self.authorizationType();
            }
        }

        self.endPoints = ko.observable([{
            text: "REST",
            value: "REST"
        }]);

        self.authorizationRequiredArray = ko.observable([{
            description: self.resource.yes,
            code: "Y"
        }, {
            description: self.resource.no,
            code: "N"
        }]);

        self.authorizationTypeArray = ko.observable([{
            description: self.resource.basic,
            code: "BA"
        }, {
            description: self.resource.bearer,
            code: "BE"
        }]);

        self.togglePassword = function() {
            passwordValue = !passwordValue;

            let eye;

            if (self.authorizationType() === "BA") {
                eye = $("#eyecon");
            } else {
                eye = $("#eyeconToken");
            }

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
            rootParams.dashboard.loadComponent("api-group-search", self);
        };

        self.save = function() {
            if (rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                self.apiGroupDTO = getNewKoModel().apiGroupDTO;
                self.apiGroupDTO.groupCode(self.groupCode());
                self.apiGroupDTO.groupDescription(self.groupDesc());
                self.apiGroupDTO.ip(self.hostIP());
                self.apiGroupDTO.port(self.hostPort());
                self.apiGroupDTO.endPointConfig(self.endPointConfig());

                if (self.authorizationRequired() === "Y") {
                    if (self.authorizationType() === "BA") {
                        self.apiGroupDTO.authorizationType(self.resource.basic);
                        self.apiGroupDTO.userName(self.userName());
                        self.apiGroupDTO.password(self.password());
                    } else if (self.authorizationType() === "BE") {
                        self.apiGroupDTO.authorizationType(self.resource.bearer);
                        self.apiGroupDTO.password(self.tokenValue());
                    }
                }

                rootParams.dashboard.loadComponent("api-group-review", self);
            }
        };
    };
});