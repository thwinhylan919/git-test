define([], function() {
    "use strict";

    // eslint-disable-next-line no-extend-native
    Object.defineProperty(Array.prototype, "includes", {
        value: function(searchElement, fromIndex) {

            if (!this) {
                throw new TypeError("\"this\" is null or not defined");
            }

            const o = Object(this),
                len = o.length >>> 0;

            if (len === 0) {
                return false;
            }

            const n = fromIndex | 0;

            let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y) {
                return x === y || (typeof x === "number" && typeof y === "number" && isNaN(x) && isNaN(y));
            }

            while (k < len) {
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }

                k++;
            }

            return false;
        }
    });
});