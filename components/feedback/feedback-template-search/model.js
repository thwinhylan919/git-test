define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for feedbackModel Model. This file contains the model definition
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
  const FeedbackModel = function() {
    const baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let getFeedbackUserRoleDeferred;
    /**
     * Private method to fetch the Feedback User Role. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function getFeedbackUserRole
     * @memberOf FeedbackModel
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const getFeedbackUserRole = function(deferred) {
      const options = {
        url: "enterpriseRoles?isLocal=true",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchTemplateListDeferred;
    /**
     * Private method to fetch the Feedback template list based on search. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function fetchTemplateList
     * @memberOf FeedbackModel
     * @param {string} templateIdentifier - Feedback template identifier for request to be searched.
     * @param {string} templateName - Feedback template name for request to be searched.
     * @param {string} roles - Feedback roles for request to be searched.
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const fetchTemplateList = function(templateIdentifier, templateName, roles, deferred) {
      const options = {
          url: "feedback/template?templateIdentifier={templateIdentifier}&templateName={templateName}&roles={roles}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          templateIdentifier: templateIdentifier,
          templateName: templateName,
          roles: roles
        };

      baseService.fetch(options, params);
    };

    return {
      getFeedbackUserRole: function() {
        getFeedbackUserRoleDeferred = $.Deferred();
        getFeedbackUserRole(getFeedbackUserRoleDeferred);

        return getFeedbackUserRoleDeferred;
      },
      fetchTemplateList: function(templateIdentifier, templateName, roles) {
        fetchTemplateListDeferred = $.Deferred();
        fetchTemplateList(templateIdentifier, templateName, roles, fetchTemplateListDeferred);

        return fetchTemplateListDeferred;
      }
    };
  };

  return new FeedbackModel();
});