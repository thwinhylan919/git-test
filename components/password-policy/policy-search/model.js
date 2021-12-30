define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    PasswordPolicySearchModel = function() {
      let listPasswordPolicyDeferred;
      const listPasswordPolicy = function(searchParams, deferred) {
        const options = {
          url: "passwordPolicy?name={policyName}&description={policyDesc}&roles=administrator&roles=corporateuser&roles=retailuser",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options, searchParams);
      };

      return {
        listPasswordPolicy: function(params) {
          listPasswordPolicyDeferred = $.Deferred();
          listPasswordPolicy(params, listPasswordPolicyDeferred);

          return listPasswordPolicyDeferred;
        }
      };
    };

  return new PasswordPolicySearchModel();
});