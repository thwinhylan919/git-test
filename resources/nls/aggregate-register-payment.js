define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";

    const LinkAccountLocale = function() {
        return {
            root: {
                header: {
                    transferMoney: "Transfer Money"
                },
                CSA: "Savings",
                TRD: "Term Deposit",
                LON: "Loan",
                ifsc: "IFSC Code",
                payVia: "Pay Via",
                accountNumber: "Account Number",
                bankdetails: "Bank Details",
                transferOn: "Transfer When",
                tansferMoneyTitle: "Transfer Money",
                accountType: "Account Type",
                myBankName: "Futura Bank Limited.",
                lookupifsccodeTitle: "Find the IFSC based on information.",
                selectAccountType: "Select Account Type",
                selectAccountNo: "Select Account",
                toAccount: "Transfer To",
                fromAccount: "Transfer From",
                lookupifsccode: "Lookup IFSC Code",
                amount: "Amount",
                transfer: "Transfer",
                invalidError: "Invalid IFSC Code",
                viewLimits: "View Limits",
                viewLimitsTitle: "Limits",
                mylimits: "My Limits",
                channel: "Channel",
                showInformation: "Select channel to view its limits.",
                purpose: "Purpose",
                comment: "Comment",
                reviewHeaderMsg: "You initiated a request for {txnName}. Please review details before you confirm!",
                txnName: "Linked Account Fund  Transfer",
                noNetworkSuggested: "No Network Suggested",
                suggested: "(Suggested)",
                validationError: "Validation Error",
                accountSelectionWarning: "Debit and credit account cannot be same.",
                successMessage: "Your transaction is successful!",
                completed: "Completed",
                buttons: {
                    verify: "Verify"
                },
                note: "Note",
                generic: Generic
            },
            ar: true,
            fr: true,
            cs: true,
            sv: true,
            en: false,
es :true,
            "en-us": false,
            el: false
        };
    };

    return new LinkAccountLocale();
});