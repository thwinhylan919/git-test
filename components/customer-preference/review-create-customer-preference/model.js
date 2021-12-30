define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const CreateCPModel = function() {
    const baseService = BaseService.getInstance();
    /**
     * Function to get new instance of CreateCPModel
     * @function
     * @memberOf CreateCPModel
     * @returns Model
     */
    let modelInitialized = false,
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      /**
       * This function creates the customer preferences of valid party Id,
       * posts entered details filled in the form as request payload
       * @function createCP
       * @memberOf CreateCPModel
       **/
      createCPDeferred;
    const createCP = function(partyId, payload, deferred) {
      const params = {
          payload: payload,
          partyId: partyId
        },
        options = {
          url: "parties/{partyId}/preferences",
          data: payload,
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
     * This function creates or updates the customer preferences of valid party Id,
     * posts updated details filled in the form as request payload
     * along with the party id ,
     * @function updateCP
     * @memberOf CreateCPModel
     **/
    let updateCPDeferred;
    const updateCP = function(partyId, payload, deferred) {
      const params = {
          payload: payload,
          partyId: partyId
        },
        options = {
          url: "parties/{partyId}/preferences",
          data: payload,
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
      init: function() {
        modelInitialized = true;

        return modelInitialized;
      },
      createCP: function(partyId, payload) {
        createCPDeferred = $.Deferred();
        createCP(partyId, payload, createCPDeferred);

        return createCPDeferred;
      },
      updateCP: function(partyId, payload) {
        updateCPDeferred = $.Deferred();
        updateCP(partyId, payload, updateCPDeferred);

        return updateCPDeferred;
      }
    };
  };

  return new CreateCPModel();
});