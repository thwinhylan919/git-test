define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model file for Selected Account detail section. This file contains the model definition
   * for Details section and exports the ViewDetailsModel model which can be used
   * as a component in any form in which specific account detail information are required.
   *
   * @namespace ViewDetailsModel~ViewDetailsModel
   * @property {Object} getSpecificAccountDetailDeferred -To store the deferred object
   * @property {Object} params -To store data passed
   * @property {Object} baseService -To store baseService object
   */
  const ViewDetailsModel = function() {
    let params;
    const baseService = BaseService.getInstance();
    /**
     * Method to fetch specific Accounts details data.
     * @ deferred object is resolved once the accounts information list is successfully fetched
     * @selectedAccountNumber - unique account number whose details is required
     */
    let getSpecificAccountDetailDeferred;
    const getSpecificAccountDetail = function(selectedAccountNumber, deferred) {
      params = {
        accNum: selectedAccountNumber
      };

      const options = {
        url: "accounts/demandDeposit/{accNum}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };

    return {
      getSpecificAccountDetail: function(selectedAccountNumber) {
        getSpecificAccountDetailDeferred = $.Deferred();
        getSpecificAccountDetail(selectedAccountNumber, getSpecificAccountDetailDeferred);

        return getSpecificAccountDetailDeferred;
      }
    };
  };

  return new ViewDetailsModel();
});