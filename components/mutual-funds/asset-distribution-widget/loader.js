    define(["module", "text!./asset-distribution-widget.html", "./asset-distribution-widget", "text!./asset-distribution-widget.css", "baseModel", "text!./asset-distribution-widget.json"], function (module, template, viewModel, css, BaseModel) {
      "use strict";

      const baseModel = BaseModel.getInstance();

      return {
        viewModel: viewModel,
        template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
      };
    });