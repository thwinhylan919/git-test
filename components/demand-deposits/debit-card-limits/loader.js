define(["module", "text!./debit-card-limits.html", "./debit-card-limits","text!./debit-card-limits.css", "baseModel","text!./debit-card-limits.json"], function(module, template, viewModel,css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
