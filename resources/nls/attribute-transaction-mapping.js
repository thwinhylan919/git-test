define([], function () {
    "use strict";

    const attributetransactionmappingLocale = function () {
        return {
            root: {
                heading: {
                    TransactionMapping: "Transaction Mapping"
                },
                TransactionMapping: {
                    MapAllTransactionstoAllPrograms: "Map All Transactions to All Programs",
                    MapAllTransactionstoAllFacilities: "Map All Transactions to All Facilities",
                    MapAllTransactionstoAllRemitterLists: "Map All Transactions to All Remitter Lists"
                },
                attributeName: {
                    Program: "Program",
                    Facility: "Facility"
                },
                rowExpander: "Row Expander {attributeName}",
                attributeCheckbox: "Select check box for {attributeName}",
                attributeTable: "Transaction Table",
                attributeIdHeader: "{attributeName} ID",
                attributeNameHeader: "{attributeName} Name",
                status: "Status",
                mapAllTransaction: "Map All Transaction"
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

    return new attributetransactionmappingLocale();
});