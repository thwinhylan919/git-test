define([
  "knockout",
  "./model",
  "ojL10n!lzn/alpha/resources/nls/application-status-history"
], function (ko, ApplicationStatusHistoryModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;
    let i;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.headingText(self.resource.statusHistory);
    self.statusHistory = ko.observableArray([]);
    self.applicationStateStringMap = ko.observable("");

    self.findApplicationStateValue = function (code) {
      let index;

      for (index = 0; index < self.applicationStateStringMap().length; index++) {
        if (self.applicationStateStringMap()[index].code === code) {
          return self.applicationStateStringMap()[index].description;
        }
      }

      return self.resource.processing;
    };

    ApplicationStatusHistoryModel.fetchApplicationHistory(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function (data) {
      let hrs, date, min;

      if (data.statusUpdateDetails) {
        ApplicationStatusHistoryModel.fetchApplicationStateStringMap(data.statusUpdateDetails).done(function (data, statusHistory) {
          self.applicationStateStringMap(data.enumRepresentations[0].data, statusHistory);

          for (i = 0; i < statusHistory.length; i++) {
            statusHistory[i].currentStatus = self.findApplicationStateValue(statusHistory[i].currentStatus);

            if (statusHistory[i].statusUpdatedOn) {
              statusHistory[i].statusUpdatedOn = new Date(statusHistory[i].statusUpdatedOn);
              hrs = statusHistory[i].statusUpdatedOn.getHours();
              date = statusHistory[i].statusUpdatedOn.toDateString();
              min = statusHistory[i].statusUpdatedOn.getMinutes();

              statusHistory[i].statusUpdatedOn = rootParams.baseModel.format(self.resource.statusUpdatedOn, {
                date: date,
                hrs: hrs,
                min: min
              });
            }
          }

          self.statusHistory(statusHistory);
        });
      }
    });
  };
});