define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/application-documents",
  "ojs/ojfilepicker",
  "ojs/ojtable",
  "ojs/ojaccordion",
  "ojs/ojarraytabledatasource"
], function (oj, ko, $, DocumentUploadModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;
    let categoryIndex, documentIndex, submissionDocumentIndex, fileCount = 0;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.dataLoaded = ko.observable(false);
    self.documentCategories = ko.observable("");
    rootParams.baseModel.registerElement("file-input");
    self.isDocumentName = ko.observable(false);
    self.acceptStr = ko.observable("image/*");
    self.documentName = ko.observable("");
    self.anyDocumentUploaded = ko.observable(false);
    self.uploadDocumentDeferredObjs = [];
    self.uploadedDocumentDetails = [];

    let uploadedDocumentCount = 0;

    self.acceptArr = ko.pureComputed(function () {
      const accept = self.acceptStr();

      return accept ? accept.split(",") : [];
    }, self);

    self.fileSelectListener = function (documentIndex, documentCategoryIndex, event) {
      const files = event.detail.files;

      self.documentCategories()[documentCategoryIndex].type[documentIndex].dataRefreshed(false);

      for (let i = 0; i < files.length; i++) {
        const index = self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray.push({
          document: files[i].name,
          iconDelete: "icon-delete",
          file: files[i],
          rowIndex: ko.observable(self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray().length)
        });

        self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray()[index - 1].remarks = ko.observable("");
      }

      self.documentCategories()[documentCategoryIndex].type[documentIndex].anyDocumentUploaded(true);
      self.documentCategories()[documentCategoryIndex].type[documentIndex].dataRefreshed(true);

    };

    const searchCategoryOrDocumentIndex = function (documentCategoryKey, arrayObj, property) {
        for (let i = 0; i < arrayObj.length; i++) {
          if (documentCategoryKey === arrayObj[i][property]) {
            return i;
          }
        }
      },
      updateIndex = function(arrayObj, rowIndex){
        for (let i = rowIndex(); i < arrayObj().length; i++) {
          arrayObj()[i].rowIndex(arrayObj()[i].rowIndex()-1) ;
        }
      },
      searchCategoryDocumentIndex = function (contentId, documentCategory, documentType, arrayObj) {
        for (let i = 0; i < arrayObj.length; i++) {
          if (documentCategory === arrayObj[i].categoryId && documentType === arrayObj[i].documentType && contentId === arrayObj[i].contentId.value) {
            return i;
          }
        }
      };

    self.columnsArray = [{
      headerText: self.resource.documentLabel,
      renderer: oj.KnockoutTemplateUtils.getRenderer("document_template", true),
      field: "document"
    }, {
      headerText: self.resource.remarks,
      renderer: oj.KnockoutTemplateUtils.getRenderer("remarks_template", true),
      field: "remarks"
    }, {
      headerText: self.resource.action,
      renderer: oj.KnockoutTemplateUtils.getRenderer("action_template", true),
      field: "iconDelete"
    }];

    let order = 0,
      documentTypeOrder = 0;

    DocumentUploadModel.fetchDocumentChecklist(self.applicantDetails()[0].applicantId().value, self.productDetails().productType).done(function (data) {
      self.documentCategories(data.documentCategoryDTOList);

      if (self.documentCategories()) {
        for (let i = self.documentCategories().length - 1; i >= 0; i--)
        {
          self.documentCategories()[i].category=self.documentCategories()[i].category.toLowerCase();
          self.documentCategories()[i].category=self.documentCategories()[i].category.charAt(0).toUpperCase()+self.documentCategories()[i].category.slice(1);

          if (self.documentCategories()[i].type.length === 0) {
            self.documentCategories().splice(i, 1);
          }

          self.documentCategories()[i].order = 10000;

          for (let j = 0; j < self.documentCategories()[i].type.length; j++)
          {
            self.documentCategories()[i].type[j].type=self.documentCategories()[i].type[j].type.toLowerCase();
          self.documentCategories()[i].type[j].type=self.documentCategories()[i].type[j].type.charAt(0).toUpperCase()+self.documentCategories()[i].type[j].type.slice(1);
            self.documentCategories()[i].type[j].showProcessing = ko.observable(false);
            self.documentCategories()[i].type[j].anyDocumentUploaded = ko.observable(false);
            self.documentCategories()[i].type[j].dataRefreshed = ko.observable(false);
            self.documentCategories()[i].type[j].remarks = "";
            self.documentCategories()[i].type[j].attachedDocumentsArray = ko.observableArray([]);
            self.documentCategories()[i].type[j].order = 10000;

            self.documentCategories()[i].type[j].dataSource = new oj.ArrayTableDataSource(self.documentCategories()[i].type[j].attachedDocumentsArray, {
              idAttribute: "rowIndex"
            });

            if (self.documentCategories()[i].type[j].mandatory) {
              self.documentCategories()[i].order = order;
              self.documentCategories()[i].type[j].order = documentTypeOrder;
              order++;
              documentTypeOrder++;
            }
          }

          self.documentCategories()[i].type.sort(function (left, right) {
            if (left.order < right.order) {
              return -1;
            }

            if (left.order > right.order) {
              return 1;
            }

            return 0;
          });
        }

        self.documentCategories().sort(function (left, right) {
          if (left.order < right.order) {
            return -1;
          }

          if (left.order > right.order) {
            return 1;
          }

          return 0;
        });

        self.dataLoaded(true);
      }

      DocumentUploadModel.fetchUploadedDocuments(self.productDetails().submissionId.value).done(function (data) {
        if (data.submissionDocument && data.submissionDocument.length > 0) {
          for (let i = 0; i < data.submissionDocument.length; i++) {
            categoryIndex = searchCategoryOrDocumentIndex(data.submissionDocument[i].categoryId, self.documentCategories(), "category");
            documentIndex = searchCategoryOrDocumentIndex(data.submissionDocument[i].documentType, self.documentCategories()[categoryIndex].type, "type");

            self.documentCategories()[categoryIndex].type[documentIndex].dataRefreshed(false);

            self.documentCategories()[categoryIndex].type[documentIndex].attachedDocumentsArray.push({
              document: data.submissionDocument[i].documentName,
              remarks: data.submissionDocument[i].remark ? data.submissionDocument[i].remark : "",
              iconDelete: "icon-delete",
              file: "",
              uploaded: true,
              contentId: data.submissionDocument[i].contentId,
              rowIndex: ko.observable(self.documentCategories()[categoryIndex].type[documentIndex].attachedDocumentsArray().length)
            });

            self.documentCategories()[categoryIndex].type[documentIndex].dataRefreshed(true);
            self.documentCategories()[categoryIndex].type[documentIndex].anyDocumentUploaded(true);
          }
        }
      });
    });

    self.applicantSelectedHandler = function (event) {
      if (event.detail.value) {
        for (let applicantIndex = 0; applicantIndex < self.documentCategories().length; applicantIndex++) {
          self.documentCategories()[applicantIndex].showDocuments(false);
        }

        self.documentCategories()[event.detail.value].showDocuments(true);
      }
    };

    self.downloadDocument = function (contentId) {
      DocumentUploadModel.downloadDocument(contentId.value, self.applicantDetails()[0].applicantId().value);
    };

    self.deleteDocument = function (documentCategoryIndex, documentIndex, rowIndex) {
      if (self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray()[rowIndex()].uploaded && JSON.parse(self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray()[rowIndex()].uploaded)) {
        const contentId = self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray()[rowIndex()].contentId;

        self.documentCategories()[documentCategoryIndex].type[documentIndex].dataRefreshed(false);

        DocumentUploadModel.deleteDocument(contentId.value).done(function () {
          DocumentUploadModel.deleteLocalDocument(self.productDetails().submissionId.value, contentId.value).done(function () {
            self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray.splice(rowIndex(), 1);
            updateIndex(self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray, rowIndex);
            self.documentCategories()[documentCategoryIndex].type[documentIndex].dataRefreshed(true);

            if (self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray().length === 0) {
              self.documentCategories()[documentCategoryIndex].type[documentIndex].anyDocumentUploaded(false);
            }
          });
        });
      } else {
        self.documentCategories()[documentCategoryIndex].type[documentIndex].dataRefreshed(false);
        self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray.splice(rowIndex(), 1);
        updateIndex(self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray, rowIndex);

        if (self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray().length === 0) {
          self.documentCategories()[documentCategoryIndex].type[documentIndex].anyDocumentUploaded(false);
        }

        ko.tasks.runEarly();
        self.documentCategories()[documentCategoryIndex].type[documentIndex].dataRefreshed(true);
      }
    };

    self.uploadStage = function(){
      DocumentUploadModel.fetchUploadedDocuments(self.productDetails().submissionId.value).done(function (data) {
        self.initializeDocumentReview(data.submissionDocument);

        if (data.submissionDocument.length > 0) {
          self.documentsLoaded(true);
        }

        self.hidePluginComponent(true);
      });
    };

    self.documentUploadContinue = function () {
      let i, j, k, l,
        upload = false;

      for (i = 0; i < self.documentCategories().length; i++) {
        for (j = 0; j < self.documentCategories()[i].type.length; j++) {
          for (k = 0; k < self.documentCategories()[i].type[j].attachedDocumentsArray().length; k++) {
            self.uploadDocument(i, j, k);
            upload = true;
          }
        }
      }

      if (!upload) {
        $("#NOFILE").trigger("openModal");
      }

      Promise.all(self.uploadDocumentDeferredObjs).finally(function () {
        DocumentUploadModel.fetchUploadedDocuments(self.productDetails().submissionId.value).done(function (data) {
          if (data.submissionDocument && data.submissionDocument.length > 0) {
            for (l = 0; l < self.uploadedDocumentDetails.length; l++) {
              self.documentCategories()[self.uploadedDocumentDetails[l].documentCategoryIndex].type[self.uploadedDocumentDetails[l].documentIndex].dataRefreshed(false);
              self.documentCategories()[self.uploadedDocumentDetails[l].documentCategoryIndex].type[self.uploadedDocumentDetails[l].documentIndex].attachedDocumentsArray.splice(self.uploadedDocumentDetails[l].tableRowIndex, 1);
              submissionDocumentIndex = searchCategoryDocumentIndex(self.uploadedDocumentDetails[l].contentId.value, self.documentCategories()[self.uploadedDocumentDetails[l].documentCategoryIndex].category, self.documentCategories()[self.uploadedDocumentDetails[l].documentCategoryIndex].type[self.uploadedDocumentDetails[l].documentIndex].type, data.submissionDocument);

              self.documentCategories()[self.uploadedDocumentDetails[l].documentCategoryIndex].type[self.uploadedDocumentDetails[l].documentIndex].attachedDocumentsArray.splice(self.uploadedDocumentDetails[l].tableRowIndex, 0, {
                document: data.submissionDocument[submissionDocumentIndex].documentName,
                remarks: data.submissionDocument[submissionDocumentIndex].remark ? data.submissionDocument[submissionDocumentIndex].remark : "",
                iconDelete: "icon-delete",
                file: "",
                uploaded: true,
                contentId: data.submissionDocument[submissionDocumentIndex].contentId,
                rowIndex: ko.observable(self.uploadedDocumentDetails[l].tableRowIndex)
              });

              self.documentCategories()[self.uploadedDocumentDetails[l].documentCategoryIndex].type[self.uploadedDocumentDetails[l].documentIndex].dataRefreshed(true);
              self.documentCategories()[self.uploadedDocumentDetails[l].documentCategoryIndex].type[self.uploadedDocumentDetails[l].documentIndex].anyDocumentUploaded(true);
            }

            if (self.productDetails().sectionBeingEdited() === "document-upload" && self.documentsUploaded && ko.isObservable(self.documentsUploaded)) {
              self.documentsUploaded(data.submissionDocument);
            }

            self.uploadedDocumentDetails = [];
            uploadedDocumentCount = 0;
            self.uploadDocumentDeferredObjs = [];
          }
        });

        self.uploadStage();
      });
    };

    self.previousPage = function(){
      if(self.distinct){
        self.documentsLoaded(false);

        DocumentUploadModel.fetchUploadedDocuments(self.productDetails().submissionId.value).done(function (data) {
          self.initializeDocumentReview(data.submissionDocument);

          if (data.submissionDocument.length > 0) {
            self.documentsLoaded(true);
          }

          self.hidePluginComponent(true);
        });
      } else{
        self.hidePluginComponent(true);
      }
    };

    self.initializeDocumentReview = function(documentData) {
      self.distinct.removeAll();

      const distinctObject = {
        categoryId: "",
        documentTypes: [{
          documentType: "",
          contentList: [{
            contentId: "",
            documentName: "",
            remarks: ""
          }]
        }]
      };
      let categoryIndex;

      for (let i = 0; i < documentData.length; i++) {
        if ((categoryIndex = self.isElementPresent(self.distinct(), documentData[i].categoryId, "categoryId")) === -1) {
          distinctObject.categoryId = documentData[i].categoryId;
          distinctObject.documentTypes[0].documentType = documentData[i].documentType;
          distinctObject.documentTypes[0].contentList[0].contentId = documentData[i].contentId;
          distinctObject.documentTypes[0].contentList[0].documentName = documentData[i].documentName;
          distinctObject.documentTypes[0].contentList[0].remarks = documentData[i].remarks;
          self.distinct.push(JSON.parse(JSON.stringify(distinctObject)));
        } else {
          const distinctDocumentTypeObject = {
            documentType: "",
            contentList: [{
              contentId: "",
              documentName: "",
              remarks: ""
            }]
          };
          let documentIndex;

          for (let j = 0; j < self.distinct()[categoryIndex].documentTypes.length; j++) {
            if ((documentIndex = self.isElementPresent(self.distinct()[categoryIndex].documentTypes, documentData[i].documentType, "documentType")) === -1) {
              distinctDocumentTypeObject.documentType = documentData[i].documentType;
              distinctDocumentTypeObject.contentList[0].contentId = documentData[i].contentId;
              distinctDocumentTypeObject.contentList[0].documentName = documentData[i].documentName;
              distinctDocumentTypeObject.contentList[0].remarks = documentData[i].remarks;
              self.distinct()[categoryIndex].documentTypes.push(JSON.parse(JSON.stringify(distinctDocumentTypeObject)));
            } else {
              const distinctContentObject = {
                contentId: "",
                documentName: "",
                remarks: ""
              };

              for (let k = 0; k < self.distinct()[categoryIndex].documentTypes[documentIndex].contentList.length; k++) {
                if (self.isElementPresent(self.distinct()[categoryIndex].documentTypes[documentIndex].contentList, documentData[i].contentId.value, "contentId") === -1) {
                  distinctContentObject.contentId = documentData[i].contentId;
                  distinctContentObject.documentName = documentData[i].documentName;
                  distinctContentObject.remarks = documentData[i].remarks;
                  self.distinct()[categoryIndex].documentTypes[documentIndex].contentList.push(JSON.parse(JSON.stringify(distinctContentObject)));
                }
              }
            }
          }
        }
      }
    };

    self.isElementPresent = function(arr, value, key) {
      let i;

      if (key === "contentId") {
        for (i = 0; i < arr.length; i++) {
          if (value === arr[i][key].value) {
            return i;
          }
        }

        return -1;
      }

      for (i = 0; i < arr.length; i++) {
        if (value === arr[i][key]) {
          return i;
        }
      }

      return -1;
    };

    self.cancelApplicationFromDocument = function () {
      self.previousPluginComponent("document-upload");
      self.showPluginComponent("cancel-application");
    };

    self.uploadDocument = function (documentCategoryIndex, documentIndex, tableRowIndex) {
      const file = self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray()[tableRowIndex].file;

      if (!file) {
        return;
      }

      self.documentCategories()[documentCategoryIndex].type[documentIndex].showProcessing(true);

      const checkListId = self.documentCategories()[documentCategoryIndex].type[documentIndex].checklistId,
        documentCategoryId = self.documentCategories()[documentCategoryIndex].type[documentIndex].docCategoryId,
        documentNature = self.documentCategories()[documentCategoryIndex].type[documentIndex].documentNature;

      $("#" + JSON.stringify(documentCategoryIndex) + JSON.stringify(documentIndex) + "-document-upload").val("");
      ko.tasks.runEarly();
      $("#" + JSON.stringify(documentCategoryIndex) + JSON.stringify(documentIndex) + "-document-upload").next("label").html(self.resource.chooseFile);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("documentChecklistId", checkListId);
      formData.append("documentTypeId", checkListId);
      formData.append("documentCategoryId", documentCategoryId);
      formData.append("documentNatureType", documentNature);
      formData.append("transactionType", "OR");
      formData.append("moduleIdentifier", "ORIGINATION");

      const uploadDocumentDeferred = $.Deferred();

      self.uploadDocumentDeferredObjs.push(uploadDocumentDeferred);

      const fileName = file.name + fileCount++;

      DocumentUploadModel.uploadDocument(formData, fileName).done(function (data) {
        const contentId = data.contentDTOList[0].contentId,
          payload = {
            contentId: contentId.value,
            categoryId: self.documentCategories()[documentCategoryIndex].category,
            documentType: self.documentCategories()[documentCategoryIndex].type[documentIndex].type,
            documentName: file.name
          };

        if (self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray()[tableRowIndex].remarks && ko.isObservable(self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray()[tableRowIndex].remarks)) {
          payload.remark = self.documentCategories()[documentCategoryIndex].type[documentIndex].attachedDocumentsArray()[tableRowIndex].remarks();
        }

        DocumentUploadModel.saveDocument(self.productDetails().submissionId.value, contentId.value, ko.toJSON(payload)).done(function () {
          self.documentCategories()[documentCategoryIndex].type[documentIndex].showProcessing(false);

          self.uploadedDocumentDetails[uploadedDocumentCount++] = {
            documentCategoryIndex: documentCategoryIndex,
            documentIndex: documentIndex,
            tableRowIndex: tableRowIndex,
            contentId: contentId
          };

          uploadDocumentDeferred.resolve();
        }).fail(function () {
          uploadDocumentDeferred.reject();
          self.documentCategories()[documentCategoryIndex].type[documentIndex].showProcessing(false);
        });
      }).fail(function () {
        uploadDocumentDeferred.reject();
        self.documentCategories()[documentCategoryIndex].type[documentIndex].showProcessing(false);
      });
    };
  };
});