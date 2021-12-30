define([
], function() {
  "use strict";

  const APIGroupCreateModel = function() {
    const Model = function() {
      this.apiGroupDTO = {
        groupCode: null,
        groupDescription: null,
        endPointConfig: null,
        ip: null,
        port: null,
        authorizationType: null,
        userName: null,
        password: null
      };
    };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      }
    };
  };

  return new APIGroupCreateModel();
});
