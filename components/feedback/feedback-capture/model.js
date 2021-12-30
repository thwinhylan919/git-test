define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  /**
   * Main file for Feedback Model. This file contains the model definition
   * for list of scales fetched from the server from table digx_fd_scale  through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch the list of properties:
   *          <ul>
   *              <li>[init()]{@link FeedbackModel.init}</li>.
   *
   *              <li>[getProperty()]{@link FeedbackModel.getFeedbackDefinition}</li>
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
    let getFeedbackTemplateDeferred;
    /**
     * Private method to fetch the Feedback Scale. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function getFeedbackTemplate
     * @memberOf FeedbackModel
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const getFeedbackTemplate = function (deferred) {
      const options = {
        url: "feedback/template?roleIdentifier=Y&transactionId=GENERIC",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let getFeedbackDefinitionDeferred;
    /**
     * Private method to fetch the Feedback Scale. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function getFeedbackDefinition
     * @memberOf FeedbackModel
     * @param {Object} deferred - An object type Deferred.
     * @param {string} transactionId - A transactionId for template to update.
     * @returns {void}
     * @private
     */
    const getFeedbackDefinition = function (deferred, transactionId) {
      const options = {
        url: "feedback/definitions/{transactionId}?templateId=4970",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, {
        transactionId: transactionId
      });
    };
    let neverAskMeAgainDeferred;
    /**
     * Private method to neverAskMeAgain
     * This method used for when user click on never ask me again.
     *
     * @function neverAskMeAgain
     * @memberOf FeedbackModel
     * @param {string} data - An object type deferred
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const neverAskMeAgain = function (data, deferred) {
      const
        options = {
          url: "me/preferences",
          data: data,
          success: function (data) {
            deferred.resolve(data);
          },
          error: function (data) {
            deferred.reject(data);
          }
        };

      baseService.update(options);
    };
    let captureFeedbackDeferred;
    /**
     * Private method to add the new property for the given category id. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function captureFeedback
     * @memberOf BaseConfigurationModel
     * @param {Object} data - A transactionId for template to update.
     * @param {Object} deferred - A transactionId for template to update.
     * @returns {void}
     * @private
     */
    const captureFeedback = function (data, deferred) {
      const option = {
        url: "feedback",
        data: data,
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.add(option);
    };
    let getFeedbackScaleImageDeferred;
    /**
     * Private method to fetch the Feedback Scale Image. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function getFeedbackScaleImage
     * @memberOf FeedbackModel
     * @param {Object} deferred - An object type Deferred.
     * @param {string} contentId -  Content id is used for rating.
     * @returns {void}
     * @private
     */
    const getFeedbackScaleImage = function (deferred, contentId) {
      const options = {
        url: "contents/{contentId}",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options, {
        contentId: contentId
      });
    };
    /**
     * Private method to fetch user preferences. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function getPreference
     * @memberOf FeedbackModel
     * @param {Object} deferred - An object type Deferred
     * @returns {void}
     * @private
     */
    let getPreferenceDeferred;
    const getPreference = function (deferred) {
      const options = {
        url: "me/preferences",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      getFeedbackTemplate: function () {
        getFeedbackTemplateDeferred = $.Deferred();
        getFeedbackTemplate(getFeedbackTemplateDeferred);

        return getFeedbackTemplateDeferred;
      },
      getFeedbackDefinition: function (transactionId) {
        getFeedbackDefinitionDeferred = $.Deferred();
        getFeedbackDefinition(getFeedbackDefinitionDeferred, transactionId);

        return getFeedbackDefinitionDeferred;
      },
      captureFeedback: function (data) {
        captureFeedbackDeferred = $.Deferred();
        captureFeedback(data, captureFeedbackDeferred);

        return captureFeedbackDeferred;
      },
      neverAskMeAgain: function (data) {
        neverAskMeAgainDeferred = $.Deferred();
        neverAskMeAgain(data, neverAskMeAgainDeferred);

        return neverAskMeAgainDeferred;
      },
      getPreference: function () {
        getPreferenceDeferred = $.Deferred();
        getPreference(getPreferenceDeferred);

        return getPreferenceDeferred;
      },
      getFeedbackScaleImage: function (contentId) {
        getFeedbackScaleImageDeferred = $.Deferred();
        getFeedbackScaleImage(getFeedbackScaleImageDeferred, contentId);

        return getFeedbackScaleImageDeferred;
      }
    };
  };

  return new FeedbackModel();
});