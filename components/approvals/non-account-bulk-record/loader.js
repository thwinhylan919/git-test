define(["module", "text!./non-account-bulk-record.html", "./non-account-bulk-record", "text!./non-account-bulk-record.css", "baseModel"], function (module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});