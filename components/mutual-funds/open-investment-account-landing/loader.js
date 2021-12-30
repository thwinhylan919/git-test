    define(["module", "text!./open-investment-account-landing.html", "./open-investment-account-landing", "text!./open-investment-account-landing.css", "baseModel", "text!./open-investment-account-landing.json"], function (module, template, viewModel, css, BaseModel) {
      "use strict";

      const baseModel = BaseModel.getInstance();

      return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
      };
    });