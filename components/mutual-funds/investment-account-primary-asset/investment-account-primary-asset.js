define([
  "knockout",

  "ojL10n!resources/nls/investment-account-primary-asset",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtrain",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojgauge",
  "ojs/ojarraydataprovider",
  "ojs/ojtable",
  "ojs/ojpopup",
  "ojs/ojarraytabledatasource",
  "ojs/ojdatacollection-utils",
  "ojs/ojradioset",
  "ojs/ojvalidationgroup"
], function(ko, resourceBundle, AssetsModel) {
  "use strict";

  return function(params) {

    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.nls = resourceBundle;
    self.assetsLoaded = ko.observable(false);
    self.assets = ko.observable([]);
    self.showAssets = ko.observable(true);
    params.baseModel.registerElement("amount-input");

    if (self.openInvestmentAccountData().additionalDetails.assets[0]) {
      self.dummyModal.additionalDetails.assets = self.openInvestmentAccountData().additionalDetails.assets;
    } else {
      self.dummyModal.additionalDetails.assets = [];

      self.dummyModal.additionalDetails.assets.push({
        assetType: null,
        value: {
          amount: ko.observable(),
          currency: ko.observable()
        },
        assetRequired: ko.observable(false)
      });
    }

    AssetsModel.fetchAssetTypes().done(function(data) {
      self.assets(data.enumRepresentations[0].data);
      self.assetsLoaded(true);
    });

    self.addAsset = function() {
      self.showAssets(false);
      ko.tasks.runEarly();

      let pushObj = {};

      pushObj = {
        assetType: null,
        value: {
          amount: ko.observable(),
          currency: ko.observable()
        },
        assetRequired: ko.observable(false)
      };

      self.dummyModal.additionalDetails.assets.push(pushObj);
      self.showAssets(true);
    };

    self.deleteAsset = function(index) {
      self.showAssets(false);
      ko.tasks.runEarly();
      self.dummyModal.additionalDetails.assets.splice(index, 1);
      self.showAssets(true);
    };

    self.assetSelectedHandler = function(index, event) {
      if (event.detail.value) {
        self.dummyModal.additionalDetails.assets[index].assetRequired(true);
      }
    };

    self.currencyParser = function(data) {
      const output = {};

      output.currencies = [];

      if (data) {
        if (data.currencyList && data.currencyList !== null) {
          for (let i = 0; i < data.currencyList.length; i++) {
            output.currencies.push({
              code: data.currencyList[i].code,
              description: data.currencyList[i].description
            });
          }
        }
      }

      return output;
    };

    self.onClickSave = function() {
      const tracker = document.getElementById("tracker");

      if (tracker && tracker.valid === "valid") {
        self.dummyModal.additionalDetails.assets.forEach(function(asset) {
          if (asset.assetType) {
            self.openInvestmentAccountData().additionalDetails.assets.push(asset);
          }
        });

        self.selectedComponent("investment-account-primary-liabilities");
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };
  };
});
