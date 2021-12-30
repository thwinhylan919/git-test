    define(["module", "text!./switch-order-details.html", "./switch-order-details", "text!./switch-order-details.css", "baseModel", "text!./switch-order-details.json"], function (module, template, viewModel, css, BaseModel) {
      "use strict";

      const baseModel = BaseModel.getInstance();

      return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
      };
    });