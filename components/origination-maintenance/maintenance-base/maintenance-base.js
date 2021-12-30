/**
 * New Originations Admin Maintenance.
 *
 * @module origination-maintenance
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} ResourceBundle
 */
define([

  "knockout",
  "ojL10n!resources/nls/maintenance-base",
  "ojs/ojknockout-validation",
  "ojs/ojbutton",
  "ojs/ojvalidationgroup",
  "ojs/ojknockout",
  "ojs/ojtable",
  "ojs/ojtrain"
], function(ko, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.header);
    rootParams.baseModel.registerComponent("product-details", "origination-maintenance");
    rootParams.baseModel.registerComponent("dealer-details", "origination-maintenance");
    rootParams.baseModel.registerComponent("financial-type-maintenance", "origination-maintenance");
    rootParams.baseModel.registerComponent("review", "origination-maintenance");
    self.selectedStep = ko.observable("product-details");
    self.selectedComponent = ko.observable("product-details");
    self.transactionName = ko.observable(self.resource.title);
    self.taskCode = ko.observable("OR_N_AM_CFI");
    self.dataLoaded = ko.observable(true);
    self.products = ko.observableArray([]);
    self.dealerData = ko.observableArray();
    self.isBackFromReview = ko.observable(false);
    self.isBack = ko.observable(false);

    self.stepArray = ko.observableArray([{
      label: self.resource.products,
      id: "product-details"
    }, {
      label: self.resource.dealer,
      id: "dealer-details"
    }, {
      label: self.resource.enumeration,
      id: "financial-type-maintenance"
    }]);

    self.listItems = ko.observableArray([{
      id: "income-maintenance",
      label: self.resource.income,
      tab: 0
    }, {
      id: "liability-maintenance",
      label: self.resource.liability,
      tab: 1
    }, {
      id: "asset-maintenance",
      label: self.resource.asset,
      tab: 2
    }, {
      id: "expense-maintenance",
      label: self.resource.expense,
      tab: 3
    }, {
      id: "accommodation-maintenance",
      label: self.resource.accommodation,
      tab: 4
    }]);

    self.tabledata = ko.observableArray([{
      masterArray: ko.observableArray(),
      selectedArray: ko.observableArray(),
      initialSelectedArray: ko.observableArray(),
      initialMasterCount: ko.observable(0),
      initialSelectedCount: ko.observable(0)
    }, {
      masterArray: ko.observableArray(),
      selectedArray: ko.observableArray(),
      initialSelectedArray: ko.observableArray(),
      initialMasterCount: ko.observable(0),
      initialSelectedCount: ko.observable(0)
    }, {
      masterArray: ko.observableArray(),
      selectedArray: ko.observableArray(),
      initialSelectedArray: ko.observableArray(),
      initialMasterCount: ko.observable(0),
      initialSelectedCount: ko.observable(0)
    }, {
      masterArray: ko.observableArray(),
      selectedArray: ko.observableArray(),
      initialSelectedArray: ko.observableArray(),
      initialMasterCount: ko.observable(0),
      initialSelectedCount: ko.observable(0)
    }, {
      masterArray: ko.observableArray(),
      selectedArray: ko.observableArray(),
      initialSelectedArray: ko.observableArray(),
      initialMasterCount: ko.observable(0),
      initialSelectedCount: ko.observable(0)
    }]);

    self.dealerData.dealerId = self.dealerData.dealerId ? self.dealerData.dealerId : ko.observable();
    self.dealerData.dealerName = self.dealerData.dealerName ? self.dealerData.dealerName : ko.observable();
    self.dealerData.dealerUrl = self.dealerData.dealerUrl ? self.dealerData.dealerUrl : ko.observable();
    ko.utils.extend(self, rootParams.rootModel);

    self.updateSelectedStep = function(event) {
      self.selectedStep(event.detail.value);
      self.selectedComponent(event.detail.value);
    };

    self.nextStep = function() {
      const train = document.getElementById("train"),
        next = train.getNextSelectableStep();

      if (next !== null) {
        self.selectedStep(next);
        self.selectedComponent(next);
      } else {
        const context = {};

        context.mode = "REVIEW";
        rootParams.dashboard.loadComponent("review", self);
      }
    };

    /**
     * Self - description.
     *
     * @return {type}  Description.
     */
    self.save = function() {
      const context = {};

      context.mode = "REVIEW";
      rootParams.dashboard.loadComponent("review", self);
    };

    self.previousStep = function() {
      const train = document.getElementById("train"),
        prev = train.getPreviousSelectableStep();

      if (prev !== null) {
        self.selectedStep(prev);
        self.selectedComponent(prev);
        self.isBack(true);
      }
    };
  };
});
