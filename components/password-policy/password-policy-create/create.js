define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/password-policy-create",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup"
], function (oj, ko, $, PasswordPolicyCreateModel, locale) {
  "use strict";

  return function (params) {
    const self = this,
      getNewKoModel = function () {
        const KoModel = ko.mapping.fromJS(PasswordPolicyCreateModel.getNewModel());

        return KoModel;
      };

    /**
     * SetObservable - Define an observable if variable is undefined.
     *
     * @param  {type} value - Variable to be set.
     * @param  {string|boolean|number} param - Defult value of variable.
     * @return {Function}       Observable returned.
     */
    function setObservable(value, param) {
      if (!value) {
        return ko.observable(param);
      }

      return value;
    }

    /**
     * SetObservableArray - Define an observableArray if variable is undefined.
     *
     * @param  {type} value - Variable to be set.
     * @return {Function}       ObservableArray returned.
     */
    function setObservableArray(value) {
      if (!value) {
        return ko.observableArray([]);
      }

      return value;
    }

    ko.utils.extend(self, params.rootModel.previousState ? params.rootModel.previousState.data : params.rootModel.paramsl);
    self.nls = locale;
    self.createPayload = getNewKoModel().passwordPolicyCreateModel;
    self.checkboxValues = getNewKoModel().checkboxValues;
    self.exclusionDetailListValues = getNewKoModel().exclusionDetailListValues;
    params.dashboard.headerName(self.nls.pageTitle.header);
    params.baseModel.registerElement("page-section");
    params.baseModel.registerComponent("review-create", "password-policy");
    params.baseModel.registerElement("confirm-screen");
    self.validationTracker = ko.observable();
    self.policyName = setObservable(self.pwdPolicyName);
    self.policyDesc = setObservable(self.pwdPolicyDesc);
    self.userTypeEnums = ko.observableArray([]);
    self.userTypeEnumsLoaded = ko.observable(false);
    self.repetitiveCharAllowedNumber = setObservable(self.nbrRepeatChars);
    self.successiveCharAllowedNumber = setObservable(self.nbrSuccessiveChars);
    self.previousPwdDisallowed = setObservable(self.pwdHistorySize);
    self.failedLoginAttempts = setObservable(self.pwdFailureCountInterval);
    self.passwordExpiryPeriod = setObservable(self.pwdMaxExpiryDays);
    self.passwordExpiryWarningPeriod = setObservable(self.pwdMinExpiryDays);
    self.firstPasswordExpiryPeriod = setObservable(self.firstPwdExpiryPeriod);
    self.maximumLength = setObservable(self.pwdMaxLength);
    self.minimumLength = setObservable(self.pwdMinLength);
    self.isUpperCaseAllowed = setObservable(self.upperAlphaAllowed, false);
    self.isUpperCaseMandatory = setObservable(self.isUpperCaseMandatory, false);
    self.numberUpperCaseAllowed = setObservable(self.nbrUpperAlpha);
    self.upperCaseAllowedSelectedValues = setObservableArray(self.upperCaseAllowedSelectedValues);
    self.isLowerCaseAllowed = setObservable(self.lowerAlphaAllowed, false);
    self.isLowerCaseMandatory = setObservable(self.isLowerCaseMandatory, false);
    self.numberLowerCaseAllowed = setObservable(self.nbrLowerAlpha);
    self.lowerCaseAllowedSelectedValues = setObservableArray(self.lowerCaseAllowedSelectedValues);
    self.isSpecialCharAllowed = setObservable(self.specialCharsAllowed, false);
    self.isSpecialCharMandatory = setObservable(self.isSpecialCharMandatory, false);
    self.numberSpecialCharAllowed = setObservable(self.nbrSpecial);
    self.specialCharSelectedValues = setObservableArray(self.specialCharSelectedValues);
    self.specialCharList = setObservable(self.specialCharAllowed);
    self.isNumericAllowed = setObservable(self.numericAllowed, false);
    self.isNumericMandatory = setObservable(self.isNumericMandatory, false);
    self.numberAllowed = setObservable(self.nbrNumeric);
    self.numericSelectedValues = setObservableArray(self.numericSelectedValues);
    self.selectedExclusionList = setObservable(self.personalDetExclude);
    self.restrictedPasswords = setObservable(self.excludedDictWords);
    self.selectedUserType = setObservableArray(self.enterpriseRoles);
    self.passwordMustChange = setObservable(self.pwdMustChange, false);
    self.upperAllowed = setObservableArray(self.upperAllowed);
    self.lowerAllowed = setObservableArray(self.lowerAllowed);
    self.specialAllowed = setObservableArray(self.specialAllowed);
    self.numAllowed = setObservableArray(self.numAllowed);

    self.exclusionDetailList = ko.observableArray([{
      id: self.exclusionDetailListValues.dob,
      name: self.nls.exclusionDetail.dob
    },
    {
      id: self.exclusionDetailListValues.firstname,
      name: self.nls.exclusionDetail.firstname
    },
    {
      id: self.exclusionDetailListValues.lastname,
      name: self.nls.exclusionDetail.lastname
    },
    {
      id: self.exclusionDetailListValues.userid,
      name: self.nls.exclusionDetail.userid
    },
    {
      id: self.exclusionDetailListValues.partyid,
      name: self.nls.exclusionDetail.partyid
    }
    ]);

    params.baseModel.registerElement("action-header");

    PasswordPolicyCreateModel.fetchUserGroupOptions().done(function (data) {
      self.userTypeEnums(data.enterpriseRoleDTOs);
      self.userTypeEnumsLoaded(true);
    });

    const restrictedPasswordsSubscription = self.restrictedPasswords.subscribe(function (value) {
      for (let i = 0; i < value.length; i++) {
        if (value[i].length > 20) {
          self.restrictedPasswords().pop(value[i]);
          params.baseModel.showMessages(null, [self.nls.hintMessages.invalidTextLength], "INFO");
        }
      }
    }),

     validateExclusionPwdSubscription = self.selectedExclusionList.subscribe(function (value) {
        for (let i = 0; i < value.length; i++) {
          if (value[i] !== self.exclusionDetailListValues.firstname() && value[i] !== self.exclusionDetailListValues.lastname() && value[i] !== self.exclusionDetailListValues.partyid() && value[i] !== self.exclusionDetailListValues.userid() && value[i] !== self.exclusionDetailListValues.dob()) {
            self.selectedExclusionList().pop(value[i]);
            params.baseModel.showMessages(null, [self.nls.hintMessages.invalidListEntry], "INFO");
          }
        }
      }),

       baseSpecialCharValidator = params.baseModel.getValidator("ONLY_SPECIAL");

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
            const element = document.getElementById("specialCharList");
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

    /**
     * This function is used to update maximumLength to blank if minimumLength is changed.
     *
     * @return {void}
     */
    self.passwordChangeHandler = function () {
      self.maximumLength("");
    };

    /**
     * This function is used to update passwordExpiryWarningPeriod to blank if passwordExpiryPeriod is changed.
     *
     * @return {void}
     */
    self.passwordExpiryPeriodChangeHandler = function () {
      self.passwordExpiryWarningPeriod("");
    };

    self.upperCaseAllowedChangeHandler = function (event) {
      if (event.detail.value[0]) {
        self.isUpperCaseAllowed($.parseJSON(event.detail.value[0]));
      } else {
        self.isUpperCaseMandatory(false);
        self.isUpperCaseAllowed(false);
        self.upperCaseAllowedSelectedValues.remove(self.checkboxValues.upperMandatory());
        self.numberUpperCaseAllowed("");
      }
    };

    self.upperCaseMandatoryChangeHandler = function (event) {
      if (event.detail.value[0]) {
        self.isUpperCaseMandatory(true);
        self.upperCaseAllowedSelectedValues.push(self.checkboxValues.upperMandatory());
      } else {
        self.upperCaseAllowedSelectedValues.remove(self.checkboxValues.upperMandatory());
        self.isUpperCaseMandatory(false);
        self.numberUpperCaseAllowed("");
      }
    };

    self.lowerCaseAllowedChangeHandler = function (event) {
      if (event.detail.value[0]) {
        self.isLowerCaseAllowed($.parseJSON(event.detail.value[0]));
      } else {
        self.isLowerCaseMandatory(false);
        self.isLowerCaseAllowed(false);
        self.lowerCaseAllowedSelectedValues.remove(self.checkboxValues.lowerCaseMandatory());
        self.numberLowerCaseAllowed("");
      }
    };

    self.lowerCaseMandatoryChangeHandler = function (event) {
      if (event.detail.value[0]) {
        self.isLowerCaseMandatory(true);
        self.lowerCaseAllowedSelectedValues.push(self.checkboxValues.lowerCaseMandatory());
      } else {
        self.isLowerCaseMandatory(false);
        self.lowerCaseAllowedSelectedValues.remove(self.checkboxValues.lowerCaseMandatory());
        self.numberLowerCaseAllowed("");
      }
    };

    self.specialCharAllowedChangeHandler = function (event) {
      if (event.detail.value[0]) {
        self.isSpecialCharAllowed($.parseJSON(event.detail.value[0]));
      } else {
        self.isSpecialCharAllowed(false);
        self.isSpecialCharMandatory(false);
        self.specialCharSelectedValues.remove(self.checkboxValues.specialCharMandatory());
        self.numberSpecialCharAllowed("");
        self.specialCharList([]);
      }
    };

    self.specialCharMandatoryChangeHandler = function (event) {
      if (event.detail.value[0]) {
        self.isSpecialCharMandatory(true);
        self.specialCharSelectedValues.push(self.checkboxValues.specialCharMandatory());
      } else {
        self.isSpecialCharMandatory(false);
        self.specialCharSelectedValues.remove(self.checkboxValues.specialCharMandatory());
        self.numberSpecialCharAllowed("");
      }
    };

    self.numberAllowedChangeHandler = function (event) {
      if (event.detail.value[0]) {
        self.isNumericAllowed($.parseJSON(event.detail.value[0]));
      } else {
        self.isNumericMandatory(false);
        self.isNumericAllowed(false);
        self.numericSelectedValues.remove(self.checkboxValues.numericMandatory());
        self.numberAllowed("");
      }
    };

    self.numberMandatoryChangeHandler = function (event) {
      if (event.detail.value[0]) {
        self.isNumericMandatory(true);
        self.numericSelectedValues.push(self.checkboxValues.numericMandatory());
      } else {
        self.isNumericMandatory(false);
        self.numericSelectedValues.remove(self.checkboxValues.numericMandatory());
        self.numberAllowed("");
      }
    };

    self.saveForReview = function () {
      if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
        return;
      }

      if (!self.isUpperCaseAllowed() && !self.isLowerCaseAllowed() && !self.isNumericAllowed() && !self.isSpecialCharAllowed()) {
        params.baseModel.showMessages(null, [self.nls.error.allowedChar], "ERROR");

        return;
      }

      if (self.isUpperCaseMandatory() && self.numberUpperCaseAllowed() === undefined) {
        params.baseModel.showMessages(null, [self.nls.error.upperMandatoryCount], "ERROR");

        return;
      }

      if (self.isLowerCaseMandatory() && self.numberLowerCaseAllowed() === undefined) {
        params.baseModel.showMessages(null, [self.nls.error.lowerMandatoryCount], "ERROR");

        return;
      }

      if (self.isNumericMandatory() && self.numberAllowed() === undefined) {
        params.baseModel.showMessages(null, [self.nls.error.numberMandatoryCount], "ERROR");

        return;
      }

      if (self.isSpecialCharMandatory() && self.numberSpecialCharAllowed() === undefined) {
        params.baseModel.showMessages(null, [self.nls.error.specialCharMandatoryCount], "ERROR");

        return;
      }

      if (self.isSpecialCharAllowed() && (self.specialCharList() === undefined || self.specialCharList().length === 0)) {
        params.baseModel.showMessages(null, [self.nls.error.specialCharListError], "ERROR");

        return;
      }

      self.createPayload.pwdPolicyName(self.policyName());
      self.createPayload.pwdPolicyDesc(self.policyDesc());
      self.createPayload.pwdMinLength(self.minimumLength());
      self.createPayload.pwdMaxLength(self.maximumLength());
      self.createPayload.nbrRepeatChars(self.repetitiveCharAllowedNumber());
      self.createPayload.nbrSuccessiveChars(self.successiveCharAllowedNumber());
      self.createPayload.pwdHistorySize(self.previousPwdDisallowed());
      self.createPayload.pwdMinExpiryDays(self.passwordExpiryWarningPeriod());
      self.createPayload.pwdMaxExpiryDays(self.passwordExpiryPeriod());
      self.createPayload.firstPwdExpiryPeriod(self.firstPasswordExpiryPeriod());
      self.createPayload.pwdMustChange(self.passwordMustChange());
      self.createPayload.upperAlphaAllowed(self.isUpperCaseAllowed());
      self.createPayload.lowerAlphaAllowed(self.isLowerCaseAllowed());
      self.createPayload.numericAllowed(self.isNumericAllowed());
      self.createPayload.specialCharsAllowed(self.isSpecialCharAllowed());
      self.createPayload.nbrUpperAlpha(self.numberUpperCaseAllowed());
      self.createPayload.nbrLowerAlpha(self.numberLowerCaseAllowed());
      self.createPayload.nbrNumeric(self.numberAllowed());
      self.createPayload.nbrSpecial(self.numberSpecialCharAllowed());
      self.createPayload.enterpriseRoles(self.selectedUserType());
      self.createPayload.excludedDictWords(self.restrictedPasswords());
      self.createPayload.personalDetExclude(self.selectedExclusionList());
      self.createPayload.specialCharAllowed(self.specialCharList());
      self.createPayload.pwdFailureCountInterval(self.failedLoginAttempts());

      params.dashboard.loadComponent("review-create", {
        data: self.createPayload
      });
    };

    self.dispose = function () {
      validateExclusionPwdSubscription.dispose();
      restrictedPasswordsSubscription.dispose();
    };
  };
});