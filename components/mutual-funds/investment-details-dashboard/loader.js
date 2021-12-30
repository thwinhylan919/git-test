    define(["module", "text!./investment-details-dashboard.html", "./investment-details-dashboard", "text!./investment-details-dashboard.css", "baseModel", "text!./investment-details-dashboard.json"], function (module, template, viewModel, css, BaseModel) {
      "use strict";

      const baseModel = BaseModel.getInstance();

      return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
      };
    });