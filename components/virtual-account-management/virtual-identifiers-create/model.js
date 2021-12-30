define([
  "baseService"
], function (BaseService) {
  "use strict";

  const RemittanceModel = function () {
    const baseService = BaseService.getInstance(),
      /**
       * Private method to fetch the list of remittance based on search. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function fetchRemittanceList
       * @memberOf RemittanceModel
       * @param {string} realCustomerNo - Real customer number.
       * @param {string} limit - Limit for  remittance.
       * @param {string} offset - Offset for  remittance.
       * @param {string} taskCode - taskCode for fetchRemittanceList
       * @returns {void}
       * @private
       */
      fetchRemittanceList = function (realCustomerNo, limit, offset, taskCode) {
        const options = {
            url: "virtualIdentifiers?realCustomerNo={realCustomerNo}&limit={limit}&offset={offset}&taskCode={taskCode}",
            apiType: "extended"
          },
          params = {
            realCustomerNo: realCustomerNo,
            limit: limit,
            offset: offset,
            taskCode: taskCode
          };

        return baseService.fetch(options, params);
      },
      /**
       * Private method to fetch data for maintenance. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function maintenances
       * @memberOf EntityModel
       * @returns {void}
       * @private
       */
      maintenance = function () {
        const options = {
          url: "maintenances/virtualAccounts"
        };

        return baseService.fetch(options);
      },
      /**
       * Private method to fetch the list of remittance based on search. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function saveRemittanceList
       * @memberOf RemittanceModel
       * @param {Object} payload - Payload for adding new remitter to list.
       * @param {string} keyId - Key id of remittance list.
       * @param {string} taskCode - taskCode for saveRemittanceList
       * @returns {void}
       * @private
       */
      saveRemittanceList = function (payload, keyId, taskCode) {
        const options = {
          url: "virtualIdentifiers/{keyId}?taskCode={taskCode}",
          data: payload,
          apiType: "extended"
        };

        return baseService.update(options, {
          keyId: keyId,
          taskCode: taskCode
        });
      },
      /**
       *  Private method to create the multi-currency payload. This
       * method will resolve a payload, which can be returned
       * from calling function to the parent.
       *
       * @function remittancePayload
       * @memberOf RemittanceModel
       * @private
       */
      remittancePayload = function () {
        return {
          remitterDTO: {
            realCustomerNo: "",
            realCustomerName: "",
            remitterDesc: "",
            remitterListId: "",
            RemitterIdDetailServiceSaveDTO: []
          }
        };
      };

    return {
      fetchRemittanceList: function (realCustomerNo, limit, offset, taskCode) {
        return fetchRemittanceList(realCustomerNo, limit, offset, taskCode);
      },
      maintenance: function () {
        return maintenance();
      },
      saveRemittanceList: function (payload, keyId, taskCode) {
        return saveRemittanceList(payload, keyId, taskCode);
      },
      getNewModel: function () {
        return remittancePayload();
      }
    };
  };

  return new RemittanceModel();
});