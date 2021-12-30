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
    self.depositTypeList=ko.observableArray([]);
    self.filteredDepositTypeList=ko.observableArray([]);
    self.tempDepositTypeList=ko.observableArray([]);
    self.selectedItem = self.params.productType;
    rootParams.baseModel.registerElement("nav-bar");

    self.depositTypeList = [{
        id: "CON",
        label: "Conventional"
      },{
        id: "RFC",
        label: "RFC"
      },{
        id: "FCNR",
        label: "FCNR"
      },{
        id: "NRE",
        label: "NRE"
      },{
        id: "NRO",
        label: "NRO"
      }];

    self.demandDepositMapping = {
        CON:"demandDeposit?productType=CON",
        RFC:"demandDeposit?productType=RFC&excludeBaseCurrency=true",
        FCNR:"demandDeposit?productType=NRE",
        NRE:"demandDeposit?productType=NRE",
        NRO:"demandDeposit?productType=NRO"
      };

    self.uiOptions = {
      menuFloat: "left",
      fullWidth: false,
      defaultOption: self.selectedItem
    };

    const subscription = self.selectedItem.subscribe(function(menuOption) {
      self.params.account("");
      self.params.depositTypeLoaded(false);
      self.params.depositTypeChanged(false);

      const productType=menuOption;

      self.params.productType(menuOption);
      self.params.resetData();

      self.params.customURL(self.demandDepositMapping[productType]);
      self.params.loadedFromReview(false);

      const depositTypeSelected = menuOption!=="CON"?menuOption:self.depositTypeList[0].label;

      if(rootParams.dashboard.appData.segment!=="CORP"){
          rootParams.dashboard.headerName(rootParams.baseModel.format(self.locale.openTermDeposit.tdHeading,{
            depositType: depositTypeSelected
          }));
      }
      else{
          rootParams.dashboard.headerName(self.locale.openTermDeposit.newDeposit);
      }

      if(menuOption==="RFC"){
        ko.tasks.runEarly();
        self.params.depositTypeChanged(true);
      }
      else{
        OpenTdModel.getDepositProducts(menuOption).done(function(data) {
          if(data.tdProductDTOList.length>0){
            self.params.setProductList(data);
            self.params.depositTypeChanged(true);
          }
        });
      }
    });

    self.filterDepositProductType = function(){
      self.filteredDepositTypeList([]);
      self.tempDepositTypeList([]);

      const productIds=[];
      let count=0, c=0, countProducts=0, m=0, hasAccount=false;

      for (let index=0; index<self.depositTypeList.length; index++){
        OpenTdModel.getDepositProducts(self.depositTypeList[index].id, countProducts).done(function(data, i) {
          if(data.tdProductDTOList.length>0){
            productIds.push(self.depositTypeList[i]);
          }

          c++;

          if(c===self.depositTypeList.length){
            for (let index2=0; index2<productIds.length; index2++){
              const excludeBaseCurrency = productIds[index2].id==="RFC";

            OpenTdModel.getAccounts(productIds[index2].id, excludeBaseCurrency, productIds[index2]).done(function(data2, j){
              if(data2.accounts && data2.accounts.length>0){
                self.tempDepositTypeList.push(j);
                hasAccount=true;
              }

          count++;

          if(count===productIds.length && countProducts===self.depositTypeList.length){
            ko.tasks.runEarly();

            if(self.tempDepositTypeList().length>0){
              self.params.customURL(self.demandDepositMapping[self.selectedItem()]);
            }

            for (let index=0; index<self.depositTypeList.length; index++){
              for (let response=0; response<self.tempDepositTypeList().length; response++){
                if(self.depositTypeList[index].id===self.tempDepositTypeList()[response].id){
                  if(self.filteredDepositTypeList().length===0 && !self.selectedItem()){
                    self.selectedItem(self.depositTypeList[index].id);
                  }

                  self.filteredDepositTypeList.push(self.depositTypeList[index]);
                }
              }
            }

            const depositTypeSelected = self.selectedItem() !=="CON"?self.selectedItem():self.depositTypeList[0].label;

            if(rootParams.dashboard.appData.segment!=="CORP"){
              rootParams.dashboard.headerName(rootParams.baseModel.format(self.locale.openTermDeposit.tdHeading,{
                depositType: depositTypeSelected
              }));
            }
            else{
              rootParams.dashboard.headerName(self.locale.openTermDeposit.newDeposit);
            }
          }

          if(count===productIds.length && !hasAccount){
            rootParams.baseModel.showMessages(null, [self.locale.openTermDeposit.noProductMapped], "ERROR");
          }
          else if(count===productIds.length && hasAccount){
            ko.tasks.runEarly();
            self.params.depositTypesLoaded(true);
          }
        });

        m++;
        }

        if(c===self.depositTypeList.length && m===0){
          rootParams.baseModel.showMessages(null, [self.locale.openTermDeposit.noProductMapped], "ERROR");
        }
        }
        });

        countProducts++;
      }
    };

    self.filterDepositProductType();

    self.dispose = function() {
      subscription.dispose();
    };
  };
});
