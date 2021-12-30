define([

  "knockout",

  "./model",

  "ojL10n!resources/nls/compliance",
  "ojL10n!resources/nls/compliance-entity",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojaccordion",
  "ojs/ojvalidationgroup"
], function(ko, FatcaComplianceModel, ResourceBundle, ResourceBundleEntity) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.entityResource = ResourceBundleEntity;
    Params.dashboard.headerName(self.resource.fatcaHeader);
    self.stagesLoaded = ko.observable(false);
    self.showMoreText = ko.observable(false);
    self.countries = ko.observableArray([]);
    self.states = ko.observableArray([]);
    self.statesMailing = ko.observableArray([]);
    self.identificationTypes = ko.observableArray([]);
    self.occupations = ko.observableArray([]);
    self.incomeRanges = ko.observableArray([]);
    Params.baseModel.registerComponent("customer-identification-info", "compliance");
    Params.baseModel.registerComponent("additional-kyc-info", "compliance");
    Params.baseModel.registerComponent("tax-residency-info", "compliance");
    Params.baseModel.registerComponent("review-fatca-compliance", "compliance");
    Params.baseModel.registerComponent("fatca-declaration", "compliance");

    const getNewKoModel = function() {
      const KoModel = FatcaComplianceModel.getNewModel();

      KoModel.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo = ko.observableArray(KoModel.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo);
      KoModel.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[0].tinAvailable = ko.observable("true");
      KoModel.fatcaComplianceData.taxResidencyInfoDTO.domesticTaxResident = ko.observable("true");
      KoModel.fatcaComplianceData.taxResidencyInfoDTO.domesticEntity = ko.observable("true");
      KoModel.fatcaComplianceData.taxResidencyInfoDTO.usCitizen = ko.observable("false");
      KoModel.fatcaComplianceData.taxResidencyInfoDTO.sptStatus = ko.observable("false");
      KoModel.fatcaComplianceData.taxResidencyInfoDTO.usGreenCardOwner = ko.observable("false");
      KoModel.fatcaComplianceData.kycInfo.pepStatus = ko.observable("PEP");
      KoModel.fatcaComplianceData.selectedValues = ko.observable(KoModel.fatcaComplianceData.selectedValues);

      return KoModel;
    };

    if (!self.params.backFromReview && !Params.rootModel.previousState) {
      self.addressType = ko.observable("permanent");
      self.isMailingAddressSame = ko.observableArray(["same"]);
      self.fatcaComplianceData = getNewKoModel().fatcaComplianceData;
      self.disableFullName = ko.observable(false);
      self.taxResidenceCountriesLoaded = ko.observable(false);
      self.taxIdentificationTypes = ko.observableArray([]);
      self.declaration = ko.observableArray([]);

      self.fatcaComplianceData.identificationInfo.fullName = self.params.personalDetails.fullName ? self.params.personalDetails.fullName : Params.baseModel.format(self.resource.fullName, {
        firstName: self.params.personalDetails.firstName,
        middleName: self.params.personalDetails.middleName ? self.params.personalDetails.middleName : "",
        lastName: self.params.personalDetails.lastName
      });

      self.fatcaComplianceData.identificationInfo.title = self.params.personalDetails.salutation;

      if (self.fatcaComplianceData.identificationInfo.fullName) {
        self.disableFullName(true);
      }

      self.stages = ko.observableArray([]);
      self.sectionBeingEdited = ko.observable();
      self.taxIdentificationType = ko.observableArray([]);
      self.taxIdentificationType()[0] = ko.observable();
      self.fillMailingAddress = ko.observable(false);
    } else if (Params.rootModel.previousState) {
      self.fatcaComplianceData = Params.rootModel.previousState.fatcaComplianceData;
      self.addressType = Params.rootModel.previousState.addressType;
      self.stages = Params.rootModel.previousState.stages;
      self.isMailingAddressSame = Params.rootModel.previousState.isMailingAddressSame;
      self.fillMailingAddress = Params.rootModel.previousState.fillMailingAddress;
      self.sectionBeingEdited = Params.rootModel.previousState.sectionBeingEdited;
      self.declaration = Params.rootModel.previousState.declaration;
      self.taxIdentificationTypes = Params.rootModel.previousState.taxIdentificationTypes;
      self.taxResidenceCountriesLoaded = Params.rootModel.previousState.taxResidenceCountriesLoaded;
      self.taxIdentificationType = Params.rootModel.previousState.taxIdentificationType;
      self.disableFullName = Params.rootModel.previousState.disableFullName;
      self.formType = Params.rootModel.previousState.formType;
    } else {
      self.addressType = self.params.params.addressType;
      self.stages = self.params.params.stages;
      self.fatcaComplianceData = self.params.fatcaComplianceData;
      self.isMailingAddressSame = self.params.params.isMailingAddressSame;
      self.fillMailingAddress = self.params.params.fillMailingAddress;
      self.sectionBeingEdited = self.params.params.sectionBeingEdited;
      self.declaration = self.params.params.declaration;
      self.taxIdentificationTypes = self.params.params.taxIdentificationTypes;
      self.taxResidenceCountriesLoaded = self.params.params.taxResidenceCountriesLoaded;
      self.taxIdentificationType = self.params.params.taxIdentificationType;
      self.disableFullName = self.params.params.disableFullName;
      self.formType = self.params.params.formType;
    }

    self.showMoreTextClick = function() {
      self.showMoreText(!self.showMoreText());
    };

    self.stages([{
        stageName: self.resource.heading.customerIdentificationInfo,
        moduleName: "customer-identification-info",
        validated: ko.observable(),
        expanded: ko.observable(true)
      },
      {
        stageName: self.resource.heading.additionalkycInfo,
        moduleName: "additional-kyc-info",
        validated: ko.observable(),
        expanded: ko.observable(false)
      },
      {
        stageName: self.resource.heading.taxResidencyInfo,
        moduleName: "tax-residency-info",
        validated: ko.observable(),
        expanded: ko.observable(false)
      },
      {
        stageName: self.resource.heading.declaration,
        moduleName: "fatca-declaration",
        validated: ko.observable(),
        expanded: ko.observable(false)
      }
    ]);

    if (self.params.backFromReview && self.sectionBeingEdited()) {
      for (let i = 0; i < self.stages().length; i++) {
        if (self.stages()[i].moduleName === self.sectionBeingEdited()) {
          self.stages()[i].expanded(true);
        } else {
          self.stages()[i].expanded(false);
        }
      }
    }

    self.stagesLoaded(true);

    self.addressTypeList = [{
      code: "permanent",
      description: self.resource.customerIdentificationInfo.addressType1
    }, {
      code: "currentResidential",
      description: self.resource.customerIdentificationInfo.addressType2
    }, {
      code: "other",
      description: self.resource.customerIdentificationInfo.addressType3
    }];

    self.submitFatcaCompliance = function() {
      const customerInfoTracker = document.getElementById("customerInfoTracker"),
        kycInfoTracker = document.getElementById("kycInfoTracker"),
        taxResidencyInfoTracker = document.getElementById("taxResidencyInfoTracker"),
        declarationTracker = document.getElementById("declarationTracker");

      if (customerInfoTracker && customerInfoTracker.valid !== "valid") {
        customerInfoTracker.showMessages();
        Params.baseModel.showMessages(null, [self.resource.formCompletionError], "ERROR");
        customerInfoTracker.focusOn("@firstInvalidShown");

        return false;
      }

      if (kycInfoTracker && kycInfoTracker.valid !== "valid") {
        kycInfoTracker.showMessages();
        Params.baseModel.showMessages(null, [self.resource.formCompletionError], "ERROR");
        kycInfoTracker.focusOn("@firstInvalidShown");

        return false;
      }

      if (taxResidencyInfoTracker && taxResidencyInfoTracker.valid !== "valid") {
        taxResidencyInfoTracker.showMessages();
        Params.baseModel.showMessages(null, [self.resource.formCompletionError], "ERROR");
        taxResidencyInfoTracker.focusOn("@firstInvalidShown");

        return false;
      }

      if (declarationTracker && declarationTracker.valid !== "valid") {
        declarationTracker.showMessages();
        Params.baseModel.showMessages(null, [self.resource.formCompletionError], "ERROR");
        declarationTracker.focusOn("@firstInvalidShown");

        return false;
      }

      if (!self.fillMailingAddress()) {
        self.fatcaComplianceData.identificationInfo.mailingAddress = JSON.parse(JSON.stringify(self.fatcaComplianceData.identificationInfo.addressDetails));
      }

      self.fatcaComplianceData.selectedValues().country = Params.baseModel.getDescriptionFromCode(self.countries(), self.fatcaComplianceData.identificationInfo.addressDetails.country);
      self.fatcaComplianceData.selectedValues().state = Params.baseModel.getDescriptionFromCode(self.states(), self.fatcaComplianceData.identificationInfo.addressDetails.state);
      self.fatcaComplianceData.selectedValues().countryMailing = Params.baseModel.getDescriptionFromCode(self.countries(), self.fatcaComplianceData.identificationInfo.mailingAddress.country);
      self.fatcaComplianceData.selectedValues().statesMailing = Params.baseModel.getDescriptionFromCode(self.states(), self.fatcaComplianceData.identificationInfo.mailingAddress.state);
      self.fatcaComplianceData.selectedValues().nationality = Params.baseModel.getDescriptionFromCode(self.countries(), self.fatcaComplianceData.identificationInfo.nationality);
      self.fatcaComplianceData.selectedValues().countryOfBirth = Params.baseModel.getDescriptionFromCode(self.countries(), self.fatcaComplianceData.identificationInfo.countryOfBirth);
      self.fatcaComplianceData.selectedValues().identificationType = Params.baseModel.getDescriptionFromCode(self.identificationTypes(), self.fatcaComplianceData.identificationInfo.identificationType);
      self.fatcaComplianceData.selectedValues().occupationDetails = Params.baseModel.getDescriptionFromCode(self.occupations(), self.fatcaComplianceData.kycInfo.occupationDetails);
      self.fatcaComplianceData.selectedValues().title = self.fatcaComplianceData.identificationInfo.title;

      if (self.addressType() !== "other") {
        self.fatcaComplianceData.selectedValues().addressType = Params.baseModel.getDescriptionFromCode(self.addressTypeList, self.addressType());
      } else {
        self.fatcaComplianceData.selectedValues().addressType = self.fatcaComplianceData.identificationInfo.addressType;
      }

      self.fatcaComplianceData.selectedValues().taxResidenceCountry = [];

      for (let i = 0; i < self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo().length; i++) {
        self.fatcaComplianceData.selectedValues().taxIdentificationType = ko.observableArray([]);

        if (self.taxIdentificationType()[i]() && self.taxIdentificationType()[i]() !== "OTHER") {
          self.fatcaComplianceData.selectedValues().taxIdentificationType()[i] = Params.baseModel.getDescriptionFromCode(self.taxIdentificationTypes()[i](), self.taxIdentificationType()[i]);
          self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[i].taxIdentifierType = ko.utils.unwrapObservable(self.taxIdentificationType()[i]);
        } else {
          self.fatcaComplianceData.selectedValues().taxIdentificationType()[i] = self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[i].taxIdentifierType;
        }

        self.fatcaComplianceData.selectedValues().taxResidenceCountry.push(Params.baseModel.getDescriptionFromCode(self.countries(), self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[i].taxResidenceCountry));
      }

      if (self.fatcaComplianceData.kycInfo.pepStatus() === "PEP") {
        self.fatcaComplianceData.selectedValues().pepStatus = self.resource.additionalkycInfo.pepStatus1;
      } else if (self.fatcaComplianceData.kycInfo.pepStatus() === "REP") {
        self.fatcaComplianceData.selectedValues().pepStatus = self.resource.additionalkycInfo.pepStatus2;
      } else {
        self.fatcaComplianceData.selectedValues().pepStatus = self.resource.additionalkycInfo.pepStatus3;
      }

      Params.dashboard.loadComponent("review-fatca-compliance", self);
    };
  };
});