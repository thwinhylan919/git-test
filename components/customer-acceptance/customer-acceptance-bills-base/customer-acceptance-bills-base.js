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

    self.menuSelection = ko.observable("EXPORTBILL");
    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = resourceBundle;
    params.dashboard.headerName(self.resourceBundle.heading.billsCustomerAcceptance);
    params.baseModel.registerElement("nav-bar");
    params.baseModel.registerComponent("customer-acceptance-nav-bar", "customer-acceptance");
    params.baseModel.registerComponent("discrepancies", "customer-acceptance");
    params.baseModel.registerComponent("export-discrepancies", "customer-acceptance");
    self.selectedComponent = ko.observable("export-discrepancies");

    self.menuOptions = ko.observable([{
      id: "EXPORTBILL",
      label: self.resourceBundle.navLabels.exportBill
    }, {
      id: "IMPORTBILL",
      label: self.resourceBundle.navLabels.importBill
    }]);

    self.uiOptions = {
      menuFloat: "left",
      fullWidth: false,
      defaultOption: self.menuSelection
    };

    self.menuSelectionSubscribe = self.menuSelection.subscribe(function(newValue) {
      if (newValue === "EXPORTBILL") {
        self.selectedComponent("export-discrepancies");
      } else if (newValue === "IMPORTBILL") {
        self.selectedComponent("discrepancies");
      }
    });
  };

  vm.prototype.dispose = function() {
    this.menuSelectionSubscribe.dispose();
  };

  return vm;
});