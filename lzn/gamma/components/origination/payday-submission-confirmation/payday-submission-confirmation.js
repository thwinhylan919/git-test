define([

    "knockout",
    "jquery",
    "./model",
    "ojL10n!lzn/gamma/resources/nls/submission-confirmation"
], function(ko, $, SubmissionConfirmationModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);

        const getNewKoModel = function() {
            const KoModel = SubmissionConfirmationModel.getNewModel();

            return KoModel;
        };

        self.resource = resourceBundle;
        self.identification = self.productDetails().submissionId.value;
        self.identificationTypeAcc = self.accountId();
        self.applicationRefNo = self.appRefNo();
        self.isCoApplogin = ko.observable(false);
        self.validationTracker = ko.observable();
        self.validationEmailTracker = ko.observable();
        self.coAppRegSuccessful = ko.observable(false);
        self.dataLoaded = ko.observable(false);
        self.userCreationPayload = ko.observable(getNewKoModel().primary);

        self.switchModuleOnClick = function() {

            rootParams.dashboard.switchModule("home");
        };

        if (self.userData && self.userData.userProfile) {
            for (let i = 0; i < self.applicantDetails().length; i++) {
                if (self.userData.userProfile.partyId.value === self.applicantDetails()[i].applicantId().value) {
                    if (self.applicantDetails()[i].applicantRelationshipType === "CO_APPLICANT") {
                        self.isCoApplogin(true);
                    } else {
                        self.isCoApplogin(false);
                    }
                }
            }

            self.userCreationPayload().coApp = getNewKoModel().coApp;
            self.dataLoaded(true);
        }

        if (self.registrationCompulsory()) {
            $("#successfulRegistration").trigger("openModal");
        }

        self.registerCoAppUser = function() {
            const emailTracker = rootParams.baseModel.showComponentValidationErrors(self.validationEmailTracker()),
                tracker = rootParams.baseModel.showComponentValidationErrors(self.validationTracker());

            if (!tracker || !emailTracker) {
                return;
            }

            if (self.applicantDetails()[1].applicantType() === "customer" && self.applicantDetails()[1].channelUser() && (self.applicantDetails()[0].applicantType() === "anonymous" && !self.applicantDetails()[0].channelUser())) {
                if (self.isCoApplogin()) {
                    self.userCreationPayload().coApp.applicantId = self.applicantDetails()[0].applicantId();
                }
            } else {
                self.userCreationPayload().coApp.applicantId = self.applicantDetails()[1].applicantId();
            }

            self.userCreationPayload().coApp.submissionId.value = self.productDetails().submissionId.value;

            if (self.productDetails().applicationId) {
                self.userCreationPayload().coApp.applicationId = self.productDetails().applicationId;
            }

            SubmissionConfirmationModel.registerCoApp(JSON.stringify(self.userCreationPayload().coApp)).done(function() {
                self.coAppRegSuccessful(true);
            });
        };

        self.register = function() {
            rootParams.baseModel.switchPage({
                homeComponent: {
                    module: "application-tracking",
                    component: "application-tracking-base"
                },
                context: "index"
            }, true);
        };

        self.trackApplication = function() {
            if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
                rootParams.baseModel.switchPage({
                    homeComponent: {
                        module: "application-tracking",
                        component: "application-tracking-base"
                    },
                    context: "index"
                }, true);
            } else {
                SubmissionConfirmationModel.deleteSession().done(function() {
                    rootParams.baseModel.switchPage({
                        homeComponent: {
                            module: "application-tracking",
                            component: "application-tracking-base"
                        },
                        context: "index"
                    }, true);
                });
            }
        };

        self.registrationSuccessful = function() {
            if (self.registrationCompulsory()) {
                $("#successfulRegistration").trigger("openModal");
            }
        };
    };
});