define([
  "knockout",
    "ojL10n!resources/nls/discrepancies",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojcollapsible",
  "ojs/ojvalidation",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojknockout-validation",
  "ojs/ojdatetimepicker",
  "ojs/ojcheckboxset",
  "ojs/ojselectcombobox",
  "ojs/ojcube",
  "ojs/ojdatagrid",
  "ojs/ojswitch",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingdatagriddatasource"
], function(ko, resourceBundle) {
  "use strict";

  const vm = function(params) {
    const self = this;

    self.menuSelection = ko.observable("EXPORTLC");
    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = resourceBundle;
    params.dashboard.headerName(self.resourceBundle.heading.lcAmendmentAcceptance);
    params.baseModel.registerElement("nav-bar");
    params.baseModel.registerComponent("customer-acceptance-nav-bar", "customer-acceptance");
    params.baseModel.registerComponent("export-amendment", "customer-acceptance");
    params.baseModel.registerComponent("import-amendment", "customer-acceptance");
    self.selectedComponent = ko.observable("export-amendment");

    self.menuOptions = ko.observable([{
      id: "EXPORTLC",
      label: self.resourceBundle.navLabels.exportLc
    }, {
      id: "IMPORTLC",
      label: self.resourceBundle.navLabels.importLc
    }]);

    self.uiOptions = {
      menuFloat: "left",
      fullWidth: false,
      defaultOption: self.menuSelection
    };

    self.menuSelectionSubscribe = self.menuSelection.subscribe(function(newValue) {
      if (newValue === "EXPORTLC") {
        self.selectedComponent("export-amendment");
      } else if (newValue === "IMPORTLC") {
        self.selectedComponent("import-amendment");
      }
    });
  };

  vm.prototype.dispose = function() {
    this.menuSelectionSubscribe.dispose();
  };

  return vm;
});