
define(["module", "text!./view-submitted-application.html", "./view-submitted-application", "text!./view-submitted-application.css", "baseModel", "text!./view-submitted-application.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
