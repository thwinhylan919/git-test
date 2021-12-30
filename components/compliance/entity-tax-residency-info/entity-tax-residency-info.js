define([

  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/compliance-entity",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojdefer",
  "ojs/ojpopup"
], function(ko, $, EntityTaxResidencyInfoModel, ResourceBundle) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.index = Params.index;
    self.taxResidenceCountries = ko.observableArray();
    self.taxResidencyInfoLoaded = ko.observable(false);

    const taxResidencyInfoObj = {
      taxResidenceCountry: "",
      taxIdentifierType: "",
      taxIdentifier: "",
      tinAvailable: "",
      tin: "",
      tinNonAvailabilityReason: ""
    };

    self.addCountry = function(index) {
      const taxResidencyOtherCountryInfoTracker = document.getElementById("taxResidencyOtherCountryInfoTracker" + index);

      if (taxResidencyOtherCountryInfoTracker && taxResidencyOtherCountryInfoTracker.valid !== "valid") {
        taxResidencyOtherCountryInfoTracker.showMessages();
        taxResidencyOtherCountryInfoTracker.focusOn("@firstInvalidShown");

        return false;
      }

      self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo.push(JSON.parse(JSON.stringify(taxResidencyInfoObj)));
      self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo().length - 1].tinAvailable = ko.observable("true");
      self.taxIdentificationType.push(ko.observable(""));
    };

    self.removeCountry = function(index) {
      self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo.splice(index, 1);
      self.taxIdentificationType.splice(index, 1);
    };

    const taxIdentificationTypeOther = {
      code: "OTHER",
      description: self.resource.taxResidencyInfo.other
    };

    self.taxCountryChanged = function(event, data, index) {
      self.taxResidenceCountriesLoaded(false);

      EntityTaxResidencyInfoModel.fetchTaxIdentificationTypes(event.detail.value).done(function(data) {
        self.taxIdentificationTypes()[index.$index()] = ko.observableArray([]);

        if (data.enumRepresentations && data.enumRepresentations.length > 0) {
          self.taxIdentificationTypes()[index.$index()](data.enumRepresentations[0].data);
        }

        self.taxIdentificationTypes()[index.$index()].push(JSON.parse(JSON.stringify(taxIdentificationTypeOther)));
        self.taxResidenceCountriesLoaded(true);
      });
    };

    self.infoPopUp = function (id, open) {
      const popup = document.querySelector("#" + id);

      if (open) {
        const listener = popup.open("exchange-rate-disclaimer");

        popup.addEventListener("ojOpen", listener);
        $("#" + id).css("width", "15rem");
      } else {
        popup.close();
      }
    };

    self.continueTaxResidencyInfo = function() {
      const taxResidencyInfoTracker = document.getElementById("taxResidencyInfoTracker");

      if (taxResidencyInfoTracker && taxResidencyInfoTracker.valid !== "valid") {
        taxResidencyInfoTracker.showMessages();
        taxResidencyInfoTracker.focusOn("@firstInvalidShown");

        return false;
      }

      self.stages()[self.index].expanded(false);
      self.stages()[self.index + 1].expanded(true);
    };

    EntityTaxResidencyInfoModel.fetchTaxResidenceCountries().done(function(data) {
      self.taxResidenceCountries(data.enumRepresentations[0].data);
      self.taxResidencyInfoLoaded(true);
    });
  };
});
