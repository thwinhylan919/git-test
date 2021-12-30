define([
  "ojs/ojcore",
  "knockout",
  "ojL10n!resources/nls/docked-menu",
  "load!./corporate.json",
  "load!./retail.json",
  "ojs/ojnavigationlist",
  "ojs/ojconveyorbelt",
  "ojs/ojarraytabledatasource"
], function (oj, ko, ResourceBundle, CorporateMenu, RetailMenu) {
  "use strict";

  return function (rootParams) {
    const self = this;

    self.resource = ResourceBundle;

    const navDataSourceArray = ko.observableArray();
    let dockedMenuEvent;

    self.dataSource = new oj.ArrayTableDataSource(navDataSourceArray, {
      idAttribute: "id"
    });

    ko.utils.arrayPushAll(navDataSourceArray, (rootParams.dashboard.appData.segment === "CORP" ? CorporateMenu : RetailMenu).menuItems);

    rootParams.baseModel.addEvent("pageChanged", {
      element: window,
      eventName: "pageChanged",
      eventHandler: function() {
          if (!dockedMenuEvent) {
            document.querySelector(".docked-menu-nav-list").setProperty("selection", null);
          }

          dockedMenuEvent = false;
      }
  });

    self.changePage = function (value) {
      dockedMenuEvent = true;

      if (value.isModule) {
        rootParams.dashboard.switchModule(value.module);
      } else {
        rootParams.baseModel.registerComponent(value.showDetailsParams.id, value.showDetailsParams.module);
        rootParams.dashboard.loadComponent(value.showDetailsParams.id, value.showDetailsParams.params);
      }
    };
  };
});