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
    MenuModel = function() {
      let fetchNotificationListDeferred;
      const fetchNotificationList = function(deferred) {
        const options = {
          url: "mailbox/mailers",
          throttle: false,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
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
      let readMailerDeffered;
      const readMailer = function(messageId, deferred) {
        const params = {
            mailerId: messageId
          },
          options = {
            url: "mailbox/mailers/{mailerId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };

        baseService.fetch(options, params);
      };

      let getMailBoxCountDeferred;
      const getMailBoxCount = function (deferred) {
        const options = {
          url: "mailbox/count?msgFlag=T",
          selfLoader: true,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function(data){
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      };

      return {
        fetchNotificationList: function() {
          fetchNotificationListDeferred = $.Deferred();
          fetchNotificationList(fetchNotificationListDeferred);

          return fetchNotificationListDeferred;
        },
        fireBatch: function(batchRequest, type) {
          fireBatchDeferred = $.Deferred();
          fireBatch(fireBatchDeferred, batchRequest, type);

          return fireBatchDeferred;
        },
        readMailer: function(messageId) {
          readMailerDeffered = $.Deferred();
          readMailer(messageId, readMailerDeffered);

          return readMailerDeffered;
        },
        getMailBoxCount: function() {
          getMailBoxCountDeferred = $.Deferred();
          getMailBoxCount(getMailBoxCountDeferred);

          return getMailBoxCountDeferred;
        }
      };
    };

  return new MenuModel();
});