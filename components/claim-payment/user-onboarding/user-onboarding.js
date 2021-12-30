define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/user-onboarding",
  "framework/js/plugins/encrypt",
  "ojs/ojinputtext",
  "ojs/ojdatetimepicker"
], function (ko, GlobalPayeeModel, ResourceBundle, Encrypt) {
  "use strict";

  return function (rootParams) {
    const self = this,
      getNewKoModel = function () {
        const KoModel = ko.mapping.fromJS(GlobalPayeeModel.getNewModel());

        return KoModel;
      };

    self.payload = ko.observable(getNewKoModel());
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    self.onBoardingModel = getNewKoModel().onBoardingModel;
    self.bankdetailsModel = getNewKoModel().bankdetailsModel;
    self.verifyModel = getNewKoModel().verifyModel;
    self.validationTracker = ko.observable();
    self.password = ko.observable();
    self.otp = ko.observable();
    self.stageOne = ko.observable(true);
    self.stageTwo = ko.observable(false);
    self.otpVerification = ko.observable(false);
    self.stageThree = ko.observable(false);
    self.branchList = ko.observableArray();
    self.globalPayeeData = ko.observable();
    self.ifsc = ko.observable();
    self.version = ko.observable();
    self.etagArray = ko.observableArray();
    self.partyId = ko.observable();
    self.uid = ko.observable();
    self.pwdnullcheck = ko.observable();
    self.cnfmPwdNullCheck = ko.observable();
    self.showPasswordRule1 = ko.observable();
    self.showPasswordRule4 = ko.observable();
    self.showPasswordRule5 = ko.observable();
    self.showPasswordRule6 = ko.observable();
    self.showPasswordRule7 = ko.observable();
    self.mandatoryUpper = ko.observableArray();
    self.mandatoryLower = ko.observableArray();
    self.mandatoryNumber = ko.observableArray();
    self.showPasswordRule2 = ko.observable();
    self.showPasswordRule3 = ko.observable();
    self.showPasswordRule8 = ko.observable();
    self.passwordRule1 = ko.observable();
    self.roles = ko.observableArray();
    self.isnbrAllowed = ko.observable();
    self.isUpperAllowed = ko.observable();
    self.isLowerAllowed = ko.observable();
    self.isSpecialCharAllowed = ko.observable();
    self.forcepasswordValidation = ko.observable(true);
    self.charIncluded = ko.observableArray();
    self.nbrCharIncluded = ko.observableArray();
    self.nbrSuccessiveChars = ko.observable();
    self.personalDetExclude = ko.observableArray();
    self.pwdHistorySize = ko.observable();
    self.policy1violated = ko.observable(false);
    self.policy2violated = ko.observable(false);
    self.policy3violated = ko.observable(false);
    self.policy5violated = ko.observable(false);
    self.policy7violated = ko.observable(false);
    self.policy8violated = ko.observable(false);
    self.policy4violated = ko.observable(false);
    self.policy6violated = ko.observable(false);
    self.excludedDictWords = ko.observableArray();
    self.excludeDictWords = ko.observable();
    self.pwdValidated = ko.observable(false);
    self.closeDisclaimer = ko.observable(false);
    self.showConfirmation = ko.observable(false);
    self.showConfirmLoginFlow = ko.observable(false);
    self.enterPassword = ko.observable(true);
    self.invalidTrackerOldPwd = ko.observable();
    self.invalidTrackerNewPwd = ko.observable();
    self.invalidTrackerCnfmPwd = ko.observable();
    self.pwdMinLength = ko.observable();
    self.validationTracker = ko.observable();
    self.pwdMaxLength = ko.observable();
    self.nbrUpperAlpha = ko.observable();
    self.nbrLowerAlpha = ko.observable();
    self.nbrNumeric = ko.observable();
    self.nbrSpecial = ko.observable();
    self.specialAllowed = ko.observableArray();
    self.message = ko.observable();
    self.mandatorySpecialChar = ko.observable();
    self.specialCharlist = ko.observableArray();
    self.confirmPassword = ko.observable();
    self.pwdPolicyChecked = ko.observable(false);
    rootParams.baseModel.registerComponent("password-validation", "password-policy-validation");
    rootParams.baseModel.registerComponent("otp-verification", "base-components");
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerElement("page-section");
    self.baseUrl = ko.observable();
    rootParams.dashboard.headerName(self.resource.payments.peertopeer.registration);
    GlobalPayeeModel.init(self.aliasValue, self.aliasType);

    const today = rootParams.baseModel.getDate();

    today.setFullYear(today.getFullYear() - 18);

    function formatDate(date) {
      const d = rootParams.baseModel.getDate(date);
      let month = "" + (d.getMonth() + 1),
        day = "" + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) {
        month = "0" + month;
      }

      if (day.length < 2) {
        day = "0" + day;
      }

      return [
        year,
        month,
        day
      ].join("-");
    }

    self.maxDate = ko.observable(formatDate(today));

    self.createUser = function () {

      const validationTracker = document.getElementById("validationTracker");

      rootParams.dashboard.headerName(self.resource.payments.peertopeer.globalpayee.review);

      if (!rootParams.baseModel.showComponentValidationErrors(validationTracker)) {
        return;
      }

      if (!rootParams.baseModel.showComponentValidationErrors(self.pwdnullcheck())) {
        return;
      }

      if (!rootParams.baseModel.showComponentValidationErrors(self.cnfmPwdNullCheck())) {
        return;
      }

      self.onBoardingModel.aliasValue(self.aliasValue().toLowerCase());
      self.onBoardingModel.aliasType(self.aliasType());
      self.onBoardingModel.userId(self.onBoardingModel.emailId());
      self.onBoardingModel.paymentId = ko.toJS(self.paymentId());

      const payload = ko.toJSON(self.onBoardingModel);

      GlobalPayeeModel.createUser(payload).done(function (data) {
        self.globalPayeeData(data);
        self.onBoardingModel.uid(self.globalPayeeData().uid);

        if (self.globalPayeeData().payeeStatus === "VER") {
          self.stageOne(false);
          self.stageTwo(true);
        } else {
          rootParams.dashboard.headerName(self.resource.payments.peertopeer.otpValidation);
          self.baseUrl("payments/transfers/peerToPeer/user/" + self.onBoardingModel.uid());
          self.stageOne(false);
          self.otpVerification(true);
        }
      });
    };

    self.otpAuthentication = function (data) {
      if (data.tokenValid) {
        self.fetchPasswordPolicy();
        self.otpVerification(false);
        self.stageOne(false);
        rootParams.dashboard.headerName(self.resource.payments.peertopeer.registration);
        self.stageTwo(true);
      }
    };

    self.fetchPasswordPolicy = function () {
      GlobalPayeeModel.fetchPasswordPolicy().done(function (data) {
        if (data) {
          self.pwdMinLength = ko.observable(data.passwordPolicyDTO[0].pwdMinLength);
          self.pwdMaxLength = ko.observable(data.passwordPolicyDTO[0].pwdMaxLength);
          self.nbrUpperAlpha = ko.observable(data.passwordPolicyDTO[0].nbrUpperAlpha);
          self.nbrLowerAlpha = ko.observable(data.passwordPolicyDTO[0].nbrLowerAlpha);
          self.nbrNumeric = ko.observable(data.passwordPolicyDTO[0].nbrNumeric);
          self.nbrSpecial = ko.observable(data.passwordPolicyDTO[0].nbrSpecial);
          self.isnbrAllowed = ko.observable(data.passwordPolicyDTO[0].numericAllowed);
          self.isUpperAllowed = ko.observable(data.passwordPolicyDTO[0].upperAlphaAllowed);
          self.isLowerAllowed = ko.observable(data.passwordPolicyDTO[0].lowerAlphaAllowed);
          self.isSpecialCharAllowed = ko.observable(data.passwordPolicyDTO[0].specialCharsAllowed);
          self.specialAllowed = ko.observableArray(data.passwordPolicyDTO[0].specialCharAllowed);
          self.successiveChars = ko.observable(data.passwordPolicyDTO[0].successiveAllowed);
          self.nbrRepeativeChars = ko.observable(data.passwordPolicyDTO[0].nbrRepeatChars);
          self.nbrSuccessiveChars = ko.observable(data.passwordPolicyDTO[0].nbrSuccessiveChars);
          self.personalDetExclude = ko.observable(data.passwordPolicyDTO[0].personalDetExclude);
          self.pwdHistorySize = ko.observable(data.passwordPolicyDTO[0].pwdHistorySize);
          self.excludeDictWords = ko.observable(data.passwordPolicyDTO[0].excludeDictWords);
          self.excludedDictWords = ko.observable(data.passwordPolicyDTO[0].excludedDictWords);

          self.showPasswordRule1(rootParams.baseModel.format(self.resource.messages.showPasswordRule1, {
            pwdMinLength: self.pwdMinLength(),
            pwdMaxLength: self.pwdMaxLength()
          }));

          if (self.isUpperAllowed()) {
            if (self.nbrUpperAlpha() !== null && self.nbrUpperAlpha() !== 0) {
              self.mandatoryUpper().push(rootParams.baseModel.format(self.resource.messages.mandatoryUpper, {
                nbrUpper: self.nbrUpperAlpha()
              }));
            }

            self.showPasswordRule2(rootParams.baseModel.format(self.resource.messages.showPasswordRule2, {
              mandatoryUpper: self.mandatoryUpper()
            }));
          } else {
            self.showPasswordRule2(rootParams.baseModel.format(self.resource.messages.showPasswordRule2, {
              mandatoryUpper: self.resource.messages.notAllowed
            }));
          }

          if (self.isLowerAllowed()) {
            if (self.nbrLowerAlpha() !== null && self.nbrLowerAlpha() !== 0) {
              self.mandatoryLower(rootParams.baseModel.format(self.resource.messages.mandatoryLower, {
                nbrLower: self.nbrLowerAlpha()
              }));
            }

            self.showPasswordRule3(rootParams.baseModel.format(self.resource.messages.showPasswordRule3, {
              mandatoryLower: self.mandatoryLower()
            }));
          } else {
            self.showPasswordRule3(rootParams.baseModel.format(self.resource.messages.showPasswordRule3, {
              mandatoryLower: self.resource.messages.notAllowed
            }));
          }

          if (self.isnbrAllowed()) {
            if (self.nbrNumeric() !== null && self.nbrNumeric() !== 0) {
              self.mandatoryNumber(rootParams.baseModel.format(self.resource.messages.mandatoryNumber, {
                nbrNumber: self.nbrNumeric()
              }));
            }

            self.showPasswordRule5(rootParams.baseModel.format(self.resource.messages.showPasswordRule5, {
              mandatoryNumber: self.mandatoryNumber()
            }));
          } else {
            self.showPasswordRule5(rootParams.baseModel.format(self.resource.messages.showPasswordRule5, {
              mandatoryNumber: self.resource.messages.notAllowed
            }));
          }

          if (self.isSpecialCharAllowed()) {
            if (self.nbrSpecial() !== null && self.nbrSpecial() !== 0) {
              self.mandatorySpecialChar(rootParams.baseModel.format(self.resource.messages.mandatorySpecialChar, {
                nbrSpecial: self.nbrSpecial()
              }));

              self.specialCharlist(rootParams.baseModel.format(self.resource.messages.specialCharlist, {
                specialCharList: self.specialAllowed()
              }));

              self.showPasswordRule7(rootParams.baseModel.format(self.resource.messages.showPasswordRule7, {
                mandatorySpecialChar: self.mandatorySpecialChar(),
                specialCharlist: self.specialCharlist()
              }));
            }
          } else {
            self.showPasswordRule7(rootParams.baseModel.format(self.resource.messages.showPasswordRule7, {
              mandatorySpecialChar: self.resource.messages.notAllowed
            }));
          }

          if (self.nbrSuccessiveChars() !== undefined) {
            self.showPasswordRule4(rootParams.baseModel.format(self.resource.messages.showPasswordRule4, {
              nbrConsecutive: self.nbrSuccessiveChars()
            }));
          }

          if (self.nbrRepeativeChars() !== undefined) {
            self.showPasswordRule8(rootParams.baseModel.format(self.resource.messages.showPasswordRule8, {
              nbrIdentical: self.nbrRepeativeChars()
            }));
          }

          self.showPasswordRule6(self.resource.messages.showPasswordRule6);

          rootParams.dashboard.helpComponent.params({
            passwordPolicy: {
              rule1: self.showPasswordRule1,
              rule2: self.showPasswordRule2,
              rule3: self.showPasswordRule3,
              rule4: self.showPasswordRule4,
              rule5: self.showPasswordRule5,
              rule6: self.showPasswordRule6,
              rule7: self.showPasswordRule7,
              rule8: self.showPasswordRule8
            }
          });

        }
      });
    };

    self.verifyUser = function () {
      rootParams.dashboard.headerName(self.resource.payments.peertopeer.registration);

      if (!self.policy1violated() && !self.policy2violated() && !self.policy3violated() && !self.policy5violated() && !self.policy7violated() && !self.policy8violated() && !self.policy4violated() && !self.policy6violated()) {
        Encrypt(self.onBoardingModel.password()).then(function(password) {
          self.onBoardingModel.password = password[0];

          const payload = ko.toJSON(self.onBoardingModel);

          GlobalPayeeModel.verifyUser(payload).done(function () {
            self.stageTwo(false);
            self.stageThree(true);
          });
        });
      }
    };

    self.nullCheck = function () {
      if (rootParams.baseModel.showComponentValidationErrors(self.invalidTrackerOldPwd())) {
        rootParams.baseModel.showComponentValidationErrors(self.invalidTrackerNewPwd());
      }
    };

    const newPasswordSubscription = self.onBoardingModel.password.subscribe(function () {
      if (!rootParams.baseModel.showComponentValidationErrors(self.invalidTrackerOldPwd())) {
        return;
      }

      if (!rootParams.baseModel.showComponentValidationErrors(self.invalidTrackerNewPwd())) {
        return;
      }

      self.specialCharPresent = ko.observableArray();
      self.policy1violated(false);
      self.policy2violated(false);
      self.policy3violated(false);
      self.policy5violated(false);
      self.policy7violated(false);
      self.policy4violated(false);
      self.policy6violated(false);
      self.policy8violated(false);

      if (self.onBoardingModel.password() === null || self.onBoardingModel.password().length < self.pwdMinLength() || self.onBoardingModel.password().length > self.pwdMaxLength()) {
        self.policy1violated(true);
        self.confirmPassword("");
      }

      self.checkAlphaCount = function () {
        let uppercount = 0,
          lowercount = 0,
          specialcharcount = 0,
          numbercount = 0,
          i;

        for (i = 0; i < self.onBoardingModel.password().length; i++) {
          if (!isNaN(self.onBoardingModel.password().charAt(i))) {
            numbercount++;
          } else if (/^[a-zA-Z0-9- ]*$/.test(self.onBoardingModel.password().charAt(i)) === false) {
            specialcharcount++;
            self.specialCharPresent.push(self.onBoardingModel.password().charAt(i));

            for (let j = 0; j < self.specialCharPresent().length; j++) {
              if (!(self.specialAllowed().filter(function (e) {
                  return e === self.specialCharPresent()[j];
                }).length > 0)) {
                self.policy7violated(true);
                self.confirmPassword("");
              }
            }
          } else if (self.onBoardingModel.password().charAt(i) === self.onBoardingModel.password().charAt(i).toUpperCase()) {
            uppercount++;
          } else if (self.onBoardingModel.password().charAt(i) === self.onBoardingModel.password().charAt(i).toLowerCase()) {
            lowercount++;
          }
        }

        if ((!self.isUpperAllowed() && uppercount !== 0) || uppercount < self.nbrUpperAlpha()) {
          self.policy2violated(true);
          self.confirmPassword("");
        }

        if ((!self.isLowerAllowed() && lowercount !== 0) || lowercount < self.nbrLowerAlpha()) {
          self.policy3violated(true);
          self.confirmPassword("");
        }

        if ((!self.isnbrAllowed() && numbercount !== 0) || numbercount < self.nbrNumeric()) {
          self.policy5violated(true);
          self.confirmPassword("");
        }

        if ((!self.isSpecialCharAllowed() && specialcharcount !== 0) || specialcharcount < self.nbrSpecial()) {
          self.policy7violated(true);
          self.confirmPassword("");
        }
      };

      self.checkAlphaCount();

      self.checkSuccessiveChars = function () {
        let prevChar, currChar, count = 0,
          repeat = 0;

        for (let i = 1; i < self.onBoardingModel.password().length; i++) {
          prevChar = self.onBoardingModel.password().charCodeAt(i - 1);
          currChar = self.onBoardingModel.password().charCodeAt(i);

          if (currChar - prevChar === 1) {
            count = count + 1;
          } else {
            count = 0;
          }

          if (currChar - prevChar === 0) {
            repeat = repeat + 1;
          } else {
            repeat = 0;
          }

          if (count === self.nbrSuccessiveChars()) {
            self.policy4violated(true);
            self.confirmPassword("");
          }

          if (count === self.nbrRepeativeChars()) {
            self.policy8violated(true);
            self.confirmPassword("");
          }
        }
      };

      self.checkSuccessiveChars();

      if (self.excludedDictWords() !== undefined) {
        ko.utils.arrayForEach(self.excludedDictWords(), function (item) {
          if (self.onBoardingModel.password() === item) {
            self.policy6violated(true);
            self.confirmPassword("");
          }
        });
      }

      self.pwdPolicyChecked(true);

      if (self.policy1violated() || self.policy2violated() || self.policy3violated() || self.policy5violated() || self.policy7violated() || self.policy8violated() || self.policy4violated() || self.policy6violated()) {
        return;
      }

      self.pwdValidated(true);
    });

    self.cancel = function () {
      newPasswordSubscription.dispose();

      self.loadComp("security-code-verification");
    };

    self.equalToPassword = {
      validate: function (value) {
        if (self.onBoardingModel.password() === value) {
          return true;
        }

        self.confirmPassword("");
        throw new Error(self.resource.payments.peertopeer.globalpayee.passwordMatch);
      }
    };

    self.cancelUser = function () {
      self.stageOne(true);
      self.stageTwo(false);
    };

    self.done = function () {
      newPasswordSubscription.dispose();

      rootParams.baseModel.switchPage({
        homeComponent: "claim-payment-existing-user-dashboard",
        homeModule: "claim-payment-existing-user",
        value: self.aliasValue(),
        type: self.aliasType(),
        id: self.paymentId(),
        amount: self.amount(),
        currency: self.currency(),
        menuNavigationAvailable: false,
        user: "ldap"
      }, true);
    };

  };
});