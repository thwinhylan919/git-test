define(["module", "text!./switch-funds-review.html", "./switch-funds-review", "text!./switch-funds-review.css", "baseModel", "text!./switch-funds-review.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
