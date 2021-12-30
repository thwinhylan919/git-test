define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/theme-list",
  "load!./brandMappingLevels.json",
  "ojs/ojinputtext",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojselectcombobox"
], function (oj, ko, model, locale, BrandMappingLevels) {
  "use strict";

  return function (params) {
    const self = this;

    self.menuSelection = ko.observable("branding");
    self.resourceBundle = locale;
    params.dashboard.headerName(locale.header);
    self.mappingType = ko.observable();

    self.brandMappingLevels = BrandMappingLevels.levels;

    self.uiOptions = {
      menuFloat: "left",
      fullWidth: false,
      defaultOption: self.menuSelection
    };

    self.arrayDataSource = ko.observableArray();
    self.mappingDataSource = ko.observableArray();

    self.datasource = new oj.ArrayTableDataSource(self.arrayDataSource, {
      idAttribute: "brandId"
    });

    self.mappingList = new oj.ArrayTableDataSource(self.mappingDataSource, {
      idAttribute: "id"
    });

    params.baseModel.registerElement("nav-bar");
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("review-theme", "theme-config");
    params.baseModel.registerComponent("review-mapping", "theme-config");
    params.baseModel.registerComponent("create-theme", "theme-config");
    params.baseModel.registerComponent("create-mapping", "theme-config");
    params.baseModel.registerElement("help");

    self.menuOptions = ko.observableArray([{
        id: "branding",
        label: self.resourceBundle.menu.brand
      },
      {
        id: "mapping",
        label: self.resourceBundle.menu.mapping
      }
    ]);

    model.getModuleThemes().done(function (data) {
      self.arrayDataSource(params.baseModel.sortLib(data.brandDTOs, "creationDate", "desc"));
    });

    self.showMapping = ko.observable(false);

    function getMappings(type) {
      if (type.length) {
        model.getMappings(type).done(function (data) {
          self.mappingDataSource.removeAll();

          ko.utils.arrayPushAll(self.mappingDataSource, params.baseModel.sortLib(data.brandDTOs, "creationDate", "desc").map(function (item) {
            item.id = item.mappedType + item.mappedValue;

            return item;
          }));

          self.showMapping(true);
        });
      } else {
        self.showMapping(false);
      }
    }

    self.mappingType.subscribe(function (type) {
      self.mappingDataSource.removeAll();
      getMappings(type);
    });

    self.viewTheme = function (data) {
      params.dashboard.loadComponent("review-theme", {
        mode: "view",
        data: data
      }, self);
    };

    self.applyTheme = function (data) {
      model.applyTheme(data.brandId, self.menuSelection()).done(function (data, status, jqXHR) {
        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXHR,
          transactionName: params.baseModel.format(self.resourceBundle.brandDeploy, {
            brandId: data.brandDTO.brandId
          })
        }, self);
      });
    };

    self.createTheme = function () {
      params.dashboard.loadComponent("create-theme", {
        mode: "create",
        roles: self.menuOptions()
      }, self);
    };

    self.createMapping = function () {
      params.dashboard.loadComponent("create-mapping", {
        mode: "create",
        selectedOption: self.mappingType()
      });
    };

    self.deleteMapping = function (data) {
      params.dashboard.loadComponent("review-mapping", {
        data: data,
        mode: "review",
        type: "delete"
      });
    };
  };
});