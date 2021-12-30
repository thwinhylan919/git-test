define([""], function () {
    "use strict";

    return function () {
        let self,
         params;

                function onClickProceed76() {
            params.dashboard.loadComponent("login-form");
        }

        function init(bindingContext, _rootParams) {
            self = bindingContext;
            params = _rootParams;

            self.pageRendered = function () {
                return true;
            };

            self.successimagepath = "success/confirmation.gif";
            _rootParams.baseModel.registerComponent("login-form", "widgets/pre-login");

            return true;
        }

        return {
            onClickProceed76: onClickProceed76,
            init: init
        };
    };
});