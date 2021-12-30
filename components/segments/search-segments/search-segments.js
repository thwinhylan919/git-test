define([
  "ojs/ojcore",
  "knockout",

  "./model",
  "ojL10n!resources/nls/search-segments",
  "ojs/ojvalidationgroup",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojbutton",
  "promise",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"
], function (oj, ko, Model, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    self.nls = resourceBundle;
    params.dashboard.headerName(self.nls.SegmentDefinition.header);
    params.baseModel.registerComponent("create-segments", "segments");
    params.baseModel.registerComponent("review-create-segments", "segments");
    self.code = ko.observable();
    self.name = ko.observable();
    self.enterpriseRole = ko.observable();
    self.segmentsObservableArray = ko.observableArray([]);
    self.enterpriseRoleOptions = ko.observableArray([]);

    if (params.rootModel.previousState && params.rootModel.previousState.searchData) {
      self.code = params.rootModel.previousState.searchData.searchCode;
      self.name = params.rootModel.previousState.searchData.searchName;
      self.enterpriseRole = params.rootModel.previousState.searchData.searchEnterpriseRole;
      self.segmentsObservableArray = params.rootModel.previousState.searchData.searchResults;
    }

    self.mode = "search";
    self.dataLoaded = ko.observable(false);
    self.searchResultsLoaded = self.segmentsObservableArray().length > 0 ? ko.observable(true) : ko.observable(false);

    Model.fetchEnterpriseRoles().then(function (data) {
      ko.utils.arrayForEach(data.enterpriseRoleDTOs, function (data) {
        if (data.enterpriseRoleId.toLowerCase() === "retailuser") {
          self.enterpriseRoleOptions.push(data);
          self.dataLoaded(true);
        }
      });
    });

    const getNewKoModel = function () {
      const KoModel = Model.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.modelInstance = getNewKoModel();

    self.pagingDatasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.segmentsObservableArray, {
      idAttribute: "code"
    }));

    self.search = function () {
      if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
        return;
      }

      Model.fetchSegments(self.code(), self.name(), self.enterpriseRole()).then(function (data) {
        self.segmentsObservableArray.removeAll();

        ko.utils.arrayForEach(data.segmentdtos, function (filter) {
          const enterpriseRoleDTO = ko.utils.arrayFirst(self.enterpriseRoleOptions(), function (enterpriseRole) {
              return enterpriseRole.enterpriseRoleId === filter.enterpriseRole;
            }),
            newSegmentObj = filter;

          newSegmentObj.enterpriseRole = enterpriseRoleDTO.enterpriseRoleName;
          self.segmentsObservableArray.push(newSegmentObj);
        });

        self.searchResultsLoaded(true);
      });
    };

    self.columns = [{
      headerText: self.nls.SegmentDefinition.SegmentCode,
      field: "code",
      template: "segmentCodeTemplate"
    }, {
      headerText: self.nls.SegmentDefinition.SegmentName,
      field: "name"
    }, {
      headerText: self.nls.SegmentDefinition.UserType,
      field: "enterpriseRole"
    }, {
      headerText: self.nls.SegmentDefinition.Status,
      field: "status",
      template: "segmentStatusTemplate"
    }];

    self.create = function () {
      const context = {},

        searchData = {};

      searchData.searchResults = self.segmentsObservableArray;
      searchData.searchCode = self.code;
      searchData.searchName = self.name;
      searchData.searchEnterpriseRole = self.enterpriseRole;

      context.mode = "create";
      context.prevmode = self.mode;
      context.searchData = searchData;
      params.dashboard.loadComponent("create-segments", context);

    };

    self.view = function (code) {
      Model.fetchSegment(code).then(function (data) {
        self.modelInstance.code(data.segmentDTO.code);
        self.modelInstance.name(data.segmentDTO.name);
        self.modelInstance.enterpriseRole(data.segmentDTO.enterpriseRole);

        if (typeof data.segmentDTO.roles !== "undefined" && data.segmentDTO.roles.length > 0) {
          for (let v = 0; v < data.segmentDTO.roles.length; v++) {
            self.modelInstance.roles.push({
              appRoleId: data.segmentDTO.roles[v].appRoleId
            });
          }
        }

        if (typeof data.segmentDTO.limits !== "undefined" && data.segmentDTO.limits.length > 0) {
          for (let z = 0; z < data.segmentDTO.limits.length > 0; z++) {
            const entityLimitPackageDTO = {
              targetUnit: "",
              entityLimitPackageMappingDTO: []
            };

            entityLimitPackageDTO.targetUnit = data.segmentDTO.limits[z].targetUnit;

            for (let x = 0; x < data.segmentDTO.limits[z].entityLimitPackageMappingDTO.length; x++) {
              const entityLimitPackageMappingDTO = {
                limitPackage: {
                  key: {
                    id: "",
                    determinantValue: ""
                  }
                }
              };

              entityLimitPackageMappingDTO.limitPackage.key.id = data.segmentDTO.limits[z].entityLimitPackageMappingDTO[x].limitPackage.key.id;
              entityLimitPackageMappingDTO.limitPackage.key.determinantValue = data.segmentDTO.limits[z].entityLimitPackageMappingDTO[x].limitPackage.key.determinantValue;
              entityLimitPackageDTO.entityLimitPackageMappingDTO.push(entityLimitPackageMappingDTO);
            }

            if (entityLimitPackageDTO.entityLimitPackageMappingDTO.length > 0) {
              self.modelInstance.limits.push(entityLimitPackageDTO);
            }
          }
        }

        self.modelInstance.status(data.segmentDTO.status);
        self.modelInstance.version(data.segmentDTO.version);

        const context = {},

          searchData = {};

        searchData.searchResults = self.segmentsObservableArray;
        searchData.searchCode = self.code;
        searchData.searchName = self.name;
        searchData.searchEnterpriseRole = self.enterpriseRole;

        context.mode = "view";
        context.prevmode = self.mode;
        context.data = self.modelInstance;
        context.searchData = searchData;
        context.enterpriseRoles = self.enterpriseRoleOptions();
        params.dashboard.loadComponent("review-create-segments", context);

      });
    };

    self.clear = function () {
      self.searchResultsLoaded(false);
      self.code("");
      self.name("");
      self.enterpriseRole("");
      self.segmentsObservableArray.removeAll();
    };

  };
});