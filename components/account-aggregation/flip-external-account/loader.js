define(["module", "text!./flip-external-account.html", "./flip-external-account",
  "text!./flip-external-account.css", "baseModel"
], function (module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});