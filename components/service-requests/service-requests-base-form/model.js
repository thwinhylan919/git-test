define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Service Request Search Model. This file contains the model definition
   * for list of moduleType and data fetched from the server through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class ServiceRequestsBaseFormModel
   */
  const ServiceRequestsBaseFormModel = function() {
    const baseService = BaseService.getInstance();
    let readDataDeferred;
    /**
     * Private method to fetch the service requests details based on service request Id
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
          url: "servicerequest/definitions/{id}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          id: id
        };

      baseService.fetch(option, params);
    };
    let getFileDeferred;
    /**
     * Private method to fetch content of uploaded image
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function getFile
     * @memberOf ErrorModel
     * @returns {void}
     * @private
     * @param {string} contentId - content ID of the uploaded image
     * @param {Object} deferred - An object type deferred
     */
    const getFile = function(contentId, deferred) {
      const option = {
          url: "contents/{contentId}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          contentId: contentId
        },
        headers = {
          "Content-Id": contentId,
          "Content-Type": "application/json"
        };

      baseService.fetch(option, params, headers);
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
       * @memberOf ServiceRequestsBaseFormModel
       * @param {string} id - Id of service request.
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestBaseForm.readData().done(function(data) {
       *
       *       });
       */
      readData: function(id) {
        readDataDeferred = $.Deferred();
        readData(id, readDataDeferred);

        return readDataDeferred;
      },
      /**
       * Public method to fetch list of Service Requests. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function getFile
       * @memberOf ServiceRequestsBaseFormModel
       * @param {string} contentId - Content ID of the uploaded image.
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestBaseForm.getFile().done(function(data) {
       *
       *       });
       */
      getFile: function(contentId) {
        getFileDeferred = $.Deferred();
        getFile(contentId, getFileDeferred);

        return getFileDeferred;
      }
    };
  };

  return new ServiceRequestsBaseFormModel();
});