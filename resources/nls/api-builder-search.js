define([], function () {
  "use strict";

  const APIGroupSearchLocale = function () {
    return {
      root: {
        groupName: "API Group Name",
        select: "Select",
        note: "Note",
        description1: "Using this option you can build pass through API(s) by using the REST API(s) exposed by host or any third party system.",
        description2: "To create a new pass through API you need to first create an API Group using API Group Builder option and then select the same API group and input the service details.",
        create: "Create",
        headerName: "API Service Builder",
        search: "Search",
        cancel: "Cancel",
        clear: "Clear",
        serviceID: "Service ID",
        serviceName: "Service Name",
        serviceURL: "Service URL",
        serviceDetails: "Service Details",
        noData: "No data to display",
        methodType: "Method Type",
        noGroupName: "Please select API Group Name"
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

  return new APIGroupSearchLocale();
});