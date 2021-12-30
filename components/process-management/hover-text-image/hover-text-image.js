define([
    "ojL10n!resources/nls/hover-text-image",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup"
], function (resourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.nls = resourceBundle;
        self.textOnImage = rootParams.textOnImage;
        self.source = rootParams.source;
        self.header = rootParams.header;

    };
});