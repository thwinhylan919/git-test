define(["module","text!./user-login-configuration-header.html", "./user-login-configuration-header", "text!./user-login-configuration-header.css", "baseModel"], function(module,template,viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });