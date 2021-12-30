define(["module", "text!./wallet-dashboard-activity.html", "./wallet-dashboard-activity", "text!./wallet-dashboard-activity.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});