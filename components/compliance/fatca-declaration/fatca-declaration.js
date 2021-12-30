define([

  "knockout",

  "ojL10n!resources/nls/compliance",
  "ojL10n!resources/nls/compliance-entity",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojcheckboxset"
], function(ko, ResourceBundle, ResourceBundleEntity) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.entityResource = ResourceBundleEntity;
    self.dataLoaded = ko.observable();
    self.dataLoaded(true);
  };
});