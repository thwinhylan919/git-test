/**
 * Forex-deal-utilization in various Payment scenarios
 *
 * @module forex-deal-utilization
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} forexDealBookingModel
 * @requires {object} ResourceBundle
 */
define([

  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/forex-deal-utilization",
  "ojs/ojselectcombobox",
  "ojs/ojradioset",
  "ojs/ojvalidationgroup"
], function(ko, $, forexDealBookingModel, ResourceBundle) {
  "use strict";

  /** Utilization of Forex Deal Booking in Payments Module.
   *
   * This component will allow a corporate user to use a pre-booked forex deal when he goes to make any transaction.
   *
   * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
   * @return {Function} Function.
   *
   */
  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    self.dealType = ko.observable();
    self.exchangeRate = ko.observable();
    self.lookUpDeal = ko.observable(false);
    self.dealPresent = ko.observable(true);
    self.selectedDealId = ko.observable();
    self.firstRowDealId = ko.observable();
    rootParams.baseModel.registerComponent("view-forex-deal", "forex-deal");

    rootParams.baseModel.registerElement([
      "modal-window"
    ]);

    /**
     * This function will open the modal window.
     *
     * @memberOf forex-deal-utilization
     * @function openLookup
     * @returns {void}
     */
    self.openLookup = function() {
      self.lookUpDeal(true);
      self.params.showList(true);
      self.params.dealId("");
      ko.tasks.runEarly();

      $("#lookUpDealNumber").trigger("openModal");
    };

    /**
     * This function will verify the Deal Number.
     *
     * @memberOf forex-deal-utilization
     * @function verifyCode
     * @returns {void}
     */
    self.verifyCode = function() {
      self.lookUpDeal(false);

      if (!self.params.dealDetails() && !rootParams.baseModel.showComponentValidationErrors(document.getElementById("verify-dealNumber-tracker")))
        {return;}

      forexDealBookingModel.fetchForexDeal(self.params.dealId()).then(function(data) {
        self.params.dealDetails(false);
        self.dealType(data.forexDealDTO.dealType === "S" ? self.resource.forexDealBooking.spot : self.resource.forexDealBooking.forward);

        self.exchangeRate({amount : data.forexDealDTO.rate,
currency : self.params.transferCurrency()});

        ko.tasks.runEarly();
        self.params.dealDetails(true);
      });
    };

    if (self.params.dealDetails()) {
      self.verifyCode();
    }

    /**
     * This function will reset the Deal Number and close the modal window.
     *
     * @memberOf forex-deal-utilization
     * @function resetCode
     * @returns {void}
     */
    self.resetCode = function() {
      self.params.dealDetails(false);
      self.params.dealId(null);
    };

    /**
     * This function resets the deal details every time the checkbox option is unselected.
     *
     * @memberOf forex-deal-utilization
     * @param {string} event  - An object containing the current event of field.
     * @function usePreBookedDealHandler
     * @returns {void}
     */
    self.usePreBookedDealHandler = function(event) {
      if (!event.detail.value.length) {
        self.resetCode();
      }
    };

    /**
     * This function will reset the Deal Number and close the modal window.
     *
     * @memberOf forex-deal-utilization
     * @function closeModal
     * @returns {void}
     */
    self.closeModal = function() {
      self.params.dealId("");
      self.selectedDealId(self.firstRowDealId());
      self.lookUpDeal(false);

      if (!self.params.dealsAvailable()) {
        self.params.usePreBookedDeal([]);
      }

      $("#lookUpDealNumber").hide();
    };
  };
});