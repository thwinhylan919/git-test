define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const MailerBaseModel = function() {
    const baseService = BaseService.getInstance();
    let fetchMailersListDeferred;
    const fetchMailersList = function(description, code, deferred) {
      const params = {
          description: description || "",
          code: code || ""
        },
        options = {
          url: "mailers?description={description}&code={code}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };

    return {
      fetchMailersList: function(description, code) {
        fetchMailersListDeferred = $.Deferred();
        fetchMailersList(description, code, fetchMailersListDeferred);

        return fetchMailersListDeferred;
      }
    };
  };

  return new MailerBaseModel();
});