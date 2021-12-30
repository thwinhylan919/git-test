define(["module", "text!./action-widget.html", "./action-widget",
  "text!./action-widget.css", "baseModel"
], function (module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});