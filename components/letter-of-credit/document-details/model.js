define([], function() {
  "use strict";

  const DocumentDetailsModel = function() {
    const Model = function() {
      this.DocumentDetails = {
        clause: [],
        copies: null,
        incoterm: null,
        name: null,
        originals: null
      };
    };

    return {
      getNewModel: function() {
        return new Model();
      }
    };
  };

  return new DocumentDetailsModel();
});