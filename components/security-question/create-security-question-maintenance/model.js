define([
], function () {
  "use strict";

  const createSecurityQuestionModel = function () {
    const Model = function () {
        this.createSecurityQuestionPayload = {
          id: null,
          secQueMapping: [{
            question: null,
            languageId: null
          }],
          version: "1"
        };
      };

    return {
      getNewModel: function () {
        return new Model();
      }
    };
  };

  return new createSecurityQuestionModel();
});