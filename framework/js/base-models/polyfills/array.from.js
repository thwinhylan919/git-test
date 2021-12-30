define([], function () {
    "use strict";

    Array.from = (function () {
        const toStr = Object.prototype.toString,
            isCallable = function (fn) {
                return typeof fn === "function" || toStr.call(fn) === "[object Function]";
            },
            toInteger = function (value) {
                const number = Number(value);

                if (isNaN(number)) {
                    return 0;
                }

                if (number === 0 || !isFinite(number)) {
                    return number;
                }

                return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
            },
            maxSafeInteger = Math.pow(2, 53) - 1,
            toLength = function (value) {
                const len = toInteger(value);

                return Math.min(Math.max(len, 0), maxSafeInteger);
            };

        return function from(arrayLike) {
            const C = this,
                items = Object(arrayLike);

            if (arrayLike === null) {
                throw new TypeError("Array.from requires an array-like object - not null or undefined");
            }

            const mapFn = arguments.length > 1 ? arguments[1] : undefined;
            let T;

            if (typeof mapFn !== "undefined") {
                if (!isCallable(mapFn)) {
                    throw new TypeError("Array.from: when provided, the second argument must be a function");
                }

                if (arguments.length > 2) {
                    T = arguments[2];
                }
            }

            const len = toLength(items.length),
                A = isCallable(C) ? Object(new C(len)) : new Array(len);
            let k = 0,
                kValue;

            while (k < len) {
                kValue = items[k];

                if (mapFn) {
                    A[k] = typeof T === "undefined" ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                } else {
                    A[k] = kValue;
                }

                k += 1;
            }

            A.length = len;

            return A;
        };
    }());
});