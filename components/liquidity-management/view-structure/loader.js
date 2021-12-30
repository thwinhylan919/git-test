define(["module", "text!./view-structure.html", "text!./view-structure.css", "baseModel",
  "./view-structure", "text!./view-structure.json"
], function(module, template, css, BaseModel, viewModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});