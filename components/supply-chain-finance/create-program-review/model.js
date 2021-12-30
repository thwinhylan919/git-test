define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            disbursementModeGet: function () {
                const params = {},
                    options = {
                        url: "/scfApplicationParams?key=DISBURSEMENT_MODE",
                        version: "ext/v1"
                    };

                return baseService.fetch(options, params);
            }
        };
    };

    return new Model();
});