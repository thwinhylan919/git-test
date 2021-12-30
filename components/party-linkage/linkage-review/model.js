define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const LinkageReviewModel = function() {
    const baseService = BaseService.getInstance(),
      /**
       * In case more than one instance of model is required,
       * we are declaring model as a function, of which new instances can be created and
       * used when required.
       *
       * @class Model
       * @private
       * @memberOf ExclusionModel~ExclusionModel
       */
      Model = function() {
        this.partyDetails = {
          partyId: "",
          userType: "",
          partyName: "",
          partyDetailsFetched: false,
          additionalDetails: ""
        };
      };
    /**
     * This function gets list of associated users for party
     * @params {partyID} - partyID for preference needs to be fetched
     * @function createLinkages
     * @memberOf ExclusionModel
     **/
    let createLinkagesDeferred;
    const createLinkages = function(partyID, linkageData, deferred) {
      const params = {
          partyId: partyID
        },
        options = {
          url: "parties/{partyId}/relations",
          data: linkageData,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.add(options, params);
    };
    /**
     * This function gets list of associated users for party
     * @params {partyID} - partyID for preference needs to be fetched
     * @function updateLinkages
     * @memberOf ExclusionModel
     **/
    let updateLinkagesDeferred;
    const updateLinkages = function(partyID, updateLinkageData, deferred) {
      const params = {
          partyId: partyID
        },
        options = {
          url: "parties/{partyId}/relations",
          data: updateLinkageData,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.update(options, params);
    };

    return {
      getNewModel: function() {
        return new Model();
      },
      createLinkages: function(batchData, createLinkageData) {
        createLinkagesDeferred = $.Deferred();
        createLinkages(batchData, createLinkageData, createLinkagesDeferred);

        return createLinkagesDeferred;
      },
      updateLinkages: function(batchData, updateLinkageData) {
        updateLinkagesDeferred = $.Deferred();
        updateLinkages(batchData, updateLinkageData, updateLinkagesDeferred);

        return updateLinkagesDeferred;
      }
    };
  };

  return new LinkageReviewModel();
});