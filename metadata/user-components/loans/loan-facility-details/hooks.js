define([""], function () {
    "use strict";

    return function () {
        let self;

        function init(bindingContext, _rootParams) {
            self = bindingContext;
            self.facilityDetails = _rootParams.facilityDetails;
            self.result = Math.round(self.facilityDetails.utilizedAmount.amount / self.facilityDetails.effectiveAmount.amount * 100 * 100) / 100;

            self.pageRendered = function () {
                return true;
            };

            return true;
        }

        return { init: init };
    };
});