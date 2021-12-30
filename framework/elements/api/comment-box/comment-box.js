define([
  "knockout",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/comment-box",
  "ojs/ojinputtext"
], function (ko, Constants, locale) {
  "use strict";

  return function (params) {
    const self = this;

    self.locale = locale;
    self.comment = params.comment;
    self.label = params.label;
    self.rootId = params.rootId;
    self.required = params.required;
    self.rawComment = ko.observable("");
    self.validationTracker = params.validator;

    const validator = params.baseModel.getValidator("COMMENTS");

    for (let i = 0; i < validator.length; i++) {
      if (validator[i].type === "length") {
        self.maxlength = validator[i].options.max;
      }
    }

    self.disclaimer = ko.observable(params.baseModel.format(self.locale.charactersLeft, {
      number: self.maxlength
    }));

    const subscriptions = self.rawComment.subscribe(function (newValue) {
      const availableLength = self.maxlength - newValue.length;

      if (availableLength < 0) {
        self.disclaimer("");
      } else {
        self.disclaimer(params.baseModel.format(self.locale.charactersLeft, {
          number: self.maxlength - newValue.length
        }));
      }

      if (newValue === "") {
        document.getElementById(self.rootId).value = null;
        document.getElementById(self.rootId).reset();
      }
    }, self);

    self.dispose = function () {
      subscriptions.dispose();
    };

    self.getTemplate = function () {
      if (Constants.module === "WALLET" && Constants.userSegment !== "ADMIN") {
        return "walletTemplate";
      }

      return "templateDefault";
    };
  };
});