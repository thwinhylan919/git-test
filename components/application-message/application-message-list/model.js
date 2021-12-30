define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            applicationMessagesget: function (locale, code) {
                const params = {
                        locale: locale,
                        code: code
                    },
                    options = {
                        url: "applicationMessages?appMsglocale={locale}&code={code}",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            },
            enumerationslocaleget: function () {
                const params = {},
                    options = {
                        url: "enumerations/locale",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            }
        };
    };

    return new Model();
});