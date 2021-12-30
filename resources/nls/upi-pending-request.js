define([], function () {
    "use strict";

    const upipendingrequestLocale = function () {
        return {
            root: {
                heading: {
                    PendingRequests: "Pending Requests",
                    Warning: "Warning"
                },
                Warning: {
                    Areyousureyouwanttorejectthisrequest: "Are you sure you want to reject this request?",
                    Yes: "Yes",
                    No: "No"
                },
                PendingRequests: {
                    Deleteicon: "Delete icon",
                    RequestdeletedSuccessfully: "Request deleted Successfully",
                    SearchbyVPA: "Search by VPA",
                    AccountNumberaccountNumber: "Account Number:{accountNumber}",
                    ListView: "List View",
                    ReceiverName: "Receiver Name",
                    CreditVPAId: "Credit VPA Id",
                    Amount: "Amount",
                    SplitBill: "Split Bill",
                    ExpiryDate: "Expiry Date",
                    RequestDate: "Request Date",
                    ReceiveFundsin: "Receive Funds in",
                    RequestTo:"Request to",
                    Note: "Note",
                    TransactionID: "Transaction ID",
                    PayeeName: "Payee Name",
                    PayeeDebitVPA: "Payee Debit VPA",
                    Approve: "Approve",
                    Reject: "Reject",
                    noRequests:"No Pending Requests",
                    splitBillForOne:"Split bill with {contributor1}",
                    splitBillForTwo:"Split bill with {contributor1},{contributor2}",
                    splitBillMultiple:"Split bill with {contributor1},{contributor2} and {remaining} more",
                    userName:"{firstName} {lastName}",
                    defaultImage:"Split Bill Image"
                },
                componentHeader: "Pending Requests",
                transactionName: "Pending Requests",
                all: "All",
                errorMessageNoVpaId: "You do not have a VPA",
                rejectSuccessfully: "Request deleted Successfully",
                me: "With Me",
                payer: "With Payer"
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
