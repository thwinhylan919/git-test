define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/report-generation",
  "load!./review-report-generation.json",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpopup"
], function (ko, ReviewReportGenerationModel, resourceBundle, paramsComponents) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    rootParams.baseModel.registerElement("action-header");
    self.Nls = resourceBundle.reportGeneration;
    self.reportDescription = resourceBundle.reportDescription;
    self.frequencyList = ko.observableArray();
    self.frequencyListMap = {};
    self.isReportFrequencyListLoaded = ko.observable(false);
    self.isReportNameLoaded = ko.observable(false);
    self.paramsComponent = ko.observable();
    self.reportsJSON = {};
    self.isReportDataLoaded = ko.observable(false);
    self.isReportsJSONLoaded = ko.observable(false);
    self.selectedReport = ko.observable();

    self.getReportName = function (reportIdentifier) {
      self.selectedReport().reportName = ko.observable(self.reportDescription[reportIdentifier]);
      self.isReportNameLoaded(true);

      let reportIdentifierData = self.reportsJSON[reportIdentifier];

      if (!reportIdentifierData) {
          reportIdentifierData = self.reportsJSON.DEFAULT;
      }

      self.paramsComponent("report/review-" + reportIdentifierData.component);

  };

    self.loadJson = function () {
      self.reportsJSON = paramsComponents;
      self.isReportsJSONLoaded(true);
    };

    self.loadJson();

    if (!self.params.data.reportRequestIdentifier) {
      self.selectedReport(self.params.data);
      self.isReportDataLoaded(true);
      self.getReportName(self.selectedReport().reportIdentifier + "");
    } else {
      const reportRequestId = self.params.data.reportRequestIdentifier();

      ReviewReportGenerationModel.getReportData(reportRequestId).done(function (data) {
        self.selectedReport(ko.mapping.fromJS(data));
        self.selectedReport().reportFreq = ko.observable("SCHEDULED");
        self.selectedReport().reportParams = ko.mapping.fromJS(JSON.parse(data.paramsMap));
        self.isReportDataLoaded(true);
        self.getReportName(self.selectedReport().reportIdentifier() + "");
      });
    }

    self.isPartyNameLoaded = ko.observable(false);

    self.back = function () {
      history.go(-1);
    };

    self.cancel = function () {
      self.startEditMode();
    };

    ReviewReportGenerationModel.getReportFrequencyTypes().done(function (data) {
      self.frequencyList(data.enumRepresentations[0].data.slice(0, 2));

      for (let i = 0; i < self.frequencyList().length; i++) {
        self.frequencyListMap[self.frequencyList()[i].code] = self.frequencyList()[i].description;
      }

      self.isReportFrequencyListLoaded(true);
    });
  };
});