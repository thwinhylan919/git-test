define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ServiceRequestsDetailModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * In case more than one instance of model is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf PreferenceFunctionsModel~PreferenceFunctionsModel
     */
    let
      approveRejectSRDeferred;
    /**
     * Private method to fetch the applicable statuses for the service request created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function approveRejectSR
     * @memberOf ErrorModel
     * @param {String} srID - An object type deferred
     * @param {String} remarks - An object type deferred
     * @param {String} status - An object type deferred
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const approveRejectSR = function(srID, remarks, status, deferred) {
      const params = {
          status: status,
          remarks: remarks
        },
        options = {
          url: "servicerequest/" + srID + "?status={status}&note={remarks}",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.patch(options, params);
    };
    let fetchProductsDetailDeferred;
    /**
     * Private method to fetch the applicable statuses for the service request created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchProductsDetail
     * @memberOf ErrorModel
     * @param {String} srID - An object type deferred
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchProductsDetail = function(srID, deferred) {
      const options = {
        url: "servicerequest/" + srID,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.fetch(options);
    };
    let fetchStatusesDeferred;
    /**
     * Private method to fetch the applicable statuses for the service request created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchStatuses
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchStatuses = function(deferred) {
      const
        options = {
          url: "enumerations/srStatus",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };
    let fetchSeverityDeferred;
    /**
     * Private method to fetch the severity levels created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchSeverity
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchSeverity = function(deferred) {
      const
        options = {
          url: "enumerations/priorityType",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };
    let fetchRequestTypesDeferred;
    /**
     * Private method to fetch the request types created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchRequestTypes
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchRequestTypes = function(deferred) {
      const
        options = {
          url: "enumerations/srFormBuilderRequestTypes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };
    let fetchProductNamesDeferred;
    /**
     * Private method to fetch the product names (module types)
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchProductNames
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchProductNames = function(deferred) {
      const
        options = {
          url: "servicerequest/products",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options);
    };
    let readFileDeferred;
    /**
     * Private method to read a file based on content id
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function readFile
     * @memberOf ErrorModel
     * @returns {void}
     * @private
     * @param {String} contentId - content id of file
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
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function approveRejectSR
       * @memberOf ServiceRequestTrackModel
       * @param {String} srID - An object type deferred
       * @param {String} remarks - An object type deferred
       * @param {String} status - An object type deferred
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestsDetailModel.approveRejectSR(srID, remarks, status).done(function(data) {
       *
       *       });
       */
      approveRejectSR: function(srID, remarks, status) {
        approveRejectSRDeferred = $.Deferred();
        approveRejectSR(srID, remarks, status, approveRejectSRDeferred);

        return approveRejectSRDeferred;
      },
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchSeverity
       * @memberOf ServiceRequestsViewModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestsDetailModel.fetchSeverity().done(function(data) {
       *
       *       });
       */
      fetchSeverity: function() {
        fetchSeverityDeferred = $.Deferred();
        fetchSeverity(fetchSeverityDeferred);

        return fetchSeverityDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchProductsDetail
       * @memberOf ServiceRequestTrackModel
       * @param {String} srID - An object type deferred
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestsDetailModel.fetchProductsDetail(srID).done(function(data) {
       *
       *       });
       */
      fetchProductsDetail: function(srID) {
        fetchProductsDetailDeferred = $.Deferred();
        fetchProductsDetail(srID, fetchProductsDetailDeferred);

        return fetchProductsDetailDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchStatuses
       * @memberOf ServiceRequestTrackModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestsDetailModel.fetchStatuses().done(function(data) {
       *
       *       });
       */
      fetchStatuses: function() {
        fetchStatusesDeferred = $.Deferred();
        fetchStatuses(fetchStatusesDeferred);

        return fetchStatusesDeferred;
      },
      /**
       * Public method to fetch list of request types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchRequestTypes
       * @memberOf ServiceRequestsViewModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestsDetailModel.fetchRequestTypes().done(function(data) {
       *
       *       });
       */
      fetchRequestTypes: function() {
        fetchRequestTypesDeferred = $.Deferred();
        fetchRequestTypes(fetchRequestTypesDeferred);

        return fetchRequestTypesDeferred;
      },
      /**
       * Public method to fetch list of Module Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchProductNames
       * @memberOf ServiceRequestsTrackModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestsDetailModel.fetchProductNames().done(function(data) {
       *
       *       });
       */
      fetchProductNames: function() {
        fetchProductNamesDeferred = $.Deferred();
        fetchProductNames(fetchProductNamesDeferred);

        return fetchProductNamesDeferred;
      },
      /**
       * Public method to read uploaded file contents. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function readFile
       * @memberOf ServiceRequestsTrackDetailsModel
       * @param {String} contentId - content id of file
       * @returns {Object} - deferredObject
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

  return new ServiceRequestsDetailModel();
});