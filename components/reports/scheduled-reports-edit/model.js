define(["baseService"], function(BaseService) {
  "use strict";

  const ScheduledReportEditModel = function() {
    const baseService = BaseService.getInstance(),
      Model = function() {
        this.payload = {
          reportRequestIdentifier: null,
          formatType: null,
          reportSchFreq: null,
          startTime: null,
          endTime: null,
          reportType: null
        };
      };

    return {
      getNewModel: function() {
        return new Model();
      },
      getScheduledReportFrequencyTypes: function() {
        const options = {
          url: "enumerations/scheduledReportFrequencyTypes"
        };

        return baseService.fetch(options);
      }
    };
  };

  return new ScheduledReportEditModel();
});