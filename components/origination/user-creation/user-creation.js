define([

    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/origination/user-creation",
    "framework/js/plugins/encrypt",
    "ojs/ojinputtext",
    "ojs/ojcheckboxset",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation"
], function(ko, $, UserCreationModel, resourceBundle,Encrypt) {
    "use strict";

    return function(rootParams) {
        const self = this;
        let payload;

        ko.utils.extend(self, rootParams.rootModel);
        self.passwordRepeat = ko.observable();
        self.password = ko.observable();

        let allQuestionList = null;

        self.refresh = ko.observable(true);
        self.displaypasswordpolicy = ko.observable();
        self.confirmEmail = ko.observable();
        self.attemptsLeft = "3";
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
        self.disableEmail = ko.observable(false);
        self.disableDob = ko.observable(false);
    self.readTermAndConditions = ko.observable(false);
    self.skipSecurityQuestions = ko.observable("OPTION_YES");
    self.noOfQuesToConfigure = ko.observable();
        self.termsAndConditions = ko.observableArray();
        self.questionListMap = ko.observableArray();
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

    if (rootParams.baseModel.small() || rootParams.baseModel.medium()) {
      rootParams.dashboard.headerName(self.resource.headerName);
    }

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
                self.isEmailVerification(data.emailVerificationRequired);
            }
        });

        self.questionNumber = function(index) {
            return index + 1;
        };

        self.password.subscribe(function(value) {
            self.userCreationPayload().password = value;
        });

        let questionListCopy;

        UserCreationModel.fetchSecurityQuestionNumber().done(function(data) {
            self.noOfQuesToConfigure(data.noOfQuestions);

            for (let i = 0; i < self.noOfQuesToConfigure(); i++) {
                self.quesAnsPayload.userSecurityQuestionList.push({
                    questionId: null,
                    answer: null
                });
            }

            UserCreationModel.fetchSecurityQuestionList().done(function (data) {
              allQuestionList = data.secQueList[0].secQueMapping;
              questionListCopy = JSON.parse(JSON.stringify(data.secQueList[0].secQueMapping));

              for (let i = 0; i < self.quesAnsPayload.userSecurityQuestionList().length; i++) {
                const questionAvilableOptionsList = Object.assign([], allQuestionList);

                self.questionListMap().push({
                  questionId: ko.observable(),
                  questionList: ko.observableArray(questionAvilableOptionsList),
                  answer: ko.observable("")
                });
                }

              self.isQuestionListLoaded(true);
            });
          });

          self.valueChangeHandler = function (index, event) {
            if (event.detail.value && event.detail.trigger) {
              let questionRemovedFromMap = null;

              for (let j = 0; j < allQuestionList.length; j++) {
                if (event.detail.previousValue === allQuestionList[j].questionId) {
                  questionRemovedFromMap = allQuestionList[j];
                }
              }

              for (let i = 0; i < self.quesAnsPayload.userSecurityQuestionList().length; i++) {
                if (i !== index && ((event.detail.previousValue !== self.questionListMap()[i].questionId()) || !self.questionListMap()[i].questionId())) {
                  self.questionListMap()[i].questionList.remove(function (object) {
                    return object.questionId === event.detail.value;
                  });

                  if (questionRemovedFromMap) {
                    self.questionListMap()[i].questionList.push(questionRemovedFromMap);
                  }
                } else {
                  self.questionListMap()[i].questionId(event.detail.value);
                  self.questionListMap()[i].answer("");
                }
              }

              self.reload();
            }
          };

        if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
            if (self.queryMap && self.queryMap.regRefNo) {
                $("#alreadyRegistered").trigger("openModal");
                self.dataLoaded(false);

                return;
            }

            UserCreationModel.updateSubmissionForAlert(self.productDetails().submissionId.value);

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
                Encrypt(self.userCreationPayload().password).then(function(password){
                const payload = {
                    username: self.userCreationPayload().username,
                    password: password,
                    notificationId: self.queryMap.regRefNo
                };

                UserCreationModel.registerThroughLink(JSON.stringify(payload), payload.notificationId).done(function() {
                    self.isRegistered(true);
                    self.isConfirmRegister(true);
                });
            });
         }
            else {
                self.userCreationPayload().partyId = self.applicantDetails()[0].applicantId();
                self.userCreationPayload().submissionId = self.productDetails().submissionId.value;

                UserCreationModel.fetchApplicantList(self.productDetails().submissionId.value).done(function(data) {
                    self.userCreationPayload().partyId = data.applicants[0].applicantId.value;

                    Encrypt(self.userCreationPayload().password).then(function(password){
                        self.userCreationPayload().password=password[0];
                        self.register();

                    });
                });
            }
        };

        let refNoHeader;

        self.register = function() {
            if (!self.disableRegistration() && !refNoHeader) {
                UserCreationModel.register(JSON.stringify(self.userCreationPayload())).done(function(data, status, jqXhr) {
                    if (!self.registrationCompulsory()) {
                        UserCreationModel.updateSubmissionForAlert(self.productDetails().submissionId.value);
                    }

                    self.disableRegistration(true);

                    refNoHeader = jqXhr.getResponseHeader("X_OR_REFERENCE_NO");

                    self.loginFlowPost();

                });
            }
        };

        self.loginFlowPost = function() {
            const loginConfigPayload = {
                loginConfigId: "SETUP_SECURITY_QUESTIONS"
            };

            self.disableSecurityQuestions(true);
            loginConfigPayload.loginConfigId = "ACCEPT_TERMS_CONDS";

            const isCoappPresent = self.registrationCompulsory() && self.productDetails().requirements && self.productDetails().requirements.noOfCoApplicants < 1,
                isReqNotPresent = self.registrationCompulsory() && !self.productDetails().requirements;

            if (isCoappPresent || isReqNotPresent) {
                UserCreationModel.submitApplication(self.productDetails().submissionId.value).done(function(data) {
                    self.productDetails().sectionBeingEdited("");

                    if (data.submissionOutputDTO && data.submissionOutputDTO.applications && data.submissionOutputDTO.applications.length > 0 && data.submissionOutputDTO.applications[0].applicationId) {
                        self.productDetails().applicationId.value = data.submissionOutputDTO.applications[0].applicationId.value;
                        self.appRefNo(data.submissionOutputDTO.applications[0].applicationId.displayValue);
                        self.productDetails().applicationId.displayValue = data.submissionOutputDTO.applications[0].applicationId.displayValue;

                        if (data.submissionOutputDTO.applications[0].accountId && data.submissionOutputDTO.applications[0].accountId.value !== null) {
                            self.accountId(data.submissionOutputDTO.applications[0].accountId.displayValue);
                        }
                    }

                    if (self.disableFinalSubmitButton && ko.isObservable(self.disableFinalSubmitButton)) {
                        self.disableFinalSubmitButton(false);
                    }

                    self.getNextStage();
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

                        if (data.submissionOutputDTO && data.submissionOutputDTO.applications && data.submissionOutputDTO.applications.length > 0 && data.submissionOutputDTO.applications[0].applicationId) {
                            self.productDetails().applicationId.value = data.submissionOutputDTO.applications[0].applicationId.value;
                            self.productDetails().applicationId.displayValue = data.submissionOutputDTO.applications[0].applicationId.displayValue;

                            if (data.submissionOutputDTO.applications[0].accountId && data.submissionOutputDTO.applications[0].accountId.value !== null) {
                                self.accountId(data.submissionOutputDTO.applications[0].accountId.displayValue);
                                self.productflowComponent(true);
                            }

                            self.appRefNo(data.submissionOutputDTO.applications[0].applicationId.displayValue);

                            if (data.submissionOutputDTO.applications[0].applicationStatus) {
                                self.applicationStatus(data.submissionOutputDTO.applications[0].applicationStatus);
                            } else {
                                self.applicationStatus(data.submissionOutputDTO.applications[0].applicationStatus);
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
                    self.passwordRepeat("");
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

        self.updateEmailDob = ko.computed(function() {
            if (self.applicantDetails()[0].contactInfo) {
                if (self.userNameType() === "EMAIL") {
                    self.userCreationPayload().username = self.applicantDetails()[0].contactInfo.email();
                    $("#username1").val(self.userCreationPayload().username);
                }

                if (self.applicantDetails()[0].contactInfo.email && ko.isObservable(self.applicantDetails()[0].contactInfo.email) && self.applicantDetails()[0].contactInfo.email()) {
                    self.userCreationPayload().email = self.applicantDetails()[0].contactInfo.email();
                    self.disableEmail(true);
                }
            }

            if (self.applicantDetails()[0].primaryInfo && self.applicantDetails()[0].primaryInfo.primaryInfo && ko.isObservable(self.applicantDetails()[0].primaryInfo.primaryInfo.birthDate) && self.applicantDetails()[0].primaryInfo.primaryInfo.birthDate()) {
                self.userCreationPayload().birthDate = self.applicantDetails()[0].primaryInfo.primaryInfo.birthDate();
                self.disableDob(true);
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
                self.baseUrl("me/emailVerification/validateAndResend/" + self.queryMap.regRefNo);
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

        self.goToHomePage = function() {

            if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
                rootParams.dashboard.switchModule("home");
            } else {
                rootParams.dashboard.switchModule("home");
            }
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
                    homeComponent: "application-tracking-base",
                    homeModule: "application-tracking",
                    context: "index"
                }, true, true);
            } else {
                UserCreationModel.deleteSession().done(function() {
                    rootParams.baseModel.switchPage({
                        homeComponent: "application-tracking-base",
                        homeModule: "application-tracking",
                        context: "index"
                    }, true, true);
                });
            }
        };

        self.dispose = function() {
            self.updateEmailDob.dispose();
        };

        self.returnToApplication = function() {
            self.disableFinalSubmitButton(false);
            self.hidePluginComponent();
        };
    };
});