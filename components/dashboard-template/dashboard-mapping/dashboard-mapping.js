define([
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/dashboard-mapping",
  "load!./dashboardTypes.json",
  "ojs/ojknockout",
  "ojs/ojinputtext",
  "ojs/ojinputnumber", "ojs/ojvalidationgroup",
  "ojs/ojknockout-validation"
], function (ko, $, model, locale, DashboardTypes) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = locale;
    self.validationTracker = ko.observable();
    self.partyId = ko.observable(true);
    self.showPartySearch = ko.observable(true);
    self.selectedPartyView = ko.observable(false);
    params.dashboard.headerName(self.resourceBundle.heading.create);
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("review-dashboard-mapping", "dashboard-template");
    params.baseModel.registerComponent("party-validate", "common");
    self.segmentRoles = ko.observableArray();
    self.listOfDashboards = ko.observableArray();
    self.selectedPartyName = ko.observable();

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

    self.partyDetails.party.displayValue.extend({
      notify: "always"
    });

    self.additionalDetails = ko.observable();
    self.selectedClass = ko.observable();
    self.selectSegment = ko.observable();
    self.enterpriseRolesLoaded = ko.observable(false);
    self.dashboardListLoaded = ko.observable(false);
    self.selectedMenuValue = ko.observable();
    self.segmentRoles = ko.observableArray();
    self.applicationRoles = ko.observableArray();
    self.segmentList = ko.observable();
    self.mappedValue = ko.observable();
    self.dashboardSelected = ko.observable();
    self.listOfSegments = ko.observableArray();

    self.classList = DashboardTypes.types.map(function (element) {
      return {
        id: element,
        label: self.resourceBundle.dashboardClass[element]
      };
    });

    self.mappingData = ko.mapping.fromJS(model.getTargetLinkageModel());

    model.getEnterpriseRoles().then(function (data) {
      if (data.enterpriseRoleDTOs) {
        self.segmentList(data.enterpriseRoleDTOs);
        self.enterpriseRolesLoaded(true);
      }
    });

    /**
     * The model function called to fetch the dashboard list.
     *
     * @function getDashboardList
     * @returns {void}
     */
    function getDashboardList(classValue, enterpriseRole) {
      self.listOfDashboards.removeAll();
      self.mappingData.dashboardId(null);
      self.mappingData.mappedValue(null);
      self.mappingData.mappedType(null);

      model.getDashboardList(classValue, enterpriseRole).then(function (data) {
        if (!data.dashboardDTOs.length) {
          return $("#noTemplate").trigger("openModal");
        }

        self.listOfDashboards(data.dashboardDTOs);
        self.dashboardSelected(data.dashboardDTOs[0].dashboardId);
        self.dashboardListLoaded(true);
      });
    }

    self.closeModal = function () {
      $("#noTemplate").trigger("closeModal");
    };

    self.getMappingList = function (value) {
      const mappedRoles = DashboardTypes.levels;

      if (value === "SEGMENT") {
        return mappedRoles.filter(function (element) {
          return element !== "SEGMENT";
        });
      } else if (value === "USER_TYPE") {
        return [mappedRoles[3]];
      }

      return mappedRoles;
    };

    self.selectedClass.subscribe(function (newValue) {
      if (self.enterpriseRolesLoaded()) {
        self.selectSegment(self.segmentList()[0].enterpriseRoleId);
        getDashboardList(newValue, self.selectSegment());
      }
    });

    const mappedTypeSubscription = self.mappingData.mappedType.subscribe(function (newValue) {
      self.mappingData.mappedValue(null);

      if (newValue === "ROLE") {
        self.mappingData.mappedValue(self.selectSegment());
      }
    });

    self.userAsyncValidator = {
      validate: function (value) {
        return model.checkUserExists(value, self.resourceBundle.userWarning);
      }
    };

    self.selectSegment.subscribe(function (newValue) {
      getDashboardList(self.selectedClass(), newValue);
      model.getEnterpriseSegmentRoles(newValue).then(self.listOfSegments);
    });

    self.saveMapping = function () {
      if (
        !self.mappingData.mappedValue() ||
        !self.mappingData.mappedType() ||
        !self.mappingData.dashboardId()
      ) {
        return params.baseModel.showMessages({}, [self.resourceBundle.selectValidParameters], "ERROR");
      }

      if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
        return;
      }

      const payload = JSON.parse(ko.mapping.toJSON(self.mappingData));

      if (self.mappingData.mappedType() === "USER") {
        params.dashboard.loadComponent("review-dashboard-mapping", {
          data: payload
        });
      } else if (self.mappingData.mappedValue() !== null) {
        params.dashboard.loadComponent("review-dashboard-mapping", {
          data: payload
        });
      } else if (self.mappingData.mappedValue() === null) {
        params.baseModel.showMessages({}, [self.resourceBundle.mappingValueWarning], "WARNING");
      }
    };

    const partyIdSubscribe = self.partyDetails.party.displayValue.subscribe(function (newValue) {
      if (newValue.length) {
        self.selectedPartyView(false);
        self.partyId(true);
        self.mappingData.mappedValue(newValue);
        self.showPartySearch(false);
        ko.tasks.runEarly();
        self.selectedPartyName(self.additionalDetails().party.personalDetails.fullName);
        self.selectedPartyView(true);
      } else {
        self.mappingData.mappedValue(null);
        self.selectedPartyView(false);
      }
    });

    self.showParty = function () {
      self.partyDetails.partyDetailsFetched(false);
      self.partyDetails.partyName(null);
      self.showPartySearch(true);
      self.mappingData.mappedValue(null);
      self.partyId(false);
      self.selectedPartyView(false);
    };

    self.createDashboard = function () {
      params.dashboard.loadComponent("select-persona", {
        mode: "create"
      });
    };

    self.dispose = function () {
      partyIdSubscribe.dispose();
      mappedTypeSubscription.dispose();
    };
  };
});