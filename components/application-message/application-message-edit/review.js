define([
    "knockout",
    "ojL10n!resources/nls/application-message-edit",
    "./model",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojbutton",
    "ojs/ojlabel"
], function (ko, resourceBundle, Model) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.componentHeader);
        self.reviewData = params.rootModel.params;
        self.confirm = params.rootModel.params.confirm;
        self.backReview = params.rootModel.params.backReview;
        self.showButtons = ko.observable(true);

        if (params.rootModel.transactionDetails) {
            self.localeLoaded = ko.observable(false);

            Model.enumerationslocaleget().then(function (response) {
                for (let i = 0; i < response.enumRepresentations[0].data.length; i++) {
                    if (self.reviewData.data.locale === response.enumRepresentations[0].data[i].code) {
                        self.reviewData.localeDescription = response.enumRepresentations[0].data[i].description;
                    }
                }

                self.localeLoaded(true);
            });

            self.showButtons(false);
        } else {
            self.localeLoaded = ko.observable(true);
        }
    };
});