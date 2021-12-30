/**
 * review forex-deal-create contains all the methods to review the creation of a forex deal booking
 *
 * @module forex-deal
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} reviewForexDealModel
 * @requires {object} ResourceBundle
 */
define([

  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/review-forex-deal-create",
  "ojs/ojcheckboxset",
  "ojs/ojgauge",
  "ojs/ojbutton"
], function(ko, $, reviewForexDealModel, ResourceBundle) {
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
    let swapDetails = {};

    ko.utils.extend(self, ko.mapping.fromJS(rootParams.rootModel));
    self.nls = ResourceBundle;
    self.createForexDealModel = self.params.createForexDealModel || self.params.data;
    self.currencyCombo = ko.observable(self.createForexDealModel.forexDealDTO.rateType() === "B" ? self.createForexDealModel.forexDealDTO.buyAmount.currency() + "-" + self.createForexDealModel.forexDealDTO.sellAmount.currency() : self.createForexDealModel.forexDealDTO.sellAmount.currency() + "-" + self.createForexDealModel.forexDealDTO.buyAmount.currency());

    if (ko.utils.unwrapObservable(self.params.reviewMode)) {
      rootParams.dashboard.headerName(self.nls.forexDeal.header);
    }

    self.selectedDealType = self.params.selectedDealType;
    self.selectedRateType = ko.observable(self.createForexDealModel.forexDealDTO.rateType() === "B" ? self.nls.forexDeal.buy : self.nls.forexDeal.sell);
    self.rateCurrency = ko.observable(self.createForexDealModel.forexDealDTO.rateType() === "B" ? self.createForexDealModel.forexDealDTO.buyAmount.currency() : self.createForexDealModel.forexDealDTO.sellAmount.currency());
    self.rateAmount = ko.observable(self.createForexDealModel.forexDealDTO.rateType() === "B" ? self.createForexDealModel.forexDealDTO.buyAmount.amount() : self.createForexDealModel.forexDealDTO.sellAmount.amount());
    self.dealType = ko.observable(self.createForexDealModel.forexDealDTO.type() === "S" ? self.nls.forexDeal.spot : self.nls.forexDeal.forward);
    self.forward = ko.observable(self.createForexDealModel.forexDealDTO.type() === "S" ? 0 : 1);
    self.partyName = ko.observable();
    self.refreshScreen = ko.observable(false);
    self.currentTask = ko.observable("FX_M_CFX");
    rootParams.baseModel.registerComponent("forex-deal-create", "forex-deal");
    rootParams.baseModel.registerComponent("forex-deal-timer", "forex-deal");
    rootParams.baseModel.registerElement("confirm-screen");

    let confirmScreenJqxhr,swapReferencenceNumber,currTemp;
    const exchangeCodes = {
      branchCode: self.params.homeBranchCodeParams,
      ccy1Code: self.currencyCombo().split("-")[0],
      ccy2Code: self.currencyCombo().split("-")[1]
    };

    /**
     *  This function is to fetch the exchange Rate.
     *
     *  @memberOf review-forex-deal-create
     *  @function fetchExchangeRate
     *  @returns {void}
     */
    function fetchExchangeRate() {
      reviewForexDealModel.getExchangeRate(exchangeCodes).then(function(response) {
        if ((self.createForexDealModel.forexDealDTO.rateType() === "B" && !currTemp) || (self.createForexDealModel.forexDealDTO.rateType() !== "B" && currTemp))
          {self.createForexDealModel.forexDealDTO.rate.amount(response.exchangeRateDetails[0].sellRate);}
        else
          {self.createForexDealModel.forexDealDTO.rate.amount(response.exchangeRateDetails[0].buyRate);}

        self.refreshScreen(false);
        ko.tasks.runEarly();
        self.refreshScreen(true);
      });
    }

    /**
     *  This function is to fetch the time value for the user's chosen currency combination.
     *
     *  @memberOf review-forex-deal-create
     *  @function getCurrencyPair
     *  @returns {void}
     */
    function getCurrencyPair() {
      reviewForexDealModel.getCurrencyPair(exchangeCodes).then(function(response) {
        if(response.forexDealMaintenanceDetails.length){
          fetchExchangeRate();
        } else {
          currTemp = exchangeCodes.ccy1Code;

          exchangeCodes.ccy1Code = exchangeCodes.ccy2Code;
          exchangeCodes.ccy2Code = currTemp;

          reviewForexDealModel.getCurrencyPair(exchangeCodes).then(function() {
            fetchExchangeRate();
          });
        }
      });
    }

    getCurrencyPair();

    let successMessage, statusMessages;
    const confirmScreenDetailsArray = [
      [{
        label: self.nls.forexDeal.hostReferenceNumber,
        value: ""
      },{
        label: self.nls.forexDeal.status,
        value: ""
      }],
      [{
        label: self.nls.forexDeal.dealType,
        value: self.dealType
      }, {
        label: self.createForexDealModel.forexDealDTO.type() === "F" ? self.nls.forexDeal.validity : "",
        value: self.createForexDealModel.forexDealDTO.type() === "F" ? self.nls.forexDeal.totalNoDays : "",
        bookingDate: self.createForexDealModel.forexDealDTO.bookingDate(),
        valueDate: self.createForexDealModel.forexDealDTO.expiryDate(),
        noOfDays: parseInt(self.createForexDealModel.forexDealDTO.type() === "F" ? self.createForexDealModel.forexDealDTO.forwardPeriod() : 2),
        complexDate: true
      }],
      [{
        label: self.selectedRateType,
        value: rootParams.baseModel.formatCurrency(self.rateAmount(), self.rateCurrency())
      }, {
        label: self.nls.forexDeal.exchangeRate,
        value: rootParams.baseModel.formatCurrency(self.createForexDealModel.forexDealDTO.rate.amount(), self.createForexDealModel.forexDealDTO.rate.currency())
      }]
    ];

    swapDetails = self.createForexDealModel.forexDealDTO.swap() ? [
      [{
        label: self.nls.forexDeal.hostReferenceNumber,
        value: ""
      },{
        label: self.nls.forexDeal.status,
        value: ""
      }],
      [{
        label: self.nls.forexDeal.dealType,
        value: self.nls.forexDeal.forward
      }, {
        label: self.nls.forexDeal.validity,
        value: self.nls.forexDeal.totalNoDays,
        bookingDate: self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.bookingDate(),
        valueDate: self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.expiryDate(),
        noOfDays: parseInt(self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.forwardPeriod()),
        complexDate: true
      }],
      [{
          label: self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.rateType() === "B" ? self.nls.forexDeal.buy : self.nls.forexDeal.sell,
          value: self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.rateType() === "B" ? rootParams.baseModel.formatCurrency(self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.buyAmount.amount(), self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.buyAmount.currency()) : rootParams.baseModel.formatCurrency(self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.sellAmount.amount(), self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.sellAmount.currency())
        },
        {
          label: self.nls.forexDeal.exchangeRate,
          value: rootParams.baseModel.formatCurrency(self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.rate.amount(), self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.rate.currency())
        }
      ]
    ] : [];

    if (!self.params.partyName) {
      reviewForexDealModel.fetchPartyDetails().then(function(data) {
        self.partyName(data.party.personalDetails.fullName);
      });
    } else {
      self.partyName(self.params.partyName);
    }

    /**
     *  This function will call while going back.
     *  Before going back first it will stop the timer if running then will land the user on the initiated page of the forex deal.
     *
     *  @memberOf review-forex-deal-create
     *  @function onBack
     *  @returns {void}
     */
    self.onBack = function() {
      rootParams.dashboard.hideDetails();
    };

    /**
     *  This function will allow the user to create a forex deal booking when the user is either a Maker or .
     *  AutoAuth.
     *
     *  @memberOf review-forex-deal-create
     * @param {string} data  - - - - - - - - - - - - - An object containing the current event of field.
     * @param {string} status  An object containing the current event of field.
     * @param {String} jqXHR  An object containing the current event of field.
     *  @function confirmForexDeal
     *  @returns {void}
     */
    function confirmForexDeal(data, status, jqXHR) {
      self.httpStatus = jqXHR.status;

      if (self.httpStatus && self.httpStatus === 202) {
        successMessage = self.nls.common.confirmScreen.approvalMessages.PENDING_APPROVAL.successmsg;
        statusMessages = self.nls.common.confirmScreen.approvalMessages.PENDING_APPROVAL.statusmsg;
        confirmScreenDetailsArray[2][1].value = rootParams.baseModel.formatCurrency(self.createForexDealModel.forexDealDTO.rate.amount(), self.createForexDealModel.forexDealDTO.rate.currency());

        if(self.createForexDealModel.forexDealDTO.swap()){
          confirmScreenDetailsArray[0][1].value = statusMessages;
          swapDetails[0][1].value = statusMessages;
         }

      } else if (self.httpStatus && (self.httpStatus === 201 || self.httpStatus === 200)) {
        successMessage = self.nls.common.confirmScreen.successMessage;
        statusMessages = self.nls.common.confirmScreen.approvalMessages.APPROVED.statusmsg;
        confirmScreenDetailsArray[2][1].value = data.forexDealDTO.rate ? rootParams.baseModel.formatCurrency(data.forexDealDTO.rate.amount, self.createForexDealModel.forexDealDTO.rate.currency()) : rootParams.baseModel.formatCurrency(self.createForexDealModel.forexDealDTO.rate.amount(), self.createForexDealModel.forexDealDTO.rate.currency());

        if(self.createForexDealModel.forexDealDTO.swap()){
          confirmScreenDetailsArray[0][1].value = statusMessages;
          swapDetails[0][1].value = statusMessages;
         }
      }

      rootParams.dashboard.loadComponent("confirm-screen", {
        jqXHR: confirmScreenJqxhr ? confirmScreenJqxhr : jqXHR,
        transactionName: self.nls.forexDeal.header,
        confirmScreenExtensions: {
          successMessage: successMessage,
          statusMessages: statusMessages,
          swapReferencenceNumber :swapReferencenceNumber,
          swapReferencenceNumberLabel:self.nls.forexDeal.swapReferencenceNumber,
          isSet: true,
          taskCode: self.currentTask(),
          isSwap: self.createForexDealModel.forexDealDTO.swap(),
          swapDetails: swapDetails,
          header1: self.createForexDealModel.forexDealDTO.rateType() === "B" ? self.nls.forexDeal.buyDetails : self.nls.forexDeal.sellDetails,
          header2: self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.rateType() === "B" ? self.nls.forexDeal.buyDetails : self.nls.forexDeal.sellDetails,
          confirmScreenDetails: confirmScreenDetailsArray,
          template: "confirm-screen/forex-deal-template"
        }
      });
    }

    /**
     *  This function will allow the user to confirm the deal if the timer flag is true
     *
     *  @memberOf review-forex-deal-create
     *  @function forexDealBooking
     *  @returns {void}
     */
    self.dealId = ko.observable();

    self.forexDealBooking = function() {
      reviewForexDealModel.forexDealBooking(self.dealId()).done(function(data, status, jqXHR) {
        confirmForexDeal(data, status, jqXHR);
      });
    };

    /**
     *  This function will allow the user to create a forex deal booking when the user is either a Maker or .
     *  AutoAuth.
     *
     *  @memberOf review-forex-deal-create
     *  @function confirmForexDealBooking
     *  @returns {void}
     */
    self.confirmForexDealBooking = function() {
      const forexDealPayload = ko.toJSON(self.createForexDealModel);

      reviewForexDealModel.confirmForexDeal(forexDealPayload).done(function(data, status, jqXHR) {
        confirmScreenJqxhr = jqXHR;

        if (data.forexDealDTO && self.createForexDealModel.forexDealDTO.swap()) {
          swapDetails[0][0].value = data.forexDealDTO.swapDealDTO.forexDealDTO.dealId;
          swapReferencenceNumber = data.forexDealDTO.swapReferenceNumber;
        }

        confirmScreenDetailsArray[0][0].value = data.forexDealDTO ? data.forexDealDTO.dealId : null;

        if (data.forexDealDTO && data.forexDealDTO.confirmationRequired) {
          self.dealId(data.forexDealDTO.dealId);
          ko.tasks.runEarly();
          $("#confirm-deal").trigger("openModal");
        } else {
          confirmForexDeal(data, status, jqXHR);
        }
      });
    };

    self.getConfirmScreenMsg = function(jqXHR) {
      if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
        {return self.nls.common.confirmScreen.approvalMessages.FAILED.successmsg;}
      else if (jqXHR.responseJSON.transactionAction)
        {return self.nls.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;}
    };

    self.getConfirmScreenStatus = function(jqXHR) {
      if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
        {return self.nls.common.confirmScreen.approvalMessages.FAILED.statusmsg;}
      else if (jqXHR.responseJSON.transactionAction)
        {return self.nls.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;}
    };

    /**
     *  This function will allow the user to approve the forex deal when the user is either a Approver.
     *
     *  @memberOf review-forex-deal-create
     *  @returns {void}
     */
    if (self.confirmScreenExtensions) {
      ko.utils.extend(self.confirmScreenExtensions, {
        isSet: true,
        taskCode: self.currentTask(),
        isSwap: self.createForexDealModel.forexDealDTO.swap(),
        swapDetails: swapDetails,
        swapReferencenceNumber :swapReferencenceNumber,
        swapReferencenceNumberLabel:self.nls.forexDeal.swapReferencenceNumber,
        header1: self.createForexDealModel.forexDealDTO.rateType() === "B" ? self.nls.forexDeal.buyDetails : self.nls.forexDeal.sellDetails,
        header2: self.createForexDealModel.forexDealDTO.swapDealDTO.forexDealDTO.rateType() === "B" ? self.nls.forexDeal.buyDetails : self.nls.forexDeal.sellDetails,
        confirmScreenDetails: confirmScreenDetailsArray,
        confirmScreenMsgEval: self.getConfirmScreenMsg,
        confirmScreenStatusEval: self.getConfirmScreenStatus,
      template: "confirm-screen/forex-deal-template"
      });
    }
  };
});
