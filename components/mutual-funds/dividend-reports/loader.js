    define(["module", "text!./dividend-reports.html", "./dividend-reports", "text!./dividend-reports.css", "baseModel", "text!./dividend-reports.json"], function (module, template, viewModel, css, BaseModel) {
      "use strict";

      const baseModel = BaseModel.getInstance();

      return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
      };
    });

