define(["module", "text!./accounts-overview.html", "./accounts-overview", "text!./accounts-overview.css", "baseModel", "text!./accounts-overview.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
