define([], function () {
    "use strict";

    const investmentDetailsDashboard = function () {
        return {
            root: {
                dashboardHeader: "Mutual Funds",
                pageHeader: "Investment Details",
                investmentAccount: "Investment Account",
                goButton: "Go",
                backToDashboard: "Back to Wealth Overview",
                holderDetails: "Holding and Nominee Details",
                download: "Download Portfolio Reports",
                disclaimer: "* Indicates change over previous value",
                includeRedeemed: "Include Redeemed Schemes",
                searchScheme: "Search Scheme",
                allSchemes: "All",
                total: "Total",
                totalInvestment: "Total Investment",
                selectCategory: "Select Category",
                schemeCategory: "Scheme Category",
                transactionCategory: "Scheme Transaction Type",
                navDescription: "Investment Summaries",
                moreOptionsLabel: "More Options",
                moreOptionsTitle: "Click here for more options",
                purchaseMenu: "Purchase",
                sip: "SIP",
                redeemSwp: "SWP",
                redeemMenu: "Redeem",
                switchMenu: "Switch",
                assetDistribution: {
                    header: "Asset Distributions"
                },
                riskProfile: {
                    header: "Risk Profile",
                    profileLabel: "Risk Profile:"
                },
                recommendedAllocation: {
                    header: "Recommended Allocation",
                    percent: "%"
                },
                accountsOverview: {
                    header: "Accounts Overview",
                    currentValue: "Current Value",
                    investedValue: "Invested Value",
                    profitLoss: "Profit/Loss",
                    returnRate: "Rate of Return(%)",
                    realised: "Realized Gain/Loss",
                    dividends: "Dividends",
                    sips: "SIPs",
                    reports: "View Reports",
                    legendValue: "{currency}*"
                },
                summary: {
                    portfolioSummary: "Portfolio Summary",
                    performanceSummary: "Performance",
                    holdingsSummary: "Holdings",
                    dividendsSummary: "Dividends",
                    recurringSummary: "Recurring"
                },
                holdingsSummary: {
                    scheme: "Scheme Name",
                    amount: "Installment Amount",
                    startDate: "Start Date",
                    endDate: "End Date",
                    frequency: "Frequency",
                    installmentsRemaining: "Installments Remaining",
                    marketValue: "Current Market Value",
                    xirr: "XIRR/CAGR (%)"
                },
                holdingsTab: {
                    subTotal: "Sub Total",
                    total: "Total",
                    recommendation: "Recommendation",
                    purchaseAmount: "Amount Invested",
                    currentPrice: "Price",
                    dividendsReinvested: "Dividends Reinvested",
                    units: "Units Held",
                    gainLoss: "Gain/Loss"
                },
                dividendsTab: {
                    subTotal: "Sub Total",
                    total: "Total",
                    recommendation: "Recommendation",
                    amountInvested: "Amount Invested",
                    currentPrice: "Price",
                    dividendsPaid: "Dividends Paid",
                    dividendsReinvested: "Dividends Reinvested",
                    marketValue: "Current Market Value"
                },
                performanceTab: {
                    subTotal: "Sub Total",
                    total: "Total",
                    recommendation: "Recommendation",
                    amountInvested: "Amount Invested",
                    marketValue: "Current Market Value",
                    gainLoss: "Gain/Loss",
                    absoluteReturn: "Absolute Return(%)",
                    xirr: "CAGR/XIRR (%)"
                },
                portfolioSummary: {
                    subTotal: "Sub Total",
                    total: "Total",
                    scheme: "Scheme Name",
                    recommendation: "Recommendation",
                    currentNav: "Current Price",
                    averagePurchasePrice: "Average Purchase Price",
                    amountInvested: "Amount Invested",
                    currentMarketValue: "Current Market Value",
                    gainLoss: "Gain/Loss",
                    rateOfReturn: "Rate of Return(%)"
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

    return new investmentDetailsDashboard();
});
