define(["module", "text!./performance-analysis-widget.html", "./performance-analysis-widget", "text!./performance-analysis-widget.css", "baseModel", "text!./performance-analysis-widget.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
