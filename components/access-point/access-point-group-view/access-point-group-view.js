define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/access-point-group",
  "ojs/ojknockout-validation",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojradioset",
  "ojs/ojlabel"
], function (oj, ko, $, AccessPointGroupViewModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerComponent("access-point-group-search", "access-point");
    rootParams.dashboard.headerName(self.nls.accessPointGroup.headerName);
    self.mode = ko.observable();
    self.selectedExternalAccessPoints = ko.observableArray([]);
    self.selectedInternalAccessPoints = ko.observableArray([]);
    self.groupCode = ko.observable();
    self.description = ko.observable();
    self.showButtons = ko.observable(true);
    self.groupType = ko.observable(self.nls.accessPointGroup.internal);
    self.reviewTransactionName = [];
    self.reviewTransactionName.header = self.nls.accessPointGroup.review;
    self.reviewTransactionName.reviewHeader = self.nls.accessPointGroup.confirmScreenheader;
    self.payload = ko.observable();
    self.httpStatus = ko.observable();
    self.transactionStatus = ko.observable();

    if (rootParams.data) {
      self.selectedExternalAccessPoints = rootParams.selectedExternalAccessPoints;
      self.selectedInternalAccessPoints = rootParams.selectedInternalAccessPoints;
      self.groupType = rootParams.groupType;
      self.groupCode = rootParams.packageId;
      self.description = rootParams.description;
      self.mode(rootParams.data.mode);
      self.showButtons(false);
    } else {
      self.selectedExternalAccessPoints(self.params.data.externalAccessPoints);
      self.selectedInternalAccessPoints(self.params.data.internalAccessPoints);

      if (self.params.data.externalAccessPoints.length > 0) {
        self.groupType(self.nls.accessPointGroup.external);
      }

      self.groupCode(self.params.data.groupCode);
      self.description(self.params.data.description);
      self.mode(self.params.mode);
    }

    self.internalColumns = [{
      headerText: self.nls.accessPointGroup.internal,
      field: "description",
      id: "internalAccessPointColumn"
    }];

    self.externalColumns = [{
      headerText: self.nls.accessPointGroup.external,
      field: "description",
      id: "externalAccessPointColumn"
    }];

    self.externalDataSource = new oj.ArrayTableDataSource(self.selectedExternalAccessPoints, {
      idAttribute: "id"
    });

    self.internalDataSource = new oj.ArrayTableDataSource(self.selectedInternalAccessPoints, {
      idAttribute: "id"
    });

    self.columnArray = [{
      headerText: self.nls.accessPointGroup.accessPoints,
      field: "accessPointID",
      id: "column2"
    }];

    self.backReview = function () {
      if (self.mode() === "reviewAfterCreate") {
        const context = {};

        context.mode = "editAfterCreate";
        context.groupType = self.params.groupType;

        context.data = {
          groupCode: self.params.data.groupCode,
          description: self.params.data.description,
          internalAccessPoints: self.params.data.internalAccessPoints,
          externalAccessPoints: self.params.data.externalAccessPoints,
          selectedInternalAccessPoints: self.selectedInternalAccessPoints(),
          selectedExternalAccessPoints: self.selectedExternalAccessPoints(),
          version: self.params.data.version
        };

        rootParams.dashboard.loadComponent("access-point-group-create", context);
      } else {

        const context = {};

        context.mode = "editAfterUpdate";
        context.groupType = self.params.groupType;

        context.data = {
          groupCode: self.params.data.groupCode,
          description: self.params.data.description,
          internalAccessPoints: self.params.data.internalAccessPoints,
          externalAccessPoints: self.params.data.externalAccessPoints,
          selectedInternalAccessPoints: self.selectedInternalAccessPoints(),
          selectedExternalAccessPoints: self.selectedExternalAccessPoints(),
          version: self.params.data.version
        };

        rootParams.dashboard.loadComponent("access-point-group-create", context);
      }
    };

    self.updateAccessPointGroup = function () {
      const context = {};

      context.mode = "editAfterUpdate";

      context.data = {
        groupCode: self.params.data.groupCode,
        description: self.params.data.description,
        internalAccessPoints: self.params.data.internalAccessPoints,
        externalAccessPoints: self.params.data.externalAccessPoints,
        selectedInternalAccessPoints: self.selectedInternalAccessPoints(),
        selectedExternalAccessPoints: self.selectedExternalAccessPoints(),
        version: self.params.data.version
      };

      rootParams.dashboard.loadComponent("access-point-group-create", context);
    };

    self.setAccessPointGroup = function () {
      self.selectedAccessPoints = ko.observableArray([]);

      for (let i = 0; i < self.selectedInternalAccessPoints().length; i++) {
        delete self.selectedInternalAccessPoints()[i].selected;
        delete self.selectedInternalAccessPoints()[i].disabled;
        self.selectedAccessPoints.push(self.selectedInternalAccessPoints()[i]);
      }

      for (let j = 0; j < self.selectedExternalAccessPoints().length; j++) {
        delete self.selectedExternalAccessPoints()[j].selected;
        delete self.selectedExternalAccessPoints()[j].disabled;
        self.selectedAccessPoints.push(self.selectedExternalAccessPoints()[j]);
      }

      self.payload = {
        accessPointGroupDTO: {
          accessPointGroupId: self.params.data.groupCode,
          description: self.params.data.description,
          accessPoints: self.selectedAccessPoints(),
          version: self.params.data.version,
          type: self.params.data.type
        }
      };
    };

    self.confirm = function () {
      self.setAccessPointGroup();

      if (self.mode() === "reviewAfterCreate") {
        AccessPointGroupViewModel.createAccessPointGroup(ko.mapping.toJSON(self.payload)).then(function (data) {
          self.httpStatus = data.getResponseStatus();

          rootParams.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            transactionName: self.nls.accessPointGroup.createAccessPointGroup
          });
        });
      } else {
        AccessPointGroupViewModel.updateAccessPointGroup(ko.mapping.toJSON(self.payload), self.groupCode()).then(function (data) {
          self.httpStatus = data.getResponseStatus();

          rootParams.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            transactionName: self.nls.accessPointGroup.updateAccessPointGroup
          });
        });
      }
    };

    self.cancel = function () {
      $("#reviewCancel").trigger("openModal");
    };

    self.yes = function () {
      rootParams.dashboard.loadComponent("access-point-group-search", {});
    };

    self.no = function () {
      $("#reviewCancel").hide();
    };

    self.backView = function () {
      const context = {};

      context.mode = "search";
      context.data = self.params.data;
      context.groupId = self.params.groupId;
      context.groupDescription = self.params.groupDescription;
      context.pagingDatasource = self.params.pagingDatasource;
      context.showSearchData = self.params.showSearchData;
      rootParams.dashboard.loadComponent("access-point-group-search", context);
    };
  };
});