define([], function() {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.cardData = rootParams.data;
    self.clickHandler = rootParams.data.clickHandler;
  };
});