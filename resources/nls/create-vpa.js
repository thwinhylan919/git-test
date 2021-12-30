define([
    "ojL10n!resources/nls/generic",
    "ojL10n!resources/nls/confirm-screen",
    "ojL10n!resources/nls/payments-common"
], function(Generic, Confirm, Common) {
    "use strict";

    const CreateVpa = function() {
        return {
            root: {
                createVpa: {
                    header: "Create VPA",
                    editHeader: "Edit VPA",
                    accountNo: "Account Number",
                    enterVpa: "Enter VPA",
                    vpaPlaceholder: "Enter Alphanumeric Value",
                    checkAvailability: "Check Availability",
                    vpaHandler: "@Futura Bank",
                    alt: "Click here to {reference}",
                    title: "Click here to {reference}",
                    vpa: "VPA",
                    reviewHeaderMsg: "You initiated a request for Create VPA. Please review details before you confirm!",
                    reviewEditHeaderMsg: "You initiated a request for Edit VPA. Please review details before you confirm!",
                    createVpaSuccess: "VPA Created Successfully",
                    editVpaSuccess: "VPA Modified Successfully",
                    checkVpaAvailability: {
                        status: {
                            true: "Available",
                            false: "Unavailable"
                        }
                    }

                },
                upiPayee: {
                    header: "VPA Payee",
                    reviewHeaderMsg: "You have initiated a request to add a new VPA Payee.Please review the details before you confirm.",
                    payeeName: "Payee Name",
                    payeeVpa: "Payee VPA",
                    accountName: "Account Name",
                    nickName: "Nick Name",
                    add: "Add"
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

    return new CreateVpa();
});