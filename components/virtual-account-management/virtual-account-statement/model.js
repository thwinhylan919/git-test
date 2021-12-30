define([
  "baseService"
], function (BaseService) {
  "use strict";

  /**
   * Main file for Virtual Account Model. This file contains the model definition
   * for list of scales fetched from the server through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch the list of properties:
   *          <ul>
   *              <li>[init()]{@link VirtualAccountStatementModel.init}</li>.
   *              <li>[getProperty()]{@link VirtualAccountStatementModel.getEntityList}</li>
   *              <li>[getProperty()]{@link VirtualAccountStatementModel.getBranchCode}</li>
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~VirtualAccountModel
   * @class VirtualAccountModel
   */
  const VirtualAccountStatementModel = function () {
    const baseService = BaseService.getInstance(),

      /**
       * Private method to fetch the list of transaction for the statement.
       *
       * @function fetchTransactionList
       * @memberOf VirtualAccountStatementModel
       * @param {string} virtualAccount - A real customer number.
       * @param {string} q - The generic filtering parameter.
       * @param {string} media - media content for download.
       * @param {string} mediaFormat - media type for download.
       * @param {string} isdownload - download check
       * @returns {void}
       * @private
       */

      fetchTransactionList = function (virtualAccount, q, media, mediaFormat, isDownload) {
        const options = {
            url: "accounts/virtual/{virtualAccount}/statements?q={q}&media={media}&mediaFormat={mediaFormat}"
          },
          parameters = {
            virtualAccount: virtualAccount,
            q: q,
            media: media,
            mediaFormat: mediaFormat
          };

        if (isDownload === true) {
          return baseService.downloadFile(options, parameters);
        }

        parameters.media = undefined;
        parameters.mediaFormat = undefined;

        return baseService.fetch(options, parameters);

      },

      /**
       * Private method to fetch the virtual account.
       *
       * @function fetchVirtualAccount
       * @memberOf VirtualAccountStatementModel
       * @param {string} taskCode - Task Code of statement is being passed
       * @returns {void}
       * @private
       */
      fetchVirtualAccount = function (taskCode) {
        return baseService.fetch({
          url: "accounts/virtual?taskCode={taskCode}"
        }, {
          taskCode: taskCode
        });
      };

    return {
      fetchTransactionList: fetchTransactionList,
      fetchVirtualAccount: fetchVirtualAccount
    };
  };

  return new VirtualAccountStatementModel();
});