define(["module", "text!./cancel-application.html", "./cancel-application", "text!./cancel-application.css", "baseModel", "text!./cancel-application.json"], function (module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});