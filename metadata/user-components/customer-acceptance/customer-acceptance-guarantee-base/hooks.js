define(["knockout"], function (ko) {
    "use strict";

    return function () {
        let self,
         params;

        function init(bindingContext, rootParams) {
            self = bindingContext;
            params = rootParams;
            self.menuSelection = ko.observable("OUTWARDBG");
            params.baseModel.registerComponent("outward-guarantee-amendment", "customer-acceptance");
            params.baseModel.registerComponent("inward-guarantee-amendment", "customer-acceptance");
            self.selectedComponent = ko.observable("outward-guarantee-amendment");

            self.menuSelectionSubscribe = self.menuSelection.subscribe(function (newValue) {
                if (newValue === "OUTWARDBG") {
                    self.selectedComponent("outward-guarantee-amendment");
                } else if (newValue === "INWARDBG") {
                    self.selectedComponent("inward-guarantee-amendment");
                }
            });

            return true;
        }

        return { init: init };
    };
});