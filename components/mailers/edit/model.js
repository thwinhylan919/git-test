define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const EditMailerModel = function() {
    const Model = function() {
        this.mailersModel = {
          code: null,
          messageType: null,
          subject: null,
          messageBody: null,
          bannerBody: "",
          description: null,
          recipients: [],
          activationDate: null
        };
      },
      baseService = BaseService.getInstance();
    let fetchPartyListDeferred;
    const fetchPartyList = function(partyId, deferred) {
      const params = {
        partyId: partyId
      },
      options = {
        url: "parties?partyId={partyId}",
        success: function(data) {
          deferred.resolve(data);
        },
        failure: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      fetchPartyList: function(partyId) {
        fetchPartyListDeferred = $.Deferred();
        fetchPartyList(partyId, fetchPartyListDeferred);

        return fetchPartyListDeferred;
      }
    };
  };

  return new EditMailerModel();
});
