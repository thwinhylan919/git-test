define([
  "knockout",
  "ojL10n!resources/nls/investment-account-personal-details",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtrain",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojdatetimepicker",
  "ojs/ojgauge",
  "ojs/ojradioset",
  "ojs/ojselectcombobox"
], function(ko, resourceBundle, PersonalDetailsModel) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    self.fetchedGenders = ko.observableArray();
    self.identificationTypes = ko.observableArray();
    self.gendersLoaded = ko.observable(false);
    self.identificationTypesLoaded = ko.observable(false);
    params.dashboard.headerName(self.resource.openAccountHeader);
    self.today = ko.observable(params.baseModel.getDate());

    PersonalDetailsModel.getIdentificationType().done(function(data) {
      self.identificationTypes(data.enumRepresentations[0].data);
      self.identificationTypesLoaded(true);
    });

    PersonalDetailsModel.fetchGender().done(function(data) {
      self.fetchedGenders(data.enumRepresentations[0].data);
      self.gendersLoaded(true);
    });

  };
});
