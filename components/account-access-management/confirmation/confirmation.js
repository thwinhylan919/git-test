define([
    "knockout",
    "jquery",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "promise"
], function(ko, $) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.isHideDetailsTrue = ko.observable(rootParams.hideDetails);
        self.showConfirmationDialog = ko.observable(true);

        self.hideConfirmationPanel = function() {
            $("#confirmCancellationScreen").hide();
        };

        self.confirmCancellation = function() {
            if (self.isHideDetailsTrue()) {
                rootParams.dashboard.hideDetails();
            } else {
                rootParams.dashboard.switchModule();
            }

            self.editButtonPressed(false);
        };
    };
});