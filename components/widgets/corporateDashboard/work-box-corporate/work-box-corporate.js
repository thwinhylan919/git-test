define([
  "ojL10n!resources/nls/maker-work-box"
], function(ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    self.loadComponentData = rootParams.rootModel.loadComponentData;
    self.workData = rootParams;
    self.totalCount = 0;
    self.resource = ResourceBundle;

    self.workData.workCount.forEach(function(v) {
      self.totalCount = self.totalCount + parseInt(v.count);
    });
  };
});
