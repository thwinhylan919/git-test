define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const ReportUserMapLocale = function() {
    return {
      root: {
        reportUserMap: {
          reportUserMap: "User Report Mapping",
          reportId: "Report Id",
          frequency: "Frequency",
          formats: "Formats",
          view: "View",
          edit: "Edit",
          cancelTransaction: "Are you sure you want to cancel the maintenance?",
          username: "User Name",
          user: "{firstName} {lastName}",
          userId: "User Id",
          cancel: "Cancel",
          back: "Back",
          save: "Save",
          confirm: "Confirm",
          successful: "Confirmation",
          transactionName: "Report User Mapping",
          successUserFImap: "User - Report mapping maintenance saved successfully.",
          backToDashBoard: "Ok",
          mappingDetails: "Mapping Summary",
          transactiontype: "Transaction Type",
          description: "Description",
          approvaltype: "Approval Type",
          corporateid: "Party Id",
          corporatename: "Party Name",
          fileIdentifier: "Reports",
          noData: "No report available for mapping.",
          userMapErrorMsg: "Please select the report to be mapped to the user.",
          pendingStatus: "Pending Approval",
          confirmStatus: "Completed",
          details: "User Map Details",
          senstiveCheck: "Sensitive Data Check",
          headerCheckBox: "Header Check Box",
          childCheckBox: "Child Check Box",
          invalidUser: "Report User Mapping not supported for this user",
          review: "Review",
          reviewMessage: "You initiated a request for User Report Mapping. Please review details before you confirm!"
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

  return new ReportUserMapLocale();
});