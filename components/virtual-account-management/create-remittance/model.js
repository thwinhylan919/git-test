define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const EntityModel = function () {
    const baseService = BaseService.getInstance();
    let fetchRemittanceListDeferred;
    /**
     * Private method to fetch the list of remittance based on search. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function fetchRemittanceList
     * @memberOf RemittanceModel
     * @param {Object} deferred - An object type Deferred.
     * @param {string} realCustomerNo - Real customer number.
     * @param {string} limit - Limit for  remittance.
     * @param {string} offset - Offset for  remittance.
     * @returns {void}
     * @private
     */
    const fetchRemittanceList = function (deferred, realCustomerNo, limit, offset) {
      const options = {
          url: "virtualIdentifiers?realCustomerNo={realCustomerNo}&limit={limit}&offset={offset}",
          apiType: "extended",
          success: function (data) {
            deferred.resolve(data);
          }
        },
        params = {
          realCustomerNo: realCustomerNo,
          limit: limit,
          offset: offset
        };

      baseService.fetch(options, params);
    };
    let maintenanceDeferred;
    /**
     * Private method to fetch data for maintenance. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function maintenances
     * @memberOf EntityModel
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const maintenance = function (deferred) {
      const options = {
        url: "maintenances/virtualAccounts",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let saveRemittanceListDeferred;
    /**
     * Private method to fetch the list of remittance based on search. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function saveRemittanceList
     * @memberOf RemittanceModel
     * @param {Object} payload - Payload for adding new remitter to list.
     * @param {string} keyId - Key id of remittance list.
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const saveRemittanceList = function (payload, keyId, deferred) {
      const options = {
        url: "virtualIdentifiers/{keyId}",
        data: payload,
        apiType: "extended",
        success: function (data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        }
      };

      baseService.update(options, {
        keyId: keyId
      });
    };

    return {
      fetchRemittanceList: function (realCustomerNo, limit, offset) {
        fetchRemittanceListDeferred = $.Deferred();
        fetchRemittanceList(fetchRemittanceListDeferred, realCustomerNo, limit, offset);

        return fetchRemittanceListDeferred;
      },
      maintenance: function () {
        maintenanceDeferred = $.Deferred();
        maintenance(maintenanceDeferred);

        return maintenanceDeferred;
      },
      saveRemittanceList: function (payload, keyId) {
        saveRemittanceListDeferred = $.Deferred();
        saveRemittanceList(payload, keyId, saveRemittanceListDeferred);

        return saveRemittanceListDeferred;
      }
    };
  };

  return new EntityModel();
});