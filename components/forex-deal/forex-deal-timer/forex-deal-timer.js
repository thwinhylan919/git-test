/**
 * review forex-deal-create contains all the methods to review the creation of a forex deal booking
 *
 * @module forex-deal
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} forexDealTimerModel
 * @requires {object} ResourceBundle
 */
define([

  "knockout",
  "./model",
  "ojL10n!resources/nls/review-forex-deal-create",
  "ojs/ojcheckboxset",
  "ojs/ojgauge",
  "ojs/ojbutton"
], function(ko, forexDealTimerModel, ResourceBundle) {
  "use strict";

  /** Review Forex Deal Initiation.
   *
   * This component will allow the user to review the forex deal booking if he has access to forex deal booking.
   *
   * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
   * @return {Function} Function.
   *
   */
  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = ResourceBundle;
    self.refreshScreen = ko.observable(false);
    self.timeHandler = ko.observable();
    self.totalWaitTimeInMilliseconds = ko.observable();
    self.exchangeRateValidTime = ko.observable();
    self.remainingTime = ko.observable();
    self.totalWaitTimeInSeconds = ko.observable();
    self.remainingTimeInSeconds = ko.observable();
    self.exchangeRateAmount = ko.observable();
    self.exchangeRateCurrency = ko.observable();
    rootParams.baseModel.registerElement("confirm-screen");

    const currCombinationValue = {
      branchCode: self.params.branchCode,
      curr1: self.params.currencyCombo.split("-")[0],
      curr2: self.params.currencyCombo.split("-")[1]
    };
    let seconds, minutes, hours, timerId;

    /**
     *  This function is to start the timer to confirm the intiated transaction with in that timer.
     *  If the checker doesn't confirm the transaction with in that timer then exchange rate will
     be fetch again for the chosen currency combination.
     *
     *  @memberOf forex-deal-timer
     *  @function printDuration
     *  @returns {void}
     */
    function printDuration() {
      timerId = setInterval(function() {
        if (self.totalWaitTimeInMilliseconds() > 0) {
          self.totalWaitTimeInMilliseconds(self.totalWaitTimeInMilliseconds() - 1000);
          self.remainingTime(self.totalWaitTimeInMilliseconds());
          seconds = Math.floor(self.remainingTime() / 1000);
          minutes = Math.floor(seconds / 60);
          seconds = seconds % 60;
          hours = Math.floor(minutes / 60);

          if (seconds < 10)
            {seconds = "0" + seconds;}

          if (minutes < 10)
            {minutes = "0" + minutes;}

          if (hours < 10)
            {hours = "0" + hours;}

          self.timeHandler({
            text: hours + ":" + minutes + ":" + seconds
          });

          if (self.remainingTimeInSeconds() !== 0)
            {self.remainingTimeInSeconds(self.remainingTimeInSeconds() - 1);}
          else {
            clearInterval(timerId);
          }
        }
      }, 1000);
    }

    /**
     *  This function is to fetch the time value for the user's chosen currency combination.
     *
     *  @memberOf forex-deal-timer
     *  @function computeRate
     *  @param {Object} response  - An object which computes rate.
     *  @returns {void}
     */
    function computeRate(response) {
      self.exchangeRateValidTime(response.forexDealMaintenanceDetails[0].hours + "-" + response.forexDealMaintenanceDetails[0].mins + "-" + response.forexDealMaintenanceDetails[0].sec);
        self.exchangeRateValidTime(self.exchangeRateValidTime().split("-"));
        self.totalWaitTimeInMilliseconds((self.exchangeRateValidTime()[0] * 60 * 60 * 1000) + (self.exchangeRateValidTime()[1] * 60 * 1000) + (self.exchangeRateValidTime()[2] * 1000));
        self.totalWaitTimeInSeconds(self.totalWaitTimeInMilliseconds() / 1000);
        self.remainingTimeInSeconds(self.totalWaitTimeInMilliseconds() / 1000);
        printDuration();
    }

    /**
     *  This function is to fetch the time value for the user's chosen currency combination.
     *
     *  @memberOf forex-deal-timer
     *  @function getTimeDuration
     *  @returns {void}
     */
    function getTimeDuration() {
      forexDealTimerModel.getCurrencyPairs(currCombinationValue).then(function(response) {
        if(response.forexDealMaintenanceDetails.length){
          computeRate(response);
        } else {
          const currTemp = currCombinationValue.curr1;

          currCombinationValue.curr1 = currCombinationValue.curr2;
          currCombinationValue.curr2 = currTemp;

          forexDealTimerModel.getCurrencyPairs(currCombinationValue).then(function(response2) {
            computeRate(response2);
          });
        }
      });
    }

    getTimeDuration();

    forexDealTimerModel.getExchangeRate(currCombinationValue).then(function(response) {
      if (self.params.rateType === "B")
        {self.exchangeRateAmount(response.exchangeRateDetails[0].sellRate);}
      else
        {self.exchangeRateAmount(response.exchangeRateDetails[0].buyRate);}

      self.refreshScreen(false);
      ko.tasks.runEarly();
      self.refreshScreen(true);
    });
  };
});