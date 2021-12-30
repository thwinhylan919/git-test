define(["module", "text!./payments-payee-list.html", "./payments-payee-list", "text!./payments-payee-list.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});