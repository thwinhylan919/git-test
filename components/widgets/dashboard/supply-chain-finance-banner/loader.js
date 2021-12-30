define(["module", "text!./supply-chain-finance-banner.html", "./supply-chain-finance-banner", "text!./supply-chain-finance-banner.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
