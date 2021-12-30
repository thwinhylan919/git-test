define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Service Request View Model. This file contains the model definition
   * for creating a new service request through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class ServiceRequestsViewModel
   */
  const ServiceRequestsViewModel = function() {
    const baseService = BaseService.getInstance();
    let addServiceRequestDeferred;
    /**
     * Private method to create a service request
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function addServiceRequest
     * @memberOf ErrorModel
     * @param {Object} data - Data to be inserted
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const addServiceRequest = function(data, deferred) {
      const
        options = {
          url: "servicerequest/definitions",
          data: data,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };

      baseService.add(options);
    };
    let updateServiceRequestDeferred;
    /**
     * Private method to update a service request
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function updateServiceRequest
     * @memberOf ErrorModel
     * @param {string} id - service request id for request to be updated
     * @param {Object} data - Updated data,
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const updateServiceRequest = function(id, data, deferred) {
      const
        options = {
          url: "servicerequest/definitions/{id}",
          data: data,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        },
        params = {
          id: id
        };

      baseService.update(options, params);
    };
    let fetchStatusesDeferred;
    /**
     * Private method to fetch the applicable statuses for the service request created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
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
     *
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
     *
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

    return {
      /**
       * Public method to add the new service request
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function addServiceRequest
       * @memberOf ServiceRequestsViewModel
       * @param {Object} data - payload to pass
       * @returns {Object} addServiceRequestDeferred
       * @example
       *      ServiceRequestView.addServiceRequest().then(function (data) {
       *
       *      });
       */
      addServiceRequest: function(data) {
        addServiceRequestDeferred = $.Deferred();
        addServiceRequest(data, addServiceRequestDeferred);

        return addServiceRequestDeferred;
      },
      /**
       * Public method to update a service request
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function updateServiceRequest
       * @memberOf ServiceRequestsViewModel
       * @param {string} id - service request id for request to be updated
       * @param {Object} data - payload to pass
       * @returns {Object} updateServiceRequestDeferred
       * @example
       *      ServiceRequestView.updateServiceRequest().then(function (data) {
       *
       *      });
       */
      updateServiceRequest: function(id, data) {
        updateServiceRequestDeferred = $.Deferred();
        updateServiceRequest(id, data, updateServiceRequestDeferred);

        return updateServiceRequestDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchStatuses
       * @memberOf ServiceRequestsViewModel
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestView.fetchStatuses().done(function(data) {
       *
       *       });
       */
      fetchStatuses: function() {
        fetchStatusesDeferred = $.Deferred();
        fetchStatuses(fetchStatusesDeferred);

        return fetchStatusesDeferred;
      },
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchSeverity
       * @memberOf ServiceRequestsViewModel
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestView.fetchSeverity().done(function(data) {
       *
       *       });
       */
      fetchSeverity: function() {
        fetchSeverityDeferred = $.Deferred();
        fetchSeverity(fetchSeverityDeferred);

        return fetchSeverityDeferred;
      },
      /**
       * Public method to fetch list of request types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchRequestTypes
       * @memberOf ServiceRequestsViewModel
       * @returns {Object} - DeferredObject.
       * @example
       *       ServiceRequestView.fetchRequestTypes().done(function(data) {
       *
       *       });
       */
      fetchRequestTypes: function() {
        fetchRequestTypesDeferred = $.Deferred();
        fetchRequestTypes(fetchRequestTypesDeferred);

        return fetchRequestTypesDeferred;
      }
    };
  };

  return new ServiceRequestsViewModel();
});