define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    ReviewLocationUpdateModel = function() {
      let updateAtmDetailsDeferred;
      const updateAtmDetails = function(id, payload, deferred) {
        const params = {id:id},
         options = {
          url: "locator/atms/" + id ,
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

        baseService.update(options, params);
      };
      let updateBranchDetailsDeferred;
      const updateBranchDetails = function(id, payload, deferred) {
        const params = {id:id},
         options = {
          url: "locator/branches/"+ id,
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

        baseService.update(options, params);
      };

      return {
        updateAtmDetails: function(id, payload) {
          updateAtmDetailsDeferred = $.Deferred();
          updateAtmDetails(id, payload, updateAtmDetailsDeferred);

          return updateAtmDetailsDeferred;
        },
        updateBranchDetails: function(id, payload) {
          updateBranchDetailsDeferred = $.Deferred();
          updateBranchDetails(id, payload, updateBranchDetailsDeferred);

          return updateBranchDetailsDeferred;
        }
      };
    };

  return new ReviewLocationUpdateModel();
});