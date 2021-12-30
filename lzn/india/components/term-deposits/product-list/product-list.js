define([

  "knockout",

  "./model",
  "ojL10n!resources/nls/td-open",
  "ojs/ojknockout-validation",
  "ojs/ojdialog",
  "ojs/ojvalidationgroup",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource"
], function(ko, OpenTdModel, locale) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.locale=locale;
    self.depositProductType = self.params.productType;

    OpenTdModel.getDepositType(self.depositProductType()).then(function(data) {
      if(data.tdProductDTOList.length>0){
        self.params.setProductList(data);
      }
    });

    const accountSubscription = self.params.additionalDetails.subscribe(function() {
      if(self.depositProductType()==="RFC"){
        OpenTdModel.getDepositType(self.depositProductType(),self.params.additionalDetails().account.currencyCode).then(function(data) {
        if(data.tdProductDTOList.length>0){
          self.params.setProductList(data);
        }
      });
    }
    });

    self.dispose = function() {
      accountSubscription.dispose();
    };
  };
});
