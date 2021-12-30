define(["baseModel"], function(BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return baseModel.wrappedComponent("statement-request", "accounts",{type: "TRD"});
});
