define([
  "ojs/ojcore",
  "knockout",

  "ojL10n!resources/nls/bills-reports",
  "ojs/ojinputtext"
], function(oj, ko, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;

    const date = rootParams.baseModel.getDate();

    date.setDate(date.getDate() + 1);
    self.tomorrowDate = oj.IntlConverterUtils.dateToLocalIso(date);
  };
});