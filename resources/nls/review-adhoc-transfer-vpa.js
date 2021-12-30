define([
    "ojL10n!resources/nls/generic",
    "ojL10n!resources/nls/confirm-screen",
    "ojL10n!resources/nls/payments-common"
], function(Generic, Confirm, Common) {
    "use strict";

    const ReviewAdhocTransferVpa = function() {
        return {
            root: {
                reviewAdhocVpa: {
                    header: "Adhoc Transfer",
                    transferTo: "Transfer To",
                    payeeVpa: "Payee VPA",
                    transferFrom: "Transfer From",
                    payeeAccountNo: "Payee Account Number",
                    ifscCode: "IFSC Code",
                    amount: "Amount",
                    note: "Note",
                    alt: "Click here to {reference}",
                    title: "Click here to {reference}",
                    vpa: "VPA",
                    bankName: "Payee Bank",
                    reviewHeaderMsg: "You have initiated a request to transfer money. Please review the details before you confirm!"
                },
                generic: Generic,
                confirm: Confirm.confirm,
                common: Common.payments.common
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

    return new ReviewAdhocTransferVpa();
});