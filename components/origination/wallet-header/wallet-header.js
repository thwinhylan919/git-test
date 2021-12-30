define([
    "knockout",
    "ojs/ojknockout",
    "knockout-helper",
    "ojs/ojbutton",
    "ojs/ojmenu"
], function(ko) {
    "use strict";

    return function(params) {
        const self = this;

        ko.utils.extend(self, params.rootModel);

        if (!(self.resource.pageTitle.login === "pageTitle.login")) {
            self.label(self.resource.pageTitle.login);
        }
    };
});