define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            countryget: function () {
                const params = {},
                    options = {
                        url: "/enumerations/country",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            stateget: function (countryCode) {
                const params = {
                        countryCode: countryCode
                    },

                    options = {
                        url: "/enumerations/country/{countryCode}/state",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            corporatecategoryget: function () {
                const params = {},
                    options = {
                        url: "/scfApplicationParams?key=NON_CUSTOMER_CATEGORY",
                        version: "ext/v1"
                    };

                return baseService.fetch(options, params);
            }
        };
    };

    return new Model();
});