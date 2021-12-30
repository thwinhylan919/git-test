define(["promise"], function (Promise) {
    "use strict";

    if (!window.Promise) {
        window.Promise = Promise;
    }

    return function () {

        const methods = {
                "array.findIndex": Array.prototype.findIndex,
                "array.includes": Array.prototype.includes,
                "array.find": Array.prototype.find,
                "array.from": Array.from,
                "array.fill": Array.prototype.fill,
                "string.includes": String.prototype.includes,
                "object.entries": Object.entries,
                "object.assign": Object.assign,
                "object.values": Object.values,
                "custom.event": typeof window.CustomEvent === "function"
            },
            requirePolyfill = function (resource) {
                return new Promise(function (resolve, reject) {
                    require([resource], function () {
                        resolve();
                    }, function (error) {
                        reject(error);
                    });
                });
            },
            promises = [];

        Object.keys(methods).forEach(function (method) {
            if (!methods[method]) {
                promises.push(requirePolyfill("base-models/polyfills/" + method));
            } else {
                promises.push(Promise.resolve());
            }
        });

        return Promise.all(promises);
    };
});