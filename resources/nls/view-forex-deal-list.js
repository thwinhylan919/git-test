define([
    "ojL10n!resources/nls/generic"
], function(Generic) {
    "use strict";

    const viewForexDealList = function() {
        return {
            root: {
                viewForexDeal: {
                    header: "View Forex Deal Bookings",
                    reversheader: "Reverse Forex Deal",
                    confirmheader: "Forex Deal Reverse",
                    initiateDeal: "Initiate Deal",
                    status: "Status",
                    dealsListTable: "Forex Deals List Table",
                    dealNumber: "Deal Number",
                    currencyLabel: "Currency",
                    currCombo: "Currency Pair",
                    currDetails: "Currency Details",
                    dealType: "Deal Type",
                    rateTypeLabel: "Transaction Type",
                    bookingDate: "Booking Date",
                    expiryDate: "Expiry Date",
                    duration: "Duration",
                    dealTyAndVal: "Validity",
                    bookedAmount: "Booked Amount",
                    availableAmount: "Outstanding Amount",
                    exchgRate: "Exchange Rate",
                    settlementAccount: "Settlement Account",
                    dealAmount: "Booked Deal Amount",
                    amount: "Amount",
                    trnscType: "Transaction Type",
                    partyDetails: "Party Details",
                    partyId: "Party ID",
                    partyName: "Party Name",
                    dealTyAndValcomposition: "{dealpatterntype} : {validity} Days",
                    transactionDetails: "Deal Details",
                    utilizedAmount: "Utilized Deal Amount",
                    utilizationStatus: "Utilization Status",
                    pick: "Pick",
                    dealIdHeader: "Deal Number {dealNumber}",
                    dealDuration: "{validity} Day(s)",
                    lookUpAllDeals: "Show All Deals",
                    paymentId: "Payment Reference No",
                    description: "Description",
                    sourceAccount: "Source Account",
                    destinatonAccount: "Destination Account",
                    dealsUtilizationTable: "Utilized Deal Details",
                    dealUtilization: "Deal Utilization",
                    revers: "Reverse",
                    currComboValue: "{buyCurrency}-{sellCurrency}",
                    percentUtilization: "{percent} Utilized",
                    viewSwapDetails: "View Swap Details",
                    swap: "SWAP",
                    dealPatternType: {
                        S: "Spot",
                        F: "Forward"
                    },
                    errorMessage: {
                        minorError: "Only Alphanumeric is allowed.",
                        noDealsAvailable: "No Deals found for given criteria"
                    },
                    forwardPeriodType: {
                        DAY: "1 Day",
                        WEEK: "7 Days",
                        FORTNIGHT: "15 Days",
                        MONTH: "30 Days",
                        QUARTER: "90 Days",
                        SIX_MONTHS: "180 Days",
                        YEAR: "365 Days"
                    },
                    rateType: {
                        B: "Buy",
                        S: "Sell"
                    },
                    statusCodes: {
                        A: "Active",
                        L: "Liquidated",
                        R: "Reversed",
                        C: "Canceled",
                        H: "Hold"
                    },
                    alt: "Click here to view deal id {reference}",
                    title: "Click here to view deal id {reference}",
                    closePopup: "Close Pop-Up",
                    select: "Please Select",
                    ariaSelect: "Please Select {label}",
                    typeDealNum: "Type Deal Number",
                    searchDealNo: "Search Deal Number",
                    reverseConfiramation: "Are you sure you want to reverse the deal: {dealId}?"
                },
                confirmScreen: {
                    approvalMessages: {
                        APPROVED: {
                            successmsg: "You have successfully approved the transaction",
                            statusmsg: "Completed"
                        },
                        PENDING_APPROVAL: {
                            successmsg: "You have successfully approved the request. It is pending for further approval.",
                            statusmsg: "Pending Approval"
                        },
                        REJECTED: {
                            successmsg: "You have rejected the request.",
                            statusmsg: "Rejected"
                        },
                        FAILED: {
                            successmsg: "Rejected by host.",
                            statusmsg: "Failed"
                        }
                    },
                    successMessage: "Your transaction is successful!",
                    failureMessage: "Your transaction is failed!",
                    corpMaker: "You have successfully initiated the transaction.",
                    successmsg: "You have successfully approved the transaction"
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

    return new viewForexDealList();
});