define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            applicationMessageslocalecodeget: function (locale, code) {
                const params = {
                        appMsglocale: locale,
                        code: code
                    },
                    options = {
                        url: "applicationMessages/{appMsglocale}/{code}",
                        version: "v1"
                    };

                return baseService.fetch(options, params);
            }
        };
    };

    return new Model();
});