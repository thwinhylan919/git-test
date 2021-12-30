define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const reportGenerationModel = function() {
    const Model = function() {
        this.reportParams = {
          merchantCode: null,
          startDate: null,
          enddate: null
        };
      },
      baseService = BaseService.getInstance();
    let listMerchantDeferred;
    const listMerchant = function(deferred, code) {
      const options = {
          url: "payments/merchants?code={code}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          code: code
        };

      baseService.fetch(options, params);
    };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      listMerchant: function(code) {
        listMerchantDeferred = $.Deferred();
        listMerchant(listMerchantDeferred, code);

        return listMerchantDeferred;
      }
    };
  };

  return new reportGenerationModel();
});