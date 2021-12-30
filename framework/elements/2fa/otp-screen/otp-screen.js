define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/otp-screen",
    "./model",
    "ojs/ojbutton",
    "ojs/ojinputtext",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup"
], function (ko, $, locale, OTPModel) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.locale = locale;
        self.referenceNumber = ko.observable(rootParams.rootModel.challenge.referenceNo);
        self.scopeType = ko.observable(rootParams.rootModel.challenge.scope);
        self.otpSent = ko.observable();

        self.otp = ko.observable();
        self.messageSection = ko.observable();
        self.pageSectionHeader = ko.observable();
        self.attemptsLeft = ko.observable(rootParams.rootModel.challenge.attemptsLeft);
        self.resendsLeft = rootParams.rootModel.challenge.resendsLeft;
        self.resentMsg = ko.observable(false);
        self.multipleInput = ko.observableArray();
        self.disableReferenceNumber = ko.observable(true);
        self.editReferenceNo = ko.observable(false);
        self.togglePassword = rootParams.rootModel.togglePassword;
        self.validationTracker = ko.observable();
        self.cancelAuthenticationScreen = rootParams.rootModel.cancelAuthenticationScreen;
        self.validationTrackerID = "validationTrackerID" + rootParams.baseModel.incrementIdCount();

        self.editReferenceNo.subscribe(function (newValue) {
            if (newValue) {
                self.disableReferenceNumber(false);
            } else {
                self.disableReferenceNumber(true);
            }
        });

        self.closeDialog = function(){
            $("#success-container").fadeOut("slow");
        };

        self.editTheReferenceNo = function () {
            if (self.editReferenceNo() === "true") {
                self.disableReferenceNumber(false);
            } else {
                self.disableReferenceNumber(true);
            }
        };

        if (self.scopeType() === "USER") {
            self.editReferenceNo(false);
        }

        if (rootParams.baseModel.cordovaDevice() === "ANDROID") {
            window.OTPAutoVerification.startOTPListener({
                delimiter: "otp:",
                length: 10
            }, function (result) {
                self.otp(result);
                window.OTPAutoVerification.stopOTPListener();
            }, function () {
                window.OTPAutoVerification.stopOTPListener();
            });
        }

        self.pageSectionHeader(self.locale.otpPageSection);
        self.messageSection(self.locale.message);

        self.completeOTP = function () {

            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById(self.validationTrackerID))) {
                return;
            }

            const buildingResponseHeader = {};

            buildingResponseHeader.otp = self.otp();
            buildingResponseHeader.referenceNo = self.referenceNumber();
            rootParams.rootModel.submit2fa(buildingResponseHeader);
        };

        self.disableResend = self.resendsLeft ? ko.observable(true) : ko.observable(false);

        self.reOTP = function () {
            self.otpSent(false);

            OTPModel.resendOTP(self.referenceNumber()).done(function () {
                self.resendsLeft = self.resendsLeft - 1;
                self.otpSent(true);

                if (!self.resendsLeft) {
                    self.disableResend(false);
                }
            });
        };

        self.otpShown = function () {
            $("#otp").bind("cut copy paste contextmenu", function (e) {
                e.preventDefault();
            });
        };
    };
});