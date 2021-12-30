define([
    "knockout"
], function(ko) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.workData = rootParams;
        self.totalCount = 0;

        self.workData.workCount.forEach(function(v) {
            self.totalCount = self.totalCount + parseInt(v.count);
        });
    };
});