define([], function() {
  "use strict";

  const resourceServerCreateModel = function() {
    const Model = function() {
      this.resourceServerModel = {
        description: null,
        name: null,
        idDomain: null,
        scopes: []
      };
    };

    return {
      getNewModel: function(dataModel) {
        return new Model(dataModel);
      }
    };
  };

  return new resourceServerCreateModel();
});