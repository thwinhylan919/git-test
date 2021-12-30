define([], function () {
    "use strict";

    Object.defineProperty(Object, "assign", {
        value: function assign(target) {
            if (target === null) {
                throw new TypeError("Cannot convert undefined or null to object");
            }

            const to = Object(target);

            for (let index = 1; index < arguments.length; index++) {
                const nextSource = arguments[index];

                if (nextSource !== null) {
                    // eslint-disable-next-line prefer-const
                    for (let nextKey in nextSource) {
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }

            return to;
        },
        writable: true,
        configurable: true
    });
});