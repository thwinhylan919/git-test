define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    AddExtBankModel = function() {
      let bankListDeferred;
      const getBankList = function(bankName, deferred) {
        const options = {
          url: "externalbanks?bankName=" + bankName,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      };
      let fetchBankDetailsDeferred;
      const getBankDetails = function(bankName, deferred) {
        const options = {
            url: "banks/{bankName}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            bankName: bankName
          };

        baseService.fetch(options, params);
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

      return {
        getBankList: function(bankName) {
          bankListDeferred = $.Deferred();
          getBankList(bankName, bankListDeferred);

          return bankListDeferred;
        },
        getBankDetails: function(bankName) {
          fetchBankDetailsDeferred = $.Deferred();
          getBankDetails(bankName, fetchBankDetailsDeferred);

          return fetchBankDetailsDeferred;
        },
        retrieveImage: function(id) {
          retrieveImageDeffered = $.Deferred();
          retrieveImage(id, retrieveImageDeffered);

          return retrieveImageDeffered;
        }
      };
    };

  return new AddExtBankModel();
});