    define(["module", "text!./recommended-allocation-widget.html", "./recommended-allocation-widget", "text!./recommended-allocation-widget.css", "baseModel", "text!./recommended-allocation-widget.json"], function (module, template, viewModel, css, BaseModel) {
      "use strict";

      const baseModel = BaseModel.getInstance();

      return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
      };
    });