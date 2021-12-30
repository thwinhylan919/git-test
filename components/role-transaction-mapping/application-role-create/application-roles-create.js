define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/authorization",
  "ojs/ojswitch",
  "ojs/ojselectcombobox",
  "ojs/ojtrain",
  "ojs/ojinputtext",
  "ojs/ojvalidationgroup",
  "ojs/ojknockout-validation"
], function (ko, ApplicationRolesCreateModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel.params);
    self.nls = resourceBundle;

    /**
     * SetObservable - Define an observable if variable is undefined.
     *
     * @param  {type} value - Variable to be set.
     * @param  {string|boolean|number} rootParams - Defult value of variable.
     * @return {Function}       Observable returned.
     */
    function setObservable(value, rootParams) {
      if (!value) {
        return ko.observable(rootParams);
      }

      return value;
    }

    self.selectedUser = setObservable(self.selectedUser);
    self.selectedAccessType = setObservable(self.selectedAccessType);
    self.selectedScopeType = setObservable(self.selectedScopeType);
    self.accessPointType = ko.observableArray();
    self.isAccessTypeFetched = ko.observable(false);
    self.isScopeFetched = ko.observable(false);
    self.selectedAccessPoint = setObservable(self.selectedAccessPoint);
    self.selectedModuleName = setObservable(self.selectedModuleName);
    self.selectedSegments = ko.observableArray();
    self.isSegmentFetched = ko.observable(false);
    self.accessPoint = ko.observableArray();
    self.roleAccessPointMap = ko.observableArray();
    self.isNext = ko.observable(false);
    self.disabled = ko.observable(false);
    self.dataSourceLoaded = ko.observable(false);
    self.accessPointTabs = ko.observableArray();
    self.dataSourceToBePassed = ko.observable();
    self.scopes = ko.observableArray();
    self.isAccessPointFetched = ko.observable(false);
    self.isUserFetched = ko.observable(false);
    self.isMapTransaction = ko.observable(false);
    self.appRoleName = setObservable(self.appRoleName);
    self.appDescription = setObservable(self.appDescription);
    self.validationTracker = ko.observable();
    self.userSegment = ko.observableArray();
    self.selectedStepValue = ko.observable("appRoleCreate");
    self.selectedStepLabel = ko.observable(self.nls.common.appRoleCreation);
    self.segmentEntityArray = ko.observableArray();
    self.segmentEntityDisplay = ko.observableArray();
    self.mappedSegments = ko.observableArray();
    self.roleSegmentMap = ko.observableArray();
    self.userSegments = ko.observableArray();
    rootParams.baseModel.registerComponent("application-role-search", "role-transaction-mapping");
    rootParams.baseModel.registerComponent("map-transaction", "role-transaction-mapping");

    const getNewKoModel = function () {
      const KoModel = ApplicationRolesCreateModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.rootModelInstance = getNewKoModel();

    const selectedUserSubscription = self.selectedUser.subscribe(function () {
      if (self.selectedUser() === self.rootModelInstance.retailUser()) {
        self.isSegmentFetched(false);
        self.userSegments([]);

        const searchParameter = {
          selectedUser: self.selectedUser()
        };

        ApplicationRolesCreateModel.fetchUserSegments(searchParameter).done(function (data) {
          self.userSegments([]);

          for (let j = 0; j < data.segmentdtos.length; j++) {
            self.userSegments().push({
              text: data.segmentdtos[j].name,
              value: data.segmentdtos[j].code
            });
          }

          self.isSegmentFetched(true);
        });
      }
    });

    if (rootParams.rootModel.params.verifyAndEdit() === true) {
      self.stepArray =
        ko.observableArray(
          [{
              label: self.nls.common.appRoleCreation,
              id: "appRoleCreate",
              visited: true
            },
            {
              label: self.nls.common.mapTransaction,
              id: "mapTransaction",
              visited: true
            }
          ]);
    } else {
      self.stepArray = ko.observableArray([{
        label: self.nls.common.appRoleCreation,
        id: "appRoleCreate",
        visited: false
      }, {
        label: self.nls.common.mapTransaction,
        id: "mapTransaction",
        visited: false,
        disabled: true
      }]);
    }

    self.trainHandler = function (event) {
      if (event.detail.fromStep.id === "appRoleCreate") {
        self.stepArray()[0].visited = true;
        self.stepArray()[0].disabled = false;
        self.mapTrans();
      } else if (event.detail.fromStep.id === "mapTransaction") {
        self.stepArray()[1].visited = true;
        self.stepArray()[1].disabled = false;
      }
    };

    rootParams.dashboard.headerName(self.nls.common.roleTransactionMapping);

    ApplicationRolesCreateModel.fetchUserGroupOptions().done(function (data) {
      if (data.enterpriseRoleDTOs) {
        for (let i = 0; i < data.enterpriseRoleDTOs.length; i++) {
          self.userSegment().push({
            text: data.enterpriseRoleDTOs[i].enterpriseRoleName,
            value: data.enterpriseRoleDTOs[i].enterpriseRoleId
          });
        }

        self.isUserFetched(true);
      }
    });

    ApplicationRolesCreateModel.fetchAccessPointType().done(function (data) {
      for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.accessPointType().push({
          text: data.enumRepresentations[0].data[i].description,
          value: data.enumRepresentations[0].data[i].code
        });

        self.isAccessTypeFetched(true);
      }
    });

    ApplicationRolesCreateModel.fetchScopes().done(function (data) {
      for (let j = 0; j < data.accessPointScopeListDTO.length; j++) {
        self.scopes().push({
          text: data.accessPointScopeListDTO[j].description,
          value: data.accessPointScopeListDTO[j].id
        });
      }

      self.isScopeFetched(true);
    });

    self.back = function () {
      self.selectedUser("");
      self.selectedAccessType("");
      self.selectedScopeType("");
      self.appRoleName("");
      self.appDescription("");
      self.selectedAccessPoint([]);
      self.selectedModuleName([]);
      self.selectedSegments([]);
      self.selectedStepValue = ko.observable("appRoleCreate");
      self.selectedStepLabel = ko.observable(self.nls.common.appRoleCreation);

      const params = ko.mapping.toJS({
        selectedUser: self.selectedUser,
        selectedAccessType: self.selectedAccessType,
        selectedScopeType: self.selectedScopeType,
        appRoleName: self.appRoleName,
        appDescription: self.appDescription,
        selectedAccessPoint: self.selectedAccessPoint,
        selectedModuleName: self.selectedModuleName,
        selectedSegments: self.selectedSegments,
        selectedStepValue: self.selectedStepValue,
        selectedStepLabel: self.selectedStepLabel,
        accessPoint: self.accessPoint,
        roleAccessPointMap: self.roleAccessPointMap,
        moduleName: self.moduleName,
        isModuleFetched: self.isModuleFetched,
        updateAppRolePolicy: self.updateAppRolePolicy,
        userType: self.userType,
        accessType: self.accessType,
        isSegmentFetched:self.isSegmentFetched,
        userSegments: self.userSegments,
        selectedItem: self.selectedItem,
        disabled: self.disabled,
        isNext: self.isNext,
        appRoleId: self.appRoleId
      });

      rootParams.dashboard.loadComponent("application-role-base", params);
    };

    self.createObservables = function (params, exclusionList) {
      let property;

      exclusionList = !Array.isArray(exclusionList) ? [exclusionList] : exclusionList;

      for (property in params) {
        if (exclusionList.indexOf(property) === -1 && !ko.isObservable(params[property])) {
          if (Array.isArray(params[property])) {
            params[property] = ko.observableArray(params[property]);
          } else if (typeof params[property] === "function") {
            //do nothing
          } else {
            params[property] = ko.observable(params[property]);
          }
        }
      }
    };

    self.mapTrans = function () {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
        return;
      }

      self.selectedStepValue("mapTransaction");
      self.selectedStepLabel(self.nls.common.mapTransaction);
      self.roleSegmentMap.removeAll();

      for (let i = 0; i < self.selectedSegments().length; i++) {
        for (let j = 0; j < self.userSegments().length; j++) {
          if (self.selectedSegments()[i] === self.userSegments()[j].value) {
            self.roleSegmentMap.push({
              segmentCode: self.userSegments()[j].value
            });
          }
        }
      }

      const searchParameters = {
        accessType: self.selectedAccessType()
      };

      ApplicationRolesCreateModel.fetchAccess(searchParameters).done(function (data) {
        self.accessPoint([]);

        for (let i = 0; i < data.accessPointListDTO.length; i++) {
          self.accessPoint().push({
            text: data.accessPointListDTO[i].description,
            value: data.accessPointListDTO[i].id
          });

        }

        self.isAccessPointFetched(true);

        const params = ko.mapping.toJS({
          accessPoint: self.accessPoint,
          isAccessPointFetched: self.isAccessPointFetched,
          selectedStepValue: self.selectedStepValue,
          accessPointType: self.accessPointType,
          stepArray: self.stepArray,
          isNext: self.isNext,
          disabled: self.disabled,
          validationTracker: self.validationTracker,
          roleAccessPointMap: self.roleAccessPointMap,
          selectedAccessType: self.selectedAccessType,
          accessPointTabs: self.accessPointTabs,
          selectedModuleName: self.selectedModuleName,
          dataSourceLoaded: self.dataSourceLoaded,
          dataSourceToBePassed: self.dataSourceToBePassed,
          selectedUser: self.selectedUser,
          appRoleName: self.appRoleName,
          appDescription: self.appDescription,
          roleSegmentMap: self.roleSegmentMap,
          selectedStepLabel: self.selectedStepLabel,
          createObservables: self.createObservables,
          scopes: self.scopes,
          selectedScopeType: self.selectedScopeType,
          verifyAndEdit: rootParams.rootModel.params.verifyAndEdit
        });

        rootParams.dashboard.loadComponent("map-transaction", params);
      });
    };

    self.dispose = function () {
      selectedUserSubscription.dispose();
    };
  };
});