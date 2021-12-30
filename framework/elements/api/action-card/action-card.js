define([
  "framework/js/constants/constants"
], function(constants) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.cardData = rootParams.data;
    self.actionCardClick = rootParams.clickHandler;
    self.module = constants.module;
  };
});
