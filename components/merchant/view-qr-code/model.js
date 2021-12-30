define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  const qrCodeModel = function() {
    const baseService = BaseService.getInstance();
    let downloadMerchantQRCodeDeferred;
    const downloadMerchantQRCode = function(deferred, merchantCode) {
      const options = {
        url: "payments/transfers/qrCode/merchants/{merchantCode}?download=true",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.downloadFile(options, {
        merchantCode: merchantCode
      });
    };

    return {
      getMerchantQRCode: function(merchantCode) {
        const options = {
          url: "payments/transfers/qrCode/merchants/{merchantCode}?download=false",
          dataType: "text"
        };

        return baseService.fetch(options, {
          merchantCode: merchantCode
        });
      },
      downloadMerchantQRCode: function(merchantCode) {
        downloadMerchantQRCodeDeferred = $.Deferred();
        downloadMerchantQRCode(downloadMerchantQRCodeDeferred, merchantCode);

        return downloadMerchantQRCodeDeferred;
      }
    };
  };

  return new qrCodeModel();
});