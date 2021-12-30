define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const reportGenerationModel = function() {
    const Model = function() {
        this.reportParams = {
          partyId: null
        };
      },
      baseService = BaseService.getInstance();
    let fetchMeDeferred, fetchMeWithPartyDeferred;
    const fetchMe = function(deferred) {
        const options = {
          url: "me",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      },
      fetchMeWithParty = function(deferred) {
        const options = {
          url: "me/party",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };

    return {
      getNewModel: function(dataModel) {
        return new Model(dataModel);
      },
      fetchMe: function() {
        fetchMeDeferred = $.Deferred();
        fetchMe(fetchMeDeferred);

        return fetchMeDeferred;
      },
      fetchMeWithParty: function() {
        fetchMeWithPartyDeferred = $.Deferred();
        fetchMeWithParty(fetchMeWithPartyDeferred);

        return fetchMeWithPartyDeferred;
      }
    };
  };

  return new reportGenerationModel();
});