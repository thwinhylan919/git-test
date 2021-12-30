/**
 * Model for review
 * @param1 {object} jquery instance
 * @param2 {object} BaseService base service instance for server communication
 * return {object} originationMaintenanceModel Modal instance
 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Const originationMaintenanceModel - description.
   *
   * @return {type}  Description.
   */
  const originationMaintenanceModel = function() {
    const baseService = BaseService.getInstance();
    let fireBatchDeferred;
    /**
     * FireCleanupBatch - fires the batch request that deletes each financial parameter.
     *
     * @param  {type} deferred             - - - - - - - - - - - - - - - - Description.
     * @param  {type} batchRequest         Description.
     * @return {type}                      Description.
     */
    const fireCleanupBatch = function(deferred, batchRequest) {
      const options = {
        url: "batch",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.batch(options, {}, batchRequest);
    };
    let saveDatafireBatchDeferred;
    /**
     * FiresaveDataBatch - fires the batch request that creates each financial parameter.
     *
     * @param  {type} deferred             - - - - - - - - - - - - - - - - Description.
     * @param  {type} batchRequest         Description.
     * @return {type}                      Description.
     */
    const firesaveDataBatch = function(deferred, batchRequest) {
      const options = {
        url: "batch",
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        }
      };

      baseService.batch(options, {}, batchRequest);
    };

    return {
      /**
       * CleanExistingData.
       *
       * @param  {type} batchRequest           - Description.
       * @return {type}                       Description.
       */
      cleanExistingData: function(batchRequest) {
        fireBatchDeferred = $.Deferred();
        fireCleanupBatch(fireBatchDeferred, batchRequest);

        return fireBatchDeferred;
      },
      /**
       * SaveData.
       *
       * @param  {type} batchRequest           - Description.
       * @return {type}                       Description.
       */
      saveData: function(batchRequest) {
        saveDatafireBatchDeferred = $.Deferred();
        firesaveDataBatch(saveDatafireBatchDeferred, batchRequest);

        return saveDatafireBatchDeferred;
      }
    };
  };

  return new originationMaintenanceModel();
});
