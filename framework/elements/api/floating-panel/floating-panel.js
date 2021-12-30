define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojs/ojanimation"
], function(oj, ko, $) {
  "use strict";

  const vm = function(rootParams) {
      const self = this;

      ko.utils.extend(self, rootParams.rootModel);
      self.panelId = rootParams.panelId;

      if (!self.panelId) {
          throw new Error();
      }

      const slideInOptions = $.extend(self.slideInOptions, {
              direction: "top"
          }),
          slideOutOptions = $.extend(self.slideOutOptions, {
              direction: "bottom"
          });

      self.openFloatingPanel = function() {
          $("#" + self.panelId + "_parent").fadeIn();
          oj.AnimationUtils.slideIn(document.getElementById(self.panelId), slideInOptions);

          if (self.rippleElement) {
              oj.AnimationUtils.ripple(document.getElementById(self.rippleElement), self.rippleOptions);
          }
      };

      self.closeFloatingPanel = function() {
          $("#" + self.panelId + "_parent").fadeOut();
          oj.AnimationUtils.slideOut(document.getElementById(self.panelId), slideOutOptions);
      };

      self.floatingPanelParentClick = function(event) {
          if (event.target.getAttribute("type") === "overlayParent") {
              document.getElementById(self.panelId).dispatchEvent(new CustomEvent("closeFloatingPanel"));
          }
      };

      self.renderComplete = function() {
          document.getElementById(self.panelId).addEventListener("openFloatingPanel", self.openFloatingPanel);
          document.getElementById(self.panelId).addEventListener("closeFloatingPanel", self.closeFloatingPanel);
          document.getElementById(self.panelId + "_parent").addEventListener("click", self.floatingPanelParentClick);
          window.addEventListener("popstate", self.closeFloatingPanel);
      };
  };

  vm.prototype.dispose = function() {
      document.getElementById(this.panelId).removeEventListener("openFloatingPanel", this.openFloatingPanel);
      document.getElementById(this.panelId).removeEventListener("closeFloatingPanel", this.closeFloatingPanel);
      document.getElementById(this.panelId + "_parent").removeEventListener("click", this.floatingPanelParentClick);
      window.removeEventListener("popstate", self.closeFloatingPanel);
  };

  return vm;
});