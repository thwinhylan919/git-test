define([], function () {
  "use strict";

  const APIBuilderReviewLocale = function () {
    return {
      root: {
        groupName: "API Group Name",
        serviceurl: "Service URL",
        serviceid: "Service ID",
        serviceName: "Service Name",
        methodType: "Method Type",
        header: "Header",
        transactionType: "Transaction Type",
        taskCode: "Task Code",
        redactionType: "Redaction Type",
        dynamicBussPolicy: "Dynamic Business Policy",
        taskAspect: "Task Aspect",
        serviceDetails: "Service Details",
        entDetails: "Entitlement Details",
        moduleName: "Module Name",
        categoryName: "Category Name",
        actionType: "Action Type",
        jsonPath: "JSON Path for Attribute Validation",
        alerts: "Alerts",
        alertsRequired: "Alerts Required",
        reviewHeading: "Review",
        reviewMessage: "You initiated a request for API Group. Please review details before you confirm!",
        confirm: "Confirm",
        cancel: "Cancel",
        back: "Back",
        yes: "Yes",
        no: "No",
        partyId: "Party Id",
        accNo: "Account Number",
        currency: "Currency",
        amount: "Amount",
        errorCode: "Error Code",
        fileName: "File Name"
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
es :true,
      "en-us": false,
      el: false
    };
  };

  return new APIBuilderReviewLocale();
});