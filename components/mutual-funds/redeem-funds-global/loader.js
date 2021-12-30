define(["module", "text!./redeem-funds-global.html", "./redeem-funds-global", "text!./redeem-funds-global.css", "baseModel", "text!./redeem-funds-global.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
