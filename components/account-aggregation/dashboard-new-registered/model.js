define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";

    const LinkAccountDashboard = function () {
      const baseService = BaseService.getInstance();
      let accountListDeferred;
      const getAccountList = function(deferred) {
              const options = {
                url: "externalaccounts",
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
          getAccountList: function() {
          accountListDeferred = $.Deferred();
          getAccountList(accountListDeferred);

          return accountListDeferred;
        }

        };
    };

    return new LinkAccountDashboard();
});
