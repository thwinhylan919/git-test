define(["ojL10n!resources/nls/generic"], function (Generic) {
  "use strict";

  const ReviewFileIdentifierLocale = function () {
    return {
      root: {
        reviewFileIdentifier: {
          fileIdentifierApproval: "File Identifier Approval",
          fIMaintenance: "File Identifier Maintenance",
          review: "Review",
          details: "Details",
          approvaltype: "Approval Type",
          approvallevel: "{approvalType} Level",
          cancel: "Cancel",
          corporateid: "Party Id",
          allFileFormat: "CSV,TXT,XLS,XLSX",
          textFileFormat: "CSV,TXT",
          corporatename: "Party Name",
          fileIdentifier: "File Identifier",
          description: "Description",
          fileformat: "File Template",
          transactiontype: "Transaction Type",
          accountingtype: "Accounting Type",
          filetype: "File Type",
          formattype: "Format Type",
          transactionName: "File Identifier Maintenance",
          ppTolerance: "Partial Processing Tolerance(%)",
          maxNoOfRecords: "Maximum No Of Records",
          debitAccountNumber: "Debit Account Number",
          reviewMessage: "Make sure the details are correct before you confirm!"
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

  return new ReviewFileIdentifierLocale();
});