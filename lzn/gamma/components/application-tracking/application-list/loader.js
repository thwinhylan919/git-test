define(["module", "text!./application-list.html", "./application-list", "text!./application-list.css", "baseModel", "text!./application-list.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});