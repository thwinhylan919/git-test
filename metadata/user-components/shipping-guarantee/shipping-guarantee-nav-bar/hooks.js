define(["knockout"], function (ko) {
    "use strict";

    return function () {
        let self,
         params;

                function onClickInitiateShippingGuarantee35() {
            self.mode("CREATE");
            params.dashboard.loadComponent("initiate-shipping-guarantee", {});
        }

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;

            self.pageRendered = function () {
                return true;
            };

            params.baseModel.registerComponent("template-list", "letter-of-credit");
            params.baseModel.registerComponent("draft-list", "letter-of-credit");
            params.baseModel.registerComponent("initiate-shipping-guarantee", "shipping-guarantee");
            self.mode = ko.observable();
            self.transactionType = ko.observable("SHIPPING_GUARANTEE");

            self.menuOptions = ko.observable([
                {
                    id: "TEMPLATES",
                    label: self.nls.template
                },
                {
                    id: "DRAFTS",
                    label: self.nls.drafts
                }
            ]);

            self.menuSelection = ko.observable("TEMPLATES");
            self.compName = ko.observable("template-list");

            self.menuSelectionSubscribe = self.menuSelection.subscribe(function (newValue) {
                if (newValue === "TEMPLATES") {
                    self.compName("template-list");
                } else if (newValue === "DRAFTS") {
                    self.compName("draft-list");
                }
            });

            return true;
        }

        return {
            onClickInitiateShippingGuarantee35: onClickInitiateShippingGuarantee35,
            init: init
        };
    };
});