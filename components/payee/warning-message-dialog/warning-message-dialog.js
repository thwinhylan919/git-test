define([
    "knockout",
    "jquery",
    "ojL10n!resources/nls/warning-message-dialog",
    "ojs/ojbutton"
], function(ko, $, ResourceBundle) {
    "use strict";

    return function(Params) {
        const self = this;

        ko.utils.extend(self, Params.rootModel);

        self.payments = ResourceBundle.payments;
        Params.baseModel.registerElement("modal-window");

        self.yes = function() {
            $("#warningDialog").hide();
            history.back();
        };

        self.no = function() {
            $("#warningDialog").hide();
        };

        self.dispose = null;
    };
});