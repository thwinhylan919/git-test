define([], function() {
    "use strict";

    // eslint-disable-next-line no-extend-native
    Object.defineProperty(Array.prototype, "fill", {
        value: function(value) {

            if (this === null) {
                throw new TypeError("this is null or not defined");
            }

            const O = Object(this),
                len = O.length >>> 0,
                start = arguments[1],
                relativeStart = start >> 0,
                end = arguments[2],
                relativeEnd = end === undefined ?
                len : end >> 0,
                final = relativeEnd < 0 ?
                Math.max(len + relativeEnd, 0) :
                Math.min(relativeEnd, len);

            let k = relativeStart < 0 ?
                Math.max(len + relativeStart, 0) :
                Math.min(relativeStart, len);

            while (k < final) {
                O[k] = value;
                k++;
            }

            return O;
        }
    });
});