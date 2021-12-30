    define(["module", "text!./transaction-reports.html", "./transaction-reports", "text!./transaction-reports.css", "baseModel", "text!./transaction-reports.json"], function (module, template, viewModel, css, BaseModel) {
      "use strict";

      const baseModel = BaseModel.getInstance();

      return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
      };
    });