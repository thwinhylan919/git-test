define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/loan-application-listing-details-review",
    "text!./loan-application-listing-details-review.json",
    "ojs/ojknockout",
    "ojs/ojbutton",
    "ojs/ojaccordion",
    "ojs/ojanimation"
], function (oj, ko, $, resourceBundle, segmentsMap) {
    "use strict";

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        self.cardData = ko.observable(params.rootModel.params.data.cardItem);
        self.selectedParty = ko.observable(params.rootModel.params.data.selectedParty());
        self.productData = ko.observable(params.rootModel.params);
        params.dashboard.headerName(self.nls.heading);
        self.segmentsMap = JSON.parse(segmentsMap).segments;
        self.segmentName = JSON.parse(segmentsMap).segment;
        self.registered = ko.observable(false);

        function registerDataSegments() {

            self.productData().dataSegments.forEach(function (element) {
                if (self.segmentsMap[element]) {
                    params.baseModel.registerComponent(self.segmentsMap[element].id, "process-management");
                }
            });

            self.registered(true);
        }

        registerDataSegments();

        const panel = document.getElementById("panel"),
            initHeight = $(panel).css("height");

        self.buttonClick = function (id, event) {
            const segment = document.getElementById(id);

            if (segment.style.display === "block") {
                event.currentTarget.children[0].children[0].children[0].innerText = self.nls.showMore;

                oj.AnimationUtils.collapse(panel, {
                    endMaxHeight: initHeight
                }).then(function () {
                    segment.style.display = "none";
                });
            } else {
                segment.style.display = "block";
                event.currentTarget.children[0].children[0].children[0].innerText = self.nls.showLess;

                oj.AnimationUtils.expand(panel, {
                    startMaxHeight: initHeight
                });
            }
        };

        self.goBack = function () {
            const parameters = params.rootModel.params;

            params.dashboard.loadComponent("loan-application-listing-details", parameters);
        };

    };
});