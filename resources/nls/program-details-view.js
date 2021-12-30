define([], function () {
    "use strict";

    const programdetailsviewLocale = function () {
        return {
            root: {
                heading: {
                    ProgramDetails: "Program Details",
                    ProgramAttributes: "Program Attributes",
                    AssociatedPrograms: "Linked Parties",
                    TopCounterparties: "Top {count} Associated Parties",
                    TopCounterparty: "Top Associated Parties",
                    Table: "Table"
                },
                ProgramDetails: {
                    ValidTo: "Valid To",
                    ValidFrom: "Valid From",
                    AutoAcceptanceInvoiceApplicability: "Auto Acceptance Invoice Applicability",
                    AutoAcceptanceDays: "Auto Acceptance Days",
                    AutoFinanceApplicability: "Auto Finance Applicability",
                    Comments: "Comments",
                    yes: "Yes",
                    no: "No",
                    Receivables: "Receivables",
                    Payables: "Payables",
                    DisbursementCurrency: "Disbursement Currency",
                    DisbursementMode: "Disbursement Mode"
                },
                ProgramAttributes: {
                    MinTenorAllowed: "Min Tenor Allowed",
                    MaxTenorAllowed: "Max Tenor Allowed",
                    ProgramTenor: "Program Tenor",
                    MinFinance: "Min Finance %",
                    MaxFinance: "Max Finance %",
                    WithRecourse: "With Recourse",
                    GraceDays: "Grace Days",
                    NumberofCounterparties: "Number of Counter Parties"
                },
                TopCounterparties: {
                    SelectCounterparty: "Select Counterparty"
                },
                Table: {
                    LinkedParties: "Linked Parties",
                    PartyNameandId: "Party Name and Id",
                    PartyRole: "Party Role",
                    OutstandingInvoicesNo: "Outstanding Invoices(No.)",
                    OutstandingInvoicesValue: "Outstanding Invoices (Value)",
                    Status: "Status",
                    partyNameAndId: "Party Name and Id",
                    partyRole: "Party Role",
                    invoices: "Invoices",
                    Party: "Party",
                    invoicesTitle: "Click for invoices",
                    PartyTilte: "Click for party details",
                    invoiceValue: "Invoice Value",
                    status: "status",
                    partyName: "Party Name",
                    partyId: "Party Id",
                    UserRole: "User Role",
                    userRoleValue: "User Role",
                    OutastandingInvoicesNo: "Outstanding Invoices (No.)",
                    numberinvoices: "Number of invoices",
                    OutsandingInvoicesValue: "Outstanding Invoices (Value)",
                    invoicesValueAmount: "Invoices Value Amount",
                    Edit: "Edit",
                    Cancel: "Cancel",
                    Back: "Back"
                },
                Status: {
                    INITIATED: "Initiated",
                    ACTIVE: "Active",
                    MODIFIED: "Modified",
                    CLOSED: "Closed",
                    OTHERS: "Others"
                },
                Relation : {
                    A: "Anchor",
                    CP: "Counterparty"
                },
                Role: {
                    B: "Buyer",
                    S: "Supplier"
                },
                InvoiceStatus : {
                    ACCEPTED: "Accepted",
                    RAISED: "Raised",
                    FINANCED: "Financed",
                    PARTIAL_FINANCED: "Partially Financed"
                },
                PaymentStatus : {
                    UNPAID: "Unpaid",
                    PART_PAID: "Partially Paid",
                    OVERDUE: "Overdue"
                },
                userRoleToDisplay: "{userRelation} - {userRole}",
                componentHeader: "View Program",
                partyid: "Party ID :{partyId}",
                ProgramType: "Program Type",
                ProgramId: "Program ID",
                ProgramName: "Program Name",
                status: "Status",
                active: "Active",
                linkedParties: "Linked Parties",
                cpSupplier: "Counterparty-Supplier",
                cpBuyer: "Counterparty-Buyer",
                anchorSupplier: "Anchor-Supplier",
                anchorBuyer: "Anchor-Buyer",
                noInvoiceValue: "No Invoices found for this Program",
                Disclaimer: "Associated Parties which have not raised invoices are not displayed",
                Note: "Note:",
                LocalCurrencyInformation: "In Local Currency Equivalent",
                NotApplicable: "NA",
                supplier: "Supplier",
                buyer: "Buyer",
                anchor: "Anchor",
                counterparty: "Counterparty",
                noData: "-"
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

    return new programdetailsviewLocale();
});