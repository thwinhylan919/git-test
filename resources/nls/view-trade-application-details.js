define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";

    const viewTradeApplicationDetails = function() {
      return {
        root: {
          header: {
            letterOfCreditSummary: "Letter of Credit {applicationNumber}",
            ViewGuarantee:"Bank Guarantee {applicationNumber}"
          },
          labels:{
            srNo: "Sr No",
            docId: "Document Id",
            docCategory: "Document Category",
            docType: "Document Type",
            remarks: "Remarks",
            remove: "Remove",
            attachedDocuments: "Attached Documents",
            documentTable: "Documents Table"
          },
          noDocsAttached: "Currently, there are no documents attached to this contract.",
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

    return new viewTradeApplicationDetails();
  });
