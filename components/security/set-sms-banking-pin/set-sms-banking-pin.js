define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/set-sms-banking-pin",
    "./model",
    "ojs/ojbutton",
    "ojs/ojvalidation",
    "ojs/ojinputtext"
], function(ko, $, ResourceBundle, Model) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.commonResource = ResourceBundle;
        rootParams.dashboard.headerName(self.resource.header);
        self.maxlength = self.maxlength || ko.observable(4);
        self.setPin = ko.observable();
        self.confirmPin = ko.observable();
        self.invalidTracker = ko.observable();
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("confirm-screen");

        $("#setPin").ready(function() {
            $("#setPin").find(".input").attr("type", "tel");
        });

        /**
         *THis is the click handler to call success popup
         *@function showSucccess
         *@return {void}.
         */
        self.showSucccess = function() {
            $("#successPinSetup").trigger("openModal");
        };

        /**
         *THis is the click handler for the ok button of the succes popup
         *@function hideWarning
         *@return {void}.
         */
        self.hideWarning = function() {
            $("#successPinSetup").hide();
            rootParams.dashboard.switchModule();
        };

        /**
         *THis is a click handler for confirm button
         *@function setPinProceed
         *@return {void}.
         */
        self.setPinProceed = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(self.invalidTracker())) {
                return;
            }

            if (self.setPin() === self.confirmPin()) {
                let payload = {
                    pin: self.setPin()
                };

                payload = ko.mapping.toJSON(payload);

                Model.smsbankingpinRegistration(payload).then(function() {
                    self.showSucccess();
                });
            } else {
                rootParams.baseModel.showMessages(null, [self.resource.pinDidntMatch], "ERROR");
            }
        };

        /**
         *THis function navigates backs
         *@function back
         *@return {void}.
         */
        self.back = function() {
            rootParams.dashboard.hideDetails();
        };
    };
});