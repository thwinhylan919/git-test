define([
], function() {
  "use strict";

  const APIGroupEditModel = function() {
    const Model = function() {
      this.apiGroupDTO = {
        ip: null,
        port: null,
        authorizationType: null,
        userName: null,
        password: null,
        groupCode: null,
        groupDescription: null,
        endPointConfig: null
      };
    };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      }
    };
  };

  return new APIGroupEditModel();
});
