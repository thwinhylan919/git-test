define([], function() {
    "use strict";

    const processmanagementLocale = function() {
        return {
            root: {

                DocumentUpload: {
                    documentUploadHeader: "Upload Documents",
                    documentUpload: "Upload Documents",
                    uploadDocumentDescription: "Listed documents are required to process your application.",
                    documentDiscription: "One line about this Document",
                    status: "status",
                    editsegment: "edit segment",
                    editsegmentTitle: "Click for edit segment",
                    continue: "Continue",
                    cancel: "Cancel",
                    back: "Back",
                    saveDraft: "Save as Draft",
                    backtoDashboard: "Back to Dashboard",
                    proceed: "Proceed",
                    termAndCondition: "I agree to the Terms and conditions",
                    verifyYourtag: "Verify Your",
                    ok: "OK",
                    segmentCompletionWarningMessg: "Please complete all the mandatory components",
                    chooseFile: "Choose File",
                    docErrorMessage: "Something went wrong while uploading document!!",
                    uploadedDocuments: "Uploaded Documents",
                    documentUploaded: "Document is uploaded",
                    information: "Note: Each document should not be more than 1 MB. Supported file types: .JPEG, .PNG, .DOC, .PDF, .TXT, .ZIP.",
                    upload: "Upload",
                    clickToUpload:"Click here to Upload"
                }
            },
            ar: true,
            fr: true,
            cs: true,
            sv: true,
            en: false,
es :true,
            "en-us": false,
            el: true
        };
    };

    return new processmanagementLocale();
});