define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  /**
   * Main file for BaseConfiguration Model. This file contains the model definition
   * for list of properties fetched from the server from table digx_fw_config_all_b through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch the list of properties:
   *          <ul>
   *              <li>[init()]{@link FeedbackModel.init}</li>.
   *
   *              <li>[getProperty()]{@link FeedbackModel.getFeedbackQuestion}</li>
   *
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~FeedbackModel
   * @class FeedbackModel
   */
  const FeedbackModel = function () {
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let getFeedbackUserRoleDeferred;
    /**
     * Private method to fetch the Feedback Question. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function getFeedbackUserRole
     * @memberOf FeedbackModel
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const getFeedbackUserRole = function (deferred) {
      const options = {
        url: "enterpriseRoles?isLocal=true",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let getFeedbackTemplateDeferred;
    /**
     * Private method to fetch the Feedback Question. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function getFeedbackTemplate
     * @memberOf FeedbackModel
     * @param {Object} deferred - An object type Deferred.
     * @param {string} templateId - Template Id of template to be fetched.
     * @returns {void}
     * @private
     */
    const getFeedbackTemplate = function (deferred, templateId) {
      const options = {
        url: "feedback/template/{templateId}",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, {
        templateId: templateId
      });
    };

    return {
      getFeedbackUserRole: function () {
        getFeedbackUserRoleDeferred = $.Deferred();
        getFeedbackUserRole(getFeedbackUserRoleDeferred);

        return getFeedbackUserRoleDeferred;
      },
      getFeedbackTemplate: function (templateId) {
        getFeedbackTemplateDeferred = $.Deferred();
        getFeedbackTemplate(getFeedbackTemplateDeferred, templateId);

        return getFeedbackTemplateDeferred;
      }
    };
  };

  return new FeedbackModel();
});