define([], function() {
    "use strict";

    const RecentActivityLocale = function() {
        return {
            root: {
                CSA: "Current And Savings",
                TRD: "Term Deposit",
                LON: "Loan",
                myBankName: "Futura Bank Limited.",
                recentActivity: "Recent Activity",
                selectAccountType: "Select Account Type",
                selectAccountNo: "Select Account",
                creditType: "{amt} Cr",
                debitType: "{amt} Dr",
                moreDetailsAlt: "View Recent Activity Details",
                moreDetails: "View More",
                viewStatement: "View Statement",
                viewStatementText: "Click to View Statement",
                moreDetailsTitle: "Click To View More Details",
                netWorthAlt: "Net Worth Graph",
                netWorthTitle: "Viewing Net Worth Graph",
                spendsAlt: "Spends Graph",
                spendsTitle: "Viewing Spends Graph",
                nodata: "No Transactions Available",
                transactionDetails: "Account Transaction Details",
                accountActivity: "My Account Activity",
                filter: "Apply",
                filterText: "Click to Apply",
                Period: "Period",
                type: "Type",
                Dr: "Dr",
                Cr: "Cr",
                bal: "Balance"
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

    return new RecentActivityLocale();
});