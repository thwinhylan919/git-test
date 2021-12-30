
define(["module", "text!./apply-new-facility-panel.html", "./apply-new-facility-panel", "text!./apply-new-facility-panel.css", "baseModel", "text!./apply-new-facility-panel.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
