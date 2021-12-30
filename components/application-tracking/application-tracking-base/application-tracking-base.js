define([

    "knockout",

    "./model",
    "framework/js/constants/constants",

    "ojL10n!resources/nls/application-tracking-base",
    "ojs/ojknockout-validation"
], function(ko, ApplicationTrackingBaseModel, Constants, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.dataLoaded = ko.observable(false);
        ko.utils.extend(self, rootParams.rootModel);
        ko.utils.extend(self, rootParams.dashboard.userData, rootParams);
        self.dataLoaded(true);
        self.resource = resourceBundle;
        self.accordionNames = resourceBundle;

        rootParams.dashboard.headerName(self.resource.landingtext);

        self.initQueryMap = function(root) {
            self.applicationArguments = root.applicationArguments;
        };

        let sessionStorageData;

        if (self.applicationArguments) {
            sessionStorageData = self.applicationArguments;
        } else {
            sessionStorageData = self.sessionStorageData;
        }

        if (sessionStorageData) {
            if (sessionStorageData.loginRedirection) {
                if (JSON.parse(sessionStorageData.loginRedirection)) {
                    if (sessionStorageData.productType === "PAYDAY") {
                        rootParams.baseModel.registerComponent("product", "payday");
                        rootParams.dashboard.switchModule("payday", true);
                    } else if (sessionStorageData.productType === "AUTOLOANFLL") {
                        rootParams.baseModel.registerComponent("product", "payday");
                        rootParams.dashboard.switchModule("payday", true);
                    } else {
                        rootParams.dashboard.switchModule("origination", true);
                    }
                }
            }
        }

        self.productHeaderImage = ko.observable("my-applications");
        self.productClassName = ko.observable();
        self.productSubClassName = ko.observable();
        self.typeApplication = ko.observable();
        self.applicantId = ko.observable(rootParams.dashboard.userData.userProfile.partyId);
        self.headingText = ko.observable(self.resource.myApplications);
        self.trackApplicationComponentName = ko.observable();
        self.productTrackingComponentName = ko.observable("application-dashboard");
        self.submissionsLoaded = ko.observable(false);
        self.applicationSummary = ko.observable({});
        self.applicationStatusStringMap = ko.observable("");
        self.submissionStatusStringMap = ko.observable("");

        self.applicationInfo = ko.observable({
            currentSubmissionId: ko.observable(),
            currentApplicationId: ko.observable(),
            currentApplicationIdDisplayValue: ko.observable(),
            currentApplicationProgress: ko.observable(),
            currentApplicationStatus: ko.observable(),
            currentSubmissionStatus: ko.observable(),
            currentApplicationStatusDesc: ko.observable(),
            currentOfferDesc: ko.observable(),
            productType: ko.observable(),
            submissionDate: ko.observable(),
            remarks: ko.observable()
        });

        self.currentUser = ko.observable("");
        self.appComponents = ko.observable([]);
        self.appDetails = ko.observable();
        self.isSummaryLoaded = ko.observable(false);
        self.isSummaryResponse = ko.observable(false);
        self.applicationData = ko.observable({});
        self.setProductCode = ko.observable();
        self.fetchedProductFlow = ko.observable(false);
        self.submissionIdList = ko.observableArray();
        self.label = ko.observable();
        self.label = self.headingText;

        self.homePage = ko.observable(false);
        self.userProfileLoaded = ko.observable(false);
        self.userLoggedIn = ko.observable(false);
        self.userProfile = ko.observable();
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("modal-window");

        self.toCleanJson = function(input) {
            return ko.toJSON(input, function(key, value) {
                if (value === null || value === undefined) {
                    return false;
                } else if (key) {
                    if (!key.replace(/^temp_.*/g, "") || key === "selectedValues") {
                        return false;
                    }

                    return value;
                }

                return value;
            });
        };

        self.findApplicationValue = function(code) {
            let index;

            for (index = 0; index < self.applicationStatusStringMap().length; index++) {
                if (self.applicationStatusStringMap()[index].code === code) {
                    return self.applicationStatusStringMap()[index].description;
                }
            }

            return self.resource.processing;
        };

        self.findSubmissionValue = function(code) {
            let index;

            for (index = 0; index < self.submissionStatusStringMap().length; index++) {
                if (self.submissionStatusStringMap()[index].code === code) {
                    return self.submissionStatusStringMap()[index].description;
                }
            }

            return self.resource.processing;
        };

        self.successHandlerApplicationStatus = function(data) {
            self.applicationStatusStringMap(data.enumRepresentations[0].data);
            ApplicationTrackingBaseModel.fetchSubmissionIdList(self.successHandlerSubmissionList);
        };

        self.successHandlerAppStages = function(data) {
            self.applicationSummary().progress = data.overAllProgress;
        };

        self.clickBackButton = function() {
            switch (self.trackApplicationComponentName()) {
                case "product-tracking-base":
                    ApplicationTrackingBaseModel.fetchApplicationStages(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId(), self.successHandlerAppStages);

                    if (self.productTrackingComponentName() !== "application-dashboard") {
                        self.productTrackingComponentName("application-dashboard");

                        return;
                    }

                    self.trackApplicationComponentName("application-list");
                    self.headingText(self.resource.myApplications);
                    break;
                default:
                    history.back();
                    break;
            }
        };

        self.changePage = function(params) {
            if (params) {
                let index = 0;
                const pgs = self.appComponents();

                for (index = 0; index < pgs.length; index++) {
                    if (pgs[index] === params.page) {
                        self.trackApplicationComponentName(pgs[index]);
                        break;
                    }
                }
            }
        };

        self.getPageChanged = function(params) {
            if (params) {
                let index = 0;
                const pgs = self.appComponents();

                for (index = 0; index < pgs.length; index++) {
                    if (pgs[index] === params) {
                        self.trackApplicationComponentName(pgs[index]);
                        break;
                    }
                }
            }
        };

        self.setCurrentStage = function(id) {
            for (let i = 0; i < self.applicationData().trackerStages.length; i++) {
                if (self.applicationData().trackerStages[i].id === id && !self.applicationData().trackerStages[i].isLastStage) {
                    self.applicationData().currentStage = self.applicationData().trackerStages[i + 1].id;

                    return;
                }
            }
        };

        self.getNextStage = function() {
            rootParams.baseModel.registerComponent(self.applicationData().currentStage, "application-tracking");
            rootParams.baseModel.registerElement("page-section");
            rootParams.baseModel.registerElement("row");
            self.trackApplicationComponentName(self.applicationData().currentStage);
            self.appComponents().push(self.trackApplicationComponentName());
            self.setCurrentStage(self.applicationData().currentStage);
        };

        self.applyPattern = function(input, pattern, position) {
            let x = input,
                output = "";

            if (x.length > pattern[position] && position < pattern.length) {
                x = x.substr(pattern[position]);
                output = self.applyPattern(x, pattern, position + 1);
                output = input.substr(0, pattern[position]) + "-" + output;

                return output;
            }

            output += x;

            return output;
        };

        self.maskValue = function(val, len) {
            const a = val.substring(0, len);

            return a.replace(/\d/g, "x") + val.substring(len);
        };

        self.goToHomePage = function() {
            rootParams.dashboard.switchModule("home");
        };

        self.returnToTracker = function() {
            rootParams.baseModel.switchPage({
                homeComponent: "application-tracking-base",
                homeModule: "application-tracking",
                context: "index"
            }, true);
        };

        document.body.style.backgroundImage = "url(" + Constants.imageResourcePath + "/origination/BG" + (rootParams.baseModel.medium() ? "/medium/" : "/") + self.productHeaderImage() + ".jpg)";

        if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
            self.userProfile(rootParams.dashboard.userData.userProfile);
            self.userLoggedIn(true);
            self.userProfileLoaded(true);

            ApplicationTrackingBaseModel.fetchApplicationStatusStringMap().then(function(data) {
                self.applicationStatusStringMap(data.enumRepresentations[0].data);

                ApplicationTrackingBaseModel.fetchSubmissionIdList().then(function(data) {
                    if (data.submissions) {
                        for (let i = 0; i < data.submissions.length; i++) {
                            if (data.submissions[i].submissionStatus !== "SUBMISSION_CANCELLED" && data.submissions[i].submissionStatus !== "SUBMISSION_WITHDRAWN") {
                                self.submissionIdList().push(data.submissions[i]);
                            }
                        }
                    }

                    rootParams.baseModel.registerComponent("application-list", "application-tracking");
                    self.trackApplicationComponentName("application-list");
                    self.submissionsLoaded(true);
                });
            });

            ApplicationTrackingBaseModel.fetchSubmissionStatusStringMap().then(function(data) {
                self.submissionStatusStringMap(data.enumRepresentations[0].data);
            });
        }
    };
});