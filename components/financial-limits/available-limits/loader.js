define(["module", "text!./available-limits.html", "./available-limits","baseModel","text!./available-limits.css"], function(module, template, viewModel,BaseModel,css) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });