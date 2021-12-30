define([
    "knockout",
      "./model",
  "ojL10n!resources/nls/cooling-limit",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojnavigationlist"
], function(ko, componentModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.showCoolingLimitSearchSection = ko.observable(rootParams.visibility() ? rootParams.visibility() : rootParams.limitEditable);
    self.editable = rootParams.limitEditable;
    self.showCoolingLimitSearchResult = ko.observable(false);
    self.coolingLimitSelected = ko.observable(false);
    self.coolingLimitsData = ko.observableArray(rootParams.limitsData().coolingLimits());
    self.selectedCoolingRecord = ko.observable();

    const limitsDataDispose = rootParams.limitsData().coolingLimits.subscribe(function(newValue) {
      ko.tasks.runEarly();
      self.coolingLimitsData(newValue);

      if (self.coolingLimitsData())
        {self.coolingLimitsData().sort(function(left, right) {
          return left.limitName.toLowerCase() === right.limitName.toLowerCase() ? 0 : left.limitName.toLowerCase() < right.limitName.toLowerCase() ? -1 : 1;
        });}

      self.showCoolingLimitSearchSection(true);
      rootParams.visibility(true);
    });

    self.checkEdit = function() {
      if (!ko.isObservable(self.limitId)) {
        self.limitId = ko.observable(self.limitId);
    }

    if (!ko.isObservable(self.limitName)) {
      self.limitName = ko.observable(self.limitName);
  }

   if (!ko.isObservable(self.limitDescription)) {
      self.limitDescription = ko.observable(self.limitDescription);
  }

   if (!ko.isObservable(self.durationLimitSlots)) {
      self.durationLimitSlots = ko.observable(self.durationLimitSlots);
  }

   if (!ko.isObservable(self.currency)) {
      self.currency = ko.observable(self.currency);
  }

      if (self.limitId()) {
        self.selectedCoolingRecord(self.limitId());
      }
    };

    const selectedCoolingRecordDispose = self.selectedCoolingRecord.subscribe(function(newValue) {
      if (!newValue) {
        self.limitId(null);
        self.limitName(null);
        self.limitDescription(null);
        self.durationLimitSlots(null);
        self.coolingLimitSelected(false);
        self.currency(null);

        return;
      }

      const test = ko.utils.arrayFirst(self.coolingLimitsData(), function(item) {
        return parseInt(item.limitId) === parseInt(newValue);
      });

      if (test) {
        self.limitId(test.limitId);
        self.limitName(test.limitName);
        self.limitDescription(test.limitDescription);
        self.durationLimitSlots(test.durationLimitSlots);
        self.currency(test.currency);
        self.coolingLimitSelected(false);
      } else {
        self.selectedCoolingRecord(null);
      }

      self.showCoolingLimitSearchSection(true);
    });

    self.linkageArrayId = ko.observable();

    self.showCoolingDetails = function() {
      componentModel.fetchCoolingLimits().done(function() {
        self.showCoolingLimitSearchResult(true);
      });
    };

    self.deleteCurrentSelection = function() {
      self.showCoolingLimitSearchSection(false);
      self.selectedCoolingRecord(null);
      self.limitId(null);
      self.limitName(null);
      self.limitDescription(null);
      self.durationLimitSlots(null);
      self.coolingLimitSelected(false);
      self.currency(null);
    };

    self.dispose = function() {
      limitsDataDispose.dispose();
      selectedCoolingRecordDispose.dispose();
    };
  };
});