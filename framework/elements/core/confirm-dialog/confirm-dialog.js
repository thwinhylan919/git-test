define([
    "jquery",
    "ojL10n!resources/nls/confirm-dialog",
    "ojs/ojbutton"
], function($, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.yes = function() {
            $("#confirm-dialog").trigger("closeModal");

            return rootParams.rootModel.switchModule();
        };

        self.no = function() {
            rootParams.rootModel.modalComponent(null);
        };

        self.resourceBundle = resourceBundle;

        self.showDialog = function() {
            $("#confirm-dialog").trigger("openModal");
        };

        $(document).keydown(function(event) {
            if (event.keyCode === 27) {
                event.preventDefault();
                self.no();
            }
        });
    };
});