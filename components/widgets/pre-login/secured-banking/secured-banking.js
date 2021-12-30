define([
    "ojL10n!resources/nls/secured-banking"
], function (resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.resource = resourceBundle;
        rootParams.baseModel.registerComponent("product-header-text", "widgets/pre-login");

        self.features = [{
                type: "authentication",
                icon: "icon-more"
            },
            {
                type: "snapshot",
                icon: "icon-occupation-info"
            },
            {
                type: "chatbot",
                icon: "icon-chat"
            },
            {
                type: "qrPayment",
                icon: "icon-qr-code"
            },
            {
                type: "siriPay",
                icon: "icon-assets"
            },
            {
                type: "iMessage",
                icon: "icon-mailbox"
            },
            {
                type: "facebook",
                icon: "icon-facebook"
            },
            {
                type: "pushNotification",
                icon: "icon-push-notifications"
            }
        ];
    };
});