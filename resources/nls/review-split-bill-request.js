define([], function() {
    "use strict";

    const reviewsplitbillrequestLocale = function() {
        return {
            root: {
                heading: { SplitMoney: "Split Money" },
                SplitMoney: {
                    ReceiveIn: "Receive Funds in",
                    Amount: "Amount",
                    ValidTill: "Valid Till",
                    Note: "Note",
                    userAmount: "user Amount",
                    ContriButorsName: "Contributors Name",
                    VPAId: "VPA Id",
                    ContributorAmount: "Contributor Amount",
                    Confirm: "Confirm",
                    back: "Back",
                    splitMoneyWith: "Split Money with"
                },
                nextAction: "What would you like to do next?",
                splitAnotherBill: "Split Another Bill",
                goToDashboard: "Go To Dashboard",
                componentHeader: "Split Money",
                review: "Review",
                reviewHeader: "You have initiated a request to receive money. Please review the details before you confirm!"
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

    return new reviewsplitbillrequestLocale();
});