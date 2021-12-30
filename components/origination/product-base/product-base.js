define([
  "knockout"
], function (ko) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.dataLoaded = ko.observable(false);
    self.productComponentName = ko.observable();
    self.submissionIdExists = ko.observable(false);
    self.pluginCompName = ko.observable("row");
    self.productflowComponent = ko.observable(true);
    self.productHeadingName = ko.observable();
    self.hideBackButton = ko.observable(false);
    self.distinct = ko.observableArray([]);
    self.documentsLoaded = ko.observable();

    rootParams.baseModel.registerComponent("product", "origination");

    self.productDetails = ko.observable({
      applicantList: ko.observableArray([]),
      baseCurrency: self.localCurrency,
      applicantDetailsFetched: ko.observable(false),
      sectionBeingEdited: ko.observable(),
      collabData: ko.observable({}),
      isUserAssociated: false,
      isRegistered: false,
      repaymentAmount: ko.observable()
    });

    self.initQueryMap = function (root) {
      self.queryMap = root.queryMap;
      self.applicationArguments = root.applicationArguments;

      // eslint-disable-next-line no-storage/no-browser-storage
      const sessionStorageDataTemp = sessionStorage.sessionStorageData;

      if (self.params && self.params.sessionStorageData && self.params.sessionStorageData.selectedCurrency) {
        self.localCurrency = self.params.sessionStorageData.selectedCurrency;
      } else if (self.applicationArguments && self.applicationArguments.selectedCurrency) {
        self.localCurrency = self.applicationArguments.selectedCurrency;
      } else if (sessionStorageDataTemp && JSON.parse(sessionStorageDataTemp) && JSON.parse(sessionStorageDataTemp).currency) {
        self.localCurrency = JSON.parse(sessionStorageDataTemp).currency;
      } else {
        self.localCurrency = rootParams.dashboard.appData.localCurrency;
      }

      self.dataLoaded(true);
    };
  };
});