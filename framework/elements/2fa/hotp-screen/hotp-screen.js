define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/hotp-screen",
    "ojs/ojbutton",
    "ojs/ojinputtext",
    "ojs/ojknockout-validation"
], function(ko, $, locale) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.locale = locale;

        self.referenceNumber = ko.observable(rootParams.rootModel.challenge.referenceNo);
        self.attemptsLeft = ko.observable(rootParams.rootModel.challenge.attemptsLeft);
        self.invalidTracker = ko.observable();
        self.hotp = ko.observable();
        self.messageSection = ko.observable();
        self.pageSectionHeader = ko.observable();
        self.togglePassword = rootParams.rootModel.togglePassword;
        self.cancelAuthenticationScreen = rootParams.rootModel.cancelAuthenticationScreen;
        self.instructions = ko.observableArray(self.locale.instructions.split(","));
        self.randomNumber = ko.observable(rootParams.rootModel.challenge.randomNumber);

        self.pageSectionHeader(self.locale.softTokenVerification);
        self.messageSection(self.locale.softTokenMessage);

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

        self.completeHOTP = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(self.invalidTracker())) {
                return;
            }

            const buildingResponseHeader = {};

            buildingResponseHeader.hotp = self.hotp();
            buildingResponseHeader.referenceNo = self.referenceNumber();
            rootParams.rootModel.submit2fa(buildingResponseHeader);
        };

        self.hotpShown = function() {
            $("#totp").bind("cut copy paste contextmenu", function(e) {
                e.preventDefault();
            });
        };
    };
});