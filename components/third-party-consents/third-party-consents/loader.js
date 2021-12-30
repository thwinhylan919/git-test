define(["module", "text!./third-party-consents.html", "./third-party-consents", "text!./third-party-consents.css", "baseModel", "text!./third-party-consents.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});