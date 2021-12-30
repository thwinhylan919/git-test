define([
  "baseService"
], function (BaseService) {
  "use strict";

  const WorkflowConfigurationModel = function () {
    const baseService = BaseService.getInstance();

    return {
      /**
       * In case more than one instance of model is required,
       * we are declaring model as a function, of which new instances can be created and
       * used when required.
       *
       * @class Model
       * @private
       * @memberOf PreferenceFunctionsModel~PreferenceFunctionsModel
       */
      saveWorkflow: function (payload) {
        const params = {
            payload: payload
          },
          options = {
            url: "workflows/saveWorkflow"
          };

        return baseService.fetch(options, params);
      }
    };
  };

  return new WorkflowConfigurationModel();
});