define([

  "knockout",

  "ojL10n!resources/nls/authorization",
  "ojs/ojcheckboxset",
  "ojs/ojselectcombobox",
  "ojs/ojnavigationlist",
  "promise"
], function(ko, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerElement("nav-bar");
    rootParams.baseModel.registerComponent("edit-entitlement", "entitlements");
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerElement("action-header");
    self.menuSelection = ko.observable(self.params.data[0].entitlementId.split( "_" )[ self.params.data[0].entitlementId.split( "_" ).length - 1 ]);
    self.menuSelection1 = ko.observable(self.params.data[0].entitlementId.split( "_" )[ self.params.data[0].entitlementId.split( "_" ).length - 1 ] + "UCN");
    rootParams.dashboard.headerName(self.nls.headings.entitlement);
    self.menuOptions = ko.observableArray();
    self.menuOptions1 = ko.observableArray();
    self.resourceListSVC = ko.observableArray();
    self.resourceListUCN = ko.observableArray();
    self.resourceLoaded = ko.observable(true);

    self.uiOptions = {
      menuFloat: "right",
      fullWidth: false,
      defaultOption: self.menuSelection
    };

    let k;

    for (k = 0; k < self.params.data.length; k++) {
      self.menuOptions.push({
        id: self.params.data[k].entitlementId.split( "_" )[ self.params.data[k].entitlementId.split( "_" ).length - 1 ],
        label: self.params.data[k].entitlementId.split( "_" )[ self.params.data[k].entitlementId.split( "_" ).length - 1 ]
      });
    }

    for (k = 0; k < self.params.data.length; k++) {
      self.menuOptions1.push({
        id: self.params.data[k].entitlementId.split( "_" )[ self.params.data[k].entitlementId.split( "_" ).length - 1 ] + "UCN",
        label: self.params.data[k].entitlementId.split( "_" )[ self.params.data[k].entitlementId.split( "_" ).length - 1 ]
      });
    }

    if (self.params.prm === 1) {
      self.resourceListSVC(self.params.resourceListPRM);
      self.resourceListUCN(self.params.resourceListUIPRM);
    } else if (self.params.apr === 1) {
      self.resourceListSVC(self.params.resourceListAPR);
      self.resourceListUCN(self.params.resourceListUIAPR);
    } else {
      self.resourceListSVC(self.params.resourceListVIW);
      self.resourceListUCN(self.params.resourceListUIVIW);
    }

    self.uiOptions1 = {
      menuFloat: "right",
      fullWidth: false,
      defaultOption: self.menuSelection1
    };

    const menuSelectionSubscription = self.menuSelection.subscribe(function(newValue) {
        self.resourceLoaded(false);
        ko.tasks.runEarly();

        if (newValue === "Perform") {
          self.resourceListSVC(self.params.resourceListPRM);
        } else if (newValue === "View") {
          self.resourceListSVC(self.params.resourceListVIW);
        } else {
          self.resourceListSVC(self.params.resourceListAPR);
        }

        self.resourceLoaded(true);
        ko.tasks.runEarly();
      }),
      menuSelectionSubscription1 = self.menuSelection1.subscribe(function(newValue) {
        self.resourceLoaded(false);
        ko.tasks.runEarly();

        if (newValue === "PerformUCN") {
          self.resourceListUCN(self.params.resourceListUIPRM);
        } else if (newValue === "ViewUCN") {
          self.resourceListUCN(self.params.resourceListUIVIW);
        } else {
          self.resourceListUCN(self.params.resourceListUIAPR);
        }

        self.resourceLoaded(true);
        ko.tasks.runEarly();
      });

    self.dispose = function() {
      menuSelectionSubscription.dispose();
      menuSelectionSubscription1.dispose();
    };

    self.backToEdit = function() {
      const params = {
        module: self.params.module,
        category: self.params.category,
        resourceListVIW: self.params.resourceListVIW,
        resourceListPRM: self.params.resourceListPRM,
        resourceListAPR: self.params.resourceListAPR,
        resourceListUIVIW: self.params.resourceListUIVIW,
        resourceListUIPRM: self.params.resourceListUIPRM,
        resourceListUIAPR: self.params.resourceListUIAPR,
        entitleName: self.params.entdispName,
        apr: self.params.apr,
        viw: self.params.viw,
        prm: self.params.prm,
        data: self.params.data
      };

      rootParams.dashboard.loadComponent("edit-entitlement", params);
    };
  };
});
