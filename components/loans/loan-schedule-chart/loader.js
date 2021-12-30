define(["module", "text!./loan-schedule-chart.html", "./loan-schedule-chart", "text!./loan-schedule-chart.css", "baseModel"], function (module, template, viewModel, css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});