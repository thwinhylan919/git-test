define([], function() {
    "use strict";

    // eslint-disable-next-line no-extend-native
    Object.defineProperty(String.prototype, "includes", {
        value: function(search, start) {
            if (typeof start !== "number") {
                start = 0;
            }

            if (start + search.length > this.length) {
                return false;
            }

            return this.indexOf(search, start) !== -1;

        }
    });
});