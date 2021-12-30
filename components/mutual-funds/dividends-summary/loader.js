define(["module", "text!./dividends-summary.html", "./dividends-summary", "text!./dividends-summary.css", "baseModel", "text!./dividends-summary.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
