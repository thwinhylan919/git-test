define([
  "./model",
  "ojL10n!resources/nls/onboard-counter-party-form",
  "knockout",
  "ojs/ojformlayout",
  "ojs/ojvalidationgroup",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojinputnumber",
  "ojs/ojradioset",
  "ojs/ojbutton",
  "ojs/ojlabel"
], function (Model, resourceBundle, ko) {
  "use strict";

  return function (params) {
    const self = this;

    self.nls = resourceBundle;
    params.dashboard.headerName(self.nls.componentHeader);
    self.corporateCategory = ko.observable();
    self.corporateCategoryData = ko.observableArray();
    self.stateData = ko.observableArray();
    self.countryData = ko.observableArray();
    self.partyId = ko.observable();
    self.partyName = ko.observable();
    self.showCorporateCategory = ko.observable(false);
    self.showCountries = ko.observable(false);
    self.showStates = ko.observable(false);
    self.showAddLandline = ko.observable(true);
    params.baseModel.registerComponent("onboard-counter-party-review", "supply-chain-finance");
    params.baseModel.registerElement("help");

    const getNewKoModel = function () {
      const KoModel = Model.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.modelInstance = params.rootModel.previousState ? params.rootModel.previousState.payload : getNewKoModel();

    if (params.rootModel.previousState && self.modelInstance.phoneNumber() !== "" && self.modelInstance.phoneNumber() !== null) {
      self.showAddLandline(false);
    }

    Model.mepartyget().then(function (response) {
      self.partyId(response.party.id.displayValue);
      self.partyName(response.party.personalDetails.fullName);
    });

    Model.corporatecategoryget().then(function (response) {
      self.corporateCategoryData(response.jsonNode.ScfApplicationParamModelKeyCollection[0].ScfApplicationParamKeyModel);
      self.showCorporateCategory(true);
    });

    self.getStatesData = function (countryCode) {
      self.showStates(false);

      Model.stateget(countryCode).then(function (response) {
        if (response.enumRepresentations && response.enumRepresentations.length > 0) {
          self.stateData(response.enumRepresentations[0].data);
        } else {
          self.stateData([]);
        }

        self.showStates(true);
      });
    };

    Model.countryget().then(function (response) {
      self.countryData(response.enumRepresentations[0].data);
      self.showCountries(true);

      if (params.rootModel.previousState) {
        self.getStatesData(self.modelInstance.address.country());
      } else {
        self.getStatesData(self.countryData()[0].code);
      }

    });

    self.onClickSubmit = function () {
      const tracker = document.getElementById("tracker");

      if (params.baseModel.showComponentValidationErrors(tracker)) {

        params.baseModel.registerComponent("onboard-counter-party-review", "supply-chain-finance");

        params.dashboard.loadComponent("onboard-counter-party-review", {
          payload: self.modelInstance,
          onboardCounterParty: self.onboardCounterParty
        });
      }
    };

    self.addLandLine = function () {
      self.showAddLandline(false);
    };

    self.getStates = function (event) {
      if (event.detail.value) {
        self.countryData().forEach(function (country) {
          if (country.code === event.detail.value) {
            self.modelInstance.address.countryName = country.description;
          }
        });

        self.getStatesData(event.detail.value);
      }
    };

    self.onboardCounterParty = function () {
      return new Promise(function (resolve, reject) {
        Model.counterpartypost(ko.mapping.toJSON(self.modelInstance, {
          ignore: ["categoryDesc", "stateName", "countryName"]
        })).then(function (data) {
          resolve(data);
        }).catch(function (err) {
          reject(err);
        });
      });
    };

    self.categoryChangedHandler = function (event) {
      if (event.detail.value) {
        self.corporateCategoryData().forEach(function (category) {
          if (category.code === event.detail.value) {
            self.modelInstance.categoryDesc = category.description;
          }
        });
      }
    };

    self.stateChangedHandler = function (event) {
      if (event.detail.value) {
        self.stateData().forEach(function (state) {
          if (state.code === event.detail.value) {
            self.modelInstance.address.stateName = state.description;
          }
        });
      }
    };

    self.onClickCancel = function () {
      params.dashboard.switchModule();
    };
  };
});