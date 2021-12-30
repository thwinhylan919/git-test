define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/review-location-update"
], function(ko, ReviewLocationUpdateModel, locale) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel.params);
    self.nls = locale;
    self.back = ko.observable(false);
    params.dashboard.headerName(self.nls.headings.transactionName);
    self.reviewData = ko.toJS(params.rootModel.params.updateData);
    params.baseModel.registerComponent("location-update", "location-maintenance");

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

      params.dashboard.loadComponent("location-update", {
        showAddInfo: self.showAddInfo,
        hrsFrom: self.hrsFrom,
        hrsTo: self.hrsTo,
        startDay: self.startDay,
        endDay: self.endDay,
        hoursSelectedFrom: self.hoursSelectedFrom,
        hoursSelectedTo: self.hoursSelectedTo,
        weekendStartDay: self.weekendStartDay,
        weekendEndDay: self.weekendEndDay,
        alternatephoneNo: self.alternatephoneNo,
        addline3: self.addline3,
        addline4: self.addline4,
        type: self.type,
        phoneNo: self.phoneNo,
        postalAddress: self.postalAddress,
        atmBranchName: self.atmBranchName,
        latitude: self.latitude,
        longitude: self.longitude,
        countryEnumsLoaded: self.countryEnumsLoaded,
        countryEnums: self.countryEnums,
        id: self.id,
        supportedServicesLoaded: self.supportedServicesLoaded,
        supportedServices: self.supportedServices,
        selectedServices: self.selectedServices,
        version: self.version,
        locationDetails: self.locationDetails
      });
    };

    self.confirm = function() {
      if (self.reviewData.type !== "ATM") {
        ReviewLocationUpdateModel.updateBranchDetails(self.reviewData.id, ko.mapping.toJSON(self.updateData)).done(function(data, status, jqXhr) {
          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.nls.headings.transactionName,
            transactionResponse : data
          });
        });
      } else {
        ReviewLocationUpdateModel.updateAtmDetails(self.reviewData.id, ko.mapping.toJSON(self.updateData)).done(function(data, status, jqXhr) {
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
