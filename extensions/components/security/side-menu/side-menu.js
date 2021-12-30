define([
  "knockout",
  "ojL10n!resources/nls/side-menu",
  "ojs/ojbutton"
], function (ko, ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    self.selectedSideMenuItem = ko.observable();
    self.menuSelectionForSideMenu = ko.observable();
    rootParams.dashboard.headerName(self.resource.header);
    rootParams.baseModel.registerComponent("profile", "base-components");

    self.sideMenuList = [{
      id: "MyProfile",
      component: "profile",
      module: "base-components"
    }, {
      id: "primaryAccount",
      component: "sms-primary-account",
      module: "sms-banking"
    }, {
      id: "securityAndLogin",
      component: "security-menu",
      module: "security"
    }, {
      id: "themes",
      component: "preview-brand-list",
      module: "theme-config"
    }, {
      id: "settings",
      component: "generic-settings",
      module: "security"
    }];

    /*{
      id: "thirdPartyApps",
      component: "third-party-consents",
      module: "third-party-consents"
    },
     {
      id: "alerts",
      component: "alerts-list",
      module: "alerts"
    },*/

    self.getRootContext = function ($root) {
      if (!rootParams.baseModel.small()) {
        if ($root.queryMap && $root.queryMap.sideMenuOption) {
          self.selectedSideMenuItem($root.queryMap.sideMenuOption);
        } else {
          self.selectedSideMenuItem("MyProfile");
        }
      }
    };

    self.selectedSideMenuItem.subscribe(function (newValue) {
      if (newValue) {
        let selectedItem = {};

        selectedItem = self.sideMenuList.find(function (item) {
          return item.id === newValue;
        });

        rootParams.baseModel.registerComponent(selectedItem.component, selectedItem.module);

        if (!rootParams.baseModel.small()) {
          self.showDetailParams = selectedItem.data || {};
          self.menuSelectionForSideMenu(selectedItem.component);
        } else {
          rootParams.dashboard.loadComponent(selectedItem.component, selectedItem.data || {});
        }
      }
    });
  };
});