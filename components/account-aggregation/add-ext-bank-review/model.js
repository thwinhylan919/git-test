define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ReviewExtBankModel = function() {
    const baseService = BaseService.getInstance(),
      Model = function() {
        this.UpdatedBankDetails = {
          bankCode: null,
          bankName: null,
          url: null,
          address: {
            line1: null,
            line2: null,
            line3: null,
            city: null,
            state: null,
            country: null,
            zipCode: null
          },
          logo: {
            value: null,
            maskingQualifier: null,
            maskingAttribute: null,
            indirectionType: null,
            displayValue: null
          },
          oauth_enabled: false,
          authorizationDetail: {
            authurl: null,
            tokenurl: null,
            revokeurl: null,
            client_id: null,
            client_secret: null,
            externalAPIs: []
          }
        };
      };
    let createBankDeferred;
    const createBank = function(model, deferred) {
      const options = {
        url: "externalbanks",
        data: model,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };

      baseService.add(options);
    };
    let updateBankDeferred;
    const updateBank = function(bankCode, model, deferred) {
      const options = {
        url: "externalbanks/" + bankCode,
        data: model,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.update(options);
    };
    let deleteBankDeferred;
    const deleteBank = function(externalBankId, deferred) {
      const options = {
          url: "externalbanks/{externalBankId}",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        },
        params = {
          externalBankId: externalBankId
        };

      baseService.remove(options, params);
    };
    let retrieveImageDeffered;
    const retrieveImage = function(id, deferred) {
      const options = {
          url: "contents/{id}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          id: id
        };

      baseService.fetch(options, params);
    };
    let uploadImageDeffered;
    const uploadImage = function(form, deferred) {
      const options = {
        url: "contents",
        formData: form,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.uploadFile(options);
    };

    return {
      getNewModel: function() {
        return new Model();
      },
      createBank: function(model) {
        createBankDeferred = $.Deferred();
        createBank(model, createBankDeferred);

        return createBankDeferred;
      },
      updateBank: function(bankCode, model) {
        updateBankDeferred = $.Deferred();
        updateBank(bankCode, model, updateBankDeferred);

        return updateBankDeferred;
      },
      deleteBank: function(id) {
        deleteBankDeferred = $.Deferred();
        deleteBank(id, deleteBankDeferred);

        return deleteBankDeferred;
      },
      retrieveImage: function(id) {
        retrieveImageDeffered = $.Deferred();
        retrieveImage(id, retrieveImageDeffered);

        return retrieveImageDeffered;
      },
      uploadImage: function(form) {
        uploadImageDeffered = $.Deferred();
        uploadImage(form, uploadImageDeffered);

        return uploadImageDeffered;
      }
    };
  };

  return new ReviewExtBankModel();
});