define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/application-documents"
], function (ko, ApplicationDocumentsModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.headingText(self.resource.documents);
    self.dataLoaded = ko.observable(false);
    self.documentChecklist = ko.observableArray();
    self.applicantDocuments = ko.observable("");
    self.shouldShowDocumentList = ko.observable(false);
    rootParams.baseModel.registerElement("file-input");
    self.uploadedIndex = ko.observable();
    self.isDocumentUploaded = ko.observableArray([]);
    self.isDocumentName = ko.observable(false);
    self.documentName = ko.observable("");

    ApplicationDocumentsModel.fetchDocumentChecklist(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function (data) {
      self.applicantDocuments(data.verificationDTOs);

      if (self.applicantDocuments()) {
        for (let k = 0; k < self.applicantDocuments().length; k++) {
          for (let j = 0; j < self.applicantDocuments()[k].contentDTOs.length; j++) {
            self.applicantDocuments()[k].contentDTOs[j].isMandatory = true;
            self.applicantDocuments()[k].contentDTOs[j].showProcessing = ko.observable(false);

            if (self.applicantDocuments()[k].contentDTOs[j].uploadedDate) {
              self.applicantDocuments()[k].contentDTOs[j].isUploaded = ko.observable(true);
            } else {
              self.applicantDocuments()[k].contentDTOs[j].isUploaded = ko.observable(false);
            }

            if (self.applicantDocuments()[k].contentDTOs[j]) {
              self.applicantDocuments()[k].contentDTOs[j].documentName = ko.observable();
              self.applicantDocuments()[k].contentDTOs[j].isDocumentName = ko.observable(false);

              if (self.applicantDocuments()[k].contentDTOs[j].title) {
                self.applicantDocuments()[k].contentDTOs[j].documentName(self.applicantDocuments()[k].contentDTOs[j].title);
                self.applicantDocuments()[k].contentDTOs[j].isDocumentName(true);
              } else {
                self.applicantDocuments()[k].contentDTOs[j].documentName(self.applicantDocuments()[k].contentDTOs[j].documentId.displayValue);
                self.applicantDocuments()[k].contentDTOs[j].isDocumentName(true);
              }
            } else {
              self.applicantDocuments()[k].contentDTOs[j] = ko.observableArray([]);
            }

            if (self.applicantDocuments()[k].contentDTOs[j].documentNature && self.applicantDocuments()[k].contentDTOs[j].documentNatureType !== "MANDATORY") {
              self.applicantDocuments()[k].contentDTOs[j].isMandatory = false;
            }
          }

          self.applicantDocuments()[k].showDocuments = ko.observable(false);
        }

        self.applicantDocuments()[0].showDocuments(true);
        self.dataLoaded(true);
      }
    });

    self.downloadFile = function (docReferenceId, applicantId) {
      ApplicationDocumentsModel.fetchDocumentsByteArray(docReferenceId, applicantId().value, self.applicationInfo().currentApplicationId());
    };

  };
});