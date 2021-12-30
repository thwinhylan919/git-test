define(["module", "text!./choose-facility-option.html", "./choose-facility-option", "text!./choose-facility-option.css", "baseModel", "text!./choose-facility-option.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });