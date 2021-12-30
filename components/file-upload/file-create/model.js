define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const FileCreateModel = function() {
    const baseService = BaseService.getInstance();
    let fetchMeDeferred;
    const fetchMe = function(deferred) {
      const options = {
        url: "me",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      fetchMe: function() {
        fetchMeDeferred = $.Deferred();
        fetchMe(fetchMeDeferred);

        return fetchMeDeferred;
      }
    };
  };

  return new FileCreateModel();
});