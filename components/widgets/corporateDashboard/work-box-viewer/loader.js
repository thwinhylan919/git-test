define(["baseModel"], function(BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return baseModel.wrappedComponent("work-box-maker", "widgets/corporateDashboard",{role : "viewer"});
});
