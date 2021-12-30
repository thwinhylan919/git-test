define(["text!./financial-summary.html", "./financial-summary", "text!./financial-summary.css","baseModel"], function (template, viewModel,css,BaseModel) {
    "use strict";

    return {
      viewModel: viewModel,
      template: BaseModel.getInstance().transformTemplate(template,css,"financial-summary")
    };
  });
