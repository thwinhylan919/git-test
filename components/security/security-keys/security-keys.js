define([
        "knockout",
        "./model",
        "jquery",
        "ojL10n!resources/nls/security-menu"

    ],
    function(ko, SecurityKeysModel, $, ResourceBundle) {
        "use strict";

        return function(rootParams) {
            const self = this;

            self.resource = ResourceBundle;
            rootParams.dashboard.headerName(self.resource.labels.securityKeys);

            self.cancel = function() {
                rootParams.dashboard.switchModule();
            };

            self.generateKeyPair = function() {
                SecurityKeysModel.createKeys(ko.toJSON({})).done(function(data, status) {
                    $("#keyPairGenerationModal").trigger("openModal");
                });
            };

            self.conformation = function() {
                $("#askToGenerateJwtKeyModal").trigger("openModal");
            };

            self.generateJwtKey = function() {
                SecurityKeysModel.createJwtKeys(ko.toJSON({})).done(function(data, status) {
                    $("#jwtKeyGenerationModal").trigger("openModal");
                });
            };

            self.cancel = function() {
                history.go(-1);
            };
        };
    });