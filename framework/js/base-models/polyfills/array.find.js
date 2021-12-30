define([], function() {
    "use strict";

    // eslint-disable-next-line no-extend-native
    Object.defineProperty(Array.prototype, "find", {
        value: function(predicate) {
            if (!this) {
                throw new TypeError("\"this\" is null or not defined");
            }

            const o = Object(this),
                len = o.length >>> 0;

            if (typeof predicate !== "function") {
                throw new TypeError("predicate must be a function");
            }

            const thisArg = arguments[1];

            let k = 0;

            while (k < len) {
                const kValue = o[k];

                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }

                k++;
            }

            return undefined;
        },
        configurable: true,
        writable: true
    });
});