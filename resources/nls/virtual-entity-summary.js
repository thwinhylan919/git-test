define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";

  return new function() {
    return {
      root: {
        header: {
          entitySummary: "Virtual Entity Summary",
          virtualEntity: "Virtual Entity",
          virtualAccount: "Virtual Accounts"
        },
        labels: {
          title: "Virtual Entity",
          createEntity: "Create Virtual Entity",
          createAccounts: "Create Virtual Account",
          entityName: "Virtual Entity Name",
          mappedAccounts: "No. Of Virtual Accounts",
          notifications: "Notifications",
          noData: "Get a summary of the Virtual Entities and the associated Virtual Accounts",
          subData: "Initiate new virtual entity, virtual account & structure creation",
          virtualEntityCount: "Number of Virtual Entities",
          virtualAccountCount: "Number of Virtual Accounts",
          virtualAccountMappingDetails: "Virtual Account Mapping Details",
          linkedToRealAccounts: "Linked To Real Accounts",
          linkedToStructures: "Linked To Structures",
          unMappedVirtualAccounts: "Unmapped Virtual Accounts",
          totalVirtualAccounts: "Total Virtual Accounts",
          popUpNote: "Above data shows the linking of virtual accounts to real accounts and virtual account structures."
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
});
