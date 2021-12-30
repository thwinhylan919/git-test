define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/limit-package",
  "ojs/ojaccordion",
  "ojs/ojlistview",
  "ojs/ojselectcombobox",
  "ojs/ojtable",
  "ojs/ojcollapsible",
  "ojs/ojnavigationlist",
  "ojs/ojarraytabledatasource",
  "ojs/ojcheckboxset",
  "promise"
], function (oj, ko, $, AccessPointLimitPackageModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.componentTemplateId = ko.observable("row_Template_user_management");
    self.selectedAccessPoint = ko.observableArray([]);
    self.selectedLimitPackage = ko.observable();
    self.loadData = ko.observable(false);
    self.datasource = new oj.ArrayTableDataSource([]);
    self.listAccessPointArray = ko.observableArray();
    self.listAccessPointGroupArray = ko.observableArray();
    self.accessPointLimitPackageArray = ko.observableArray();
    self.accessPointTypeArray = ko.observableArray();
    self.listOfAccessPointId = ko.observableArray();
    self.hitLimitPackage = ko.observable(true);
    self.tableData = ko.observableArray();
    self.limitPackageDetails = rootParams.limitPackageDetails;
    self.listLimitPackageArray = rootParams.listLimitPackageArray;
    self.header = rootParams.header;
    self.selectedLimitPackages = rootParams.selectedLimitPackages;
    self.businessEntity = rootParams.businessEntity;
    self.idForModalWindow = self.businessEntity ? self.businessEntity : self.header.replace(/\s/g, "_");
    self.accessPointType = rootParams.accessPointType;
    self.messages = rootParams.messages;
    self.packageId = ko.observable();
    rootParams.baseModel.registerComponent("review-limit-package", "financial-limit-package");
    rootParams.baseModel.registerComponent("access-point-group-view", "access-point");
    self.internalAccessPoints = ko.observableArray();
    self.externalAccessPoints = ko.observableArray();
    self.description = ko.observable();
    self.intOrExt = ko.observable();
    self.changeParameter = ko.observable();

    self.data = ko.observable({
      groupCode: self.packageId(),
      description: self.description(),
      internalAccessPoints: self.internalAccessPoints(),
      externalAccessPoints: self.externalAccessPoints(),
      accessPoints: ko.observableArray(),
      version: ko.observable(),
      mode: "view"
    });

    self.showIconInformationForGroup = ko.observable(false);

    self.columnArray = [{
      headerText: self.nls.access_point_limit_package_mapping.accessPoint,
      renderer: oj.KnockoutTemplateUtils.getRenderer("accessPointScript"+self.header, true)
    },
    {
      headerText: self.nls.access_point_limit_package_mapping.limitPackage,
      renderer: oj.KnockoutTemplateUtils.getRenderer("selectScript"+self.header, true)
    },
    {
      headerText: self.nls.access_point_limit_package_mapping.actions,
      renderer: oj.KnockoutTemplateUtils.getRenderer("buttonsScript"+self.header, true)
    }
    ];

    self.refresh = function (data) {
      data.row.selectedLimitPackage("");
    };

    const promise1 = AccessPointLimitPackageModel.fetchSystemConfigurationDetails().then(function (data) {
      self.changeParameter(data.configResponseList[0].propertyValue);
    });

    self.showGroupInformation = function (data) {
      self.packageId(data.row.accessPoint);
      self.internalAccessPoints.removeAll();
      self.externalAccessPoints.removeAll();

      for (let i = 0; i < self.listAccessPointGroupArray().length; i++) {
        if (self.listAccessPointGroupArray()[i].accessPointGroupId === self.packageId()) {
          self.description(self.listAccessPointGroupArray()[i].description);

          for (let j = 0; j < self.listAccessPointGroupArray()[i].accessPoints.length; j++) {
            const index = self.listOfAccessPointId().indexOf(self.listAccessPointGroupArray()[i].accessPoints[j].id);

            if (self.listAccessPointArray()[index].type === "INT") {
              self.intOrExt(self.nls.access_point_limit_package_mapping.internal);

              self.internalAccessPoints.push({
                id: self.listAccessPointArray()[index].id,
                description: self.listAccessPointArray()[index].description
              });
            } else if (self.listAccessPointArray()[index].type === "EXT") {
              self.intOrExt(self.nls.access_point_limit_package_mapping.external);

              self.externalAccessPoints.push({
                id: self.listAccessPointArray()[index].id,
                description: self.listAccessPointArray()[index].description
              });
            }
          }

          break;
        }
      }

      self.data({
        groupCode: self.packageId(),
        description: self.description(),
        internalAccessPoints: self.internalAccessPoints(),
        externalAccessPoints: self.externalAccessPoints(),
        accessPoints: ko.observableArray(),
        version: ko.observable(),
        mode: "view"
      });

      self.showIconInformationForGroup(true);
      ko.tasks.runEarly();
      $("#" + self.idForModalWindow).trigger("openModal");
    };

    self.done = function () {
      $("#" + self.idForModalWindow).hide();
      self.showIconInformationForGroup(false);
      ko.tasks.runEarly();
    };

    promise1.then(function () {
      const promise3 = AccessPointLimitPackageModel.listAccessPointGroup();

      promise3.then(function (data) {
        if (self.changeParameter() === "Y") {
          if (self.accessPointType() === "INT") {
            for (let k1 = 0; k1 < data.accessPointGroupListDTO.length; k1++) {
              if (data.accessPointGroupListDTO[k1].type === "INT") {
                self.listAccessPointGroupArray.push(data.accessPointGroupListDTO[k1]);
              }
            }
          } else {
            self.listAccessPointGroupArray(data.accessPointGroupListDTO);
          }

          self.listAccessPointGroupArray().sort(function (a, b) {
            if (a.accessPointGroupId < b.accessPointGroupId) { return -1; }

            if (a.accessPointGroupId > b.accessPointGroupId) { return 1; }

            return 0;
          });
        }

        const promise2 = AccessPointLimitPackageModel.listAccessPoint(self.accessPointType());

        promise2.then(function (data) {
          if (self.changeParameter() === "Y") {
            self.listAccessPointArray(data.accessPointListDTO);

            self.listAccessPointArray().sort(function (a, b) {
              if (a.id < b.id) { return -1; }

              if (a.id > b.id) { return 1; }

              return 0;
            });
          }

          for (let k = 0; k < self.listAccessPointArray().length; k++) {
            self.listOfAccessPointId.push(self.listAccessPointArray()[k].id);
            self.accessPointTypeArray.push([]);
            self.accessPointLimitPackageArray.push([]);
          }

          for (let i = 0; i < self.listAccessPointGroupArray().length; i++) {
            self.listOfAccessPointId.push(self.listAccessPointGroupArray()[i].accessPointGroupId);
            self.accessPointTypeArray.push([]);
            self.accessPointLimitPackageArray.push([]);
          }

          self.listOfAccessPointId.push("GLOBAL");
          self.accessPointTypeArray.push([]);
          self.accessPointLimitPackageArray.push([]);

          for (let j = 0; j < self.listLimitPackageArray().length; j++) {
            if (self.listOfAccessPointId.indexOf(self.listLimitPackageArray()[j].accessPointValue) >= 0) {
              self.accessPointLimitPackageArray()[self.listOfAccessPointId.indexOf(self.listLimitPackageArray()[j].accessPointValue)].push(self.listLimitPackageArray()[j].key.id);
              self.accessPointTypeArray()[self.listOfAccessPointId.indexOf(self.listLimitPackageArray()[j].accessPointValue)].push(self.listLimitPackageArray()[j].accessPointGroupType);
            }
          }

          for (let y = 0; y < self.listAccessPointArray().length; y++) {
            const obj = {
              accessPoint: self.listOfAccessPointId()[y],
              LimitPackageArray: self.accessPointLimitPackageArray()[y],
              selected: ko.observable([]),
              accessPointType: self.accessPointTypeArray()[y],
              selectedLimitPackage: ko.observable(),
              description: self.listAccessPointArray()[y].description,
              entityId: self.header,
              isGroup: false
            };

            self.tableData.push(obj);
          }

          for (let z = self.listAccessPointArray().length; z < self.listOfAccessPointId().length - 1; z++) {
            const groupObj = {
              accessPoint: self.listOfAccessPointId()[z],
              LimitPackageArray: self.accessPointLimitPackageArray()[z],
              selected: ko.observable([]),
              accessPointType: self.accessPointTypeArray()[z],
              selectedLimitPackage: ko.observable(),
              description: self.listAccessPointGroupArray()[z - self.listAccessPointArray().length].description,
              entityId: self.header,
              isGroup: true
            };

            self.tableData.push(groupObj);
          }

          const zz = self.listAccessPointArray().length + self.listAccessPointGroupArray().length,
            globalObj = {
              accessPoint: self.listOfAccessPointId()[zz],
              LimitPackageArray: self.accessPointLimitPackageArray()[zz],
              selected: ko.observable([]),
              accessPointType: self.accessPointTypeArray()[zz],
              selectedLimitPackage: ko.observable(),
              description: self.nls.access_point_limit_package_mapping.consolidated,
              entityId: self.header,
              isGroup: false
            };

          self.tableData.push(globalObj);

          if (self.selectedLimitPackages() !== null) {
            for (let x = 0; x < self.selectedLimitPackages().length; x++) {
              if(self.tableData()[self.listOfAccessPointId.indexOf(self.selectedLimitPackages()[x].accessPointValue)])
                {self.tableData()[self.listOfAccessPointId.indexOf(self.selectedLimitPackages()[x].accessPointValue)].selectedLimitPackage(self.selectedLimitPackages()[x].key.id);}
            }
          }

          self.datasource.reset(self.tableData, {
            idAttribute: "accessPoint"
          });

          self.limitPackageDetails(self.datasource.data());
          self.loadData(true);
        });
      });
    });

  };
});
