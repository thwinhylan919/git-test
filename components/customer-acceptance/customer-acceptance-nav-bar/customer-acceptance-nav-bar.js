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
], function (ko, resourceBundle) {
  "use strict";

  const vm = function (params) {
    const self = this;

    self.menuSelection = ko.observable("DISCREPANCIES");
    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = resourceBundle;
    params.baseModel.registerElement("nav-bar");
    params.baseModel.registerComponent("export-amendment", "customer-acceptance");
    params.baseModel.registerComponent("discrepancies", "customer-acceptance");
    params.baseModel.registerComponent("inward-guarantee-amendment", "customer-acceptance");
    self.selectedComponent = ko.observable("discrepancies");
    params.dashboard.headerName(self.resourceBundle.heading.customerAcceptance);

    self.menuOptions = ko.observable([{
      id: "DISCREPANCIES",
      label: self.resourceBundle.navLabels.discrepancies
    }, {
      id: "AMENDMENT",
      label: self.resourceBundle.navLabels.amendment
    }, {
      id: "INWARDBG",
      label: self.resourceBundle.navLabels.inwardGuarantee
    }]);

    self.uiOptions = {
      menuFloat: "left",
      fullWidth: false,
      defaultOption: self.menuSelection
    };

    self.menuSelectionSubscribe = self.menuSelection.subscribe(function (newValue) {
      if (newValue === "DISCREPANCIES") {
        self.selectedComponent("discrepancies", {});
      } else if (newValue === "AMENDMENT") {
        self.selectedComponent("export-amendment", {});
      } else if (newValue === "INWARDBG") {
        self.selectedComponent("inward-guarantee-amendment");
      }
    });
  };

  vm.prototype.dispose = function () {
    this.menuSelectionSubscribe.dispose();
  };

  return vm;
});