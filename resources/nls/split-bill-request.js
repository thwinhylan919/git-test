define([], function() {
    "use strict";

    const splitbillrequestLocale = function() {
        return {
            root: {
                heading: { SplitMoney: "Split Money" },
                SplitMoney: {
                    ReceiveIn: "Receive Funds in",
                    AccountNumberaccountNumber: "Account Number : {accountNumber}",
                    EnterAmount: "Enter Amount",
                    ValidTill: "Valid Till",
                    ContributorName: "Contributor Name",
                    VPAId: "VPA Id",
                    DeleteContributor: "Delete Contributor",
                    DeleteContributorTitle: "Click for Delete Contributor",
                    Proceed: "Proceed",
                    BacktoContributors: "Back to Contributors",
                    altBacktoContributors: "Back to Contributors",
                    cancel: "Cancel",
                    amountValidation: "Sum of amount contributed does not match total bill amount. Please check and try again.",
                    maxPayeeLimit: "You have reached the maximum count of contributors allowed per Split Bill transaction.",
                    minPayeeLimit: "Please add at least one contributor in order to proceed with Split Bill."
                },
                componentHeader: "Split Money",
                transactionName: "Split Money",
                note: "Note"
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

    return new splitbillrequestLocale();
});