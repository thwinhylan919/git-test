define([
  "ojs/ojcore"
], function(oj) {
  "use strict";

  return function(params) {
    const self = this,
      myDate = new Date(params.date);

    self.day = ("0" + myDate.getDate()).slice(-2);
    self.month = oj.LocaleData.getMonthNames("abbreviated")[myDate.getMonth()];
    self.year = myDate.getFullYear();
  };
});
