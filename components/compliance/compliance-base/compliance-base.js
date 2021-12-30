define([

  "knockout",
  "jquery",

  "ojL10n!resources/nls/compliance",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox"
], function(ko, $, ResourceBundle) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.dataLoaded = ko.observable();
    self.complianceComponentName = ko.observable();

    if (self.params.personalDetails.partyType === "IND" || self.params.personalDetails.partyType === "INDIVIDUAL") {
      self.formType = "INDIVIDUAL";
      Params.baseModel.registerTransaction("fatca-compliance", "compliance");
      self.complianceComponentName("fatca-compliance");
    } else {
      self.formType = "ENTITY";
      Params.baseModel.registerTransaction("entity-fatca-compliance", "compliance");
      self.complianceComponentName("entity-fatca-compliance");
    }

    self.dataLoaded(true);

    self.infoPopUp = function(id, open) {
      const popup = document.querySelector("#" + id);

      if (open) {
        const listener = popup.open("#exchange-rate-disclaimer");

        popup.addEventListener("ojOpen", listener);
        $("#" + id).css("width", "15rem");
      } else {
        popup.close();
      }
    };
  };
});