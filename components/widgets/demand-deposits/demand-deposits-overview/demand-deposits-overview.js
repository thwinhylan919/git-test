define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/accounts-overview",
  "ojs/ojinputtext",
  "ojs/ojchart"
], function(ko, accountsModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.nls = resourceBundle;
    self.accountDetails = ko.observableArray();
    self.accountsLoaded = ko.observable(false);
    self.accountType = rootParams.data.module;

    const accountObject = {
      amount: 0,
      count: 0
    };

    rootParams.baseModel.registerComponent("account-overview", "accounts");

    /**
     * [setData this function extracts the required info needed].
     *
     * @param {[data]} data - Received from response.
     * @returns {Object} AccountObject - object passed to render information.
     */
    function setData(data){

      return data.items.map(function(element){
        accountObject.amount += element.totalActiveAvailableBalance.amount;
        accountObject.count += element.count;
        accountObject.currency = element.totalActiveAvailableBalance.currency;
        accountObject.loadImage = "dashboard/casa-icon.svg";
        accountObject.type = element.accountType;

        return accountObject;
      });
    }

    accountsModel.fetchAccounts().then(function(data) {
      if(!rootParams.baseModel.isEmpty(data.summary)){
        self.accountDetails(setData(data.summary));
      }

      self.accountsLoaded(true);
    });
  };
});
