define([], function() {
    "use strict";

    const BeneficiaryLocale = function() {
        return {
            root: {
                beneficiaryDetails: {
                    labels: {
                        title: "Payees",
                        create: "+Create New",
                        accounts: "Accounts",
                        dd: "Demand Drafts",
                        search: "Search By Name or Beneficiary"
                    }
                },
                tableHeaders: {
                    beneficiaryName: "Payee Name",
                    accountType: "Account Type",
                    accountDetails: "Account Details",
                    nickName: "Nickname",
                    createdBy: "Created By",
                    transactionType: "Transaction Type",
                    draftFavour: "Draft Favouring",
                    description: "Description"
                },
                networktype: {
                    SWI: "SWIFT Code",
                    NAC: "National Clearing Code",
                    SPE: "Bank Details",
                    SWIFT: "SWIFT Code",
                    SORT: "SORT Code",
                    BANK: "Bank Details",
                    NEFT: "NEFT",
                    RTGS: "RTGS",
                    "Card Payment": "Card Payment",
                    "Credit Transfer": "Credit Transfer"
                },
                payeeCategory: {
                    INDIADOMESTIC: "Domestic",
                    SEPADOMESTIC: "Domestic",
                    UKDOMESTIC: "Domestic",
                    INTERNATIONAL: "International",
                    INTERNAL: "Internal",
                    DOM: "Domestic",
                    INT: "International"
                },
                payee: {
                    deletesuccess: "{name} Account was deleted.",
                    internalaccount: "Internal Account"
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

    return new BeneficiaryLocale();
});