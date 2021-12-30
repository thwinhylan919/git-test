define(["module", "text!./claim-payment-existing-user-dashboard.html", "./claim-payment-existing-user-dashboard", "text!./claim-payment-existing-user-dashboard.css", "baseModel", "text!./claim-payment-existing-user-dashboard.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});