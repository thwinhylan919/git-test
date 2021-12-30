define([

  "knockout",

  "./model",
  "ojL10n!resources/nls/access-point",
  "ojs/ojknockout-validation",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojradioset",
  "ojs/ojlabel",
  "ojs/ojswitch",
  "ojs/ojvalidation",
  "ojs/ojknockout-validation",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojfilepicker"
], function (ko, AccessPointCreateModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;

    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerComponent("access-point-view", "access-point");
    rootParams.baseModel.registerComponent("access-point-search", "access-point");
    rootParams.dashboard.headerName(self.nls.accessPoint.headerName);

    self.accessPointId = self.params.data !== undefined ? self.params.data.id : ko.observable();
    self.accessType = self.params.data !== undefined ? self.params.data.type : ko.observable("EXT");
    self.accessPointStatus = self.params.data !== undefined ? self.params.data.status || self.params.data.accessPointStatus : ko.observable("N");
    self.accessPointDescription = self.params.data !== undefined ? self.params.data.description : ko.observable();
    self.clientId = self.params.data !== undefined ? self.params.data.clientId : ko.observable();
    self.isHeadlessMode = self.params.data !== undefined ? self.params.data.headlessMode : ko.observable(false);
    self.defaultSelect = self.params.data !== undefined ? self.params.data.defaultSelect : ko.observable(false);
    self.contentId = self.params.data !== undefined ? self.params.data.imgRefno : ko.observable();
    self.selfOnboard = self.params.data !== undefined ? self.params.data.selfOnboard : ko.observable(false);
    self.skipLoginFlow = self.params.data !== undefined ? self.params.data.skipLoginFlow : ko.observable(false);
    self.pwdEncryptionEnabled = self.params.data !== undefined ? self.params.data.pwdEncryptionEnabled : ko.observable(false);
    self.uploadedImage = self.params.uploadedImage !== undefined ? self.params.uploadedImage : ko.observable();
    self.isExternal = self.params.isExternal !== undefined ? self.params.isExternal : ko.observable(true);
    self.twoFARequired = self.params.twoFARequired !== undefined ? self.params.twoFARequired : ko.observable(false);
    self.statusSwitch = ko.observable(false);
    self.consentRequired = self.consentRequired !== undefined ? self.consentRequired : ko.observable(false);

    self.selectedScopes = ko.observableArray([]);
    self.accessPointInstance = ko.observable();
    self.payloadObj = {};
    self.version = self.params.data !== undefined ? self.params.data.version : ko.observable();
    self.accessTypeOptions = ko.observableArray([]);
    self.dataLoaded = ko.observable(false);
    self.scopes = ko.observableArray([]);
    self.scopeOptions = ko.observableArray([]);
    self.accessPointAspects = ko.observableArray([]);
    self.groupValid = ko.observable();

    if (self.params.data !== undefined && self.params.data.aspects !== undefined) {
      for (let i = 0; i < self.params.data.aspects().length; i++) {
        if (self.params.data.aspects()[i].taskAspect === "2fa") {
          self.twoFARequired(self.params.data.aspects()[i].enabled);
        }
      }
    }

    if (self.params && self.params.mode === "editAfterUpdate") {
      self.mode = "edit";

      if (self.accessPointStatus() === "Y") {
        self.statusSwitch(true);
      } else {
        self.statusSwitch(false);
      }

    } else {
      self.mode = "create";

      if (self.accessPointStatus() === "Y") {
        self.statusSwitch(true);
      } else {
        self.statusSwitch(false);
      }

    }

    if (self.mode === "create" || self.mode === "edit") {
      AccessPointCreateModel.fetchAccessPointType().done(function (data) {
        self.accessTypeOptions.removeAll();

        for (let i = 0; i < data.enumRepresentations.length; i++) {
          for (let j = 0; j < data.enumRepresentations[i].data.length; j++) {
            self.accessTypeOptions.push({
              description: data.enumRepresentations[i].data[j].description,
              code: data.enumRepresentations[i].data[j].code
            });
          }
        }

        AccessPointCreateModel.fetchScope().done(function (data) {
          self.scopeOptions.removeAll();

          for (let i = 0; i < data.accessPointScopeListDTO.length; i++) {
            self.scopeOptions.push({
              id: data.accessPointScopeListDTO[i].id,
              description: data.accessPointScopeListDTO[i].description
            });
          }

          self.selectedScopes([]);

          if (self.params.mode === "editAfterCreate" || self.params.mode === "editAfterUpdate") {
            for (let k = 0; k < self.params.data.scopes().length; k++) {
              for (let j = 0; j < self.scopeOptions().length; j++) {
                if (self.params.data.scopes()[k] === self.scopeOptions()[j].id) {
                  self.selectedScopes.push(self.scopeOptions()[j].description);
                }
              }
            }
          }

          self.dataLoaded(true);
        });
      });
    }

    const getNewKoModel = function () {
      const KoModel = AccessPointCreateModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.preparePayload = function () {
      const tracker = document.getElementById("tracker");

      if (tracker.valid === "valid") {
        self.accessPointInstance(getNewKoModel().accessPointModel);
        self.accessPointInstance().id(self.accessPointId());
        self.accessPointInstance().description(self.accessPointDescription());
        self.accessPointInstance().type(self.accessType());
        self.accessPointInstance().headlessMode(self.isHeadlessMode());
        self.accessPointInstance().selfOnboard(self.selfOnboard());
        self.accessPointInstance().clientId(self.clientId());
        self.accessPointInstance().skipLoginFlow(self.skipLoginFlow());
        self.accessPointInstance().pwdEncryptionEnabled(self.pwdEncryptionEnabled());

        if (self.params.statusSwitch) {
          self.accessPointStatus("Y");
        } else {
          self.accessPointStatus("N");
        }

        if (!self.isExternal()) {
          self.accessPointInstance().defaultSelect(self.defaultSelect());
          self.accessPointInstance().scopes([]);
          self.accessPointInstance().imgRefno(self.contentId());
        } else {
          for (let i = 0; i < self.selectedScopes().length; i++) {
            for (let j = 0; j < self.scopeOptions().length; j++) {
              if (self.selectedScopes()[i] === self.scopeOptions()[j].description) {
                self.scopes.push(self.scopeOptions()[j].id);
              }
            }
          }

          self.accessPointInstance().consentRequired(self.consentRequired());
          self.accessPointInstance().scopes(self.scopes());
          self.accessPointInstance().imgRefno(self.contentId());
        }

        self.accessPointInstance().status(self.accessPointStatus());
        self.accessPointInstance().description(self.accessPointDescription());
        self.accessPointInstance().version(self.version());
        self.accessPointAspects.removeAll();

        self.accessPointAspects.push({
          taskAspect: "2fa",
          enabled: self.twoFARequired()
        });

        self.accessPointInstance().aspects(self.accessPointAspects());
        self.payloadObj = self.accessPointInstance();
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.submit = function () {
      self.preparePayload();

      if (self.groupValid() !== "valid") {
        return;
      }

      if (self.mode === "create") {
        const context = {};

        context.data = self.payloadObj;
        context.mode = "reviewAfterCreate";
        context.accessTypeOptions = self.accessTypeOptions;
        context.isExternal = self.isExternal;
        context.selectedScopes = self.selectedScopes;
        context.uploadedImage = self.uploadedImage;
        context.statusSwitch = self.params.statusSwitch;
        context.twoFARequired = self.twoFARequired;
        context.accessPointStatus = self.accessPointStatus;
        context.accessType = self.accessType;
        rootParams.dashboard.loadComponent("access-point-view", context);
      } else {
        const context = {};

        context.data = self.payloadObj;
        context.mode = "reviewAfterEdit";
        context.accessTypeOptions = self.accessTypeOptions;
        context.isExternal = self.isExternal;
        context.selectedScopes = self.selectedScopes;
        context.uploadedImage = self.uploadedImage;
        context.statusSwitch = self.statusSwitch;
        context.twoFARequired = self.twoFARequired;
        context.accessPointStatus = self.accessPointStatus;
        context.accessType = self.accessType;
        rootParams.dashboard.loadComponent("access-point-view", context);
      }
    };

    self.back = function () {
      rootParams.dashboard.loadComponent("access-point-search", {});
    };

    self.accessTypeChangeHandler = function () {
      if (self.accessType() === "EXT") {
        self.isExternal(true);
      } else {
        self.isExternal(false);
        self.selectedScopes([]);
      }
    };

    self.imageSelectListener = function (event) {
      const files = event.detail.files[0];

      self.uploadedImage(files.name);

      const formData = new FormData();

      formData.append("file", files);

      AccessPointCreateModel.uploadImage(formData).then(function (data) {
        self.contentId(data.contentDTOList[0].contentId.value);
      }).fail(
        self.contentId("")
      );
    };

  };
});