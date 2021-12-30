define([], function() {
  "use strict";

  const APIBuilderGroupViewLocale = function() {
    return {
      root: {
        headerName: "API Builder",
        serviceURL: "Service URL",
        serviceId: "Service ID",
        serviceName: "Service Name",
        header: "Header",
        methodType: "Method Type",
        transactionType: "Transaction Type",
        taskCode: "Task Code",
        redactionType: "Redaction Type",
        dynaBussPolicy: "Dynamic Business Policy",
        taskAspect: "Task Aspects",
        moduleName: "Module Name",
        categoryName: "Category Name",
        actionType: "Action Type",
        partyId: "Party ID",
        accNo: "Account Number",
        amount: "Amount",
        alerts: "Alerts",
        edit: "Edit",
        back: "Back",
        cancel: "Cancel"
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

  return new APIBuilderGroupViewLocale();
});