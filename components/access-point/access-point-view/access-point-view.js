define([

  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/access-point",
  "ojs/ojknockout-validation",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojradioset",
  "ojs/ojlabel",
  "ojs/ojswitch"
], function (ko, $, AccessPointViewModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerComponent("access-point-search", "access-point");
    rootParams.dashboard.headerName(self.nls.accessPoint.headerName);
    self.payload = ko.observable();
    self.httpStatus = ko.observable();
    self.transactionStatus = ko.observable();
    self.dataLoaded = ko.observable(false);
    self.reviewTransactionName = [];
    self.reviewTransactionName.header = self.nls.accessPoint.review;
    self.reviewTransactionName.reviewHeader = self.nls.accessPoint.confirmScreenheader;
    self.uploadedImage = ko.observable();
    self.contentId = ko.observable();
    self.isExternal = self.params.isExternal !== undefined ? self.params.isExternal : ko.observable(false);
    self.accessTypeOptions = self.params.accessTypeOptions !== undefined ? self.params.accessTypeOptions : ko.observableArray([]);
    self.selectedScopes = self.params.selectedScopes !== undefined ? self.params.selectedScopes : ko.observableArray([]);
    self.scopeOptions = ko.observableArray([]);
    self.statusSwitch = ko.observable(false);
    self.twoFARequired = ko.observable();

    if (self.params.mode === "view") {
      self.mode = "view";

      if (self.params.data !== undefined) {

        if (self.params.data.accessPointStatus() === "Y") {
          self.statusSwitch(true);
        } else {
          self.statusSwitch(false);
        }

        if (self.params.data.twoFARequired !== undefined) {
          self.twoFARequired = self.params.data.twoFARequired;
        }

      }

      AccessPointViewModel.fetchAccessPointType().done(function (data) {
        for (let i = 0; i < data.enumRepresentations.length; i++) {
          for (let j = 0; j < data.enumRepresentations[i].data.length; j++) {
            self.accessTypeOptions.push({
              description: data.enumRepresentations[i].data[j].description,
              code: data.enumRepresentations[i].data[j].code
            });
          }
        }

        AccessPointViewModel.fetchScope().done(function (data) {
          for (let k = 0; k < data.accessPointScopeListDTO.length; k++) {
            self.scopeOptions.push({
              id: data.accessPointScopeListDTO[k].id,
              description: data.accessPointScopeListDTO[k].description
            });
          }

          for (let i = 0; i < self.params.data.scopes().length; i++) {
            for (let j = 0; j < self.scopeOptions().length; j++) {
              if (self.scopeOptions()[j].id === self.params.data.scopes()[i]) {
                self.selectedScopes.push(self.scopeOptions()[j].description);
              }
            }
          }

          self.dataLoaded(true);
        });
      });

      if (self.params.data.imgRefno()) {
        AccessPointViewModel.readImage(self.params.data.imgRefno()).then(function (data) {
          self.uploadedImage(data.contentDTOList[0].title);
          self.contentId(data.contentDTOList[0].contentId.value);
        });
      }

      if (self.params.data.type() === "EXT") {
        self.isExternal(true);
      }

    } else {

      if (self.params.mode === "reviewAfterEdit") {
        self.mode = "edit";
      } else {
        self.mode = "create";
      }

      if (self.params.data.imgRefno !== undefined && self.params.data.imgRefno()) {
        AccessPointViewModel.readImage(self.params.data.imgRefno()).then(function (data) {
          self.uploadedImage(data.contentDTOList[0].title);
          self.contentId(data.contentDTOList[0].contentId.value);
        });
      }

      if (self.params.statusSwitch !== undefined) {
        self.statusSwitch(self.params.statusSwitch);
      }

      if (self.params.twoFARequired !== undefined) {
        self.twoFARequired = self.params.twoFARequired;
      }

      self.dataLoaded(true);
    }

    self.backReview = function () {

      if (self.mode === "edit") {
        const context = {};

        context.mode = "editAfterUpdate";
        context.data = self.params.data;
        context.uploadedImage = self.params.uploadedImage;
        context.isExternal = self.params.isExternal;
        context.statusSwitch = self.statusSwitch;
        context.twoFARequired = self.params.data.twoFARequired;
        rootParams.dashboard.loadComponent("access-point-create", context);
      } else {
        const context = {};

        context.mode = "editAfterCreate";
        context.data = self.params.data;
        context.uploadedImage = self.params.uploadedImage;
        context.isExternal = self.params.isExternal;
        context.statusSwitch = self.statusSwitch;
        context.twoFARequired = self.params.data.twoFARequired;
        rootParams.dashboard.loadComponent("access-point-create", context);
      }
    };

    self.updateAccessPoint = function () {
      const context = {};

      context.mode = "editAfterUpdate";
      context.data = self.params.data;
      context.uploadedImage = self.uploadedImage;
      context.isExternal = self.isExternal;
      context.statusSwitch = self.statusSwitch;
      context.twoFARequired = self.params.data.twoFARequired;
      rootParams.dashboard.loadComponent("access-point-create", context);
    };

    self.confirm = function () {

      self.payload = {
        accessPointDTO: self.params.data
      };

      if (self.mode === "edit") {
        AccessPointViewModel.updateAccessPoint(ko.mapping.toJSON(self.payload), self.params.data.id()).then(function (data) {
          self.httpStatus = data.getResponseStatus();

          rootParams.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            transactionName: self.nls.accessPoint.updateAccessPoint
          });
        });
      } else {
        AccessPointViewModel.createAccessPoint(ko.mapping.toJSON(self.payload)).then(function (data) {
          self.httpStatus = data.getResponseStatus();

          rootParams.dashboard.loadComponent("confirm-screen", {
            transactionResponse: data,
            transactionName: self.nls.accessPoint.createAccessPoint
          });
        });
      }
    };

    self.cancel = function () {
      $("#reviewCancel").trigger("openModal");
    };

    self.yes = function () {
      rootParams.dashboard.loadComponent("access-point-search", {});
    };

    self.no = function () {
      $("#reviewCancel").hide();
    };

    self.backView = function () {
      const context = {};

      context.mode = "search";
      context.data = self.params.data;
      context.uploadedImage = self.params.uploadedImage;
      rootParams.dashboard.loadComponent("access-point-search", context);
    };

  };
});