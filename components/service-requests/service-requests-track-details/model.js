define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Service Request Track Model. This file contains the model definition
   * for list of product names and data fetched from the server through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class ServiceRequestsTrackDetailsModel
   */
  const ServiceRequestsTrackDetailsModel = function() {
    const baseService = BaseService.getInstance();
    let readDataDeferred;
    /**
     * Private method to fetch the service request details based on service request Id
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function readData
     * @memberOf ErrorModel
     * @returns {void}
     * @private
     * @param {string} id - service request id for request to be read
     * @param {Object} deferred - An object type deferred
     */
    const readData = function(id, deferred) {
      const option = {
          url: "servicerequest/{id}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          id: id
        };

      baseService.fetch(option, params);
    };
    let readFileDeferred;
    /**
     * Private method to read a file based on content id
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function readFile
     * @memberOf ErrorModel
     * @returns {void}
     * @private
     * @param {string} contentId - content id of file
     * @param {Object} deferred - An object type deferred
     */
    const readFile = function(contentId, deferred) {
      const option = {
          url: "contents/{contentId}?alt={mediaType}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          contentId: contentId,
          mediaType: "media"
        };

      baseService.downloadFile(option, params);
    };

    return {
      /**
       * Public method to read Service Request details. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function readData
       * @memberOf ServiceRequestTrackDetails
       * @param {string} id - Id of service request.
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestTrackDetails.readData().done(function(data) {
       *
       *       });
       */
      readData: function(id) {
        readDataDeferred = $.Deferred();
        readData(id, readDataDeferred);

        return readDataDeferred;
      },
      /**
       * Public method to read uploaded file contents. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function readFile
       * @memberOf ServiceRequestsTrackDetailsModel
       * @param {string} contentId - Content id of file.
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestTrackDetails.readFile().done(function(data) {
       *
       *       });
       */
      readFile: function(contentId) {
        readFileDeferred = $.Deferred();
        readFile(contentId, readFileDeferred);

        return readFileDeferred;
      }
    };
  };

  return new ServiceRequestsTrackDetailsModel();
});