define([
    "ojL10n!resources/nls/generic",
    "ojL10n!resources/nls/confirm-screen",
    "ojL10n!resources/nls/payments-common"
], function(Generic, Confirm, Common) {
    "use strict";

    const ReviewTransferPayeeUpi = function() {
        return {
            root: {
                reviewTransferUpi: {
                    header: "Transfer Money",
                    transferTo: "Transfer To",
                    accountName: "Account Name",
                    bankDetails: "Bank Details",
                    accountType: "Account Type",
                    payeeVpa: "Payee VPA",
                    transferFrom: "Transfer From",
                    payeeAccountNo: "Payee Account Number",
                    ifscCode: "IFSC Code",
                    amount: "Amount",
                    note: "Note",
                    alt: "Click here to {reference}",
                    title: "Click here to {reference}",
                    vpa: "VPA",
                    bankName: "Bank Name",
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

    return new ReviewTransferPayeeUpi();
});