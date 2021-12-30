define([
    "knockout",
    "ojL10n!resources/nls/manage-payees-billers",
  "ojs/ojradioset",
  "ojs/ojknockout"
], function(ko, ResourceBundle) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.changeView = Params.changeView;
    self.resource = ResourceBundle;

    self.managingArray = [{
        id: "payees",
        label: self.resource.labels.payees
      }
    ];

    self.manage = ko.observable(self.managingArray[0].id);
    self.component = ko.observable("payments-payee-list");
    Params.baseModel.registerComponent("payments-payee-list", "payee");
    Params.baseModel.registerComponent("biller-list", "payments");
    self.refreshComponent = ko.observable(true);

    self.managingChanged = function(event) {
      if (event.detail.value) {
        self.refreshComponent(false);

        if (event.detail.value === self.managingArray[0].id) {
          self.component("payments-payee-list");
        } else if (event.detail.value === self.managingArray[1].id) {
          self.component("biller-list");
        }

        self.refreshComponent(true);
      }
    };
  };
});