define(["module", "text!./capital-gain-reports.html", "./capital-gain-reports", "text!./capital-gain-reports.css", "baseModel", "text!./capital-gain-reports.json"], function (module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});

