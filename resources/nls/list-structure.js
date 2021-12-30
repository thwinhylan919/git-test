define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  const listStructure = function() {
    return {
      root: {
        header: {
          accountStructure: "Account Structures"
        },
        structureDetails: {
          structureDetailsTable: "Structure Details Table",
          structureId: "Structure Id",
          structureName: "Structure Name",
          type: "Type",
          startDate: "Start Date",
          endDate: "End Date",
          priority: "Priority",
          interestMethod: "Interest Method",
          structurePriority: "Structure Priority",
          instructionType: "Instruction Type",
          status: "Status",
          Resumed : "Active",
          Paused : "Paused",
          Expired : "Expired",
          Sweep : "Sweep",
          Pool : "Pool",
          Hybrid : "Hybrid",
          createStructure : "Create Structure",
          statusWithCount : "{status} ({count})"
        },
        alt: {
          filter: "Filter Structure List",
          addStructure: "Add New Structure",
          summarised : "Summarized",
          detailed: "Detailed",
          tabular : "Tabular",
          reset : "Reset",
          card : "Click here to view details of structure {structureName}"
        },
        link: {
          filter: "Filter Structure List",
          addStructure: "Add New Structure",
          summarised : "Summarized",
          detailed: "Detailed",
          tabular : "Tabular",
          reset : "Reset",
          card : "Click here to view details of structure {structureName}"
        },
        message : {
          noStructure : "You have not yet created any structure.",
          noStructureForFilter : "No matching records found for given filter."
        },
        pleaseSelect: "Please Select",
        reset: "Reset",
        structureType: "Structure Type",
        views: "Views",
        searchFields : "Structure Name",
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

  return new listStructure();
});