define([], function () {
    "use strict";

    const viewfinancesLocale = function () {
        return {
            root: {
                heading: {
                    ViewFinance: "View Finance",
                    FinanceList: "List of Finances",
                    search: "Search"
                },
                Search: {
                    ProgramName: "Program Name",
                    CounterPartyName: "Counter Party Name",
                    MoreSearchOptions: "More Search Options",
                    MoreSearchOptionsTitle: "Click here for More Search Options",
                    LessSearchOptions: "Less Search Options",
                    LessSearchOptionsTitle: "Click here for Less Search Options",
                    FinanceRefNo: "Finance Reference No.",
                    requestId: "Transaction Reference No.",
                    FinanceDueDate: "Finance Due Date",
                    From: "From",
                    To: "To",
                    Currency: "Currency",
                    FinanceStatus: "Finance Status",
                    FinanceAmountRange: "Finance Amount Range",
                    OutstandingAmountRange: "Outstanding Amount Range",
                    Search: "Search",
                    Clear: "Clear"
                },
                FinanceList: {
                    CounterpartyName: "Counterparty Name",
                    ProgramName: "Program Name",
                    DueDate: "Due Date",
                    ReferenceNo: "Finance Reference No",
                    RequestId: "Transaction Reference No.",
                    FinancedAmount: "Financed Amount",
                    OutstandingAmount: "Outstanding Amount",
                    RepaidAmount: "Repaid Amount",
                    Status: "Status",
                    FinanceNoTitle: "Click for Finance Details",
                    PrincipalAmount: "Principal :",
                    InterestAmount: "Interest :",
                    MoreInfoTitle: "Click here for more details",
                    inProcess: "In Process",
                    others: "Others"
                },
                ViewFinance: {
                    PartyId: "Party ID : {partyId}",
                    Cancel: "Cancel",
                    NoData: "-"
                },
                select: "Select"
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

    return new viewfinancesLocale();
});