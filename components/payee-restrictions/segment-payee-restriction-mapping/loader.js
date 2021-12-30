define(["module", "text!./segment-payee-restriction-mapping.html", "./segment-payee-restriction-mapping", "text!./segment-payee-restriction-mapping.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});