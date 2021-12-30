define([
    "jquery",
    "framework/js/constants/constants"
], function ($, Constants) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.label = rootParams.label;
        self.value = rootParams.value;

        self.dataClass = rootParams.dataClass;

        self.dataId = rootParams.dataId || rootParams.baseModel.incrementIdCount();

        self.computeStyles = function () {
            $("div[data-id=" + self.dataId + "]").addClass(self.dataClass);

            if (Constants.userSegment === "ADMIN" || Constants.userSegment === "CORPADMIN") {
                $("div[data-id=" + self.dataId + "]").addClass("oj-md-8 oj-lg-9");
            }
        };
    };
});