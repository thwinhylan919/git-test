define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/trade-finance-common", "ojL10n!resources/nls/trade-finance-errors", "ojL10n!resources/nls/view-bills", "ojL10n!resources/nls/view-letter-of-credit"], function(Generic, TradeFinanceCommon, TradeFinanceErrors, ViewBills, ViewLC) {
  "use strict";

  const DiscrepanciesLocale = function() {
    return {
      root: {
        heading: {
          billDiscrepancies: "Bill Discrepancies",
          discrepancyDetails: "Discrepancy Details",
          customerAcceptance: "Customer Acceptance",
          billTables: "Searched List for Bill Discrepancies",
          lcAmendmentAcceptance: "LC Amendment Acceptance",
          billsCustomerAcceptance: "Bill Discrepancy Acceptance"
        },
        navLabels: {
          discrepancies: "Bill Discrepancies",
          amendment: "Export LC Amendment",
          navBarDescription: "Navigation Bar for Customer Acceptance",
          acceptance: "Acceptance for",
          exportLc: "Export LC",
          importLc: "Import LC",
          exportBill: "Export Bills",
          importBill: "Import Bills",
          inwardGuarantee: "Inward Guarantee Amendment"
        },
        labels: {
          productName: "Product Name",
          beneficiary: "Beneficiary",
          notes: "Notes",
          resolution: "Resolution",
          accept: "Accept",
          reject: "Reject",
          notresolved: "Not resolved yet",
          srNo: "Sr No.",
          billNumber: "Bill No. {billNumber} - Discrepancy Details",
          customerAcceptanceInitiation: "Customer Acceptance",
          lcNumber: "LC Number {lcNumber}",
          LCNumber: "LC Number",
          amendmentNumber: "Amendment Number {amendmentNumber}"
        },
        viewLC: ViewLC,
        button: {
          initiate: "Initiate"
        },
        generic: Generic,
        common: TradeFinanceCommon,
        tradeFinanceErrors: TradeFinanceErrors,
        viewBills: ViewBills,
        productNameTable : {
          EXPORTLC: "Export Letter Of Credit",
          IMPORTLC: "Import Letter Of Credit"
        }
      },
      ar: false,
      en: false,
es :true,
      "en-us": false
    };
  };

  return new DiscrepanciesLocale();
});