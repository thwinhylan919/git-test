define(["module", "text!./apply-online.html", "./apply-online", "text!./apply-online.css","baseModel"], function (module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template,css,baseModel.getComponentName(module))
    };
  });
