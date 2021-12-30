define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    PasswordPolicyCreateModel = function() {
      const Model = function() {
        this.passwordPolicyCreateModel = {
          pwdPolicyName: null,
          pwdPolicyDesc: null,
          enterpriseRoles: [],
          pwdMinLength: null,
          pwdMaxLength: null,
          nbrRepeatChars: null,
          nbrSuccessiveChars: null,
          pwdHistorySize: null,
          excludedDictWords: [],
          pwdMinExpiryDays: null,
          pwdMaxExpiryDays: null,
          pwdMustChange: null,
          upperAlphaAllowed: null,
          lowerAlphaAllowed: null,
          numericAllowed: null,
          specialCharsAllowed: null,
          nbrUpperAlpha: 0,
          nbrLowerAlpha: 0,
          nbrNumeric: 0,
          nbrSpecial: 0,
          personalDetExclude: null,
          specialCharAllowed: null,
          firstPwdExpiryPeriod: null,
          pwdFailureCountInterval: null
        };

        this.checkboxValues = {
          lowerCaseMandatory: "lowerCaseMandatory",
          upperMandatory: "upperMandatory",
          specialCharMandatory: "specialCharMandatory",
          numericMandatory: "numericMandatory",
          upperAllowed: "upperAllowed",
          lowerAllowed: "lowerAllowed",
          specialAllowed: "specialAllowed",
          numAllowed: "numAllowed"
        };

        this.exclusionDetailListValues = {
          dob: "dob",
          firstname: "firstname",
          lastname: "lastname",
          userid: "userid",
          partyid: "partyid"
        };
      };
      let createPasswordPolicyDeferred;
      const createPasswordPolicy = function(createPayload, deferred) {
        const options = {
          url: "passwordPolicy",
          data: createPayload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

        baseService.add(options);
      };
      /**
       * This function fires a GET request to fetch the user groups options
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched
       *
       * @function fetchUserGroupOptions
       * @memberOf UsersCreateModel
       * @example UsersCreateModel.fetchUserGroupOptions();
       */
      let fetchUserGroupOptionsDeferred;
      const fetchUserGroupOptions = function(deferred) {
        const options = {
          url: "enterpriseRoles?isLocal=true",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      };

      return {
        getNewModel: function(modelData) {
          return new Model(modelData);
        },
        createPasswordPolicy: function(payload) {
          createPasswordPolicyDeferred = $.Deferred();
          createPasswordPolicy(payload, createPasswordPolicyDeferred);

          return createPasswordPolicyDeferred;
        },
        fetchUserGroupOptions: function() {
          fetchUserGroupOptionsDeferred = $.Deferred();
          fetchUserGroupOptions(fetchUserGroupOptionsDeferred);

          return fetchUserGroupOptionsDeferred;
        }
      };
    };

  return new PasswordPolicyCreateModel();
});