define([
        "knockout",
        "./model",
        "jquery",
        "ojL10n!resources/nls/registration",
        "ojs/ojcore",
        "ojs/ojinputtext",
        "ojs/ojdatetimepicker",
        "ojs/ojcheckboxset",
        "ojs/ojselectcombobox",
        "ojs/ojdatetimepicker",
        "ojs/ojvalidation",
        "ojs/ojvalidationgroup",
        "ojs/ojknockout-validation",
        "ojs/ojdialog"
    ],
    function(ko, UserCredentialModel,$, resourceBundle, oj) {
        "use strict";

        return function(rootParams) {
            const self = this;

            ko.utils.extend(self, rootParams.rootModel);
            self.response = ko.observable();
            self.nls = resourceBundle;
            self.accountEnumLoaded = ko.observable(false);
            self.validationTracker = ko.observable();
            self.agreement = ko.observableArray();

            const today = rootParams.baseModel.getDate(),
                currentYear = today.getFullYear();

            self.accountEnumList = ko.observableArray();
            rootParams.dashboard.headerName(self.nls.registration.headerName);
            self.headerMessages = ko.observableArray();
            self.emailDispatched = ko.observable(false);

            self.headerMessages.push({
                icon: "dashboard/confirmation.svg",
                headerMessage: self.nls.registration.header.success,
                summaryMessage: self.nls.registration.messages.summaryMessage,
                headerStyle: "successHeader"
            });

            self.monthEnumList = ko.observableArray([{
                    code: "01",
                    description: "01"
                },
                {
                    code: "02",
                    description: "02"
                },
                {
                    code: "03",
                    description: "03"
                },
                {
                    code: "04",
                    description: "04"
                },
                {
                    code: "05",
                    description: "05"
                },
                {
                    code: "06",
                    description: "06"
                },
                {
                    code: "07",
                    description: "07"
                },
                {
                    code: "08",
                    description: "08"
                },
                {
                    code: "09",
                    description: "09"
                },
                {
                    code: "10",
                    description: "10"
                },
                {
                    code: "11",
                    description: "11"
                },
                {
                    code: "12",
                    description: "12"
                }
            ]);

            self.yearEnumList = ko.observableArray([{
                    code: currentYear,
                    description: currentYear
                },
                {
                    code: currentYear + 1,
                    description: currentYear + 1
                },
                {
                    code: currentYear + 2,
                    description: currentYear + 2
                },
                {
                    code: currentYear + 3,
                    description: currentYear + 3
                },
                {
                    code: currentYear + 4,
                    description: currentYear + 4
                },
                {
                    code: currentYear + 5,
                    description: currentYear + 5
                }
            ]);

            rootParams.baseModel.registerElement("internal-account-input");
            rootParams.baseModel.registerComponent("otp-verification", "base-components");
            rootParams.baseModel.registerComponent("user-creation", "registration");
            self.accountType = ko.observable("CSA");
            self.accountNumber = ko.observable(null);
            self.userCredentials = ko.observable(true);
            self.verification = ko.observable(false);
            self.clickedCreditCard = ko.observable(false);
            self.clickedTermDeposit = ko.observable(false);
            self.clickedDemandDeposit = ko.observable(false);
            self.clickedLoanAccount = ko.observable(false);
            self.expiryMonth = ko.observable("01");
            self.expiryYear = ko.observable();
            self.invalidTracker = ko.observable();
            self.message = ko.observable();
            self.minYear = ko.observable();
            self.minMonth = ko.observable();
            self.minYear = currentYear;
            self.minMonth = 1;
            self.attemptsLeft="";

            UserCredentialModel.getAccounts().done(function(data) {
                self.accountEnumList(data.enumRepresentations[0].data);
                self.accountEnumLoaded(true);
                self.clickedDemandDeposit(true);
            });

            const getNewKoModel = function() {
                const KoModel = UserCredentialModel.getNewModel();

                return KoModel;
            };

            self.openListener = function() {
               $("#termsConditions").css("display","block");
            };

            self.startAnimationListener = function(event) {
                const ui = event.detail;

                if (event.target.id !== "popup1") {
                    return;
                }

                if (ui.action === "open") {
                    event.preventDefault();

                    const options = {
                        direction: "top"
                    };

                    oj.AnimationUtils.slideIn(ui.element, options).then(ui.endCallback);
                } else if (ui.action === "close") {
                    event.preventDefault();
                    ui.endCallback();
                }
            };

            self.cancelListener = function() {
                $("#termsConditions").css("display","none");
            };

            self.signUpButton = ko.observable(true);

            self.enableSignUp = function(event) {
                const enableSignUp = self.signUpButton();

                if (event.detail.value.toString() === "true") {
                    self.signUpButton(!enableSignUp);
                } else {
                    self.signUpButton(true);
                }
            };

            self.payload = ko.observable(getNewKoModel());

            self.optionChangedHandler = function(event) {
                if (event.detail.value === "LON") {
                    self.resetPayload();
                    self.clickedLoanAccount(true);
                    self.clickedTermDeposit(false);
                    self.clickedCreditCard(false);
                    self.clickedDemandDeposit(false);
                }

                if (event.detail.value === "CCA") {
                    self.resetPayload();
                    self.clickedLoanAccount(false);
                    self.clickedTermDeposit(false);
                    self.clickedCreditCard(true);
                    self.clickedDemandDeposit(false);
                }

                if (event.detail.value === "CSA") {
                    self.resetPayload();
                    self.clickedLoanAccount(false);
                    self.clickedTermDeposit(false);
                    self.clickedCreditCard(false);
                    self.clickedDemandDeposit(true);
                }

                if (event.detail.value === "TRD") {
                    self.resetPayload();
                    self.clickedLoanAccount(false);
                    self.clickedTermDeposit(true);
                    self.clickedCreditCard(false);
                    self.clickedDemandDeposit(false);
                }
            };

            self.validation = function() {
                if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                    return;
                }

                if (typeof self.accountType() === "object") {
                    self.payload().accountType = self.accountType()[0];
                } else {
                    self.payload().accountType = self.accountType();
                }

                self.payload().accountNumber = self.accountNumber();

                if (self.clickedDemandDeposit()) {
                    if (self.payload().debitCardNumber) {
                        self.payload().debitCardNumber = self.payload().debitCardNumber.replace(/\s/g, "");
                    }
                }

                if (self.clickedCreditCard()) {
                    if (self.expiryYear()) {
                        self.expiryYear(currentYear);
                    }

                    const date = rootParams.baseModel.getDate();

                    date.setMonth(self.expiryMonth() + 1);
                    date.setYear(self.expiryYear());
                    self.payload().creditCardExpiryDate = date;
                    self.payload().creditCardExpiryDate = self.payload().creditCardNumber = self.payload().creditCardNumber.replace(/\s/g, "");
                }

                if (self.agreement()[0]) {

                    UserCredentialModel.createRequest(ko.toJSON(self.payload())).done(function(data) {
                        self.payload().customer = true;
                        self.response(data);

                        if (self.response().partyVerificationResponse.verificationStatus && self.response().accountVerificationResponse.verificationStatus) {
                            if (self.clickedDemandDeposit()) {
                                if (self.response().debitCardVerificationResponse.verificationStatus && self.response().registrationDTO && self.response().registrationDTO.registrationId) {
                                    self.baseURL = "registration/" + self.response().registrationDTO.registrationId;
                                    self.userCredentials(false);
                                    self.verification(true);
                                    self.attemptsLeft=self.response().attemptsLeft;
                                }
                            } else if (self.response().registrationDTO && self.response().registrationDTO.registrationId) {
                                self.baseURL = "registration/" + self.response().registrationDTO.registrationId;
                                self.userCredentials(false);
                                self.verification(true);
                                self.attemptsLeft=self.response().attemptsLeft;
                            }
                        }
                    });
                }
            };

            self.OtpAuthentication = function(data) {
                if (data.tokenValid) {
                    self.verification(false);
                    self.emailDispatched(true);
                }
            };

            self.loginRedirect = function() {
                rootParams.baseModel.switchPage({
                    module: "login"
                }, false, false, null, true);
            };

            self.cancel = function() {
                location.replace("index.html");
            };

            self.resetPayload = function() {
                self.payload().accountType = self.accountType();
                self.payload().firstName = "";
                self.payload().lastName = "";
                self.payload().emailId = "";
                self.payload().partyId = "";
                self.payload().dateOfBirth = "";
                self.payload().accountNumber = self.accountNumber(null);
                self.payload().creditCardNumber = "";
                self.payload().creditCardNameOnCard = "";
                self.payload().creditCardExpiryDate = "";
                self.payload().creditCardCVVNumber = "";
                self.payload().debitCardNumber = "";
                self.payload().debitCardPin = "";
            };

        };
    });