define([], function() {
  "use strict";

  function extend(target, source) {
    if (source) {
      const descriptors = Object.keys(source).reduce(function(descriptors, key) {
        descriptors[key] = Object.getOwnPropertyDescriptor(source, key);

        return descriptors;
      }, {});

      Object.getOwnPropertySymbols(source).forEach(function(sym) {
        const descriptor = Object.getOwnPropertyDescriptor(source, sym);

        if (descriptor.enumerable) {
          descriptors[sym] = descriptor;
        }
      });

      Object.defineProperties(target, descriptors);
    }

    return target;
  }

  return extend;
});
