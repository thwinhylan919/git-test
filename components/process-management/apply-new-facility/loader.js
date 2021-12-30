define(["module", "text!./apply-new-facility.html", "./apply-new-facility", "text!./apply-new-facility.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
