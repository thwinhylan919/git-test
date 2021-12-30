define(["module","text!./download-statement.html", "./download-statement","text!./download-statement.css", "baseModel", "text!./download-statement.json"], function(module,template, viewModel, css, BaseModel) {
  "use strict";

const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});