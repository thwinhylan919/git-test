define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const merchantModel = function() {
    const Model = function() {
        this.merchantModel = {
          description: null,
          successUrl: null,
          failureUrl: null,
          redirectionUrl: null,
          merchantAccount: null,
          code: null,
          accountType: null,
          remittanceType: null,
          commissionAccountType: null,
          commissionAccount: null,
          commissionAccountFlag: "DISABLED",
          checksumType: null,
          securityKey: null,
          userAccountFlag: false,
          checksumAlgorithm: null
        };
      },
      baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let createMerchantDeferred;
    const createMerchant = function(model, deferred) {
      const options = {
        url: "payments/merchants",
        data: model,
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };

      baseService.add(options);
    };
    let updateMerchantDeferred;
    const updateMerchant = function(model, code, deferred) {
      const options = {
        url: "payments/merchants/{code}",
        data: model,
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      },
        params = {
          code: code
        };

      baseService.update(options, params);
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
      createMerchant: function(model) {
        createMerchantDeferred = $.Deferred();
        createMerchant(model, createMerchantDeferred);

        return createMerchantDeferred;
      },
      updateMerchant: function(model, code) {
        updateMerchantDeferred = $.Deferred();
        updateMerchant(model, code, updateMerchantDeferred);

        return updateMerchantDeferred;
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