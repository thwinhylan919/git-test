define([
  "knockout",
    "./model",
  "ojL10n!resources/nls/loan-portfolio",
  "ojs/ojinputtext",
  "ojs/ojchart"
], function(ko, Model, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    rootParams.baseModel.registerElement("action-header");
    rootParams.baseModel.registerElement("action-widget");
    self.nls = resourceBundle;
    self.accounts = ko.observableArray();
    self.productTypes = ko.observableArray();
    self.productTypeBasedList = ko.observableArray();
    self.productTypeSeries = ko.observableArray();
    self.selectedValue = ko.observable();
    self.conventionalAccountsAvailable = ko.observable(false);
    self.islamicAccountsAvailable = ko.observable(false);
    self.accountsLoaded = ko.observable(false);

    self.legendObject = rootParams.baseModel.large() ? {
      position: "end",
      maxSize: "50%"
    } : {
      position: "bottom"
    };

    self.typeOfAccounts = [{
        id: "CON",
        label: self.nls.accountDetails.labels.conventionalAccount
    }, {
        id: "ISL",
        label: self.nls.accountDetails.labels.islamicAccount
    }];

    function setData(data) {
      self.accountsLoaded(false);
      self.accounts(data);

      if (self.accounts() && self.accounts().length > 0) {
        for (let i = 0; i < self.accounts().length; i++) {
          self.productTypes.push(self.accounts()[i].productDTO.name);
        }

        self.distinctNames = ko.utils.arrayGetDistinctValues(self.productTypes()).sort();

        ko.utils.arrayForEach(self.productTypes(), function(item) {
          self.productTypeBasedList()[item] = self.productTypeBasedList()[item] || [];
          self.productTypeBasedList()[item].push(item);
        });

        for (let k = 0; k < self.distinctNames.length; k++) {
          self.productTypeSeries.push({
            name: self.distinctNames[k],
            items: [self.productTypeBasedList()[self.distinctNames[k]].length]
          });
        }
      }

      self.accountsLoaded(true);
    }

    self.selectedAccountTypeChangedHandler = function(event){
      if(self.accountsLoaded()){
        self.dataList(self.accounts());

        self.dataList(self.dataList().filter(function(item) {
            return item.module.indexOf(event.detail.value) > -1;
        }));

        setData(self.dataList());
      }
    };

    Model.fetchAccounts().then(function(data) {
      if(!rootParams.baseModel.isEmpty(data.accounts)){
        data.accounts.forEach(function(element) {
            if (element.module === "CON") {
                self.conventionalAccountsAvailable(true);
            } else if (element.module === "ISL") {
                self.islamicAccountsAvailable(true);
            }

        });

        if(!(self.conventionalAccountsAvailable() && self.islamicAccountsAvailable())){
          setData(data.accounts);
        }

        self.accounts(data.accounts);

      }
    });
  };
});
