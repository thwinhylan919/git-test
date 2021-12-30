define([], function() {
  "use strict";

  const entityLimitMapping = function() {
    return {
      root: {
        entity: "Entity",
        limitPackage: "Limit Package",
        common: {
          pleaseSelect: "Please Select"
        }
      }
    };
  };

  return new entityLimitMapping();
});