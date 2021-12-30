define([
  "jquery",
  "baseService"
], function($, BaseService) {
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
  const FeedbackModel = function() {
    const baseService = BaseService.getInstance();
    let getFeedbackQuestionDeferred;
    /**
     * Private method to fetch the Feedback Question. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function getFeedbackQuestion
     * @memberOf FeedbackModel
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const getFeedbackQuestion = function(deferred) {
      const options = {
        url: "feedback/questions",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let getFeedbackOptionListDeferred;
    const getFeedbackOptionList = function(deferred) {
      const options = {
        url: "feedback/options",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let addQuestionDeferred;
    /**
     * AddQuestion - adding a new question.
     *
     * @param  {string} data     - An string containg the data to be sent to host.
     * @param  {Object} deferred - An Object containg the data to be sent to host.
     * @returns {Object} Question      returns question array.
     */
    const addQuestion = function(data, deferred) {
      const option = {
        url: "feedback/questions",
        data: data,
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.add(option);
    };

    return {
      /**
       * GetFeedbackQuestion - get feedback questions.
       *
       * @returns {Object}  Returns questions.
       */
      getFeedbackQuestion: function() {
        getFeedbackQuestionDeferred = $.Deferred();
        getFeedbackQuestion(getFeedbackQuestionDeferred);

        return getFeedbackQuestionDeferred;
      },
      /**
       * AddQuestion - description.
       *
       * @param  {string} data - An string containg the data to be sent to host.
       * @returns {Object}      Returns object.
       */
      addQuestion: function(data) {
        addQuestionDeferred = $.Deferred();
        addQuestion(data, addQuestionDeferred);

        return addQuestionDeferred;
      },
      /**
       * GetFeedbackOptionList - description.
       *
       * @returns {Object}  Returns option object.
       */
      getFeedbackOptionList: function() {
        getFeedbackOptionListDeferred = $.Deferred();
        getFeedbackOptionList(getFeedbackOptionListDeferred);

        return getFeedbackOptionListDeferred;
      }
    };
  };

  return new FeedbackModel();
});