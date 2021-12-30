define([], function () {
    "use strict";

    const viewfinancedetailsLocale = function () {
        return {
            root: {
                heading: {
                    ViewFinance: "View Finance",
                    FinanceDetails: "Finance Details",
                    RepaymentDetails: "Repayment Details",
                    OutstandingDetails: "Outstanding Finance",
                    disbursementDetails: "Disbursement Details"
                },
                FinanceDetails: {
                    FinanceAmount: "Finance Amount",
                    InterestRate: "Interest Rate",
                    interestAmount: "Interest Amount",
                    MaturityDate: "Maturity Date",
                    Interest: "{InterestPercent} %"
                },
                OrderDetails: {
                    ReferenceNo: "Finance Reference No.",
                    ProgramName: "Name of Program",
                    CounterPartyName: "Counterparty Name",
                    Comments: "Comments",
                    NotApplicable: "NA",
                    productName: "Product Name"
                },
                RepaymentDetails: {
                    PrincipalAmount: "Principal Amount",
                    InterestCharged: "Interest Charged",
                    OverdueInterest: "Overdue Interest"
                },
                OutstandingDetails: {
                    PrincipalAmount: "Principal Amount",
                    InterestCharged: "Interest Charged",
                    OverdueInterest: "Overdue Interest"
                },
                ViewFinance: {
                    PartyId: "Party ID : {partyId}",
                    Back: "Back",
                    cancel: "Cancel",
                    repayFinance: "Repay Finance",
                    FinanceDate: "Finance Date",
                    transactionDate: "Transaction Date",
                    Status: "Finance Status",
                    transactionStatus: "Transaction Status",
                    inProcess: "In Process",
                    LinkedInvoice: "View Linked Invoices",
                    LinkedInvoiceTitle: "Click Here to view Linked Invoices",
                    linkedInvoices: "Linked Invoices",
                    NoData: "-"
                },
                InvoiceList: {
                    invoiceRefNo: "Invoice Reference No.",
                    invoiceNumber: "Customer Invoice No.",
                    dueDate: "Due Date",
                    invoiceAmount: "Invoice Amount",
                    financedAmount: "Financed Amount",
                    outstandingAmount: "Outstanding Amount",
                    invoiceStatus: "Invoice Status"
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

    return new viewfinancedetailsLocale();
});