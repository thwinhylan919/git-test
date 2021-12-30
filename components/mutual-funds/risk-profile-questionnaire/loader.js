define(["module", "text!./risk-profile-questionnaire.html", "./risk-profile-questionnaire", "text!./risk-profile-questionnaire.css", "baseModel", "text!./risk-profile-questionnaire.json"], function(module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});