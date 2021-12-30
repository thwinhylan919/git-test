define([
  "ojL10n!resources/nls/aggregate-register-payment"
], function(ResourceBundle) {
  "use strict";

  /** View description.
   *
   * @param {Object} params  - An object which contains contect of dashboard and param values.
   * @return {Function} Function.

   */
  return function(params) {
    const self = this;

    self.resource = ResourceBundle;
    params.baseModel.registerComponent("account-aggregation-payment", "account-aggregation");

    self.transfer = function() {
      params.dashboard.loadComponent("account-aggregation-payment", {
        mode: "makePayment"
      }, self);
    };

  };
});