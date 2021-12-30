define([
  "knockout",
  "jquery",
  "ojL10n!resources/nls/confirm-pattern"
], function (ko, $, ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.confirmPattern);
    self.disableConfirmButton = ko.observable(true);
    self.confirmPattern = ko.observable();

    let lockConfirm;

    self.appendPatternLockforConfirmPin = function () {
      const confirmPinOnDraw = function (pattern) {
        self.confirmPattern(pattern);

        if (self.params.setPattern() !== self.confirmPattern()) {
          $("#confirm-pattern-slider [class*=patt-lines]").addClass("confirm-pattern-fail");

          setTimeout(function () {
            lockConfirm.reset();
          }, 500);

          self.disableConfirmButton(true);
        } else {
          $("#confirm-pattern-slider [class*=patt-lines]").addClass("confirm-pattern-success");
          self.disableConfirmButton(false);
        }
      };

      require(["thirdPartyLibs/patternLock/patternLock", "css!thirdPartyLibs/patternLock/patternLock"], function (PatternLock) {
        lockConfirm = new PatternLock("#patternContainerConfirm", {
          radius: 20,
          onDraw: confirmPinOnDraw,
          patternVisible: true
        });
      });
    };

    self.appendPatternLockforConfirmPin();

    self.cancelClickHandler = function () {
      rootParams.rootModel.params.genericViewModel.resetLayout();
    };

    self.proceedForConfirmPattern = function () {
      if (self.params.setPattern() === self.confirmPattern()) {
        self.params.enrollUser(self.params.JWTToken);
      } else {
        self.params.baseModel.showMessages(null, [self.resource.patternDoesNotMatch], "ERROR");
        lockConfirm.reset();
      }
    };
  };
});