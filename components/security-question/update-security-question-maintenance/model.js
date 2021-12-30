define([], function () {
  "use strict";

  const updateSecurityQuestionModel = function () {
    const Model = function () {
      this.updateSecurityQuestionPayload = {
        id: null,
        secQueMapping: [{
          questionId: null,
          question: null,
          languageId: null,
          maintenanceId: null
        }]
      };
    };

    return {
      getNewModel: function () {
        return new Model();
      }
    };
  };

  return new updateSecurityQuestionModel();
});