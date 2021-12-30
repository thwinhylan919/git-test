define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  /**
   * Model for application loan statement input in the Application tracking additional details section. It serves as the model where the data to be used by the application details section is defined. Since this model is tech agnostic, it can be coupled with any technology.
   *
   * @namespace ApplicationLoanStatementInputModel~Model
   * @class
   * @property {Object[]} sections - Array containing the distinct additional information sections
   */
  const ApplicationLoanStatementInputModel = function () {
    /**
     * @class Model
     * @private
     * @memberOf ApplicationLoanStatementInputModel~Model
     */
    const Model = function () {
        this.loanStatement = {
          required: "",
          frequency: ""
        };
      },
      /**
       * baseService instance through which all the rest calls will be made.
       *
       * @attribute baseService
       * @type {Object} BaseService Instance
       * @private
       */
      baseService = BaseService.getInstance();
    let frequencyListDeffered, configurationDeffered, configureLoanStatementDeffered;
    const fetchFrequencyList = function (deferred) {
        const options = {
          url: "enumerations/frequency?for=loanStatement",
          success: function (data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      },
      fetchConfiguration = function (submissionId, applicationId, deferred) {
        const params = {
            submissionId: submissionId,
            applicationId: applicationId
          },
          options = {
            url: "submissions/{submissionId}/applications/{applicationId}/configuration",
            success: function (data) {
              deferred.resolve(data);
            }
          };

        baseService.fetch(options, params);
      },
      configureLoanStatement = function (submissionId, applicationId, data, deferred) {
        const params = {
            submissionId: submissionId,
            applicationId: applicationId
          },
          options = {
            url: "submissions/{submissionId}/applications/{applicationId}/configuration",
            data: JSON.stringify(data),
            success: function (data) {
              deferred.resolve(data);
            }
          };

        baseService.update(options, params);
      };

    return {
      fetchFrequencyList: function () {
        frequencyListDeffered = $.Deferred();
        fetchFrequencyList(frequencyListDeffered);

        return frequencyListDeffered;
      },
      fetchConfiguration: function (submissionId, applicationId) {
        configurationDeffered = $.Deferred();
        fetchConfiguration(submissionId, applicationId, configurationDeffered);

        return configurationDeffered;
      },
      configureLoanStatement: function (submissionId, applicationId, data) {
        configureLoanStatementDeffered = $.Deferred();
        configureLoanStatement(submissionId, applicationId, data, configureLoanStatementDeffered);

        return configureLoanStatementDeffered;
      },
      getNewModel: function (modelData) {
        return new Model(modelData);
      }
    };
  };

  return new ApplicationLoanStatementInputModel();
});