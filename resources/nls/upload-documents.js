define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";

    const processmanagementLocale = function() {
        return {
            root: {
                generic: Generic,
                header: {
                    documentUploadHeader: "Facility Application"
                },
                componentHeader: "Application Tracker",
                link:{
                    alt:"Click here for Download",
                    title: "Click here for Download"
                },
                DocumentUpload: {
                    noDocumentMessage:"No Documents Uploaded",
                    collateralApplied:"Collateral applied for {collateralAmount}",
                    appliedOn:"On {ondate}",
                    incomeTaxReturns: "Income Tax Returns",
                    Documents: "Documents",
                    salesTaxReturns: "Sales Tax Returns",
                    noFileSelected: "No File Selected",
                    financialStatements: "Financial Statements",
                    businessCreditReport: "Business Credit Report",
                    legalDocuments: "Legal Documents",
                    facilityId: "FACILITY ID 0171 ABC CORP LTD",
                    documentUpload: "Upload Documents",
                    uploadDocumentDescription: "Listed documents are required to process your application",
                    documentDiscription: "One line about this Document",
                    status: "status",
                    editsegment: "edit segment",
                    editsegmentTitle: "Click for edit segment",
                    continue: "Continue",
                    cancel: "Cancel",
                    back: "Back",
                    home: "Home",
                    loadMore: "More",
                    documents: "Upload Documents",
                    saveDraft: "Save as Draft",
                    backtoDashboard: "Back to Dashboard",
                    proceed: "Proceed",
                    termAndCondition: "I agree to the Terms and conditions",
                    verifyYourtag: "Verify Your",
                    ok: "OK",
                    segmentCompletionWarningMessg: "Please complete all the mandatory components",
                    chooseFile: "Choose File",
                    otherDoc: "Any Other Documents",
                    otherDocDescription: "Upload any other Document",
                    noDocumentUploaded: "No Documents are Attached"
                },
                UploadDocuments: {
                    uploadDocuments: "Upload Documents",
                    edit: "Edit",
                    editTitle: "Click for Edit",
                    businessCreditReportTitle: "Business Credit Report",
                    financialStatementsTitle: "Financial Statements",
                    salesTaxReturnsTitle: "Sales Tax Returns",
                    incomeTaxReturnsTitle: "Income Tax Returns"
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