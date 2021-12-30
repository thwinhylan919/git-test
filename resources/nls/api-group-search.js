define([], function () {
  "use strict";

  const APIGroupSearchLocale = function () {
    return {
      root: {
        groupName: "API Group Name",
        select: "Select",
        note: "Note",
        description1: "API Group can be created for a set of pass through API(s) falling under a module. All the parameters that are common for an API Group can be configured here.",
        description2: "To view the list of all the API(s) falling under a group, simply click on Service Details link against the module name in the search results.",
        create: "Create",
        headerName: "API Group Builder",
        search: "Search",
        cancel: "Cancel",
        clear: "Clear",
        all: "All",
        groupParameters: "Group Parameters",
        services: "Services",
        error: "Error",
        ok: "Ok",
        noServicesMessage: "No Services are available under the selected group."
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