define([
    "ojL10n!resources/nls/generic",
    "ojL10n!resources/nls/confirm-screen",
    "ojL10n!resources/nls/adhoc-payments"
], function(Generic, Confirm, Payments) {
    "use strict";

    const AdhocTransferVpa = function() {
        return {
            root: {
                adhocTransferVpa: {
                    header: "Adhoc Transfer",
                    alt: "Click here to {reference}",
                    title: "Click here to {reference}",
                    payeeVpa: "Payee VPA",
                    transferTo: "Transfer to",
                    account: "Account",
                    transferFrom: "Transfer From",
                    amount: "Amount",
                    note: "Note",
                    transfer: "Transfer",
                    vpa: "VPA",
                    accountNo: "Account Number {account}",
                    payeeAccountNo: "Payee Account Number",
                    confirmAccountNo: "Confirm Account Number",
                    bankName: "Bank Name",
                    viewLimits: "View Limits",
                    verifyCode: "Verify",
                    bankLookUp: "Lookup IFSC Code",
                    pleaseSelect: "Please Select",
                    ifscCode: "IFSC Code"

                },
                generic: Generic,
                confirm: Confirm.confirm,
                payments: Payments.payments
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

    return new AdhocTransferVpa();
});