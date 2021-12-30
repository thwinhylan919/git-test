define([

  "knockout",

  "./model",
  "ojL10n!resources/nls/sms-and-missed-call-banking",
  "ojs/ojswitch"
], function(ko, Model, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.header);
    self.smsBanking = ko.observable(false);
    self.missedCallBanking = ko.observable(false);

    Model.smsbankingpinRegistrationRead().then(function(data) {
      if (data.pinRegistrationDTO.missedCallEnabled)
        {self.missedCallBanking(data.pinRegistrationDTO.missedCallEnabled);}

      if (data.pinRegistrationDTO.smsBankingEnabled)
        {self.smsBanking(data.pinRegistrationDTO.smsBankingEnabled);}
    });

    rootParams.baseModel.registerComponent("set-sms-banking-pin", "security");

    self.missedCallBanking.subscribe(function(newValue) {
      let payload = {
        missedCallEnabled: newValue
      };

      payload = ko.mapping.toJSON(payload);
      Model.missedCallBankingAndSMSBanking(payload);
    });

    self.smsBanking.subscribe(function(newValue) {
      let payload = {
        smsBankingEnabled: newValue
      };

      payload = ko.mapping.toJSON(payload);
      Model.missedCallBankingAndSMSBanking(payload);
    });
  };
});