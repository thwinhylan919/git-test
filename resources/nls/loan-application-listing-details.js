define([], function () {
    "use strict";

    const LoanAppListingDetails = function () {
        return {
            root: {
                Confirmicon: "Confirm icon",
                AmountOf: "Amount of {amount}",
                On: "On {date}",
                CustomerNameselected: "Customer Name selected",
                CustomerName: "Customer Name",
                CustomerId: "Customer Id",
                ProcessIcon: "Process Icon",
                ProcessStatus: "Process Status",
                Amount: "Amount",
                ApplicationDate: "Application Date",
                Documents: "Documents",
                ViewDocuments: "View/Download Your Documents",
                DocumentsTitle: "Click for Documents",
                ApplicationsDetails: "Application Details",
                ViewApplicationsDetails: "View Your Application",
                ApplicationsDetailsTitle: "Click for Applications Details",
                Cancel: "Cancel",
                Close: "Close",
                NoDocuments: "Currently, there are no documents available for you to View or Download. If you are unable to see your uploaded document, please contact the bank.",
                ClickOnCancel: "Click here to hide",
                Back: "Back",
                uploaded: "{Doc} has been successfully uploaded.",
                requestType: {
                    TermLoan: "Term Loan",
                    WorkingCapitalLoan: "Working Capital",
                    EquipmentFinancingLoan: "Equipment Loan",
                    RealEstateLoan: "Real Estate Loan"
                },
                processStatus:
                {
                    SUBMITTED: "Submitted",
                    IN_PROGRESS: "In Progress",
                    DRAFT: "Draft",
                    COMPLETED: "Completed"
                },
                loanAppliedFor: "Loan Applied for",
                componentHeader: "Application Tracker"
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

    return new LoanAppListingDetails();
});