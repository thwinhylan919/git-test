define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const FileViewLocale = function() {
    return {
      root: {
        fileView: {
          uploadedFiles: "Uploaded Files Inquiry",
          search: "Search",
          clear: "Clear",
          fileName: "File Name",
          fileId: "File Identifier Description",
          select: "Select File Identifier",
          referenceId: "File Reference Id",
          searchResults: "Search Results",
          fileRefId: "File Reference Id : {fileRefId}",
          status: "File Status",
          selectFileStatus: "Select File Status",
          dateRange: "Date Range",
          fromDate: "From Date",
          toDate: "To Date",
          date: "Date",
          uploaded: "File has been uploaded and file reference number is generated.",
          verified: "File has been pre-processed and authorization checks are done (limit + account access check).",
          expired: "File has been expired.",
          error: "File has been pre-processed and contains error.",
          processing_in_progress: "File is pending for liquidation.",
          processed: "File is liquidated.",
          processexcp: "File is processed but some of the records are in error.",
          deleted: "File has been deleted.",
          approved: "File has been approved.",
          rejected: "File has been rejected.",
          statusDesc: "{status} :",
          viewing: "Showing Results For :- {viewing}",
          uploadDate: "Upload Details (date & time)",
          uploadDetails: "Upload Details",
          uploadDetailsText: "Click to Upload Details",
          paymentType: "Payment Type",
          transactionName: "File Deletion",
          confirmDeleteMsg: "Are you sure you want to delete this file?",
          warning: "Warning",
          yes: "Yes",
          no: "No",
          cancel: "Cancel",
          todayFile: "Today's Files",
          noData: "No data to display. Please modify your search inputs.",
          fileViewErrorMsg: "Please provide at least 2 search inputs.",
          dateSelectErrorMsg: "Please specify both start and end date.",
          btid: "File Identifier",
          fileIdDesc: "{fileId} - {description}",
          transactionType: "Transaction Type",
          type: "Type",
          selectPaymentType: "Select Transaction Type",
          details: "View Files Uploaded",
          searchEnable: "Enable Search",
          searchEnableText: "Click to Enable Search",
          action: "Action",
          deleteFileText: "Click to delete file",
          deleteFile: "Delete file",
          dash:"-"
        },
        generic: Generic
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

  return new FileViewLocale();
});