/**
 * Model for create-rd
 * @param {object} BaseService base service instance for server communication
 * @return {object} recurringDepositModel Modal instance
 */
define([
  "baseService"
], function(BaseService) {
  "use strict";

  const recurringDepositModel = function() {
   const baseService = BaseService.getInstance();

    return {
      /**
       * Function to create nominee at the time of rd creation.
       *
       * @param {Object} payload  - An object containg the data to be sent to host.
       * @returns {Promise}  Returns the promise object.
       */
      confirmAddNominee: function(payload) {
          return baseService.add({
              url: "nominee",
              data: payload
          });
      },
      /**
       * Function to create RD.
       *
       * @param {Object} data - Payload to be passed to create RD.
       * @param {boolean} isSimulated - Flag to simulate and validate given request payload.
       * @returns {Promise}  Returns the promise object.
       */
       openRd: function (data, isSimulated) {
        const options = {
          url: "accounts/deposit",
          data: data
        };

        options.headers = {};

        if (isSimulated) {
         options.headers["X-Validate-Only"] = "Y";
        }

       return baseService.add(options);
      }
    };
  };

  return new recurringDepositModel();
});