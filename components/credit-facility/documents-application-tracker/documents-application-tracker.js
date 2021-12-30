define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/upload-documents",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton"
], function(ko, DocumentUploadrModel, locale) {
    "use strict";

    return function(params) {
        const self = this;

        ko.utils.extend(self, params.rootModel.params);

        self.locale = locale;
        params.dashboard.headerName(self.locale.componentHeader);

        self.ownerId = ko.observable();
        self.documentListDetails = ko.observableArray();
        params.dashboard.headerName(self.locale.componentHeader);

        self.onClickCancel = function() {
            params.dashboard.switchModule();
        };

        self.onClickBack = function() {
            params.dashboard.loadComponent("details-screen", {});
        };

        self.downloadDocumentDetails = function(contentId){
            DocumentUploadrModel.fetchDocumentsDetails(contentId, self.partyId);
        };

        self.back = function() {
            history.back();
        };

        DocumentUploadrModel.fetchDocumentList(self.partyId, self.midOfficeRefNo).done(function (data) {
            const docs = data.contentDTOList;

            for(let k = 0; k < docs.length; k++){
                if(docs[k].contentId){
                        self.documentListDetails.push({
                        fileName:docs[k].title,
                        contentId:docs[k].contentId.value,
                        documentName:docs[k].title.split(".")[0]
                    });

                }
            }
        });
    };
});