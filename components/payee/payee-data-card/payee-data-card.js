define([
    "knockout"
], function(ko) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);

        self.cardData = rootParams.data;
        self.imageSrc = ko.observable(rootParams.image);
        self.clickHandler = rootParams.data.clickHandler;
    };
});