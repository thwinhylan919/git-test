define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/virtual-entity-information",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtrain",
  "ojs/ojcheckboxset",
  "ojs/ojradioset",
  "ojs/ojdatetimepicker",
  "ojs/ojselectcombobox"
], function (oj, ko, VirtualEntityModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel || params.rootModel.previousState);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.title);
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("virtual-entity-create", "virtual-account-management");
    self.mailingAddress = ko.observableArray([]);
    self.displayAddress = ko.observable(false);
    self.displayCorrespondenceAddress = ko.observable(false);
    self.showLandline = ko.observable(false);
    self.newWorkPhone = ko.observable();
    self.fromEntitySearch = ko.observable();
    self.reviewToCreate = ko.observable(false);
    self.showTemplates = ko.observable(true);
    self.today = ko.observable(oj.IntlConverterUtils.dateToLocalIso(params.baseModel.getDate()));
    self.corporateTypeOptions = ko.observableArray();
    self.genderOptions = ko.observable([]);
    self.templateLoaded = ko.observable(false);
    self.mobileRequired = ko.observable(false);
    self.emailRequired = ko.observable(false);
    self.genderOptionsTemplateLoaded = ko.observable(false);
    self.nationalityTemplateLoaded = ko.observable(false);
    self.editFromReviewScreen = ko.observable();
    self.limit = "0";
    self.offset = "0";

    VirtualEntityModel.fetchCountryList(self.limit, self.offset).then(
      function (data) {
        if (data.jsonNode && data.jsonNode.data.length > 0 && data.jsonNode.data) {
          self.countryOptions(data.jsonNode.data);
        }

        self.nationalityTemplateLoaded(true);

      });

    VirtualEntityModel.fetchGenderList().then(
      function (data) {
        if (data.enumRepresentations && data.enumRepresentations.length > 0 && data.enumRepresentations[0].data) {
          self.genderOptions(data.enumRepresentations[0].data);
        }

        self.genderOptionsTemplateLoaded(true);
      });

    self.realEntityAddress.subscribe(function () {
      self.afterRender();
    });

    self.countryOptions.subscribe(function () {
      self.afterRender();
    });

    self.corporateTypes = function () {

      const corporateTypesResponse = [{
          code: "C",
          description: self.resource.corporation
        },
        {
          code: "CO",
          description: self.resource.cooperative
        },
        {
          code: "P",
          description: self.resource.partnership
        },
        {
          code: "SP",
          description: self.resource.soleProprietorship
        }
      ];

      for (let i = 0; i < corporateTypesResponse.length; i++) {
        self.corporateTypeOptions.push({
          code: corporateTypesResponse[i].code,
          description: corporateTypesResponse[i].description
        });
      }

      self.templateLoaded(true);
    };

    self.corporateTypes();

    self.setFlags = function () {
      if (self.modelInstance.corporateDetails.workNumber()[1].areaCode() && self.modelInstance.corporateDetails.workNumber()[1].number()) {
        self.showLandline(true);
        self.showAddLandlineLink(false);
        self.showDeleteLandlineLink(true);
      } else {
        self.showLandline(false);
        self.showAddLandlineLink(true);
        self.showDeleteLandlineLink(false);
      }

      if (self.modelInstance.entityType() === "I") {
        self.modelInstance.mailingAddress.line1(self.modelInstance.address.line1());
        self.modelInstance.mailingAddress.line2(self.modelInstance.address.line2());
      }
    };

    self.modelMapping = function () {
      if (params.rootModel.params.editFromViewScreen) {
        if (params.rootModel.params.editFromReviewScreen) {
          self.setFlags();
          self.editFromReviewScreen(true);
        }

        if (!params.rootModel.params.reviewMode && !params.rootModel.params.editFromReviewScreen) {
          self.setFlags();
        }
      } else if (self.modelInstance) {
        self.setFlags();
      }

    };

    self.modelMapping();

    const getCountry = function (country) {
        for (let index = 0; index < self.countryOptions().length; index++) {
          if (self.countryOptions()[index].countryCode.toLowerCase() === country.toLowerCase()) {
            return self.countryOptions()[index].countryCode;
          }
        }
      },
      copyFromRealEntityAdrress = function (realEntityAddress) {
        if (realEntityAddress) {
          self.modelInstance.address.line1(realEntityAddress.line1);
          self.modelInstance.address.line2(realEntityAddress.line2);
          self.modelInstance.address.country(getCountry(realEntityAddress.country));
          self.modelInstance.address.zipCode(realEntityAddress.postalCode);
        }
      },
      copyFromCorrespondence = function (address) {
        self.modelInstance.mailingAddress.line1(address.line1());
        self.modelInstance.mailingAddress.line2(address.line2());
        self.modelInstance.mailingAddress.country(address.country());
        self.modelInstance.mailingAddress.zipCode(address.zipCode());
      };

    self.afterRender = function () {
      if (self.modelInstance) {
        if (self.checkboxFlag()) {
          self.correspondenceAddress(["generic"]);
          copyFromRealEntityAdrress(self.realEntityAddress());
          self.displayAddress(false);
          self.displayCorrespondenceAddress(false);
        } else {
          self.displayCorrespondenceAddress(true);
          self.correspondenceAddress([]);
        }

        if (self.mailingCheckboxFlag()) {
          self.mailingAddress(["generic"]);
          copyFromCorrespondence(self.modelInstance.address);
          self.displayAddress(false);
        } else {
          self.displayAddress(true);
          self.mailingAddress([]);
        }
      }
    };

    self.preferredModeChangeHandler = function (event) {
      if (self.modelInstance.entityType() === "C") {
        self.modelInstance.corporateDetails.preferredModeOfCommunication(event.detail.value);
      } else {
        self.modelInstance.individualDetails.preferredModeOfCommunication(event.detail.value);
      }

      if (event.detail.value === "E") {
        self.emailRequired(true);
        self.mobileRequired(false);
      } else {
        self.emailRequired(false);
        self.mobileRequired(true);
      }
    };

    self.mailingAddressChangedHandler = function (event) {
      if (event.detail.value.length > 0 && event.detail.value[0] === "generic") {
        self.displayAddress(false);
        self.mailingCheckboxFlag(true);
        copyFromCorrespondence(self.modelInstance.address);
      } else {
        self.modelInstance.mailingAddress.line1(null);
        self.modelInstance.mailingAddress.line2(null);
        self.modelInstance.mailingAddress.country(null);
        self.modelInstance.mailingAddress.zipCode(null);
        self.displayAddress(true);
        self.mailingCheckboxFlag(false);
      }
    };

    self.correspondenceAddressChangedHandler = function (event) {
      if (event.detail.value.length > 0 && event.detail.value[0] === "generic") {
        copyFromRealEntityAdrress(self.realEntityAddress());

        if (self.mailingCheckboxFlag()) {
          copyFromCorrespondence(self.modelInstance.address);
        }

        self.displayCorrespondenceAddress(false);
        self.checkboxFlag(true);
      } else {
        self.modelInstance.address.line1(null);
        self.modelInstance.address.line2(null);
        self.modelInstance.address.country(null);
        self.modelInstance.address.zipCode(null);
        self.correspondenceAddress([]);
        self.checkboxFlag(false);
        self.displayCorrespondenceAddress(true);
      }
    };

    self.addNewLandline = function () {
      self.showLandline(true);
      self.showAddLandlineLink(false);
      self.showDeleteLandlineLink(true);
    };

    self.deleteNewLandline = function () {
      self.modelInstance.corporateDetails.workNumber()[1].areaCode(null);
      self.modelInstance.corporateDetails.workNumber()[1].number(null);
      self.showLandline(false);
      self.showAddLandlineLink(true);
      self.showDeleteLandlineLink(false);
    };
  };
});