define([
  "knockout",
  "jquery",
  "ojL10n!resources/nls/confirm-pin",
  "ojs/ojbutton"
], function (ko, $, ResourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.confirmPin);
    self.isLengthProper = ko.observable(false);

    $("#confirmPin").ready(function () {
      $("#confirmPin").attr("type", "tel");
    });

    self.cancelClickHandler = function () {
      rootParams.rootModel.params.genericViewModel.resetLayout();
    };

    let re;

    self.confirmPinProceed = function (event) {
      if (event.detail.value.length === self.params.maxlength()) {
        if (self.params.maxlength() === 6) {
          re = new RegExp("^([0-9]{6})$");
        } else {
          re = new RegExp("^([0-9]{4})$");
        }

        if (re.test(event.detail.value)) {
          self.isLengthProper(true);

          if (self.params.setPin() === event.detail.value) {
            self.params.enrollUser(self.params.JWTToken);
          } else {
            rootParams.baseModel.showMessages(null, [self.resource.pinDidntMatch], "ERROR");
            $(".set-pin-input").find("input").val("");
          }
        }
      }
    };
  };
});