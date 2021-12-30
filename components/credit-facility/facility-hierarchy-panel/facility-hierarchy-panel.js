define([
    "knockout",
    "ojL10n!resources/nls/facility-overview",
    "ojs/ojbutton",
    "ojs/ojnavigationlist",
    "ojs/ojvalidationgroup",
    "ojs/ojformlayout",
    "ojs/ojarraytabledatasource"

], function (ko, resourceBundle) {
    "use strict";

    return function (params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);

        self.nls = resourceBundle;
        self.loadTree = ko.observable(true);
        self.isIEBrowser=ko.observable(false);

        function isIE() {
            const ua = navigator.userAgent,
                is_ie = ua.indexOf("MSIE") > -1 || ua.indexOf("Trident/") > -1;

            return is_ie;
        }

        if (isIE()) {
            self.isIEBrowser(true);
        } else {
            self.isIEBrowser(false);
        }

    };
});
