define([], function() {
  "use strict";

  const accountStructureDetails = function() {
    return {
      root: {
        structureDetails: {
          structureDetailsTable: "Structure Details Table",
          structureId: "Structure Id",
          structureName: "Structure Name",
          type: "Type",
          startDate: "Start Date",
          endDate: "End Date",
          priority: "Priority",
          status: "Status",
          Resumed : "Active",
          Paused : "Paused",
          Expired : "Expired"
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

  return new accountStructureDetails();
});