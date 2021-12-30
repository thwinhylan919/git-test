define([
  "ojs/ojcore",
  "knockout",

  "ojL10n!resources/nls/location-search-results",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource"
], function(oj, ko, locale) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = locale;
    self.locationDetails = ko.observable();
    rootParams.baseModel.registerComponent("location-read", "location-maintenance");

    self.resultsDataSource = new oj.ArrayTableDataSource(self.results(), {
      idAttribute: "id"
    });

    self.paginationDataSource = new oj.PagingTableDataSource(self.resultsDataSource);

    self.showLocationDetails = function(locationDetails) {
      self.locationDetails(locationDetails);

      const context = {};

      context.locationDetails = self.locationDetails;
      context.countryEnumsLoaded = self.countryEnumsLoaded;
      context.countryEnums = self.countryEnums;

      rootParams.dashboard.loadComponent("location-read", context);
    };

    self.renderAddress = function(data) {
      let address = "";

      address = data.postalAddress.line1 + "," + data.postalAddress.line2 + "," + data.postalAddress.city + "," + data.postalAddress.country;

      return address;
    };
  };
});
