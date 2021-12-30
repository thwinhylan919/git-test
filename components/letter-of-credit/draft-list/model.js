define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const DraftModel = function() {
    const baseService = BaseService.getInstance();
    let Deferred;
    const getDrafts = function(deferred, url) {
      const options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      },
      getDraftLC = function(id, deferred) {
        const options = {
            url: "letterofcredits/drafts/{draftId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            draftId: id
          };

        baseService.fetch(options, params);
      },
      getDraftSG = function(id, deferred) {
        const options = {
            url: "shippingGuarantees/draft/{id}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            id: id
          };

        baseService.fetch(options, params);
      };

    return {
      getDrafts: function(url) {
        Deferred = $.Deferred();
        getDrafts(Deferred,url);

        return Deferred;
      },
      getDraftLC: function(id) {
        Deferred = $.Deferred();
        getDraftLC(id, Deferred);

        return Deferred;
      },
      getDraftSG: function(id) {
        Deferred = $.Deferred();
        getDraftSG(id, Deferred);

        return Deferred;
      }
    };
  };

  return new DraftModel();
});
