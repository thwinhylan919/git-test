
define(["module", "text!./facility-hierarchy-panel.html", "./facility-hierarchy-panel", "text!./facility-hierarchy-panel.css", "baseModel", "text!./facility-hierarchy-panel.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
