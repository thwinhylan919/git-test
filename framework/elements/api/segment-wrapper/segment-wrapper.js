define(["knockout",
    "jquery",
    "ojL10n!resources/nls/segment-wrapper",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojbutton",
    "ojs/ojinputtext",
    "ojs/ojlabel"
], function (ko, $, resourceBundle) {
    "use strict";

    return function (params) {

        const self = this;

        self.nls = resourceBundle;
        self.back = params.rootModel.params.back;
        self.productData = ko.observable(params.rootModel.params.productData);
        self.currentSegment = ko.observable(params.rootModel.params.currentSegment);
        self.selectedParty = ko.observable(params.rootModel.params.selectedParty);
        params.dashboard.headerName(params.rootModel.params.pageHeader);
        self.productData().draftName = ko.observable();
        self.review = params.rootModel.params.review;
        self.iconMap = params.rootModel.params.iconMap;
        self.successHandler = {};
        self.refreshStatus = ko.observable(true);

        self.segmentChangeHandler = function (event) {
            if (event.detail.trigger === "option_selected") {
                params.baseModel.registerComponent(event.detail.value.id, self.productData().module);
                self.currentSegment(event.detail.value);
                self.currentSegment().status = "inProgress";
            }

            self.refreshStatus(false);
            ko.tasks.runEarly();
            self.refreshStatus(true);
        };

        self.continue = function () {
            self.successHandler().then(function (data) {
                params.rootModel.params.loadNextSegment(self);
                self.refreshStatus(false);
                ko.tasks.runEarly();
                self.refreshStatus(true);
            });
        };

        self.saveAsDraft = function () {
            $("#draftModal").trigger("closeModal");
            params.rootModel.params.saveAsDraft();
        };

        self.openDraftModal = function () {
            $("#draftModal").trigger("openModal");
        };

        self.cancel = function () {
            $("#draftModal").hide();
        };

        self.saveAndReview = function () {
            self.successHandler().then(function (data) {
                params.rootModel.params.saveAndReview();
            });
        };

        self.draftValidate = function () {
            const tracker = document.getElementById("draftTracker");

            if (tracker.valid === "valid") {
                self.saveAsDraft();
            } else {
                tracker.showMessages();
                tracker.focusOn("@firstInvalidShown");
            }
        };
    };
});