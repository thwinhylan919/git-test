define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "ojL10n!resources/nls/document-upload",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojbutton",
    "ojs/ojcheckboxset",
    "ojs/ojprogress",
    "ojs/ojinputnumber",
    "ojs/ojknockout"
], function (oj, ko, DocumentUploadrModel, resourceBundle) {
    "use strict";

    return function (params) {
        const self = this,
            getNewModel = function () {
                const KoModel = ko.mapping.fromJS(DocumentUploadrModel.getNewModel());

                return KoModel;
            };

        self.mainDto = {};
        ko.utils.extend(self, params.rootModel);

        self.nls = resourceBundle;

        params.baseModel.registerComponent("file-input", "process-management");

        self.documentList = ko.observableArray();
        self.documentsLoaded = ko.observable(false);
        self.review = params.review;
        self.uploadFlag = ko.observable(false);
        self.documentName = ko.observable();
        self.documentLinkageId = ko.observable();
        self.documentType = ko.observable();

        const documentIdMap = {};

        for(let i=0; i<params.rootModel.productData().payload.applicantDetails.applicantDetailsDocument().length;i++){

            if(typeof params.rootModel.productData().payload.applicantDetails.applicantDetailsDocument()[i].documentLinkageId === "function"){
               documentIdMap[params.rootModel.productData().payload.applicantDetails.applicantDetailsDocument()[i].documentName()] = params.rootModel.productData().payload.applicantDetails.applicantDetailsDocument()[i].documentLinkageId();

           }else{

                documentIdMap[params.rootModel.productData().payload.applicantDetails.applicantDetailsDocument()[i].documentName] = params.rootModel.productData().payload.applicantDetails.applicantDetailsDocument()[i].documentLinkageId;
           }
        }

        DocumentUploadrModel.fetchDatasegment(params.rootModel.productData().data.productId).then(function (data) {

            for(let index=0 ; index < data.jsonNode.Stages[0].documentsList.length; index++){
                data.jsonNode.Stages[0].documentsList[index].isUpload = ko.observable(!!documentIdMap[data.jsonNode.Stages[0].documentsList[index].documentTypeName]);
            }

            data.jsonNode.Stages[0].documentsList.forEach(function (documents) {
                self.documentList.push(documents);
            });

            self.documentsLoaded(true);
        });

        self.datasource1 = new oj.ArrayTableDataSource(self.documentList, {
            idAttribute: "documentTypeName"
        });

        self.datasource2 = new oj.ArrayTableDataSource(params.rootModel.productData().payload.applicantDetails.applicantDetailsDocument, {
            idAttribute: "documentLinkageId"
        });

        self.uploadAllDocument = function () {

            for (let i = 0; i < self.documentList().length; i++) {

                const file = document.getElementById(self.documentList()[i].documentTypeName),

                 uploadDocInfo = getNewModel().applicantDetailsDocument;

                if (file.files[0]) {
                    uploadDocInfo.documentType = file.files[0].type;

                    if (self.isUploadedAlready(self.documentList()[i].documentTypeName)) {
                        DocumentUploadrModel.documentUploadService(file.files[0]).done(function (data) {
                            if (data.contentDTOList[0].contentId) {
                                uploadDocInfo.documentName = self.documentList()[i].documentTypeName;
                                uploadDocInfo.documentLinkageId = data.contentDTOList[0].contentId.value;
                                self.documentList()[i].isUpload(true);

                                params.rootModel.productData().payload.applicantDetails.applicantDetailsDocument.push(uploadDocInfo);
                            } else {
                                params.baseModel.showMessages(null, [self.resource.docErrorMessage], "ERROR");
                            }
                        });
                    }
                }
            }
        };

        self.getDocType = function (docId) {
            for (let i = 0; i < self.documentList().length; i++) {
                if (self.documentList()[i].documentTypeName === docId) {
                    return self.documentList()[i].documentTypeDesc;
                }
            }
        };

        self.isUploadedAlready = function (documentName) {
            for (let i = 0; i < params.rootModel.productData().payload.applicantDetails.applicantDetailsDocument().length; i++) {
                if (params.rootModel.productData().payload.applicantDetails.applicantDetailsDocument()[i].documentName === documentName) {
                    return false;
                }
            }

            return true;
        };

        params.rootModel.successHandler = function () {

            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }

            return new Promise(function (resolve) {
                resolve();
            });
        };

    };
});