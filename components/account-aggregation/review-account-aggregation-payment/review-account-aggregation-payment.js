/**
 * Review Account Aggregation Payment used to review the transfer money to internal or external account
 *
 * @module account-aggregation
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} assembleStructureModel
 * @requires {object} ResourceBundle
 */
define([

  "knockout",
  "ojL10n!resources/nls/aggregate-register-payment",
  "ojs/ojbutton"
], function(ko, ResourceBundle) {
  "use strict";

  /**
   * Account Aggregation Payment component is used to transfer money to internal or external account.
   *
   * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
   * @return {Function} Function.
   */
  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    rootParams.baseModel.registerElement("row");
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.header.transferMoney);

    /**
     * This function will be used for the last page.
     *
     * @memberOf review-account-aggregation-payment
     * @function back
     * @returns {void}
     */
    self.back = function() {
      rootParams.dashboard.hideDetails();
    };
  };
});