define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/facility-application",
    "ojL10n!resources/nls/amend-facility",
    "./model",
    "ojs/ojbutton",
    "ojs/ojnavigationlist", "ojs/ojformlayout", "ojs/ojlistview", "ojs/ojtreeview",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojflattenedtreetabledatasource",
    "ojs/ojflattenedtreedatagriddatasource",
    "ojs/ojjsontreedatasource",
    "ojs/ojarraydataprovider",
    "ojs/ojprogress",
    "ojs/ojlistview"
], function(oj, ko, $, resourceBundle, collateralResourceBundle, ViewApplicationModel) {
    "use strict";

    return function(params) {
        const self = this;

        self.isFlow = ko.observable(false);
        self.loadComponentName = ko.observable();

        self.resourceBundle = resourceBundle;
        self.collateralResourceBundle = collateralResourceBundle;
        params.baseModel.registerComponent("details-screen", "process-management");

        params.baseModel.registerComponent("collateral-evaluation-details", "credit-facility");
        params.baseModel.registerComponent("collateral-evaluation-ownership-details", "credit-facility");
        params.baseModel.registerComponent("collateral-evaluation-seniority-details", "credit-facility");
        params.baseModel.registerComponent("collateral-evaluation-documents-upload", "credit-facility");

        ko.utils.extend(self, params.rootModel.params);

        if (self.type === "Facility Amendment" || self.type === "New Facility Application") {
            params.dashboard.headerName(self.resourceBundle.viewFacilitySubmittedApplication);
        } else {
            params.dashboard.headerName(self.resourceBundle.viewColateralSubmittedApplication);
        }

        self.dataLoaded = ko.observable(false);

        self.partyName = ko.observable();

        ViewApplicationModel.fetchParty().done(function(data) {
            self.partyName(data.party.personalDetails.fullName);
        });

        if (self.mode && self.mode === "approval") {
            self.payload = self.data;

            if (self.payload.collateralDetails && self.payload.collateralDetails.length > 0) {
                self.newCollateralsDataSource = new oj.ArrayTableDataSource(self.data.collateralDetails);
            }

            if (self.payload && self.payload.childFacilities.length > 0) {
                self.datasource = new oj.ArrayTableDataSource(self.data.childFacilities, { idAttribute: "facilityType" });
            }
        } else {
            if (self.payload && self.payload.collateralDetails) {
                self.newCollateralsDataSource = new oj.ArrayTableDataSource(self.payload.collateralDetails, { idAttribute: "collateralDesc" });
            } else {
                self.newCollateralsDataSource = new oj.ArrayTableDataSource([]);
            }

            if (self.type === "New Facility Application" && self.payload.childFacilities) {
                self.datasource = new oj.ArrayTableDataSource(self.payload.childFacilities, { idAttribute: "facilityType" });
            }

        }

        if (self.type === "Facility Amendment") {
            ViewApplicationModel.fetchLiabilityId().done(function(data) {

                ViewApplicationModel.getFacilityDetails(data.liabilitydtos[0].id, self.payload.lineCode + (self.payload.lineSerialNumber ? self.payload.lineSerialNumber : "_1")).done(function(data) {
                    self.facilityData = ko.observable(data.facilityDTO);
                    self.dataLoaded(true);
                });

            });

        }

        if (self.type === "New Facility Application" || self.type === "Facility Amendment") {
            self.stages = [{
                    templateHeading: self.resourceBundle.heading.FacilityRequirements,
                    templateName: "credit-facility/facility-details"
                },
                {
                    templateHeading: self.collateralResourceBundle.AmendFacility.collateralApplicationSummary,
                    templateName: "credit-facility/collateral-details"
                },
                {
                    templateHeading: self.resourceBundle.heading.UploadDocs,
                    templateName: "credit-facility/uploaded-documents"
                }
            ];
        } else if (self.type === "Collateral Evaluation") {
            self.stages = [{
                    componentHeading: self.collateralResourceBundle.heading.collateralEvaluationDetails,
                    componentName: "collateral-evaluation-details"
                },
                {
                    componentHeading: self.collateralResourceBundle.heading.collateralEvaluationOwnershipDetails,
                    componentName: "collateral-evaluation-ownership-details"
                },
                {
                    componentHeading: self.collateralResourceBundle.heading.collateralEvaluationSeniorityDetails,
                    componentName: "collateral-evaluation-seniority-details"
                },
                {
                    componentHeading: self.resourceBundle.heading.UploadDocs,
                    componentName: "collateral-evaluation-documents-upload"
                }
            ];
        } else if (self.type === "Collateral Revaluation") {
            self.loadComponentName("collateral-revaluation-flow");
            self.isFlow(true);
        }

        const panel = document.getElementById("panel"),
            initHeight = $(panel).css("height");

        self.buttonClick = function(id, event) {
            const segment = document.getElementById(id);

            if (segment.style.display === "block") {
                // Call the collapse method, then hide the extra content when animation ends.
                event.currentTarget.children[0].children[0].children[0].innerText = self.resourceBundle.showMore;

                oj.AnimationUtils.collapse(panel, {
                    endMaxHeight: initHeight
                }).then(function() {
                    segment.style.display = "none";
                });
            } else {
                // Mark the extra content to be displayed, followed by a call to the expand method.
                segment.style.display = "block";
                event.currentTarget.children[0].children[0].children[0].innerText = self.resourceBundle.showLess;

                oj.AnimationUtils.expand(panel, {
                    startMaxHeight: initHeight
                });
            }
        };

        self.datasourceNewCreate = function(data, payload) {
            self.datasourceNew = new oj.ArrayTableDataSource(payload.childFacilities, { idAttribute: "facilityType" });

            return self.datasourceNew;
        };

        self.calculateYears = function(data) {
            const one_day = 1000 * 60 * 60 * 24,
                diff = new Date(data.expiryDate.sqlDate ? data.expiryDate.sqlDate : data.expiryDate).getTime() - new Date(data.lineStartDate.sqlDate ? data.lineStartDate.sqlDate : data.lineStartDate).getTime(),
                days = Math.round(diff / one_day);

            return Math.floor(days / 365);
        };

        self.calculateMonths = function(data) {
            const one_day = 1000 * 60 * 60 * 24,
                diff = new Date(data.expiryDate.sqlDate ? data.expiryDate.sqlDate : data.expiryDate).getTime() - new Date(data.lineStartDate.sqlDate ? data.lineStartDate.sqlDate : data.lineStartDate).getTime(),
                days = Math.floor(diff / one_day);

            return Math.floor((days % 365) / 30);
        };

        self.calculateProgress = function() {
            return Math.round(((self.facilityData().utilizedAmount.amount / self.facilityData().effectiveAmount.amount) * 100) * 100) / 100;
        };
    };
});