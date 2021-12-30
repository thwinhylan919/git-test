define(["module", "text!./virtual-structure-tree-view.html", "text!./virtual-structure-tree-view.css", "baseModel",
  "./virtual-structure-tree-view", "text!./virtual-structure-tree-view.json"
], function(module, template, css, BaseModel, viewModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))

  };
});
