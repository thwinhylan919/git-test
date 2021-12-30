define([], function() {
  "use strict";

  const serviceRequestSearch = function() {
    return {
      root: {
        serviceRequestHeader: "Service Request Definition",
        searchByRequestName: "Request Name",
        search: "Search",
        cancel: "Cancel",
        clear: "Clear",
        moreOptions: "More Search Options",
        lessOptions: "Less Search Options",
        searchByRequestDescription: "Request Description",
        productName: "Product Name",
        requestType: "Request Type",
        noData: "No Data",
        copy: "Copy",
        recentServiceRequests: "Recently Added Service Requests",
        view: "View",
        createServiceRequest: "Create Service Request",
        create: "Create",
        createText: "You can define a Service Request for various transactions or inquiries and also add the various attributes which needs to be displayed to the business user on Service Request Screen.  Once you add a Service Request it starts appearing in the Business User's login page",
        noRequest: "There are no service request defined yet",
        text: "It will start appearing here once you create one.",
        transactionType: "Transaction Type",
        transactionTypePlaceholder: "Select Transaction",
        selectProduct: "Select Product",
        typeDescription: "Type Request Description",
        typeRequestName: "Search Request Name",
        searchResult: "Search Results",
        createTextPara2: "To speed up the process you can search and copy an existing Service Request or click below to start from scratch.",
        filterNeeded: "Please enter minimum one search criteria",
        confirmation: "Invalid Search",
        ok: "Ok",
        back: "Back",
        invalidEntry: "Please enter valid characters.",
        enterRequestName: "Please enter the request name",
        createdOn: "Created On",
        confirmCopy: "Confirm",
        copyMessage: "A copy of your Service Request will be created",
        activationStatus: "Activation Status",
        active: "Active",
        inactive: "Inactive",
        updateActivatioStatus: "Update Activation Status",
        statusLabel: "Status",
        remarksLabel: "Remarks",
        statusChangeMsg: "Please change the status",
        statusErrorMessage: "Please enter valid characters in Remarks",
        hoverText: "Copy and Create new",
        alt: "Click here to Edit",
        title: "Click here to Edit"
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

  return new serviceRequestSearch();
});
