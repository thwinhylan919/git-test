define([], function () {
    "use strict";

    const requestFinanceGlobalLocale = function () {
        return {
            root: {
                heading: { requestFinance: "Request Finance" },
                requestFinance: {
                    PartyName: "Party Name",
                    PartyIDpartyId: "Party ID : {partyId}",
                    financeFor: "Finance for",
                    invoice: "Invoice",
                    purchaseOrder: "Purchase Order",
                    associatedPartyLabel: "Associated Party Name",
                    selectPlaceholder: "Select",
                    programNameLabel: "Program Name",
                    currencyLabel: "Currency to be disbursed",
                    counterPartyName: "Counter Party Name",
                    disbursementCurrency: "Disbursement in Currency"
                },
                ProgramStatus: {
                    ACTIVE: "Active"
                },
                componentHeader: "Request Finance",
                submit: "Submit",
                clear: "Clear",
                programProductErrorMessage: "You are not allowed to request finance against invoices as you are not the borrower.",
                programProductValueErrorMessage: "Please select the program having valid product."
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

    return new requestFinanceGlobalLocale();
});