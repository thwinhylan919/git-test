define(["module", "text!./virtual-keyboard.html", "./virtual-keyboard",
  "text!./virtual-keyboard.css", "baseModel"
], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});