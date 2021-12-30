define(["module", "text!./tree-view.html", "text!./tree-view.css", "baseModel",
  "./tree-view", "text!./tree-view.json"
], function(module, template, css, BaseModel, viewModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});