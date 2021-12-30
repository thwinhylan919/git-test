define(["module", "text!./rd-nominee-list.html",
    "./rd-nominee-list",
    "text!./rd-nominee-list.css", "baseModel"
  ],
  function(module, template, viewModel, css, BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return {
      viewModel: viewModel,
      template: baseModel.transformTemplate(template, css, baseModel.getComponentName(module))
    };
  });