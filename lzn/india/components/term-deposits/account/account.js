define([

  "knockout",
  "ojs/ojknockout-validation",
  "ojs/ojdialog",
  "ojs/ojvalidationgroup",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource"
], function(ko) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);

    self.demandDepositMapping = {
        CON:"demandDeposit?productType=CON",
        FCNR:"demandDeposit?productType=NRE",
        NRE:"demandDeposit?productType=NRE",
        NRO:"demandDeposit?productType=NRO"
    };

    if(self.params.productType()==="RFC"){
      if(self.params.specificCurrency){
        self.params.customURL("demandDeposit?productType=RFC&accountCurrency="+self.params.specificCurrency);
      }

      if(self.params.excludeBaseCurrency){
        self.params.customURL("demandDeposit?productType=RFC&excludeBaseCurrency=true");
      }
    }
      else{
        self.params.customURL(self.demandDepositMapping[self.params.productType()]);
      }
  };
});