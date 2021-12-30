define([
  "knockout",
  "ojL10n!resources/nls/credit-facility",
  "./model"
], function (ko, resourceBundle, CollateralModel) {
  "use strict";

  return function (params) {
    const self = this;

    self.nls = resourceBundle;
    self.collateralAmount= ko.observable(0);
    self.availableAmount = ko.observable(0);
    self.baseCurrency = ko.observable();
    self.showCollateral = ko.observable(false);
    self.utilizedPercentage = ko.observable();
    self.availablePercentage = ko.observable();

    self.collateralAmountInBaseCurr= ko.observable(0);
    self.availableAmountInBaseCurr= ko.observable(0);
    self.utilizedAmountInBaseCurr = ko.observable(0);
    params.baseModel.registerComponent("collateral-overview", "credit-facility");

    CollateralModel.fetchLiabilityId().done(function (data1) {
     CollateralModel.fetchCollateralList(data1.liabilitydtos[0].id,data1.liabilitydtos[0].branch,data1.liabilitydtos[0].partyId,"INR").then(function (data) {

         if (data && data.collateraldtos) {
        data.collateraldtos.forEach(element => {
          self.collateralAmountInBaseCurr(self.collateralAmountInBaseCurr() + element.collateralValueInBaseCurr.amount);
          self.availableAmountInBaseCurr(self.availableAmountInBaseCurr() + element.availableAmountInBaseCurr.amount);
          self.baseCurrency(element.availableAmountInBaseCurr.currency);
          self.utilizedAmountInBaseCurr(self.collateralAmountInBaseCurr()-self.availableAmountInBaseCurr());
        });

        const utilizedPercentage1=Math.round(self.utilizedAmountInBaseCurr()/self.availableAmountInBaseCurr()*100),
         availablePercentage1=100-Math.round(self.utilizedAmountInBaseCurr()/self.availableAmountInBaseCurr()*100);

        self.utilizedPercentage(utilizedPercentage1+"%");
        self.availablePercentage(availablePercentage1+"%");

        self.showCollateral(true);
      }
    });
  });

    self.viewDetails = function() {
      params.dashboard.loadComponent("collateral-overview","");
      };

  };
});
