define([], function () {
    "use strict";

    Object.values = function (obj) {
        return Object.keys(obj).map(function (e) {
            return obj[e];
        });
    };
});