define(["knockout"], function (ko) {
    "use strict";

    return function () {
        let self,
         params;

        function init(bindingContext, _rootParams) {
            self = bindingContext;
            params = _rootParams;

            self.document = {
                processId: "COPS",
                stageId: "CPM_FA_COPS_INITI",
                attachedDocuments: ko.observableArray([])
            };

            ko.utils.extend(self, params);

            self.pageRendered = function () {
                return true;
            };

            return true;
        }

        return { init: init };
    };
});