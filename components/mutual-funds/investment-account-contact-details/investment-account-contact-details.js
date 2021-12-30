define([

  "knockout",

  "ojL10n!resources/nls/investment-account-contact-details",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtrain",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojdatetimepicker",
  "ojs/ojgauge",
  "ojs/ojselectcombobox"
], function(ko, resourceBundle, ContactInfoModel) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.openAccountHeader);
    self.countries = ko.observableArray();
    self.countriesLoaded = ko.observable(false);
    params.baseModel.registerElement("address-input");

    if (!self.openInvestmentAccountData().contactDetails[0].phoneNumber) {
      self.openInvestmentAccountData().contactDetails[0].phoneNumber = ko.observable(self.openInvestmentAccountData().contactDetails[0].phoneNumber);
      self.openInvestmentAccountData().contactDetails[0].email = ko.observable(self.openInvestmentAccountData().contactDetails[0].email);
    }

    if (self.openInvestmentAccountData().contactDetails[1] && self.openInvestmentAccountData().contactDetails[1].email) {
      self.showAnotherEmail = ko.observable(true);
    } else {
      self.showAnotherEmail = ko.observable(false);
    }

    if (self.openInvestmentAccountData().contactDetails[1] && self.openInvestmentAccountData().contactDetails[1].phoneNumber) {
      self.showAnotherContactNumber = ko.observable(true);
    } else {
      self.showAnotherContactNumber = ko.observable(false);
    }

    self.addressModel = {
      country: "",
      state: "",
      city: "",
      postalCode: "",
      line1: "",
      line2: ""
    };

    const pushObjContact = {
      contactType: "WPH",
      phoneNumber: null,
      email: null
    };

    self.addAnotherNumber = function() {
      if (!self.openInvestmentAccountData().contactDetails[1]) {
        self.openInvestmentAccountData().contactDetails.push(pushObjContact);
        self.showAnotherContactNumber(true);
      } else {
        self.showAnotherContactNumber(true);
      }
    };

    self.addAnotherEmail = function() {
      if (!self.openInvestmentAccountData().contactDetails[1]) {
        self.openInvestmentAccountData().contactDetails.push(pushObjContact);
        self.showAnotherEmail(true);
      } else {
        self.showAnotherEmail(true);
      }
    };

    self.deleteAnotherContact = function() {
      self.openInvestmentAccountData().contactDetails[1].phoneNumber = null;
      self.showAnotherContactNumber(false);
    };

    self.deleteAnotherEmail = function() {
      self.openInvestmentAccountData().contactDetails[1].email = null;
      self.showAnotherEmail(false);
    };

    ContactInfoModel.fetchCountryList().done(function(data) {
      self.countries(data.enumRepresentations[0].data);

      self.countries().forEach(function(country) {
        if (self.openInvestmentAccountData().addressDetails[0].country) {
          if (self.openInvestmentAccountData().addressDetails[0].country.toLowerCase() === country.description.toLowerCase()) {
            self.openInvestmentAccountData().addressDetails[0].country = country.description;
          }
        }
      });

      self.countriesLoaded(true);
    });

    self.emailValidator = [params.baseModel.getValidator("EMAIL")[0], {
      validate: function(value) {
        const compareTo = self.openInvestmentAccountData().contactDetails[0].email();

        if (value === compareTo) {
          throw new Error(self.resource.duplicateEmailError);
        }
      }
    }];

    self.contactNoValidator = [params.baseModel.getValidator("MOBILE_NO")[0], {
      validate: function(value) {
        const compareTo = self.openInvestmentAccountData().contactDetails[0].phoneNumber();

        if (value === compareTo) {
          throw new Error(self.resource.duplicateContactNoError);
        }
      }
    }];

  };
});
