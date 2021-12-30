define(["module", "text!./investment-allocation-widget.html", "./investment-allocation-widget", "text!./investment-allocation-widget.css", "baseModel", "text!./investment-allocation-widget.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
