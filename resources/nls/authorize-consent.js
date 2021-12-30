define(["ojL10n!resources/nls/generic"], function (Generic) {
    "use strict";

    const authorizeconsentLocale = function () {
        return {
            root: {
                heading: {
                    ACCOUNT: "Consent Authorization",
                    PAYMENT: "Confirm Payment Account"
                },
                ConsentAuthorization: {
                    Selectandconfirmaccounts: "Select and confirm account(s) to share information with {touchPointName}.",
                    SelectDebitorAccount: "Please select the account to pay from:",
                    selectDetail: "Please check the details below are correct.",
                    fundsConfirmationHeader: "We have received a request from Card Based Payment Instrument Issuer to provide confirmation of sufficient funds from the following account:"

                },
                accountNumber: "Account Number",
                accountName: "Account Name",
                expiryDate: "Expiry Date",
                debitorAccountNumber: "Debit Account Number",
                amount: "Amount",
                endDate: "End Date",
                firstPaymentDate: "Payment Start Date",
                validUntil: "Note: {touchPointName} will access your information from selected account(s) {validUntilDate}",
                date: "until: {date}.",
                payeeName: "Payee Name",
                paymentReference: "Payment Reference",
                sortCode:"Sort Code",
                accountValue: "{accountType} | {accountNumber}",
                EvryDay: "Every day.",
                EvryWorkgDay: "Every working day.",
                IntrvlDay: "Every 15 Calendar day.",
                IntrvlWkDay: "Every week or 2nd week, on the 3rd day of the week.",
                WkInMnthDay: "Every month, on the 2nd week of the month, and on the third day of the week.",
                IntrvlMnthDay: "Every month, on the last day of the month.",
                QtrDay: "Paid on the 25th March, 24th June, 29th September and 25th December.",
                frequency: "Frequency",
                currencyOfTransfer : "Currency Of Transfer",
                fundsConfirmationRespond: "Please confirm that you would like us to respond to future confirmation of funds requests from Card Based Payment Instrument Issuer.",
                fundsConfirmationNote : "Please note that Card Based Payment Instrument Issuer will never see your account balance.",
                yesOrNo : "We will only provide a 'Yes or No' answer to the Card Based Payment Instrument Issuer when you use your Card Based Payment Instrument Issuer card.",
                generic: Generic
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

    return new authorizeconsentLocale();
});