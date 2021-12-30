define([], function() {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.actionCardClick = rootParams.clickHandler;
    self.cardData = rootParams.data;
  };
});