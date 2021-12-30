define(["module","text!./review-bill-payment.html", "./review-bill-payment", "text!./review-bill-payment.css", "baseModel","text!./review-bill-payment.json"], function(module, template, viewModel,css, BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return {
    viewModel: viewModel,
    template:  baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
  };
});