define(["module","text!./security-code-verification.html", "./security-code-verification", "text!./security-code-verification.css","baseModel"], function(module,template,viewModel,css,BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});