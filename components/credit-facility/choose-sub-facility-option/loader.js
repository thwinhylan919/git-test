define(["module", "text!./choose-sub-facility-option.html", "./choose-sub-facility-option", "text!./choose-sub-facility-option.css", "baseModel", "text!./choose-sub-facility-option.json"], function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });