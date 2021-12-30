define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            mepartyget: function () {
                const params = {},
                 options = {
                    url: "/me/party",
                    version: "v1"
                };

                return baseService.fetch(options, params);
            }
        };
    };

    return new Model();
});