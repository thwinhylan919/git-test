define([
  "ojs/ojcore",
  "knockout",
    "ojL10n!extensions/resources/nls/payment-landing",
  "load!./payment-landing-items.json",
  "ojs/ojlistview",
  "ojs/ojarraytabledatasource"
], function(oj, ko, ResourceBundle, LandingJSON) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    self.paymentLandingQuicklinks = ko.observableArray([]);

    function setData(items) {
      let components = items;

      if(rootParams.dashboard.appData.segment!=="ADMIN"){
        components = rootParams.baseModel.filterAuthorisedComponents(components, "component");
      }

      for (let i = 0; i < components.length; i++) {
        rootParams.baseModel.registerComponent(components[i].id, components[i].module);
      }

      self.paymentLandingQuicklinks.removeAll();
      ko.utils.arrayPushAll(self.paymentLandingQuicklinks, components);
    }

    setData(rootParams.baseModel.cordovaDevice() ? LandingJSON.mobile.items : LandingJSON.web.items);

    self.datasource = new oj.ArrayTableDataSource(self.paymentLandingQuicklinks(), {
      idAttribute: "id"
    });

    rootParams.dashboard.headerName(self.resource.header);

    self.clickHandler = function(context) {
      rootParams.baseModel.registerComponent(context.component, context.module);
      rootParams.dashboard.loadComponent(context.component, context.params || {});
    };
  };
});