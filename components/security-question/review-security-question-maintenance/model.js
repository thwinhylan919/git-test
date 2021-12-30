define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";

  const reviewSecurityQuestionModel = function () {
    const Model = function () {
        this.createSecurityQuestionPayload = {
          id: null,
          secQueMapping: [{
            questionId: null,
            question: null,
            languageId: null
          }]
        };
      },
      baseService = BaseService.getInstance();
    let createSecurityQuestionDeferred;
    const createSecurityQuestion = function (data, deferred) {
      const options = {
        url: "securityQuestion",
        data: data,
        success: function (data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.add(options);
    };
    let updateSecurityQuestionDeferred;
    const updateSecurityQuestion = function (data, maintenanceId, deferred) {
      const params = {
          maintenanceId: maintenanceId
        },
        options = {
          url: "securityQuestion/{maintenanceId}",
          data: data,
          success: function (data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

      baseService.update(options, params);
    };

    return {
      createSecurityQuestion: function (data) {
        createSecurityQuestionDeferred = $.Deferred();
        createSecurityQuestion(data, createSecurityQuestionDeferred);

        return createSecurityQuestionDeferred;
      },
      updateSecurityQuestion: function (data, maintenanceId) {
        updateSecurityQuestionDeferred = $.Deferred();
        updateSecurityQuestion(data, maintenanceId, updateSecurityQuestionDeferred);

        return updateSecurityQuestionDeferred;
      },
      getNewModel: function () {
        return new Model();
      }
    };
  };

  return new reviewSecurityQuestionModel();
});