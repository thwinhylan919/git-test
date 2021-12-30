define([], function() {
  "use strict";

  const resourceServerEditModel = function() {
    const Model = function() {
      this.resourceServerModel = {
        id: null,
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

  return new resourceServerEditModel();
});