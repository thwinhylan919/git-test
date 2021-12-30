define([], function () {
    "use strict";

    const upipendingrequestLocale = function () {
        return {
            root: {
                PendingRequests: {
                    SearchbyVPA: "Search by VPA",
                    AccountNumberaccountNumber: "Account Number:{accountNumber}",
                    ListView: "List View",
                    ReceiverName: "Receiver Name",
                    CreditVPAId: "Credit VPA Id",
                    Amount: "Amount",
                    SplitBill: "Split Bill",
                    ExpiryDate: "Expiry Date",
                    RequestDate: "Request Date",
                    requestFrom: "Request From",
                    ReceiveFundsin: "Receive Funds in",
                    RequestTo:"Request to",
                    Note: "Note",
                    TransactionID: "Transaction ID",
                    PayeeName: "Payee Name",
                    PayeeDebitVPA: "Payee Debit VPA",
                    noRequests:"No Pending Requests",
                    splitBillForOne:"Split bill with {contributor1}",
                    splitBillForTwo:"Split bill with {contributor1},{contributor2}",
                    splitBillMultiple:"Split bill with {contributor1},{contributor2} and {remaining} more",
                    filter: "Filter Transaction History",
                    filterAlt:"Filter Transaction History",
                    transactionType:"Transaction Type",
                    selectDate:"Select Date",
                    selectDateError : "Please enter both start and end dates of date range",
                    status :"Status",
                    transferDate:"Transfer Date",
                    transferFrom:"Transfer From"

                },
                all: "All",
                componentHeader: "Transaction History",
                transactionName: "Transaction History",
                errorMessageNoVpaId: "You do not have a VPA"
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

    return new upipendingrequestLocale();
});
