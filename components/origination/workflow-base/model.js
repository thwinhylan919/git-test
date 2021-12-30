define([
  "baseService"
], function(BaseService) {
  "use strict";

  const WorkflowConfigurationModel = function() {
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
      fetchProducts: function (partyId, payload) {
        const params = {
            payload: payload,
            partyId: partyId
          },
          options = {
            url: "workflows/products"
          };

        return baseService.fetch(options, params);
      },
      fetchWorkflow: function (productClass, product) {
        const params = {
            productClass: productClass,
            product: product
          },
          options = {
            url: "workflows?productClass={productClass}&productSubClass={product}"
          };

        return baseService.fetch(options, params);
      },
      saveWorkflow: function (payload) {
        const options = {
          url: "workflows",
          data: payload
        };

        return baseService.add(options);
      },
      updateWorkflow: function (flowId, payload) {
        const params = {
            workFlowId: flowId
          },
          options = {
            url: "workflows/{workFlowId}",
            data: payload
          };

        return baseService.update(options, params);
      },
      activateWorkflow: function (flowId) {
        const params = {
            workFlowId: flowId
          },
          options = {
            url: "workflows/{workFlowId}/activation"
          };

        return baseService.update(options, params);
      }
    };
  };

  return new WorkflowConfigurationModel();
});