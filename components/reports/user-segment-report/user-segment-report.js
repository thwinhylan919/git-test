define([

    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/user-segment-report",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox"
], function(ko, $, userSegmentModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle.userSegment;
        self.validationTracker = rootParams.validationTracker;
        self.isEnterpriseRolesLoaded = ko.observable(false);
        self.enterpriseRoles = ko.observableArray();
        self.segments = ko.observableArray();
        self.isUserSegmentsLoaded = ko.observable(false);
        self.selectedActivity = ko.observable([]);

        userSegmentModel.fetchEnumeration().done(function(data) {
            self.enterpriseRoles(data.enterpriseRoleDTOs);
            self.isEnterpriseRolesLoaded(true);
        });

        userSegmentModel.fetchSegments().done(function(data) {
            self.segments(data.segmentdtos);
            self.isUserSegmentsLoaded(true);
        });

        self.userTypeSelected = function(event) {
            if (event.detail.value) {
                $("#userType").val(event.detail.value);
            }
        };

        self.userSegmentsSelected = function(event) {
            if (event.detail.value) {
                $("#userSegments").val(event.detail.value);
            }
        };
    };
});