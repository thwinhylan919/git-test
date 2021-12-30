define([], function () {
    "use strict";

    const installmentsdueLocale = function () {
        return {
            root: {
                heading: {
                    InstallmentsDue: "Installments Due"
                },
                InstallmentsDue: {
                    InstallmentsDue: "Installments Due",
                    DueDate: "Due Date",
                    LoanAccountDetails: "Loan Account Details",
                    PartyName: "Party Name",
                    AmountDue: "Principal Amount",
                    AutoPayment: "Auto Payment",
                    linkDetails: "Click to see details of {account}",
                    linkDetailsText: "{account} Details",
                    pay: "Pay",
                    clickpay: "Click here to Pay",
                    payNow: "Pay Now",
                    displayContent: "{nickname}",
                    Amount: "Principal Amount",
                    autoPayment: "Auto Payment",
                    upcoming: "Upcoming",
                    overDue: "Overdue",
                    yes:"Yes",
                    no:"No",
                    noupcomingData: "No Upcoming Installments",
                    noOverDueData: "No OverDue Installments",
                    upcomingText: "in next 10 days"
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

    return new installmentsdueLocale();
});
