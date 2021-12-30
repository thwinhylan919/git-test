define([], function () {
    "use strict";

    const multipleOrdersGlobal = function () {
        return {
            root: {
                confirmScreen: {
                    success: "Success",
                    fail: "Failed",
                    confirmPurchasePageHeader: "Purchase Order Details",
                    confirmSwitchPageHeader: "Switch Order Details",
                    confirmRedeemPageHeader: "Redeem Order Details",
                    failureReason: "Failure Reason",
                    status: "Status"
                }
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

    return new multipleOrdersGlobal();
});