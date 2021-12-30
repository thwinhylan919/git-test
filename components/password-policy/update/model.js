define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    PasswordPolicyEditModel = function() {
      const Model = function() {
        this.policyUpdatePayload = {
          policyId: null,
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
          nbrUpperAlpha: null,
          nbrLowerAlpha: null,
          nbrNumeric: null,
          nbrSpecial: null,
          personalDetExclude: [],
          version: null,
          specialCharAllowed: [],
          pwdFailureCountInterval: null,
          firstPwdExpiryPeriod: null
        };

        this.checkboxValues = {
          lowerCaseMandatory: "lowerCaseMandatory",
          upperMandatory: "upperMandatory",
          specialCharMandatory: "specialCharMandatory",
          numericMandatory: "numericMandatory"
        };

        this.exclusionDetailListValues = {
          dob: "Date of Birth",
          firstname: "First Name",
          lastname: "Last Name",
          userid: "User Id",
          partyid: "Party Id",
          dobDisplay: "dob",
          firstnameDisplay: "firstname",
          lastnameDisplay: "lastname",
          useridDisplay: "userid",
          partyidDisplay: "partyid"
        };
      };
      /**
       * This function fires a GET request to fetch the user groups options
       * and delegates control to the successhandler along with response data
       * once the details are successfully fetched
       *
       * @function fetchUserGroupOptions
       * @memberOf PasswordPolicyEditModel
       * @example PasswordPolicyEditModel.fetchUserGroupOptions();
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
        fetchUserGroupOptions: function() {
          fetchUserGroupOptionsDeferred = $.Deferred();
          fetchUserGroupOptions(fetchUserGroupOptionsDeferred);

          return fetchUserGroupOptionsDeferred;
        }
      };
    };

  return new PasswordPolicyEditModel();
});