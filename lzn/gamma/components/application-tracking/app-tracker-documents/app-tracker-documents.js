define([
    "knockout",
  "jquery",
  "./model",
    "ojL10n!lzn/gamma/resources/nls/application-documents"
], function(ko, $, ApplicationDocumentsModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
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

    ApplicationDocumentsModel.fetchDocumentChecklist(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function(data) {
      self.applicantDocuments(data.applicantDocuments);

      if (self.applicantDocuments()) {
        for (let k = 0; k < self.applicantDocuments().length; k++) {
          for (let i = 0; i < self.applicantDocuments()[k].documentCategories.length; i++) {
            for (let j = 0; j < self.applicantDocuments()[k].documentCategories[i].documents.length; j++) {
              self.applicantDocuments()[k].documentCategories[i].documents[j].isMandatory = true;
              self.applicantDocuments()[k].documentCategories[i].documents[j].showProcessing = ko.observable(false);

              if (self.applicantDocuments()[k].documentCategories[i].documents[j].uploadedDate) {
                self.applicantDocuments()[k].documentCategories[i].documents[j].isUploaded = ko.observable(true);
              } else {
                self.applicantDocuments()[k].documentCategories[i].documents[j].isUploaded = ko.observable(false);
              }

              if (self.applicantDocuments()[k].documentCategories[i].documents[j].contentDTO) {
                self.applicantDocuments()[k].documentCategories[i].documents[j].contentDTO = ko.observableArray(self.applicantDocuments()[k].documentCategories[i].documents[j].contentDTO);

                for (let l = 0; l < self.applicantDocuments()[k].documentCategories[i].documents[j].contentDTO().length; l++) {
                  self.applicantDocuments()[k].documentCategories[i].documents[j].contentDTO()[l].documentName = ko.observable();
                  self.applicantDocuments()[k].documentCategories[i].documents[j].contentDTO()[l].isDocumentName = ko.observable(false);

                  if (self.applicantDocuments()[k].documentCategories[i].documents[j].contentDTO()[l].title) {
                    self.applicantDocuments()[k].documentCategories[i].documents[j].contentDTO()[l].documentName(self.applicantDocuments()[k].documentCategories[i].documents[j].contentDTO()[l].title);
                    self.applicantDocuments()[k].documentCategories[i].documents[j].contentDTO()[l].isDocumentName(true);
                  } else {
                    self.applicantDocuments()[k].documentCategories[i].documents[j].contentDTO()[l].documentName(self.applicantDocuments()[k].documentCategories[i].documents[j].contentDTO()[l].documentId.displayValue);
                    self.applicantDocuments()[k].documentCategories[i].documents[j].contentDTO()[l].isDocumentName(true);
                  }
                }
              } else {
                self.applicantDocuments()[k].documentCategories[i].documents[j].contentDTO = ko.observableArray([]);
              }

              if (self.applicantDocuments()[k].documentCategories[i].documents[j].documentNature && self.applicantDocuments()[k].documentCategories[i].documents[j].documentNature !== "MANDATORY") {
                self.applicantDocuments()[k].documentCategories[i].documents[j].isMandatory = false;
              }
            }
          }

          self.applicantDocuments()[k].showDocuments = ko.observable(false);
        }

        self.applicantDocuments()[0].showDocuments(true);
        self.dataLoaded(true);
      }
    });

    self.applicantSelectedHandler = function(event) {
      if (event.detail.value) {
        for (let applicantIndex = 0; applicantIndex < self.applicantDocuments().length; applicantIndex++) {
          self.applicantDocuments()[applicantIndex].showDocuments(false);
        }

        self.applicantDocuments()[event.detail.value].showDocuments(true);
      }
    };

    self.downloadFile = function(docReferenceId, applicantId) {
      ApplicationDocumentsModel.fetchDocumentsByteArray(docReferenceId, applicantId.value, self.applicationInfo().currentApplicationId());
    };

    self.deleteDocument = function(documentId, contentIndex, documentIndex, documentCategoryIndex, applicantIndex) {
      ApplicationDocumentsModel.deleteDocument(documentId.value).done(function() {
        self.applicantDocuments()[applicantIndex].documentCategories[documentCategoryIndex].documents[documentIndex].contentDTO.splice(contentIndex, 1);
      });
    };

    self.uploadDocument = function(documentIndex, documentCategoryIndex, applicantIndex) {
      self.applicantDocuments()[applicantIndex].documentCategories[documentCategoryIndex].documents[documentIndex].showProcessing(true);

      let file;

      if ($("#" + JSON.stringify(applicantIndex) + JSON.stringify(documentCategoryIndex) + JSON.stringify(documentIndex) + "-document-upload").val() !== "" && document.getElementById(JSON.stringify(applicantIndex) + JSON.stringify(documentCategoryIndex) + JSON.stringify(documentIndex) + "-document-upload").files.length > 0) {
        file = document.getElementById(JSON.stringify(applicantIndex) + JSON.stringify(documentCategoryIndex) + JSON.stringify(documentIndex) + "-document-upload").files[0];
      } else {
        $("#NOFILE").trigger("openModal");
        self.applicantDocuments()[applicantIndex].documentCategories[documentCategoryIndex].documents[documentIndex].showProcessing(false);

        return false;
      }

      const checkListId = self.applicantDocuments()[applicantIndex].documentCategories[documentCategoryIndex].documents[documentIndex].checklistId,
        documentCategoryId = self.applicantDocuments()[applicantIndex].documentCategories[documentCategoryIndex].documents[documentIndex].docCategoryId,
        documentNature = self.applicantDocuments()[applicantIndex].documentCategories[documentCategoryIndex].documents[documentIndex].documentNature,
        ownerId = self.applicantDocuments()[applicantIndex].documentCategories[documentCategoryIndex].documents[documentIndex].applicantId.value;

      $("#" + JSON.stringify(applicantIndex) + JSON.stringify(documentCategoryIndex) + JSON.stringify(documentIndex) + "-document-upload").val("");
      ko.tasks.runEarly();
      $("#" + JSON.stringify(applicantIndex) + JSON.stringify(documentCategoryIndex) + JSON.stringify(documentIndex) + "-document-upload").next("label").html(self.resource.chooseFile);

      const formData = new FormData();

      formData.append("file", file, file.name);
      formData.append("documentChecklistId", checkListId);
      formData.append("documentTypeId", checkListId);
      formData.append("documentCategoryId", documentCategoryId);
      formData.append("documentNatureType", documentNature);
      formData.append("ownerId", ownerId);
      formData.append("transactionType", "OR");
      formData.append("moduleIdentifier", "ORIGINATION");
      formData.append("applicationId", self.applicationInfo().currentApplicationId());

      ApplicationDocumentsModel.uploadDocument(formData).done(function(data) {
        const documentId = data.contentDTOList[0].documentId.value,
          content = data.contentDTOList[0];

        self.applicantDocuments()[applicantIndex].documentCategories[documentCategoryIndex].documents[documentIndex].docReferenceId = data.contentDTOList[0].contentId;

        ApplicationDocumentsModel.getDocumentInfo(documentId, ownerId, self.applicationInfo().currentApplicationId()).done(function(data) {
          self.applicantDocuments()[applicantIndex].documentCategories[documentCategoryIndex].documents[documentIndex].showProcessing(false);

          const contentIndex = self.applicantDocuments()[applicantIndex].documentCategories[documentCategoryIndex].documents[documentIndex].contentDTO().length;

          self.applicantDocuments()[applicantIndex].documentCategories[documentCategoryIndex].documents[documentIndex].contentDTO.push(content);
          self.applicantDocuments()[applicantIndex].documentCategories[documentCategoryIndex].documents[documentIndex].contentDTO()[contentIndex].title = data.contentDTOList[0].title;
          self.applicantDocuments()[applicantIndex].documentCategories[documentCategoryIndex].documents[documentIndex].contentDTO()[contentIndex].documentName = ko.observable(self.applicantDocuments()[applicantIndex].documentCategories[documentCategoryIndex].documents[documentIndex].contentDTO()[contentIndex].title);
          self.applicantDocuments()[applicantIndex].documentCategories[documentCategoryIndex].documents[documentIndex].contentDTO()[contentIndex].isDocumentName = ko.observable(true);
        }).fail(function() {
          self.applicantDocuments()[applicantIndex].documentCategories[documentCategoryIndex].documents[documentIndex].showProcessing(false);
        });
      }).fail(function() {
        self.applicantDocuments()[applicantIndex].documentCategories[documentCategoryIndex].documents[documentIndex].showProcessing(false);
      });
    };
  };
});