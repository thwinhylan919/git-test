define(["module", "text!./wealth-management-promotional-offers.html", "./wealth-management-promotional-offers", "text!./wealth-management-promotional-offers.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
