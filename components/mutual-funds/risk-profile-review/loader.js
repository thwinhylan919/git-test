    define(["module", "text!./risk-profile-review.html", "./risk-profile-review", "text!./risk-profile-review.css", "baseModel", "text!./risk-profile-review.json"], function(module, template, viewModel, css, BaseModel) {
      "use strict";

      const baseModel = BaseModel.getInstance();

      return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
      };
    });