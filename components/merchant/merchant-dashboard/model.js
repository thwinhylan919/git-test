define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const merchantModel = function() {
    const Model = function() {
        this.merchantModel = {
          description: null,
          static_success_url: null,
          dynamic_success_url: null,
          static_failure_url: null,
          dynamic_failure_url: null,
          merchantAccount: null,
          code: null,
          accountType: null,
          commissionAccountType: null,
          commissionAccount: null,
          commissionAccountFlag: "DISABLED",
          checksumType: null,
          securityKey: "",
          userAccountFlag: false,
          checksumAlgorithm: "",
          remittanceType: null,
          redirectionUrl: null
        };
      },
      baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let readMerchantDeferred;
    const readMerchant = function(merchantCode, deferred) {
      const options = {
          url: "payments/merchants/{merchantCode}",
          success: function(data, header) {
            deferred.resolve(data, header);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          merchantCode: merchantCode
        };

      baseService.fetch(options, params);
    };
    let listMerchantDeferred;
    const listMerchant = function(description, code, deferred) {
      const options = {
          url: "payments/merchants?description={description}&code={code}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          description: description,
          code: code
        };

      baseService.fetch(options, params);
    };
    let fetchUserDetailsDeferred;
    const fetchUserDetails = function(deferred) {
      const options = {
        url: "parties/me",
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
       * Method to initialize the described model.
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      readMerchant: function(merchantCode) {
        readMerchantDeferred = $.Deferred();
        readMerchant(merchantCode, readMerchantDeferred);

        return readMerchantDeferred;
      },
      listMerchant: function(description, code) {
        listMerchantDeferred = $.Deferred();
        listMerchant(description, code, listMerchantDeferred);

        return listMerchantDeferred;
      },
      fetchUserDetails: function() {
        fetchUserDetailsDeferred = $.Deferred();
        fetchUserDetails(fetchUserDetailsDeferred);

        return fetchUserDetailsDeferred;
      }
    };
  };

  return new merchantModel();
});