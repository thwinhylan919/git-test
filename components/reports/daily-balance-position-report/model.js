define([], function () {
  "use strict";

  const reportGenerationModel = function () {
    const Model = function () {
      this.reportParams = {
        startDate: null,
        endDate: null
      };
    };

    return {
      getNewModel: function (dataModel) {
        return new Model(dataModel);
      }
    };
  };

  return new reportGenerationModel();
});