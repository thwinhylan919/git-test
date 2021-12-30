define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/password-policy",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset",
  "ojs/ojvalidationgroup",
  "ojs/ojknockout-validation"
], function (oj, ko, $, PasswordPolicyEditModel, locale) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel.params);
    self.nls = locale;
    params.baseModel.registerElement("page-section");
    self.validationTracker = ko.observable();
    self.isUpperCaseAllowed = ko.observable();
    self.specialChars = ko.observableArray([]);
    self.isUpperCaseMandatory = ko.observable();
    self.isLowerCaseMandatory = ko.observable();
    self.isSpecialCharMandatory = ko.observable();
    self.isNumericMandatory = ko.observable();
    self.numberUpperCaseAllowed = ko.observable(0);
    self.checkValues = ko.observableArray();
    self.upperCaseAllowed = ko.observableArray();
    self.upperCaseAllowed.push(self.isUpperAlphaAllowed().toString());
    self.lowerCaseAllowed = ko.observableArray();
    self.lowerCaseAllowed.push(self.isLowerAlphaAllowed().toString());
    self.specialCharsAllowed = ko.observableArray();
    self.specialCharsAllowed.push(self.isSpecialCharAllowed().toString());
    self.numericAllowed = ko.observableArray();
    self.numericAllowed.push(self.isNumericAllowed().toString());
    params.dashboard.headerName(self.nls.pageTitle.header);
    self.personalDetExclusionPayload = ko.observableArray([]);
    self.pwdExpiryPeriod = ko.observable(self.pwdExpiryPeriod());
    self.pwdExpiryWarningPeriod = ko.observable(self.pwdExpiryWarningPeriod());
    self.maxLength = ko.observable(self.maxLength());
    self.minLength = ko.observable(self.minLength());
    self.lowerAlphaMandatory = self.lowerAlphaMandatory ? self.lowerAlphaMandatory : ko.observableArray([]);
    self.specialCharMandatory = self.specialCharMandatory ? self.specialCharMandatory : ko.observableArray([]);
    self.numberMandatory = self.numberMandatory ? self.numberMandatory : ko.observableArray([]);
    params.baseModel.registerElement("action-header");
    params.baseModel.registerComponent("review-update", "password-policy");

    const baseSpecialCharValidator = params.baseModel.getValidator("ONLY_SPECIAL");

    let specialCharValidatorRegEx;

    $.each(baseSpecialCharValidator, function (_key, value) {
        if (value.type.toLowerCase() === oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP) {
            value.options.pattern = value.options.pattern.replace(/\*$/, "?");
            specialCharValidatorRegEx = value;
        }
    });

    const validator = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP).
    createValidator(specialCharValidatorRegEx.options);

    self.specialCharValidator = {
        validate: function (value) {
            const element = document.getElementById("specialCharAllowed1");
            let i;

            try {

                for (i = 0; i < value.length; i++) {
                    validator.validate(value[i]);
                }
            } catch (e) {
                element.valueOptions.splice(i, 1);
                throw e;
            }
        }
    };

    const restrictedPasswordsSubscription = self.restrictedPwdDetails.subscribe(function (value) {
        for (let i = 0; i < value.length; i++) {
          if (value[i].length > 20) {
            self.restrictedPwdDetails().pop(value[i]);
            params.baseModel.showMessages(null, [self.nls.message.invalidTextLength], "INFO");
          }
        }
      }),
      validateExclusionPwdSubscription = self.personalDetExclusion.subscribe(function (value) {
        for (let i = 0; i < value.length; i++) {
          if (value[i] !== self.exclusionDetailList()[0].id && value[i] !== self.exclusionDetailList()[1].id && value[i] !== self.exclusionDetailList()[2].id && value[i] !== self.exclusionDetailList()[3].id && value[i] !== self.exclusionDetailList()[4].id) {
            if (value[i] !== self.exclusionDetailList()[0].name && value[i] !== self.exclusionDetailList()[1].name && value[i] !== self.exclusionDetailList()[2].name && value[i] !== self.exclusionDetailList()[3].name && value[i] !== self.exclusionDetailList()[4].name) {
              self.personalDetExclusion().pop(value[i]);
              params.baseModel.showMessages(null, [self.nls.message.invalidListEntry], "INFO");
            }
          }
        }
      });

    self.exclusionDetailList = ko.observableArray([{
      id: "dob",
      name: self.nls.exclusionDetail.dob
    },
    {
      id: "firstname",
      name: self.nls.exclusionDetail.firstname
    },
    {
      id: "lastname",
      name: self.nls.exclusionDetail.lastname
    },
    {
      id: "userid",
      name: self.nls.exclusionDetail.userid
    },
    {
      id: "partyid",
      name: self.nls.exclusionDetail.partyid
    }
    ]);

    const getNewKoModel = function () {
      const KoModel = ko.mapping.fromJS(PasswordPolicyEditModel.getNewModel());

      return KoModel;
    };

    self.checkboxValues = getNewKoModel().checkboxValues;
    self.payload = getNewKoModel().policyUpdatePayload;

    self.upperCaseAllowedChangeHandler = function (event) {
      if (event.detail.value) {
        if (event.detail.value.length !== 0) {
          self.isUpperCaseAllowed($.parseJSON(event.detail.value));
          params.rootModel.params.isUpperAlphaAllowed($.parseJSON(event.detail.value));
        } else {
          self.isUpperCaseMandatory(false);
          self.isUpperCaseAllowed(false);
          self.nbrUpperDisabled(false);
          self.nbrUpperAlpha("");
          params.rootModel.params.upperAlphaMandatory([]);
          params.rootModel.params.isUpperAlphaAllowed(false);
        }
      }
    };

    self.upperCaseMandatoryChangeHandler = function (event) {
      if (event.detail.value) {
        if (event.detail.value.length !== 0) {
          self.nbrUpperDisabled(true);
          self.nbrUpperAlpha("");
          self.isUpperCaseMandatory(true);
          params.rootModel.params.isUpperAlphaAllowed(true);
        } else {
          self.nbrUpperAlpha("");
          self.isUpperCaseMandatory(false);
          self.nbrUpperDisabled(false);
        }
      }
    };

    self.lowerCaseAllowedChangeHandler = function (event) {
      if (event.detail.value) {
        if (event.detail.value.length !== 0) {
          self.isLowerAlphaAllowed($.parseJSON(event.detail.value));
        } else {
          self.nbrLowerDisabled(false);
          self.isLowerCaseMandatory(false);
          self.nbrLowerAlpha("");
          params.rootModel.params.lowerAlphaMandatory([]);
          params.rootModel.params.isLowerAlphaAllowed(false);
        }
      }
    };

    self.lowerCaseMandatoryChangeHandler = function (event) {
      if (event.detail.value) {
        if (event.detail.value.length !== 0) {
          self.nbrLowerDisabled(true);
          self.isLowerCaseMandatory(true);
          self.nbrLowerAlpha("");
          self.lowerAlphaMandatory.push(self.checkboxValues.lowerCaseMandatory());
        } else {
          self.nbrLowerAlpha("");
          self.nbrLowerDisabled(false);
          self.isLowerCaseMandatory(false);
          self.lowerAlphaMandatory.remove(self.checkboxValues.lowerCaseMandatory());
        }
      }
    };

    self.specialCharAllowedChangeHandler = function (event) {
      if (event.detail.value) {
        if (event.detail.value.length !== 0) {
          self.isSpecialCharAllowed($.parseJSON(event.detail.value));
        } else {
          self.specialCharAllowed.removeAll();
          self.nbrSpecialCharDisabled(false);
          self.isSpecialCharMandatory(false);
          self.nbrSpecialChar("");
          params.rootModel.params.specialCharMandatory([]);
          params.rootModel.params.isSpecialCharAllowed(false);
        }
      }
    };

    self.specialCharMandatoryChangeHandler = function (event) {
      if (event.detail.value) {
        if (event.detail.value.length !== 0) {
          self.nbrSpecialCharDisabled(true);
          self.isSpecialCharMandatory(true);
          self.nbrSpecialChar("");
          self.specialCharMandatory.push(self.checkboxValues.specialCharMandatory());
        } else {
          self.nbrSpecialChar("");
          self.nbrSpecialCharDisabled(false);
          self.isSpecialCharMandatory(false);
          self.specialCharMandatory.remove(self.checkboxValues.specialCharMandatory());
        }
      }
    };

    self.numberAllowedChangeHandler = function (event) {
      if (event.detail.value) {
        if (event.detail.value.length !== 0) {
          self.isNumericAllowed($.parseJSON(event.detail.value));
        } else {
          self.nbrNumericDisabled(false);
          self.isNumericMandatory(false);
          self.nbrNumericAlpha("");
          params.rootModel.params.numberMandatory([]);
          params.rootModel.params.isNumericAllowed(false);
        }
      }
    };

    self.numberMandatoryChangeHandler = function (event) {
      if (event.detail.value) {
        if (event.detail.value.length !== 0) {
          self.nbrNumericDisabled(true);
          self.isNumericMandatory(true);
          self.nbrNumericAlpha("");
          self.numberMandatory.push(self.checkboxValues.numericMandatory());
        } else {
          self.nbrNumericAlpha("");
          self.nbrNumericDisabled(false);
          self.isNumericMandatory(false);
          self.numberMandatory.remove(self.checkboxValues.numericMandatory());
        }
      }
    };

    self.save = function () {
      if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
        return;
      }

      if (!self.isUpperCaseAllowed() && !self.isLowerAlphaAllowed() && !self.isNumericAllowed() && !self.isSpecialCharAllowed()) {
        params.baseModel.showMessages(null, [self.nls.message.allowedChar], "ERROR");

        return;
      }

      if (self.isUpperCaseMandatory() && self.nbrUpperAlpha() < 1) {
        params.baseModel.showMessages(null, [self.nls.message.upperMandatoryCount], "ERROR");

        return;
      }

      if (self.isLowerCaseMandatory() && self.nbrLowerAlpha() < 1) {
        params.baseModel.showMessages(null, [self.nls.message.lowerMandatoryCount], "ERROR");

        return;
      }

      if (self.isNumericMandatory() && self.nbrNumericAlpha() < 1) {
        params.baseModel.showMessages(null, [self.nls.message.numberMandatoryCount], "ERROR");

        return;
      }

      if (self.isSpecialCharMandatory() && self.nbrSpecialChar() < 1) {
        params.baseModel.showMessages(null, [self.nls.message.specialCharMandatoryCount], "ERROR");

        return;
      }

      if (self.isSpecialCharAllowed() && (self.specialCharAllowed() === undefined || self.specialCharAllowed().length === 0)) {
        params.baseModel.showMessages(null, [self.nls.message.specialCharListError], "ERROR");

        return;
      }

      self.payload.policyId(self.id());
      self.payload.pwdPolicyName(self.pwdPolicyName());
      self.payload.pwdPolicyDesc(self.pwdPolicyDesc());
      self.payload.enterpriseRoles(self.userType());
      self.payload.pwdMinLength(self.minLength());
      self.payload.pwdMaxLength(self.maxLength());
      self.payload.nbrRepeatChars(self.repetitiveChar());
      self.payload.nbrSuccessiveChars(self.successiveChar());
      self.payload.pwdHistorySize(self.previousPwdDisallowed());
      self.payload.pwdFailureCountInterval(self.successiveInvalid());
      self.payload.excludedDictWords(self.restrictedPwdDetails());
      self.payload.pwdMinExpiryDays(self.pwdExpiryWarningPeriod());
      self.payload.pwdMaxExpiryDays(self.pwdExpiryPeriod());
      self.payload.pwdMustChange(self.forcePwdChange());
      self.payload.upperAlphaAllowed(self.isUpperAlphaAllowed());
      self.payload.lowerAlphaAllowed(self.isLowerAlphaAllowed());
      self.payload.numericAllowed(self.isNumericAllowed());
      self.payload.specialCharsAllowed(self.isSpecialCharAllowed());
      self.payload.nbrUpperAlpha(self.nbrUpperAlpha());
      self.payload.nbrLowerAlpha(self.nbrLowerAlpha());
      self.payload.nbrNumeric(self.nbrNumericAlpha());
      self.payload.nbrSpecial(self.nbrSpecialChar());

      ko.utils.arrayForEach(self.personalDetExclusion(), function (item) {
        ko.utils.arrayForEach(self.exclusionDetailList(), function (array) {
          if (item === array.id || item === array.name) {
            self.personalDetExclusionPayload.push(array.id);
          }
        });
      });

      self.payload.personalDetExclude(self.personalDetExclusionPayload());
      self.payload.specialCharAllowed(self.specialCharAllowed());
      self.payload.firstPwdExpiryPeriod(self.firstPwdExpiry());
      self.payload.version(self.version());

      params.dashboard.loadComponent("review-update", {
        data: self.payload
      });
    };

    self.dispose = function () {
      validateExclusionPwdSubscription.dispose();
      restrictedPasswordsSubscription.dispose();
    };
  };
});
