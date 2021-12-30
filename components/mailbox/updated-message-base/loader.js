define(["baseModel"], function(BaseModel) {
    "use strict";

    const baseModel = BaseModel.getInstance();

    return baseModel.wrappedComponent("message-base", "mailbox");
});