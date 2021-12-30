define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/create-mapping",
  "load!./brandMappingLevels.json",
  "ojs/ojknockout",
  "ojs/ojinputtext",
  "ojs/ojinputnumber",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup"
], function (ko, model, locale, BrandMappingLevels) {
  "use strict";

  return function (params) {
    const self = this;

    self.resourceBundle = locale;
    self.validationTracker = ko.observable();
    self.validationTrackerID = "validationTrackerID" + params.baseModel.incrementIdCount();
    self.mappedValues = ko.observableArray();
    self.segments = ko.observableArray();
    self.selectedSegment = ko.observable();
    self.parameters = params.rootModel.params;
    params.dashboard.headerName(self.resourceBundle.heading.create);
    params.baseModel.registerComponent("party-name-search", "common");
    params.baseModel.registerComponent("party-validate", "common");
    params.baseModel.registerComponent("review-mapping", "theme-config");
    self.showPartySearch = ko.observable(false);
    self.partyId = ko.observable();
    self.selectedPartyName = ko.observable();
    self.brandList = ko.observableArray();

    self.brandMappingLevels = BrandMappingLevels.levels;

    self.partyDetails = {
      partyId: ko.observable(null),
      partyName: ko.observable(null),
      partyDetailsFetched: ko.observable(false),
      partyFirstName: ko.observable(null),
      partyLastName: ko.observable(null),
      party: {
        value: ko.observable(null),
        displayValue: ko.observable(null)
      }
    };

    model.getModuleThemes().then(function (data) {
      if (!data.brandDTOs.length) {
        params.baseModel.showMessages(null, [self.resourceBundle.noBrandCreated], "ERROR");

      } else {
        self.brandList([].concat(data.brandDTOs));
      }
    });

    self.partyDetails.party.displayValue.extend({
      notify: "always"
    });

    self.additionalDetails = ko.observable();
    self.selectedPartyView = ko.observable(false);

    const getTargetLinkageModel = function (brandId, mappedValue, mappedType) {
      const KoModel = model.getTargetLinkageModel(brandId, mappedValue, mappedType);

      return ko.mapping.fromJS(KoModel);
    };

    self.mappingData = ko.observable(getTargetLinkageModel(null, null, self.parameters.selectedOption));

    function fetchSegmentsForUserType(userType) {
      self.segments.removeAll();

      return model.getSegmentEnterpriseRoles(userType).then(function (data) {
        ko.utils.arrayPushAll(self.segments, data.segmentdtos.filter(function (item) {
          return item.status !== "DISABLED";
        }));
      });
    }

    self.userAsyncValidator = {
      validate: function (value) {
        return model.checkUserExists(value, self.resourceBundle.userWarning);
      }
    };

    self.saveMapping = function () {
      if (!params.baseModel.showComponentValidationErrors(document.getElementById(self.validationTrackerID))) {
        return;
      }

      if (self.mappingData().mappedType() === "ROLE" && self.selectedSegment()) {
        self.mappingData().mappedType("SEGMENT");
        self.mappingData().mappedValue(ko.utils.unwrapObservable(self.selectedSegment()));
      }

      params.dashboard.loadComponent("review-mapping", {
        data: ko.mapping.toJS(self.mappingData()),
        type: "create",
        mode: "review"
      });
    };

    const mappedTypeSubscription = self.mappingData().mappedType.subscribe(function (newValue) {
        self.mappedValues.removeAll();
        ko.tasks.runEarly();
        self.mappingData().mappedValue(null);

        if (newValue === "ROLE") {
          model.getEnterpriseRoles().then(function (data) {
            data.enterpriseRoleDTOs.forEach(function (key) {
              self.mappedValues.push({
                value: key.enterpriseRoleId,
                text: key.enterpriseRoleName
              });
            });

            fetchSegmentsForUserType(self.mappedValues()[0].value);
          });
        } else if (newValue === "BANK") {
          if (params.dashboard.userData.userProfile.accessibleEntityDTOs && params.dashboard.userData.userProfile.accessibleEntityDTOs.length) {
            params.dashboard.userData.userProfile.accessibleEntityDTOs.forEach(function (key) {
              self.mappedValues.push({
                text: key.entityName,
                value: key.entityId
              });
            });
          }
        } else if (newValue === "PARTY") {
          self.selectedPartyName("");
          self.selectedPartyView(false);
        }
      }),
      mappedValueSubscription = self.mappingData().mappedValue.subscribe(function (newValue) {
        if (self.mappingData().mappedType() === "ROLE") {
          fetchSegmentsForUserType(newValue);
        }
      });

    self.mappingData().mappedType.valueHasMutated();

    const partyIdSubscribe = self.partyDetails.party.displayValue.subscribe(function (newValue) {
      if (newValue.length) {
        self.selectedPartyView(false);
        self.partyId(true);
        self.mappingData().mappedValue(newValue);
        self.showPartySearch(false);
        ko.tasks.runEarly();
        self.selectedPartyName(self.additionalDetails().party.personalDetails.fullName);
        self.selectedPartyView(true);
      } else {
        self.mappingData().mappedValue(null);
        self.selectedPartyView(false);
      }
    });

    self.showParty = function () {
      self.partyDetails.partyDetailsFetched(false);
      self.partyDetails.partyName(null);
      self.showPartySearch(true);
      self.mappingData().mappedValue(null);
      self.partyId(false);
      self.selectedPartyView(false);
    };

    self.dispose = function () {
      mappedTypeSubscription.dispose();
      mappedValueSubscription.dispose();
      partyIdSubscribe.dispose();
    };
  };
});