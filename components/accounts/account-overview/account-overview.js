define([], function() {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.accountInfo = rootParams.rootModel.accountDetails();
        self.type = rootParams.rootModel.accountType;
        self.resource = rootParams.rootModel.nls;
    };
});