define(["module", "text!./demand-deposit-analysis.html", "./demand-deposit-analysis", "text!./demand-deposit-analysis.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});