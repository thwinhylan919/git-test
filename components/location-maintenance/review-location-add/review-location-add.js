define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/review-location-add"
], function(ko,ReviewLocationAddModel, locale) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel.params);
    self.nls = locale;
    self.reviewData = params.rootModel.params.createData ? ko.toJS(params.rootModel.params.createData) : params.rootModel.params.transactionDetails.transactionSnapshot;
    self.back = ko.observable(false);
    params.dashboard.headerName(self.nls.headings.transactionName);
    params.baseModel.registerComponent("location-add", "location-maintenance");

    if (params.rootModel.params.transactionDetails && params.rootModel.params.transactionDetails.transactionSnapshot) {
            self.supportedServicesLoaded = ko.observable();
            self.supportedServices = ko.observableArray();
            self.selectedServices = ko.observableArray();

            ReviewLocationAddModel.fetchSupportedServices(params.rootModel.params.transactionDetails.transactionSnapshot.type).done(function (data) {
                    self.supportedServices(data.serviceDTOs);
                    self.supportedServicesLoaded(true);
                });

                ko.utils.arrayForEach(self.reviewData.supportedServices, function (item) {
                    self.selectedServices.push(item.name);
                });
     }

    self.workTimings = function() {
      let timings = "";

      timings = self.reviewData.workDays[0] + ":" + self.reviewData.workTimings[0];

      return timings;
    };

    self.workTimings1 = function() {
      if (self.reviewData.workDays[1] !== null) {
        let timings = "";

        timings = self.reviewData.workDays[1] + ":" + self.reviewData.workTimings[1];

        return timings;
      }
    };

    self.edit = function() {
      self.back(true);
      params.dashboard.loadComponent("location-add", {});
    };

    self.confirm = function () {
      if (self.createData.type() !== "ATM") {
        ReviewLocationAddModel.addBranchLocation(ko.mapping.toJSON(self.createData)).done(function (data, status, jqXhr) {
          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.nls.headings.transactionName,
            transactionResponse: data
          });
        });
      } else {
        ReviewLocationAddModel.addAtmLocation(ko.mapping.toJSON(self.createData)).done(function (data, status, jqXhr) {
          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.nls.headings.transactionName,
            transactionResponse: data
          });
        });
      }
    };
  };
});