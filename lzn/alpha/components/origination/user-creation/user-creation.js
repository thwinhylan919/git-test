define([

    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/origination/user-creation",
    "ojs/ojinputtext",
    "ojs/ojcheckboxset",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation"
], function(ko, $, UserCreationModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;
        let payload;

        ko.utils.extend(self, rootParams.rootModel);
        self.passwordRepeat = ko.observable();
        self.displaypasswordpolicy = ko.observable();
        self.confirmEmail = ko.observable();
        self.isConfirmRegister = ko.observable(false);
        self.isRegistered = ko.observable(false);
        self.userNameType = ko.observable();
        self.baseUrl = ko.observable();
        self.isCoApplogin = ko.observable(false);
        self.isEmailVerification = ko.observable(false);
        self.passwordPolicyLoaded = ko.observable(false);
        self.coAppRegSuccessful = ko.observable(false);
        self.disableSecurityQuestions = ko.observable(false);
        self.disableRegistration = ko.observable(false);
        self.readTermAndConditions = ko.observable(false);
        self.skipSecurityQuestions = ko.observable("OPTION_NO");
        self.noOfQuesToConfigure = ko.observable();
        self.termsAndConditions = ko.observableArray();
        self.questionListMap = {};
        self.questionSelectedMap = {};
        self.questionList = ko.observableArray();
        self.isQuestionListLoaded = ko.observable(false);
        self.validationEmailTracker = ko.observable();
        self.validationPwdTracker = ko.observable();
        self.validationTracker = ko.observable();

        if (self.productDetails().isRegistered) {
            self.isRegistered(true);
        }

        self.dataLoaded = ko.observable(true);

        /**
         * Function to get a new Knockout Specific model of User Creation
         * section.
         *
         * @function
         * @private
         * @memberOf UserCreationViewModel
         * @returns KoModel ~ KnockOut specific model.
         */
        const getNewKoModel = function() {
            const KoModel = UserCreationModel.getNewModel();

            return KoModel;
        };

        self.resource = resourceBundle;
        self.userCreationPayload = ko.observable(getNewKoModel().primary);
        self.quesAnsPayload = getNewKoModel().QuesAnsPayload;
        self.quesAnsPayload.userSecurityQuestionList = ko.observableArray([]);

        self.switchModuleOnClick = function() {

            rootParams.dashboard.switchModule("home", true);
        };

        UserCreationModel.fetchPasswordPolicy().done(function(data) {
            if (data) {
                const pwdProps = data.passwordPolicyDTO;
                let msg = "";

                msg = rootParams.baseModel.format(self.resource.passwordPolicy, {
                    pwdMinLength: pwdProps[0].pwdMinLength,
                    pwdMaxLength: pwdProps[0].pwdMaxLength,
                    nbrNumeric: pwdProps[0].nbrNumeric,
                    nbrUpperAlpha: pwdProps[0].nbrUpperAlpha,
                    nbrLowerAlpha: pwdProps[0].nbrLowerAlpha,
                    nbrSpecial: pwdProps[0].nbrSpecial,
                    specialAllowed: pwdProps[0].specialCharAllowed
                });

                msg = new DOMParser().parseFromString(msg, "text/html");
                self.displaypasswordpolicy(msg);
                self.passwordPolicyLoaded(true);
            }
        });

        UserCreationModel.fetchUserNameType().done(function(data) {
            self.userNameType(data.userNameType);

            if (self.userNameType() === "EMAIL") {
                self.isEmailVerification(data.isEmailVerificationRequired);
            }
        });

        self.questionNumber = function(index) {
            return index + 1;
        };

        let questionListCopy;

        UserCreationModel.fetchSecurityQuestionNumber().done(function(data) {
            self.noOfQuesToConfigure(data.noOfQuestions);

            for (let i = 0; i < self.noOfQuesToConfigure(); i++) {
                self.quesAnsPayload.userSecurityQuestionList.push({
                    questionId: null,
                    answer: null
                });
            }

            UserCreationModel.fetchSecurityQuestionList().done(function(data) {
                questionListCopy = JSON.parse(JSON.stringify(data.secQueList[0].secQueMapping));
                self.questionList(data.secQueList[0].secQueMapping);

                for (let i = 0; i < self.questionList().length; i++) {
                    self.questionListMap[self.questionList()[i].questionId] = self.questionList()[i].question;
                }

                self.isQuestionListLoaded(true);
            });
        });

        self.valueChangeHandler = function(event) {
            if (event.detail.value) {
                for (let i = 0; i < self.quesAnsPayload.userSecurityQuestionList().length; i++) {
                    if (self.quesAnsPayload.userSecurityQuestionList()[i].questionId !== null && event.detail.value === self.quesAnsPayload.userSecurityQuestionList()[i].questionId[0]) {
                        if (self.questionSelectedMap[i]) {
                            self.questionList.push({
                                questionId: self.questionSelectedMap[i],
                                question: self.questionListMap[self.questionSelectedMap[i]]
                            });

                            self.questionSelectedMap[i] = event.detail.value;
                        } else {
                            self.questionSelectedMap[i] = event.detail.value;
                        }

                        for (let j = 0; j < self.questionList().length; j++) {
                            if (event.detail.value === self.questionList()[j].questionId) {
                                self.questionList.splice(j, 1);
                            }
                        }
                    }
                }
            }
        };

        if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
            if (self.queryMap && self.queryMap.regRefNo) {
                $("#alreadyRegistered").trigger("openModal");
                self.dataLoaded(false);

                return;
            }

            for (let i = 0; i < self.applicantDetails().length; i++) {
                if (rootParams.dashboard.userData.userProfile.partyId.value === self.applicantDetails()[i].applicantId().value) {
                    if (self.applicantDetails()[i].applicantRelationshipType === "CO_APPLICANT") {
                        self.isCoApplogin(true);
                    } else {
                        self.isCoApplogin(false);
                    }
                }
            }

            self.userCreationPayload().coApp = getNewKoModel().coApp;
        } else if (self.queryMap && self.queryMap.regRefNo) {
            UserCreationModel.notificationSuccess(self.queryMap.regRefNo).fail(function() {
                self.dataLoaded(false);
            });
        }

        self.skipSecurityQuestionsChange = function(event, data) {
            if (data.value === "OPTION_NO" && self.quesAnsPayload.userSecurityQuestionList().length === 0) {
                for (let i = 0; i < self.noOfQuesToConfigure(); i++) {
                    self.quesAnsPayload.userSecurityQuestionList.push({
                        questionId: null,
                        answer: null
                    });
                }

                self.questionList(JSON.parse(JSON.stringify(questionListCopy)));
            }

            if (data.value === "OPTION_YES") {
                self.quesAnsPayload.userSecurityQuestionList([]);
            }
        };

        self.viewTermAndConditions = function() {
            $("#termsAndConditionsPopup").trigger("openModal");
            self.readTermAndConditions(true);
        };

        self.closeTermAndConditions = function() {
            $("#termsAndConditionsPopup").trigger("closeModal");
        };

        self.registerUser = function() {
            self.validationEmailTracker(document.getElementById("emailTracker"));
            self.validationPwdTracker(document.getElementById("pwdTracker"));
            self.validationTracker(document.getElementById("valTracker"));

            const emailTracker = rootParams.baseModel.showComponentValidationErrors(self.validationEmailTracker()),
                pwdTracker = rootParams.baseModel.showComponentValidationErrors(self.validationPwdTracker()),
                tracker = rootParams.baseModel.showComponentValidationErrors(self.validationTracker());

            if (!tracker || !emailTracker || !pwdTracker) {
                return;
            }

            if (!self.readTermAndConditions()) {
                $("#readtermsAndConditionsPopup").trigger("openModal");
                self.termsAndConditions([]);

                return;
            }

            if (self.queryMap && self.queryMap.regRefNo) {
                const payload = {
                    username: self.userCreationPayload().username,
                    password: self.userCreationPayload().password,
                    notificationId: self.queryMap.regRefNo
                };

                UserCreationModel.registerThroughLink(JSON.stringify(payload), payload.notificationId).done(function() {
                    self.isRegistered(true);
                    self.isConfirmRegister(true);
                });
            } else {
                self.userCreationPayload().partyId = self.applicantDetails()[0].applicantId();
                self.userCreationPayload().submissionId = self.productDetails().submissionId.value;
                self.register();
            }
        };

        let refNoHeader;

        self.register = function() {
            if (!self.disableRegistration() && !refNoHeader) {
                UserCreationModel.register(JSON.stringify(self.userCreationPayload())).done(function(data, status, jqXhr) {
                    self.disableRegistration(true);

                    if (self.skipSecurityQuestions() === "OPTION_NO") {
                        for (let i = 0; i < self.quesAnsPayload.userSecurityQuestionList().length; i++) {
                            self.quesAnsPayload.userSecurityQuestionList()[i].questionId = self.quesAnsPayload.userSecurityQuestionList()[i].questionId + "";

                            for (let j = i + 1; j < self.quesAnsPayload.userSecurityQuestionList().length; j++) {
                                self.quesAnsPayload.userSecurityQuestionList()[j].questionId = self.quesAnsPayload.userSecurityQuestionList()[j].questionId + "";

                                if (self.quesAnsPayload.userSecurityQuestionList()[i].questionId === self.quesAnsPayload.userSecurityQuestionList()[j].questionId) {
                                    rootParams.baseModel.showMessages(null, [self.resource.messages.duplicateQuestions], "INFO");

                                    return;
                                }
                            }
                        }
                    }

                    refNoHeader = jqXhr.getResponseHeader("X_OR_REFERENCE_NO");

                    if (self.skipSecurityQuestions() === "OPTION_NO") {
                        UserCreationModel.postSecurityQuestions(ko.toJSON(self.quesAnsPayload), refNoHeader).done(function() {
                            self.loginFlowPost(refNoHeader);
                        });
                    } else {
                        self.loginFlowPost(refNoHeader);
                    }
                });
            } else if (self.skipSecurityQuestions() === "OPTION_NO") {
                UserCreationModel.postSecurityQuestions(ko.toJSON(self.quesAnsPayload), refNoHeader).done(function() {
                    self.loginFlowPost(refNoHeader);
                });
            } else {
                self.loginFlowPost(refNoHeader);
            }
        };

        self.loginFlowPost = function(refNoHeader) {
            const loginConfigPayload = {
                loginConfigId: "SETUP_SECURITY_QUESTIONS"
            };

            UserCreationModel.createLoginConfig(JSON.stringify(loginConfigPayload), refNoHeader).done(function() {
                self.disableSecurityQuestions(true);
                loginConfigPayload.loginConfigId = "ACCEPT_TERMS_CONDS";

                UserCreationModel.createLoginConfig(JSON.stringify(loginConfigPayload), refNoHeader).done(function() {
                    const isCoappPresent = self.registrationCompulsory() && self.productDetails().requirements && self.productDetails().requirements.noOfCoApplicants < 1,
                        isReqNotPresent = self.registrationCompulsory() && !self.productDetails().requirements,
                        coappExisting = self.registrationCompulsory() && self.productDetails().requirements && self.productDetails().requirements.noOfCoApplicants > 0 && self.applicantDetails()[1].applicantType() === "customer",
                        isCreditCard = self.registrationCompulsory() && self.productDetails().productClassName === "CREDIT_CARD";

                    if (isCoappPresent || isReqNotPresent || coappExisting || isCreditCard) {
                        UserCreationModel.submitApplication(self.productDetails().submissionId.value).done(function(data) {
                            self.productDetails().sectionBeingEdited("");

                            if (data.applicationDetailsDTO[0].applicationId && data.applicationDetailsDTO[0].applicationId.value) {
                                self.productDetails().applicationId.value = data.applicationDetailsDTO[0].applicationId.value;
                                self.appRefNo(data.applicationDetailsDTO[0].applicationId.displayValue);
                                self.productDetails().applicationId.displayValue = data.applicationDetailsDTO[0].applicationId.displayValue;

                                if (data.applicationDetailsDTO[0].accountId && data.applicationDetailsDTO[0].accountId.value !== null) {
                                    self.accountId(data.applicationDetailsDTO[0].accountId.displayValue);
                                }
                            }

                            if (self.disableFinalSubmitButton && ko.isObservable(self.disableFinalSubmitButton)) {
                                self.disableFinalSubmitButton(false);
                            }

                            self.getApplications();
                            self.isConfirmRegister(true);
                            self.userCreationPayload().coApp = getNewKoModel().coApp;
                            self.productflowComponent(true);
                            self.isRegistered(true);
                            self.productDetails().isRegistered = true;
                        }).fail(function() {
                            self.productflowComponent(true);
                            self.isRegistered(true);
                            self.productDetails().isRegistered = true;

                            if (self.disableFinalSubmitButton && ko.isObservable(self.disableFinalSubmitButton)) {
                                self.disableFinalSubmitButton(false);
                            }
                        });
                    } else {
                        self.isRegistered(true);
                        self.productDetails().isRegistered = true;
                        self.isConfirmRegister(true);
                        self.userCreationPayload().coApp = getNewKoModel().coApp;
                    }
                });
            });
        };

        self.getApplications = function() {
            UserCreationModel.getApplications(self.productDetails().submissionId.value).done(function(data) {
                if (data.applications[0].applicationId) {
                    self.appRefNo(data.applications[0].applicationId.displayValue);

                    if (data.applications[0].applicationStatus) {
                        self.applicationStatus(data.applications[0].applicationStatus);
                    } else {
                        self.applicationStatus(data.applications[0].submissionStatus);
                    }

                    self.productflowComponent(true);
                    self.getNextStage();
                }
            });
        };

        self.registerCoAppUser = function() {
            self.validationEmailTracker(document.getElementById("emailTracker"));
            self.validationPwdTracker(document.getElementById("pwdTracker"));
            self.validationTracker(document.getElementById("valTracker"));

            const emailTracker = rootParams.baseModel.showComponentValidationErrors(self.validationEmailTracker()),
                pwdTracker = rootParams.baseModel.showComponentValidationErrors(self.validationPwdTracker()),
                tracker = rootParams.baseModel.showComponentValidationErrors(self.validationTracker());

            if (!tracker || !emailTracker || !pwdTracker) {
                return;
            }

            if ((self.applicantDetails()[1].applicantType() === "customer" && self.applicantDetails()[1].channelUser()) && (self.applicantDetails()[0].applicantType() === "anonymous" && !self.applicantDetails()[0].channelUser())) {
                if (self.isCoApplogin()) {
                    self.userCreationPayload().coApp.partyId = self.applicantDetails()[0].applicantId();
                }
            } else {
                self.userCreationPayload().coApp.partyId = self.applicantDetails()[1].applicantId();
            }

            self.userCreationPayload().coApp.submissionId.value = self.productDetails().submissionId.value;

            if (self.productDetails().applicationId && self.productDetails().applicationId.value) {
                self.userCreationPayload().coApp.applicationId.value = self.productDetails().applicationId.value;
            }

            UserCreationModel.registerCoApp(JSON.stringify(self.userCreationPayload().coApp)).done(function() {
                if (self.registrationCompulsory()) {
                    UserCreationModel.submitApplication(self.productDetails().submissionId.value).done(function(data) {
                        self.productDetails().sectionBeingEdited("");

                        if (data.applicationDetailsDTO[0].applicationId && data.applicationDetailsDTO[0].applicationId.value) {
                            self.productDetails().applicationId.value = data.applicationDetailsDTO[0].applicationId.value;
                            self.productDetails().applicationId.displayValue = data.applicationDetailsDTO[0].applicationId.displayValue;

                            if (data.applicationDetailsDTO[0].accountId && data.applicationDetailsDTO[0].accountId.value !== null) {
                                self.accountId(data.applicationDetailsDTO[0].accountId.displayValue);
                                self.productflowComponent(true);
                            }

                            self.appRefNo(data.applicationDetailsDTO[0].applicationId.displayValue);

                            if (data.applicationDetailsDTO[0].applicationStatus) {
                                self.applicationStatus(data.applicationDetailsDTO[0].applicationStatus);
                            } else {
                                self.applicationStatus(data.applicationDetailsDTO[0].submissionStatus);
                            }

                            self.productflowComponent(true);
                            self.getApplications();
                            self.productDetails().isRegistered = true;
                        } else {
                            self.getApplications();
                        }

                        self.coAppRegSuccessful(true);
                        self.userCreationPayload().coApp = getNewKoModel().coApp;
                        self.productflowComponent(true);
                    }).fail(function() {
                        self.productflowComponent(true);
                    });
                } else {
                    self.coAppRegSuccessful(true);
                }
            });
        };

        self.equalToPassword = {
            validate: function(value) {
                const compareTo = self.userCreationPayload().password;

                if (!value && !compareTo) {
                    return true;
                } else if (value !== compareTo) {
                    throw new Error(self.resource.messages.confirmPasswordMismatch);
                }

                return true;
            }
        };

        self.equalToEmail = {
            validate: function(value) {
                const compareTo = self.userCreationPayload().username;

                if (!value && !compareTo) {
                    return true;
                } else if (value !== compareTo) {
                    throw new Error(self.resource.messages.confirmEmailMismatch);
                }

                return true;
            }
        };

        self.updateEmail = ko.computed(function() {
            if (self.applicantDetails()[0].contactInfo) {
                self.userCreationPayload().username = self.applicantDetails()[0].contactInfo.email();
                $("#username1").val(self.userCreationPayload().username);
            }
        });

        self.otpDevice = ko.observable("");
        rootParams.baseModel.registerComponent("otp-verification", "base-components");

        self.verifyEmail = function() {
            self.validationEmailTracker(document.getElementById("emailTracker"));

            if (!rootParams.baseModel.showComponentValidationErrors(self.validationEmailTracker())) {
                return;
            }

            if (self.queryMap && self.queryMap.regRefNo) {
                self.baseUrl("registration/prospect/varificationCode/validateAndResend/" + self.queryMap.regRefNo);
            } else {
                self.baseUrl("me/emailVerification/validateAndResend/" + self.productDetails().submissionId.value);
            }

            if (self.queryMap && self.queryMap.regRefNo) {
                payload = {
                    email: self.userCreationPayload().username,
                    notificationId: self.queryMap.regRefNo
                };
            } else {
                payload = {
                    email: self.userCreationPayload().username,
                    submissionId: self.productDetails().submissionId.value
                };
            }

            if ($("#emailVerification").css("display") === "none") {
                UserCreationModel.verifyEmail(ko.toJSON(payload)).done(function() {
                    self.otpDevice("otpDevice4");
                    $("#emailVerification").trigger("openModal");
                });
            } else {
                $("#emailVerification").trigger("closeModal");
                $("#otpSuccess").trigger("openModal");
            }
        };

        const showPassword = function() {
                $("#pwd").prop({
                    type: "text"
                });
            },
            hidePassword = function() {
                $("#pwd").prop({
                    type: "password"
                });
            };

        self.showHide = function() {
            if (!self.pwshown()) {
                self.pwshown(true);
                showPassword();
            } else {
                self.pwshown(false);
                hidePassword();
            }
        };

        self.createMarketingConsentData = function(applicantId) {
            const marketingConsentData = {
                partyId: applicantId,
                emailContactAllowed: self.applicantDetails().primaryInfo.adConsent,
                smsContactAllowed: false,
                phoneContactAllowed: false,
                postalContactAllowed: self.applicantDetails().primaryInfo.adConsent,
                preferredFrequency: "MNT",
                informationSource: [{
                    sourceName: "In_the_Press",
                    sourceCode: "ITP"
                }]
            };

            return ko.toJSON(marketingConsentData);
        };

        /**
         * Function to start the application tracking - component.
         *
         * @function trackApplication
         * @memberOf UserCreationViewModel
         * @returns {void}
         */
        self.trackApplication = function() {
            if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
                rootParams.baseModel.switchPage({
                    homeComponent: {
                        module: "application-tracking",
                        component: "application-tracking-base",
                        query: {
                            context: "index"
                        }
                    }
                }, true, true);
            } else {
                UserCreationModel.deleteSession().done(function() {
                    rootParams.baseModel.switchPage({
                        homeComponent: {
                            module: "application-tracking",
                            component: "application-tracking-base",
                            query: {
                                context: "index"
                            }
                        }
                    }, true, true);
                });
            }
        };

        self.dispose = function() {
            self.updateEmail.dispose();
        };
    };
});