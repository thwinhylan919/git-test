define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "ojL10n!resources/nls/redeem-funds-global",
  "./model",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojvalidationgroup",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojselectcombobox"
], function (oj, ko, $, resourceBundle, RedeemFundDetails) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.fundDetails.pageHeader);
    params.baseModel.registerComponent("redeem-order-details", "mutual-funds");
    self.refresh = ko.observable(true);

    self.menuSelectOptions = ko.observableArray();

    self.menuSelectOptions.push({
      code: "REDEEM",
      value: self.resource.fundDetails.redeem,
      module: "redeem-fund-details"
    });

    self.menuSelectOptions.push({
      code: "SWP",
      value: self.resource.fundDetails.actionSwp,
      module: "redeem-fund-details"
    });

    self.fetchResults = function () {
      const trackernew = document.getElementById("redeemfund");

      if (!params.baseModel.showComponentValidationErrors(trackernew)) {
        return;
      }

      if (self.modelData.redeemFund.investmentAccountNumber || self.modelData.redeemFund.fundHouseCode || self.modelData.redeemFund.scheme.schemeCode) {
        RedeemFundDetails.fetchData(self.modelData.redeemFund.investmentAccountNumber.value, self.modelData.redeemFund.fundHouseCode, self.modelData.redeemFund.scheme.schemeCode).done(function (data) {
          let tempData = null;

          tempData = $.map(data.accountHoldings, function (v) {
            const newObj = {};

            newObj.accountHoldingId = v.accountHoldingId;
            newObj.schemeName = v.scheme.schemeName;
            newObj.schemeCode = v.scheme.schemeCode;
            newObj.folio = v.folioNumber;
            newObj.purchaseNav = v.averagePurchaseNav.amount;
            newObj.totalUnits = v.investmentSummary.currentUnits;
            newObj.redeemableUnits = v.investmentSummary.availableUnits;
            newObj.marketValue = v.investmentSummary.marketValue.amount;
            newObj.currency = v.investmentSummary.marketValue.currency;
            newObj.fundHouseCode = v.fundHouseCode;

            return newObj;
          });

          self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(tempData, {
            idAttribute: "schemeCode"
          })));

          self.showSearchResults(true);
        });
      }
    };

    self.clearResults = function () {
      self.refresh(false);
      self.modelData.redeemFund.investmentAccountNumber = "";
      self.modelData.redeemFund.fundHouseCode = "";
      self.modelData.redeemFund.scheme.schemeCode = "";
      self.dataSource();
      self.showSearchResults(false);
      ko.tasks.runEarly();
      self.refresh(true);
    };

    self.openMenu = function (model, event) {
      self.modelUsage = ko.observable(model);

      const launcherId = event.currentTarget.attributes.id.nodeValue;

      self.launcherId = launcherId;
      document.getElementById(self.launcherId + "container").open();
    };

    self.menuItemSelect = function (event, data) {
      if (event.target.id === "REDEEM") {
        self.onRedeem(data);
      }

      if (event.target.id === "SWP") {
        self.onSwp(data);
      }
    };
  };
});