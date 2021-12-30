define(["module", "text!./external-accounts-net-worth-graph.html", "./external-accounts-net-worth-graph", "text!./external-accounts-net-worth-graph.css","baseModel"], function (module, template, viewModel,css,BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css,baseModel.getComponentName(module))
    };
  });
