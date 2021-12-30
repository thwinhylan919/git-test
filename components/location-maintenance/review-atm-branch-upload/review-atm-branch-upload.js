define([
  "knockout",
    "./model",
  "ojL10n!resources/nls/review-location-add"
], function(ko, ReviewLocationUploadModel, locale) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel.params);
    self.nls = locale;
    self.reviewData = ko.toJS(params.rootModel.params);
    self.fileName = ko.observable(self.file.properties.name);
    self.back = ko.observable(false);
    self.recordId = ko.observable(self.recordId);
    params.dashboard.headerName(self.nls.headings.transactionName);
    params.baseModel.registerComponent("location-add", "location-maintenance");

    self.confirmForUpload = function() {
      if (self.file) {
        if (self.file.properties.size <= 0) {
          params.baseModel.showMessages(null, [self.nls.headings.emptyFileErrorMsg], "INFO");

          return;
        }

        if (self.file.properties.size > 1048576) {
          params.baseModel.showMessages(null, [self.nls.headings.fileSizeErrorMsg], "INFO");

          return;
        }

        ReviewLocationUploadModel.uploadDocument(self.file.properties, self.selectedType.toUpperCase()).done(function(data, status, jqXhr) {
          self.recordId(data.recordId);

          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.nls.headings.transactionName,
            template: "admin/location-confirm-screen",
            resourceBundle: self.nls,
            downloadFile:self.downloadFile
          }, self);
        });
      } else {
        params.baseModel.showMessages(null, [self.nls.headings.noFileFoundErrorMessage], "INFO");
      }
    };

    self.edit = function() {
      self.back(true);
      params.dashboard.loadComponent("location-add", {}, self);
    };

    self.downloadFile = function() {
      ReviewLocationUploadModel.fetchPDF(self.recordId());
    };
  };
});