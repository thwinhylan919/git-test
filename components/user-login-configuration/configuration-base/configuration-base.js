define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/user-login-configuration",
  "ojs/ojcheckboxset"
], function (ko, UserLoginFlowModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = resourceBundle;
    self.componentsList = ko.observableArray();
    self.currentQueryMap = ko.observableArray();
    self.uiComponentName = ko.observable();
    self.loginConfigId = ko.observable();
    self.componentMandatory = ko.observable(false);

    let loadedComponentOrder;

    params.baseModel.registerElement("page-section");
    params.baseModel.registerComponent("change-password", "change-password");
    params.baseModel.registerComponent("terms-and-conditions", "user-login-configuration");
    params.baseModel.registerComponent("view-user-security-question", "user-security-question");
    params.baseModel.registerComponent("profile", "base-components");
    params.baseModel.registerComponent("my-limits", "limits-enquiry");

    UserLoginFlowModel.listUserLoginFlow().done(function (data) {
      if (data.userLoginFlowDTOList.length > 0) {
        for (let index = 0; index < data.userLoginFlowDTOList.length; index++) {
          if (data.userLoginFlowDTOList[index].loginConfigDTO) {
            self.componentsList.push(data.userLoginFlowDTOList[index].loginConfigDTO);
          }
        }

        self.componentsList.sort(function (left, right) {
          return left.displayOrder === right.displayOrder ? 0 : left.displayOrder < right.displayOrder ? -1 : 1;
        });

        loadedComponentOrder = 0;
        self.loginConfigId(self.componentsList()[0].id);
        self.uiComponentName(self.componentsList()[0].id);
        self.componentMandatory(self.componentsList()[0].mandatory);

        params.dashboard.loadComponent(self.uiComponentName(), {
          loadNextComponent: self.loadNextComponent,
          uiComponentName: self.uiComponentName,
          componentMandatory: self.componentMandatory
        });
      }
    });

    self.loadNextComponent = function () {

      self.currentQueryMap = decodeURI(window.location.search).replace("?", "").split("&").map(param => param.split("=")).reduce((values, [key, value]) => {
        values[key] = value;

        return values;
      }, {});

      if (self.currentQueryMap.page === "create-user-security-question") {
        self.currentQueryMap.page = "view-user-security-question";
      }

      if (self.currentQueryMap.page !== self.uiComponentName()) {
        for (let index = 0; index < self.componentsList().length; index++) {
          if (self.componentsList()[index].id === self.currentQueryMap.page) {
            loadedComponentOrder = index;
            break;
          }
        }

        loadedComponentOrder = loadedComponentOrder + 1;

        if (loadedComponentOrder < self.componentsList().length) {
          self.uiComponentName(self.componentsList()[loadedComponentOrder].id);
          self.loginConfigId(self.componentsList()[loadedComponentOrder].id);

          params.dashboard.loadComponent(self.uiComponentName(), {
            loadNextComponent: self.loadNextComponent,
            incrementloadedComponentId: self.incrementloadedComponentId,
            componentsList: self.componentsList,
            componentMandatory: self.componentMandatory
          });

        } else if (loadedComponentOrder === self.componentsList().length) {
          params.dashboard.switchModule();
        }

      } else {

        const payload = ko.toJSON({
          loginConfigId: self.loginConfigId()
        });

        UserLoginFlowModel.createLoginConfig(payload).done(function () {
          loadedComponentOrder = loadedComponentOrder + 1;

          if (loadedComponentOrder < self.componentsList().length) {
            self.uiComponentName(self.componentsList()[loadedComponentOrder].id);
            self.loginConfigId(self.componentsList()[loadedComponentOrder].id);

            params.dashboard.loadComponent(self.uiComponentName(), {
              loadNextComponent: self.loadNextComponent,
              incrementloadedComponentId: self.incrementloadedComponentId,
              componentsList: self.componentsList,
              componentMandatory: self.componentMandatory
            });
          } else if (loadedComponentOrder === self.componentsList().length) {
            params.dashboard.switchModule();
          }
        });
      }
    };

    self.incrementloadedComponentId = function () {
      loadedComponentOrder = loadedComponentOrder + 1;
      self.uiComponentName(self.componentsList()[loadedComponentOrder].id);
      self.loginConfigId(self.componentsList()[loadedComponentOrder].id);
      params.dashboard.loadComponent(self.uiComponentName(), {}, self);
    };
  };
});