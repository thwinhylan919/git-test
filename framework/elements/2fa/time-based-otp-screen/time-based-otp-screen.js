define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/time-based-otp-screen",
    "ojs/ojbutton",
    "ojs/ojinputtext",
    "ojs/ojknockout-validation"
], function(ko, $, locale) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.locale = locale;
        self.referenceNumber = ko.observable(rootParams.rootModel.challenge.referenceNo);
        self.attemptsLeft = rootParams.rootModel.challenge.attemptsLeft;
        self.invalidTracker = ko.observable();
        self.totp = ko.observable();
        self.messageSection = ko.observable();
        self.pageSectionHeader = ko.observable();
        self.togglePassword = rootParams.rootModel.togglePassword;
        self.cancelAuthenticationScreen = rootParams.rootModel.cancelAuthenticationScreen;
        self.instructions = ko.observableArray(self.locale.instructions.split(","));

        self.scopeType = ko.observable(rootParams.rootModel.challenge.scope);
        self.disableReferenceNumber = ko.observable(true);
        self.editReferenceNo = ko.observable(false);

        self.editReferenceNo.subscribe(function(newValue) {
            if (newValue) {
                self.disableReferenceNumber(false);
            } else {
                self.disableReferenceNumber(true);
            }
        });

        self.editTheReferenceNo = function() {
            if (self.editReferenceNo() === "true") {
                self.disableReferenceNumber(false);
            } else {
                self.disableReferenceNumber(true);
            }
        };

        if (self.scopeType() === "USER") {
            self.editReferenceNo(false);
        }

        self.pageSectionHeader(self.locale.softTokenVerification);
        self.messageSection(self.locale.softTokenMessage);

        self.completeTOTP = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(self.invalidTracker())) {
                return;
            }

            const buildingResponseHeader = {};

            buildingResponseHeader.totp = self.totp();
            buildingResponseHeader.referenceNo = self.referenceNumber();
            rootParams.rootModel.submit2fa(buildingResponseHeader);
        };

        self.totpShown = function() {
            $("#totp").bind("cut copy paste contextmenu", function(e) {
                e.preventDefault();
            });
        };
    };
});