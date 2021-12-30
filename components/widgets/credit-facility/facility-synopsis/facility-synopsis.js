define([
  "knockout",
  "ojL10n!resources/nls/credit-facility",
  "./model",
  "ojs/ojprogress",
  "ojs/ojinputnumber"

], function (ko,resourceBundle, model) {
  "use strict";

  return function (params) {
    const self = this;

    self.nls = resourceBundle;
    self.sanctionedAmount= ko.observable(0);
    self.utilizedAmountInBaseCurr = ko.observable(0);
    self.availableAmountInBaseCurr = ko.observable(0);
    self.baseCurrency = ko.observable();
    self.show = ko.observable(false);
    self.utilizedPercentage = ko.observable();
    self.availablePercentage = ko.observable();

    params.baseModel.registerComponent("facility-overview", "credit-facility");

    model.fetchLiabilityId().done(function (data1) {
    model.getFacilityList(data1.liabilitydtos[0].id,data1.liabilitydtos[0].branch,data1.liabilitydtos[0].partyId,"INR").done(function (data) {
      if (data && data.facilitydtos) {
        data.facilitydtos.forEach(element => {
          self.sanctionedAmount(self.sanctionedAmount() + element.effectiveAmountInBaseCurr.amount);
          self.utilizedAmountInBaseCurr(self.utilizedAmountInBaseCurr() + element.utilizedAmountInBaseCurr.amount);
          self.availableAmountInBaseCurr(self.availableAmountInBaseCurr() + element.availableAmountInBaseCurr.amount);
          self.baseCurrency(element.availableAmountInBaseCurr.currency);
        });

        const utilizedPercentage1=Math.round(self.utilizedAmountInBaseCurr()/self.sanctionedAmount()*100),
         availablePercentage1=100-Math.round(self.utilizedAmountInBaseCurr()/self.sanctionedAmount()*100);

        self.utilizedPercentage(utilizedPercentage1+"%");
        self.availablePercentage(availablePercentage1+"%");

        self.show(true);
      }
    });
  });

    self.viewDetails = function() {
    params.dashboard.loadComponent("facility-overview","", self);
    };
  };
});
