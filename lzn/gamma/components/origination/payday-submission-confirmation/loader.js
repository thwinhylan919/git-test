define(["module", "text!./payday-submission-confirmation.html", "./payday-submission-confirmation", "text!./payday-submission-confirmation.css", "baseModel"],
  function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });