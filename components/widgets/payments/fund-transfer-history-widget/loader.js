define(["module", "text!./fund-transfer-history-widget.html", "./fund-transfer-history-widget", "text!./fund-transfer-history-widget.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
