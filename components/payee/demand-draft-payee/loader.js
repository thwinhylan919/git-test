define([
  "module",
  "text!./demand-draft-payee.html",
  "./demand-draft-payee",
  "text!./demand-draft-payee.css",
  "baseModel",
  "text!./demand-draft-payee.json"
], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});