define(["ojL10n!resources/nls/generic"], function(Generic) {
    "use strict";

    const DashboardLocale = function() {
        return {
            root: {
                bankName: "MTB Bank",
                backImage: "Go back",
                skipToMainContent: "Skip to main content",
                headers: {
                    approver: "Approver",
                    loans: "Loans",
                    maker: "Maker",
                    "demand-deposits": "Savings & Current",
                    "term-deposits": "Term Deposits",
                    viewer: "Viewer",
                    overview: "Overview",
                    payments: "Payments",
                    creditCard: "Credit Cards",
                    systemDashboard: "Dashboard",
                    dashboard: "Dashboard",
                    dashboardnStatistics: "Dashboard and Statistics",
                    "supply-chain-finance": "Supply Chain Finance",
                    "liquidity-management": "Liquidity Management",
                    "virtual-account-management": "Virtual Account Management",
                    "credit-facility-management": "Credit Facility Management"
                },
                sessionExpiredHeader: "Session Expired",
                sessionExpired: "Your session has expired. Please try again.",
                passwordWarningMessage: "Your password is about to expire in {pwdExpiryWarningDays} days, please change your password at the earliest.",
                fatcaWarningMessage: "You are required to submit FATCA & CRS related information. Please click the link to open the form.",
                fatcaForm: "FATCA & CRS form",
                fatcaFormTitle: "Click to open FATCA & CRS form",
                changePasswordTitle: "Click to Change Password",
                changePassword: "Change Password.",
                overlayDismissTitle: "Click to dismiss overlay",
                overlayDismiss: "Dismiss Overlay",
                backTop: "Back To Top",
                systemConfigPending: "You cannot do any transaction since System Configuration is not set yet.",
                passwordExample: "Example, if your name is Roopa Lal and date of birth is 23-12-1980, then your password is ROOP2312",
                passwordNotification: "Password Combination",
                passCombination: "The document is password protected, it is a combination of the first 4 letters of your name (in capital letters) followed by your date of birth (in DDMM format).",
                generic: Generic
            },
            ar: false,
            fr: true,
            cs: false,
            sv: false,
            en: false,
es :true,
            "en-us": false,
            el: false
        };
    };

    return new DashboardLocale();
});