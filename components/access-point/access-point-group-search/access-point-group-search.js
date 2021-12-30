define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/access-point-group",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojknockout",
  "promise",
  "ojs/ojgauge",
  "ojs/ojarraydataprovider"
], function (oj, ko, $, AccessPointGroupSearchModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerComponent("access-point-group-create", "access-point");
    rootParams.baseModel.registerComponent("access-point-group-view", "access-point");
    rootParams.dashboard.helpComponent.componentName("access-point-group-search");
    rootParams.baseModel.registerElement("modal-window");
    rootParams.dashboard.headerName(self.nls.accessPointGroup.headerName);
    self.groupCode = ko.observable();
    self.description = ko.observable();
    self.internalAccessPoints = ko.observableArray([]);
    self.externalAccessPoints = ko.observableArray([]);
    self.version = ko.observable();
    self.numberOfAccessPoints = ko.observable();
    self.accessPointsFetched = ko.observable(0);
    self.groupId = self.params.groupId !== undefined ? self.params.groupId : ko.observable();
    self.groupDescription = self.params.groupDescription !== undefined ? self.params.groupDescription : ko.observable();
    self.pagingDatasource = self.params.pagingDatasource !== undefined ? self.params.pagingDatasource : ko.observable();
    self.showSearchData = self.params.showSearchData !== undefined ? self.params.showSearchData : ko.observable(false);

    self.groupParams = {
      groupCode: "",
      description: ""
    };

    self.headerText = [{
        headerText: self.nls.accessPointGroup.groupCode,
        renderer: oj.KnockoutTemplateUtils.getRenderer("groupCodeTemplate", true)
      },
      {
        headerText: self.nls.accessPointGroup.description,
        renderer: oj.KnockoutTemplateUtils.getRenderer("descriptionTemplate", true)
      },
      {
        headerText: self.nls.accessPointGroup.numberOfAccessPoints,
        renderer: oj.KnockoutTemplateUtils.getRenderer("numberOfAccessPoints", true)
      }
    ];

    self.createAccessPointGroup = function () {
      const context = {};

      context.mode = "create";
      rootParams.dashboard.loadComponent("access-point-group-create", context);
    };

    self.prepareDatasource = function (data) {
      self.pagingDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(data, {
        idAttribute: ["groupCode"]
      })));
    };

    self.search = function () {
      if (!self.groupId() && !self.groupDescription()) {
        $("#searchError").trigger("openModal");
      } else {
        self.groupParams.groupCode = self.groupId();
        self.groupParams.description = self.groupDescription();

        AccessPointGroupSearchModel.search(self.groupParams).done(function (data) {
          const tempData = $.map(data.accessPointGroupListDTO, function (v) {
            const newObj = {};

            newObj.groupCode = v.accessPointGroupId;
            newObj.description = v.description;
            newObj.numberOfAccessPoints = v.accessPoints.length;
            self.numberOfAccessPoints(v.accessPoints.length);

            return newObj;
          });

          self.prepareDatasource(tempData);
          self.showSearchData(true);
        });
      }
    };

    self.view = function (data) {
      AccessPointGroupSearchModel.getAccessPointGroup(data.groupCode).then(function (data) {
        self.groupParams.groupCode = data.accessPointGroupDTO.accessPointGroupId;
        self.groupParams.description = data.accessPointGroupDTO.description;
        self.version(data.accessPointGroupDTO.version);
        self.internalAccessPoints([]);
        self.externalAccessPoints([]);

        const promise = [];

        for (let i = 0; i < data.accessPointGroupDTO.accessPoints.length; i++) {
          const promiseObj = new Promise(function (resolve) {
            AccessPointGroupSearchModel.getAccessPoint(data.accessPointGroupDTO.accessPoints[i].id).done(function (data) {
              if (data.accessPointDTO.type === "INT") {
                self.internalAccessPoints.push(data.accessPointDTO);
              } else {
                self.externalAccessPoints.push(data.accessPointDTO);
              }

              resolve();
            });
          });

          promise.push(promiseObj);
        }

        Promise.all(promise).then(function () {
          const context = {};

          context.data = {
            groupCode: self.groupParams.groupCode,
            description: self.groupParams.description,
            internalAccessPoints: self.internalAccessPoints(),
            externalAccessPoints: self.externalAccessPoints(),
            version: self.version()
          };

          context.mode = "view";
          context.groupId = self.groupId;
          context.groupDescription = self.groupDescription;
          context.pagingDatasource = self.pagingDatasource;
          context.showSearchData = self.showSearchData;
          rootParams.dashboard.loadComponent("access-point-group-view", context);
        });
      });
    };

    self.clear = function () {
      self.groupId("");
      self.groupDescription("");
      self.showSearchData(false);
    };

    self.closeDialogBox = function () {
      $("#searchError").hide();
    };
  };
});