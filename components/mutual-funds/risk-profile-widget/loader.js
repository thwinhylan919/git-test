    define(["module", "text!./risk-profile-widget.html", "./risk-profile-widget", "text!./risk-profile-widget.css", "baseModel", "text!./risk-profile-widget.json"], function (module, template, viewModel, css, BaseModel) {
      "use strict";

      const baseModel = BaseModel.getInstance();

      return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
      };
    });