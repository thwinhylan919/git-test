define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/record-view-non-financial",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojlistview",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource"
], function (ko, recordViewModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel.params);
    self.showBackButton = ko.observable(true);
    self.Nls = resourceBundle.recordViewNonFinancial;
    self.rStatusList = ko.observableArray();
    self.loadPartialComponentName = ko.observable();
    self.rStatusListMap = {};
    rootParams.dashboard.headerName(self.Nls.uploadedFiles);

    if (!self.selectedFile()) {
      self.selectedRecord = ko.observable(rootParams.data);
      self.selectedRecord().recRefId = rootParams.data.transactionSnapshot.recRefId;
      self.selectedRecord().payeeType = "";
      self.selectedRecord().accountType = rootParams.data.transactionSnapshot.accountType;
      self.showBackButton(false);
    }

    self.recordDetails = ko.observable();
    self.recordDetailsLoaded = ko.observable(false);
    self.recordType = ko.observable();
    self.transactionType = ko.observableArray();

    function getJSONData() {

      require(["load!components/file-upload/record-view-non-financial/record-view-non-financial.json"], function (data) {
        self.transactionType = data;
      });
    }

    getJSONData();

    recordViewModel.getRecordStatus().done(function (data) {
      self.rStatusList(data.enumRepresentations[0].data);

      for (let i = 0; i < self.rStatusList().length; i++) { self.rStatusListMap[self.rStatusList()[i].code] = self.rStatusList()[i].description; }

      recordViewModel.readRecord(self.selectedRecord().fileRefId, self.selectedRecord().recRefId).done(function (data) {
        if (data.recordDetails) {
          const obj = data.recordDetails;

          obj.recStatus = self.rStatusListMap[self.selectedRecord().status];
          obj.recRefId = self.selectedRecord().recRefId;
          obj.payeeType = self.selectedRecord().payeeType;
          obj.accountType = self.selectedRecord().accountType;
          self.recordDetails(obj);

          const transactionType = self.transactionType[data.transactionType];

          if (transactionType) {
            self.loadPartialComponentName(transactionType[0].partialComponentName);
          }
        }

        if (data.errorDetails) {
          if (data.errorDetails.length !== 0) { self.recordDetails().errorMessage = data.errorDetails[0].errorMessage; }
        }

        self.recordDetailsLoaded(true);
      });
    });

    self.back = function () {
      history.go(-1);
    };
  };
});