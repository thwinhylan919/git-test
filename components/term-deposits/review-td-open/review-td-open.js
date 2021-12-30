define([
    "knockout",
    "ojL10n!resources/nls/review-td-open"
  ], function(ko, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.depositTypesList = {
        CON:"Conventional",
        RFC:"RFC",
        FCNR:"FCNR",
        NRE:"NRE",
        NRO:"NRO"
      };

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    self.module = self.params.data.module==="ISL"?"ISL":"CON";
    self.createRDModel = self.params.data;
    self.parties = self.params.parties;
    self.createTDConfirm = self.params.createTDConfirm;
    self.hostSupportsNominee = self.params.hostSupportsNominee;
    rootParams.baseModel.registerElement("internal-account-input");
    rootParams.baseModel.registerComponent("review-add-edit-nominee", "nominee");
    self.component = ko.observable("review-add-edit-nominee");

    if(rootParams.dashboard.appData.segment!=="CORP"){
      rootParams.dashboard.headerName(rootParams.baseModel.format(self.resource.common.tdHeading,{
          depositType: self.depositTypesList[self.params.productType]
      }));
    }
    else{
      rootParams.dashboard.headerName(self.resource.common.termDpositHeader);
    }

    self.reviewTransactionName = [];
    self.reviewTransactionName.header = self.resource.common.review;
    self.reviewTransactionName.reviewHeader = self.resource.common.reviewHeader;

    self.formatTenure = function() {
      return rootParams.baseModel.format(self.resource.depositDetail.tenureFormat, {
        years: self.createRDModel.tenure.years,
        months: self.createRDModel.tenure.months,
        days: self.createRDModel.tenure.days
      });
    };
  };
});