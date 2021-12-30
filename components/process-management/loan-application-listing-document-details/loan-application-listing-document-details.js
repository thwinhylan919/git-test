define([
  "ojL10n!resources/nls/loan-application-listing-details",
  "knockout",
  "./model",
  "ojs/ojformlayout",
  "ojs/ojbutton"
], function(resourceBundle, ko, DocumentUploadrModel) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.nls = resourceBundle;
    rootParams.dashboard.headerName(self.nls.componentHeader);
    self.cardData = ko.observable(rootParams.rootModel.params.data.cardItem);
    self.selectedParty = ko.observable(rootParams.rootModel.params.data.selectedParty());
    self.dataSegmentDocumentList = ko.observableArray(rootParams.rootModel.params.data.dataSegmentDocumentList);
    self.documentsList = rootParams.rootModel.params.payload.applicantDetails ? ko.observableArray(rootParams.rootModel.params.payload.applicantDetails.applicantDetailsDocument()) : null;
    self.documentNameMapping = ko.observable();
    self.documentsLoaded = ko.observable(false);
    self.documentListDetails = ko.observableArray();

    if (rootParams.rootModel.params.data.cardItem.type === "Loan Drawdown") {
      DocumentUploadrModel.fetchDocumentList(rootParams.rootModel.params.data.partyId.value, rootParams.rootModel.params.data.cardItem.midOfficeRefNo).done(function(data) {
        const docs = data.contentDTOList;

        for (let k = 0; k < docs.length; k++) {
          if (docs[k].contentId) {
            self.documentListDetails.push({
              fileName: docs[k].title,
              contentId: docs[k].contentId.value,
              documentName: docs[k].title.split(".")[0]
            });

          }
        }

      });
    } else
    if (self.documentsList) {
      self.documentsList().forEach(function(uploadedDocument) {
        self.dataSegmentDocumentList().forEach(function(documentDescription) {
          if (uploadedDocument.documentName() === documentDescription.documentTypeName) {
            self.documentNameMapping[documentDescription.documentTypeName] = documentDescription.documentTypeDesc;
          }
        });

      });

      self.documentsLoaded(true);

    }

    self.goBack = function() {
      const parameters = rootParams.rootModel.params;

      rootParams.dashboard.loadComponent("loan-application-listing-details", parameters);
    };

    self.downloadDocumentDetails = function(contentId) {
      DocumentUploadrModel.fetchDocumentsDetails(contentId, rootParams.rootModel.params.data.partyId.value);
    };

  };
});
