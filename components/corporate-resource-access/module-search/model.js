define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            enumerationsaccessModuleget: function () {
                const params = {},
                 options = {
                    url: "/enumerations/accessModule",
                    version: "v1"
                };

                return baseService.fetch(options, params);
            }
        };
    };

    return new Model();
});