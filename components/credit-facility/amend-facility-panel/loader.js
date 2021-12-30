
define(["module", "text!./amend-facility-panel.html", "./amend-facility-panel", "text!./amend-facility-panel.css", "baseModel", "text!./amend-facility-panel.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
