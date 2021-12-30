define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /* Extending predefined baseService to get ajax functions. */
  const baseService = BaseService.getInstance(),
    /**
     * Main file for Asset Information Model. This file contains the model definition
     * for asset information section and exports the AssetsInfoModel which can be injected
     * in any framework and developer will, by default get a self aware model for Asset
     * Information Section.<br/><br/>
     * The injected Model Class will have below properties:
     * <ul>
     *      <li>Model for Assets Section using [getNewModel()]{@link AssetsInfoModel.getNewModel}</li>
     *      <li>Service abstractions to fetch all the necessary component level data, which includes:
     *          <ul>
     *              <li>[init()]{@link AssetsInfoModel.init}</li>
     *              <li>[getNewModel()]{@link AssetsInfoModel.getNewModel}</li>
     *              <li>[getAssetTypeList()]{@link AssetsInfoModel.getAssetTypeList}</li>
     *              <li>[getExistingAssets()]{@link AssetsInfoModel.getExistingAssets}</li>
     *              <li>[saveModel()]{@link AssetsInfoModel.saveModel}</li>
     *              <li>[deleteModel()]{@link AssetsInfoModel.deleteModel}</li>
     *          </ul>.
     *      </li>
     * </ul>.
     *
     * @namespace AssetsInfo~AssetsInfoModel
     * @class AssetsInfoModel
     * @property {string} id - asset id
     * @property {string} type - type of selected asset
     * @property {Object} value - object to store value of asset
     * @property {Integer} value.amount - asset's worth
     * @property {string} value.currency - currency code used
     * @property {Integer} ownershipPercentage - ownership percentage
     */
    SentMailsModel = function() {
      let fetchAllSentMailsDeferred;
      const fetchAllSentMails = function(deferred) {
        const options = {
          url: "mailbox/mails?msgFlag=F&deleteStatus=false",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let retrieveAttachmentDeferred;
      const retrieveAttachment = function(contentId, deferred) {
        const params = {
          contentId: contentId
        },
        options = {
          url: "contents/{contentId}?transactionType=IM",
          selfLoader: true,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function() {
            deferred.reject();
          }
        };

        baseService.fetch(options, params);
      };
      let fireBatchDeferred;
      const fireBatch = function(deferred, batchRequest, type) {
        const options = {
          url: "batch",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.batch(options, {
          type: type
        }, batchRequest);
      };

      return {
        fetchAllSentMails: function() {
          fetchAllSentMailsDeferred = $.Deferred();
          fetchAllSentMails(fetchAllSentMailsDeferred);

          return fetchAllSentMailsDeferred;
        },
        retrieveAttachment: function(contentId) {
          retrieveAttachmentDeferred = $.Deferred();
          retrieveAttachment(contentId, retrieveAttachmentDeferred);

          return retrieveAttachmentDeferred;
        },
        fireBatch: function(batchRequest, type) {
          fireBatchDeferred = $.Deferred();
          fireBatch(fireBatchDeferred, batchRequest, type);

          return fireBatchDeferred;
        }
      };
    };

  return new SentMailsModel();
});