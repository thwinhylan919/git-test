define([

  "knockout",

  "./model",

  "ojL10n!resources/nls/available-limits",
  "ojs/ojlistview",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojdialog",
  "ojs/ojbutton",
  "ojs/ojgauge",
  "ojs/ojchart"
], function (ko, AvailableLimitModel, ResourceBundle) {
  "use strict";

  /** Transfer view limits.
   *
   * @param {Object} Params  - An object which contains contect of dashboard and param values.
   * @return {Function} Function.
   * @return {Object} GetNewKoModel.
   *
   */
  return function (Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.dispose = "";
    self.nls = ResourceBundle;
    self.maxAmount = ko.observable();
    Params.baseModel.registerElement("page-section");
    self.minAmount = ko.observable();
    self.count = ko.observable();
    self.currency = ko.observable();
    self.dataSource = ko.observable();
    self.responseMinAmount = ko.observable();
    self.responseMaxAmount = ko.observable();
    self.response = ko.observable();
    self.isApprovalRequired = ko.observable(false);
    self.isAmountSpent = ko.observable(false);
    self.isCountSpent = ko.observable(false);
    self.noLimitsAttached = ko.observable(false);

    self.availableLimitParams = {
      taskCode: "",
      payeeId: "",
      accessPointValue: "",
      networkType: ""
    };

    if (self.parentTaskCode) {
      self.availableLimitParams.taskCode = self.parentTaskCode() || ko.observable();
    } else {
      self.availableLimitParams.taskCode = ko.utils.unwrapObservable(Params.type) || ko.observable();
    }

    if (Params.id) {
      self.availableLimitParams.payeeId = ko.utils.unwrapObservable(Params.id);
    } else {
      self.availableLimitParams.payeeId = self.customPayeeId ? self.customPayeeId() : ko.observable();
    }

    self.availableLimitParams.accessPointValue = ko.utils.unwrapObservable(Params.accessPointValue);

    if (self.availableLimitParams.taskCode === "PC_F_CGNDP") {
      self.availableLimitParams.networkType = self.paymentType && self.paymentType() ? self.paymentType() : self.network && self.network() ? self.network() : ko.observable();
    } else if (self.availableLimitParams.taskCode === "PC_F_DOM") {
      if (self.params && self.params.transferDataPayee.domesticPayeeType === "SEPA") {
        self.availableLimitParams.networkType = self.params.transferDataPayee.sepaType;
      } else {
        self.availableLimitParams.networkType = self.network ? self.network() : null || self.paymentType ? self.paymentType() : null || ko.observable();
      }
    } else {
      self.availableLimitParams.networkType = self.network ? self.network() : null || self.paymentType ? self.paymentType() : null || ko.observable();
    }

    AvailableLimitModel.fetchAvailableLimits(self.availableLimitParams).done(function (data) {
      self.isApprovalRequired(data.approvalRequired);

      if (data.amountRange) {
        self.maxAmount(data.amountRange.maxTransaction.amount);
        self.minAmount(data.amountRange.minTransaction.amount);
        self.currency(data.amountRange.minTransaction.currency);
        self.count(data.maxCount);
        self.responseMinAmount(self.minAmount());
        self.responseMaxAmount(self.maxAmount());

        if ((self.maxAmount() < self.minAmount()) || self.maxAmount() === 0) {
          self.isAmountSpent(true);
        }

        if (self.count() === 0) {
          self.isCountSpent(true);
        }
      } else {
        self.noLimitsAttached(true);
      }

    });

  };
});