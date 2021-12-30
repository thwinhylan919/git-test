define(["module", "text!./review-virtual-structure.html", "./review-virtual-structure", "text!./review-virtual-structure.css", "baseModel", "text!./review-virtual-structure.json"],
  function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
