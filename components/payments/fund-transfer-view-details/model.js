define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Const FundTransferDetailsModel - description.
   *
   * @return {type}  Description.
   */
  const FundTransferDetailsModel = function() {
    const baseService = BaseService.getInstance();
    let downloadDeferred;

    /**
     * Const download - description.
     *
     * @param  {type} deferred    - - - - - - - - - - - - - - Description.
     * @param  {type} paymentId   Description.
     * @param  {type} paymentType Description.
     * @param  {type} uri         Description.
     * @return {type}             Description.
     */
    const download = function(deferred, paymentId, paymentType, uri) {
      const options = {
          url: "payments/{paymentType}/{uri}/{paymentId}?media=application/pdf",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          paymentId: paymentId,
          uri: uri,
          paymentType: paymentType
        };

      baseService.downloadFile(options, params);
    };

    return {
      download: function(paymentId, paymentType, uri) {
        downloadDeferred = $.Deferred();
        download(downloadDeferred, paymentId, paymentType, uri);

        return downloadDeferred;
      }
    };
  };

  return new FundTransferDetailsModel();
});
