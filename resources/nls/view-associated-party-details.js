define([], function () {
    "use strict";

    const viewinvoiceLocale = function () {
        return {
            root: {
                heading: {
                   CounterPartyDetails: "Counterparty Details",
                   ContactDetails: "Contact Details",
                   TopAssociatedPrograms: "Top {count} Associated Programs",
                   TopAssociatedProgram: "Top Associated Programs",
                   AssociatedPrograms: "Associated Programs"
                },
                ViewAssociatedParty: {
                    PartyID: "Party ID : {partyId}",
                    OnboardedOn: "Onboarded On",
                    Status: "Status",
                    Receivables: "Receivables",
                    Payables: "Payables"
                },
                CounterPartyDetails: {
                    PartyID: "Party ID",
                    PartyName: "Party Name",
                    ShortName: "Short Name",
                    CorporateRegistrationNumber: "Corporate Registration Number",
                    taxRegNumber: "Tax Registration Number",
                    CategoryofCorporate: "Category of Corporate",
                    KYCStatus: "KYC Status"
                },
                ContactDetails: {
                    Contact: "Contact Details",
                    Email: "Email",
                    Address: "Address",
                    PINCode: "PIN Code",
                    mobileNumber: "+{code} -{number}"
                },
                AssociatedPrograms:{
                    Name: "Program Name & Id",
                    PartyRole: "Party Role",
                    OutstandingNumber: "Outstanding Invoices (No.)",
                    OutstandingAmount: "Outstanding Invoices (Value)",
                    Invoices: "View Invoices",
                    InvoicesTitle: "Go To Invoices",
                    Programs: "View Programs",
                    ProgramsTitle: "Go To Programs",
                    Status: "Status"
                },
                Status: {
                    ACTIVE: "Active",
                    INACTIVE: "Inactive",
                    INITIATED: "Initiated",
                    OTHERS: "Others"
                },
                Buttons:{
                    Cancel: "Cancel",
                    Back: "Back"
                },
                TopAssociatedPrograms:{
                    Receivables: "Receivables {amount}",
                    Payables: "Payables {amount}"
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
                componentHeader: "View Associated Parties",
                Disclaimer: "Programs which have no invoices raised are not displayed",
                Note: "Note:",
                LocalCurrencyInformation: "In Local Currency Equivalent",
                Others: "Others",
                noSellerProgramsMessage: "Currently, there are no 'Receivables' from the spokes",
                noBuyerProgramsMessage: "Currently, there are no 'Payables' from the spokes",
                NotValidData: "-"
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

    return new viewinvoiceLocale();
});