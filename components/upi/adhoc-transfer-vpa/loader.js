define(["module", "text!./adhoc-transfer-vpa.html", "./adhoc-transfer-vpa", "text!./adhoc-transfer-vpa.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});