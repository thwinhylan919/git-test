define([

  "knockout",

  "ojL10n!resources/nls/open-investment-account-train",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtrain",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojgauge",
  "ojs/ojselectcombobox"
], function(ko, resourceBundle, InvestmentAccountModel) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.openAccountHeader);

    self.getNewKoModel = function() {
      const investmentAccountModel = InvestmentAccountModel.getData();

      return investmentAccountModel;
    };

    if (params.rootModel.params.showAdditionalDetailsSection) {
      self.showAdditionalDetailsSection = ko.observable(params.rootModel.params.showAdditionalDetailsSection);
    } else {
      self.showAdditionalDetailsSection = ko.observable(false);
    }

    self.dataSourceAssets = ko.observable();
    self.showTrain = ko.observable(true);
    self.globalLoaded = ko.observable(true);
    self.selectedStepValueIA = ko.observable("investment-account-personal-details");
    params.baseModel.registerComponent("investment-account-contact-details", "mutual-funds");
    params.baseModel.registerComponent("investment-account-fatca", "mutual-funds");
    params.baseModel.registerComponent("investment-account-nomination-details", "mutual-funds");
    params.baseModel.registerComponent("investment-account-personal-details", "mutual-funds");
    self.loadPersonalDetailsSection = ko.observable(false);
    self.fetchedInfo = {};
    self.openInvestmentAccountData = params.rootModel.params.openInvestmentAccountData ? ko.observable(params.rootModel.params.openInvestmentAccountData) : ko.observable(self.getNewKoModel());
    self.noOfNomineesAllowed = ko.observable(params.rootModel.params.noOfNomineesAllowed);

    if (params.rootModel.params.selectedStepValueIA) {
      self.selectedStepValueIA(params.rootModel.params.selectedStepValueIA);
    }

    if (params.rootModel.params.selectedComponent) {
      self.selectedComponent = ko.observable(params.rootModel.params.selectedComponent);
    } else {
      self.selectedComponent = ko.observable("investment-account-primary-asset");
    }

    InvestmentAccountModel.fetchpartyDetails().done(function(data) {
      if (data.party.personalDetails.birthDate) {
        self.fetchedInfo.birthDate = data.party.personalDetails.birthDate;
        self.openInvestmentAccountData().personalDetails.birthDate = data.party.personalDetails.birthDate;
      }

      if (data.party.personalDetails.gender) {
        self.fetchedInfo.gender = data.party.personalDetails.gender;
        self.openInvestmentAccountData().personalDetails.gender = data.party.personalDetails.gender;
      }

      if (data.party.personalDetails.maritalStatus) {
        self.fetchedInfo.maritalStatus = data.party.personalDetails.maritalStatus;
        self.openInvestmentAccountData().personalDetails.maritalStatus = data.party.personalDetails.maritalStatus;
      }

      if (data.party.personalDetails.fullName) {
        self.fetchedInfo.fullName = data.party.personalDetails.fullName;
        self.openInvestmentAccountData().personalDetails.fullName = data.party.personalDetails.fullName;
      }

      let foundPST = false,
        address = [],
        indexPST = 0;

      data.party.addresses.forEach(function(address, index) {
        if (address.type === "PST") {
          foundPST = true;
          indexPST = index;
        }
      });

      address = foundPST ? data.party.addresses[indexPST] : data.party.addresses[0];

      if (address.postalAddress.line1) {
        self.fetchedInfo.address1 = address.postalAddress.line1;
        self.openInvestmentAccountData().addressDetails[0].address1 = address.postalAddress.line1;
      }

      if (address.postalAddress.line2) {
        self.fetchedInfo.address2 = address.postalAddress.line2;
        self.openInvestmentAccountData().addressDetails[0].address2 = address.postalAddress.line2;
      }

      if (address.postalAddress.city) {
        self.fetchedInfo.city = address.postalAddress.city;
        self.openInvestmentAccountData().addressDetails[0].city = address.postalAddress.city;
      }

      if (address.postalAddress.state) {
        self.fetchedInfo.state = address.postalAddress.state;
        self.openInvestmentAccountData().addressDetails[0].state = address.postalAddress.state;
      }

      if (address.postalAddress.country) {
        self.fetchedInfo.country = address.postalAddress.country;
        self.openInvestmentAccountData().addressDetails[0].country = address.postalAddress.country;
      }

      if (address.postalAddress.postalCode) {
        self.fetchedInfo.pin = address.postalAddress.postalCode;
        self.openInvestmentAccountData().addressDetails[0].pin = address.postalAddress.postalCode;
      }

      self.loadPersonalDetailsSection(true);
    });

    if (params.rootModel.params.stepArray) {
      self.stepArray =
        ko.observableArray(params.rootModel.params.stepArray);
    } else {
      self.stepArray =
        ko.observableArray(
          [{
              label: self.resource.personalDetails,
              id: "investment-account-personal-details",
              visited: false,
              disabled: false
            },
            {
              label: self.resource.contactDetails,
              id: "investment-account-contact-details",
              visited: false,
              disabled: true
            },
            {
              label: self.resource.nominationDetails,
              id: "investment-account-nomination-details",
              visited: false,
              disabled: true
            },
            {
              label: self.resource.fatca,
              id: "investment-account-fatca",
              visited: false,
              disabled: true
            }
          ]);
    }

    self.nextStep = function() {
      const tracker = document.getElementById("tracker");

      if (tracker && tracker.valid === "valid") {
        const itrain = document.getElementById("train");

        if (itrain.selectedStep === "purchase-order-details") {
          self.stepTwoEnable(true);
        }

        self.globalLoaded(false);

        for (let j = 0; j < itrain.steps.length; j++) {
          if (itrain.selectedStep === itrain.steps[j].id) {
            itrain.steps[j].visited = true;
            itrain.steps[j].disabled = false;

            if (j < 2) {
              itrain.steps[j + 1].visited = true;
              itrain.steps[j + 1].disabled = false;
            }

            break;
          }
        }

        ko.tasks.runEarly();

        let loadIndex = 0;

        for (let i = 0; i < self.stepArray().length; i++) {
          if (self.stepArray()[i].id === self.selectedStepValueIA()) {
            loadIndex = i + 1;
            break;
          }
        }

        self.selectedStepValueIA(self.stepArray()[loadIndex].id);
        self.globalLoaded(true);
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.previousStep = function() {
      self.globalLoaded(false);

      const itrain = document.getElementById("train");

      for (let j = 0; j < itrain.steps.length; j++) {
        if (itrain.selectedStep === itrain.steps[j].id) {
          itrain.steps[j].visited = true;
          itrain.steps[j].disabled = false;

          if (j > 0) {
            itrain.steps[j - 1].visited = true;
            itrain.steps[j - 1].disabled = false;
          }

          break;
        }
      }

      ko.tasks.runEarly();

      let loadIndex = 0;

      for (let i = 0; i < self.stepArray().length; i++) {
        if (self.stepArray()[i].id === self.selectedStepValueIA()) {
          loadIndex = i - 1;
          break;
        }
      }

      self.selectedStepValueIA(self.stepArray()[loadIndex].id);
      self.globalLoaded(true);
    };
  };
});
