define(["module", "text!./offline-notification.html", "./offline-notification",
  "text!./offline-notification.css", "baseModel"
], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});