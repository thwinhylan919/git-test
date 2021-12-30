define([
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/review-theme",
  "ojs/ojaccordion"
], function (ko, $, model, locale) {
  "use strict";

  return function (rootParams) {
    const self = this;

    rootParams.baseModel.registerElement("row");
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerComponent("preview-theme", "theme-config");
    self.parameters = rootParams.rootModel.params;
    self.resourceBundle = locale;
    self.reviewTransactionName = {};
    self.reviewTransactionName.header = self.resourceBundle.generic.common.review;
    self.reviewTransactionName.reviewHeader = self.resourceBundle.reviewBrand;

    if (rootParams.rootModel.params.zip) {
      self.zip = rootParams.rootModel.params.zip;
    }

    let updateBrandId;

    if (rootParams.rootModel.params.mode === "edit") {
      updateBrandId = rootParams.rootModel.params.brandId;
    }

    self.sizeUnit = "rem";
    self.theme = rootParams.rootModel.params.data;
    self.showReviewPage = ko.observable(false);
    self.currentTokens = {};
    self.skeletonStructure = {};
    self.themeProperties = ["background", "border", "hover", "size", "interaction", "selected", "typography", "shadow"];
    rootParams.dashboard.headerName(self.resourceBundle.headerName);

    self.themeProperties.forEach(function (component) {
      rootParams.baseModel.registerComponent(component, "theme-config");
    });

    self.editTheme = function () {
      rootParams.dashboard.loadComponent("create-theme", {
        mode: "edit",
        data: self.theme
      }, self);
    };

    self.downloadImageAssets = function (theme) {
      model.downloadImageAssets(theme.brandId);
    };

    self.deleteTheme = function (theme, isDeleteConfirmed) {
      if (!isDeleteConfirmed) {
        $("#confirmDelete").trigger("openModal");
      } else {
        model.deleteDocument(theme.brandId).then(function (data) {
          $("#confirmDelete").trigger("closeModal");

          rootParams.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            transactionName: self.resourceBundle.deleteThemeTransaction
          }, self);
        });
      }
    };

    self.getTokens = function () {
      return Object.keys(self.skeletonStructure).map(function (element) {
        return {
          headerName: element
        };
      });
    };

    self.cancelConfirmDialog = function () {
      $("#confirmDelete").trigger("closeModal");
    };

    function generateJSON(parentObject, result) {
      result = result || {};

      let property;

      for (property in parentObject) {
        if (Object.prototype.hasOwnProperty.call(parentObject, property)) {
          if (typeof parentObject[property] === "object") {
            generateJSON(parentObject[property], result);
          } else {
            result[parentObject[property]] = null;
          }
        }
      }

      return result;
    }

    require(["load!framework/json/theme/themes.json"], function (data) {
      const json = generateJSON(data);

      json["--base-font-url"] = null;
      json["--base-font-family"] = null;

      Object.assign(self.skeletonStructure, data);

      if (rootParams.rootModel.params.mode === "view") {
        model.fetchAssets(self.theme.brandId).then(function (brandData) {
          self.theme.styleAsset = brandData;
          Object.assign(json, brandData);
          Object.assign(self.currentTokens, ko.mapping.fromJS(json));
          self.showReviewPage(true);
        });
      } else if (rootParams.rootModel.params.mode === "review" || rootParams.rootModel.params.mode === "edit") {
        Object.assign(json, self.theme.styleAsset);
        Object.assign(self.currentTokens, ko.mapping.fromJS(json));
        self.showReviewPage(true);
      } else if (rootParams.rootModel.params.mode === "approval") {
        Object.assign(json, JSON.parse(rootParams.rootModel.params.data.styleAsset));
        Object.assign(self.currentTokens, ko.mapping.fromJS(json));
        self.showReviewPage(true);
      }
    });

    self.saveTheme = function () {
      model.uploadDocument(ko.mapping.toJS(self.theme), self.zip).then(function (data) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          transactionName: self.resourceBundle.themeTransaction
        }, self);
      });
    };

    self.confirmUpdateTheme = function () {
      model.updateDocument(ko.mapping.toJS(self.theme), self.zip, updateBrandId).then(function (data) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          transactionName: self.resourceBundle.updateTransaction
        }, self);
      });
    };
  };
});