define(["module", "text!./remittance-identifier-information.html", "./remittance-identifier-information", "text!./remittance-identifier-information.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });
