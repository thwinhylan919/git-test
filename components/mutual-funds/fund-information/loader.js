define(["module", "text!./fund-information.html", "./fund-information", "text!./fund-information.css", "baseModel", "text!./fund-information.json"], function (module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});
