define(["baseModel"], function(BaseModel) {
  "use strict";

  const baseModel = BaseModel.getInstance();

  return baseModel.wrappedComponent("account-transactions", "accounts",{type: "CSA"});
});
