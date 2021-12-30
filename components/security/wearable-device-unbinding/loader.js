define(["module", "text!./wearable-device-unbinding.html", "./wearable-device-unbinding", "text!./wearable-device-unbinding.css", "baseModel"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});