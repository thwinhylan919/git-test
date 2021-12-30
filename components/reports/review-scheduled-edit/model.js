define(["jquery", "baseService"], function ($, BaseService) {
  "use strict";

  const ScheduledReportEditModel = function () {
    const baseService = BaseService.getInstance(),
      Model = function () {
        this.payload = {
          reportRequestIdentifier: null,
          formatType: null,
          reportSchFreq: null,
          startTime: null,
          endTime: null,
          reportType: null
        };
      };
    let updateScheduledEditDeferred;
    const updateScheduledEdit = function (deferred, payload) {
      const options = {
        url: "reports/reportRequest",
        data: payload,
        success: function (data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.update(options);
    };

    return {
      getNewModel: function () {
        return new Model();
      },
      updateScheduledEdit: function (payload) {
        updateScheduledEditDeferred = $.Deferred();
        updateScheduledEdit(updateScheduledEditDeferred, payload);

        return updateScheduledEditDeferred;
      }
    };
  };

  return new ScheduledReportEditModel();
});