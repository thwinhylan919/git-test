define(["module", "text!./redeem-funds-review.html", "./redeem-funds-review", "text!./redeem-funds-review.css", "baseModel", "text!./redeem-funds-review.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});