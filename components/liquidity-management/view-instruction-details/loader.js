define(["module", "text!./view-instruction-details.html", "text!./view-instruction-details.css", "baseModel",
  "./view-instruction-details", "text!./view-instruction-details.json"
], function(module, template, css, BaseModel, viewModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});