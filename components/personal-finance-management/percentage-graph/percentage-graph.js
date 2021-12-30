define([
    "knockout",
  "ojs/ojgauge"
], function(ko) {
  "use strict";

  return function(Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.progressBarData = Params.data;
    self.toolTipCallBackRequired = !!self.progressBarData.toolTipCallBack;

    self.afterRender = function() {
      const labelElement = document.getElementById("progressLabel-" + self.progressBarData.uniqueId);

      for (let i = 0; i < self.progressBarData.thresholdValues.length; i++) {
        if (self.progressBarData.value <= self.progressBarData.thresholdValues[i].max) {
          if (labelElement)
            {labelElement.style.color = self.progressBarData.thresholdValues[i].color;}

          break;
        }

        if (i === self.progressBarData.thresholdValues.length - 1) {
          if (labelElement)
            {labelElement.style.color = self.progressBarData.thresholdValues[i].color;}
        }
      }
    };
  };
});