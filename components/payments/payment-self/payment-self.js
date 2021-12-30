define([
    "knockout",
  "jquery",
  "ojs/ojknockout"
], function(ko) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    Params.baseModel.registerComponent("review-payment-self", "payments");

    if (self.stageTwo()) {
      const transferData = {
        header: Params.dashboard.headerName(),
        reviewMode: true
      };

      if (self.transferOn() === "later")
        {transferData.instructionId = self.paymentId();}
      else if (self.transferOn() === "now")
        {transferData.paymentId = self.paymentId();}

      Params.dashboard.loadComponent("review-payment-self", {
        transferData: transferData,
        retainedData: self
      }, self);
    }
  };
});