define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  /**
   *
   * FeedbackModel - Main file for Feedback Model. This file contains the model definition
   * for feedback information section and exports the FeedbackModel which can be injected
   * in any framework and developer will, by default get a self aware model for feedback Section.<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace Feedback~FeedbackModel
   * @class feedbackModel
   * @returns {Object}  return object containing information about feedback model
   */
  return function FeedbackModel() {
    const Model = function () {
        this.feedbackDefinitionDTO = [{
          transactionId: null,
          ratings: [{
            weightId: null,
            temp_questionSelected: null,
            temp_optionsRequestList: [],
            temp_questionDescription: null,
            temp_selectedOptions: [],
            questionRequestList: [{
              questionId: null,
              questionDescription: null,
              optionsRequestList: [{
                optionId: null,
                optionDescription: null
              }]
            }]
          }]
        }];
      },
      baseService = BaseService.getInstance();
    let getFeedbackTransactionDeferred;
    /**
     * Private method to fetch the Feedback Transaction. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function getFeedbackTransaction
     * @memberOf FeedbackModel
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const getFeedbackTransaction = function (deferred) {
      const options = {
        url: "resourceTasks?view=hierarchy",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let getFeedbackMappingDeferred;
    /**
     * Private method to fetch the Feedback Transaction. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function getFeedbackMapping
     * @memberOf FeedbackModel
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const getFeedbackMapping = function (deferred) {
      const options = {
        url: "feedback/definitions",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let getFeedbackQuestionDeferred;
    /**
     * Private method to fetch the Feedback Transaction. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function getFeedbackQuestion
     * @memberOf FeedbackModel
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const getFeedbackQuestion = function (deferred) {
      const options = {
        url: "feedback/questions",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let createFeedbackTransactionDeferred;
    /**
     * Private method to fetch the Feedback Transaction. This
     * method will resolve a passed deferred object, which can be returned
     * from calling function to the parent.
     *
     * @function createFeedbackTransaction
     * @memberOf FeedbackModel
     * @param {Object} data - An object type data.
     * @param {Object} deferred - An object type Deferred.
     * @returns {void}
     * @private
     */
    const createFeedbackTransaction = function (data, deferred) {
      const options = {
        url: "feedback/definitions",
        data: data,
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.add(options);
    };

    return {
      getNewModel: function () {
        return new Model();
      },
      getFeedbackTransaction: function () {
        getFeedbackTransactionDeferred = $.Deferred();
        getFeedbackTransaction(getFeedbackTransactionDeferred);

        return getFeedbackTransactionDeferred;
      },
      createFeedbackTransaction: function (data) {
        createFeedbackTransactionDeferred = $.Deferred();
        createFeedbackTransaction(data, createFeedbackTransactionDeferred);

        return createFeedbackTransactionDeferred;
      },
      getFeedbackQuestion: function () {
        getFeedbackQuestionDeferred = $.Deferred();
        getFeedbackQuestion(getFeedbackQuestionDeferred);

        return getFeedbackQuestionDeferred;
      },
      getFeedbackMapping: function () {
        getFeedbackMappingDeferred = $.Deferred();
        getFeedbackMapping(getFeedbackMappingDeferred);

        return getFeedbackMappingDeferred;
      }
    };
  };
});