define([
    "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/mailbox",
  "ojs/ojtoolbar",
  "ojs/ojknockout",
  "ojs/ojnavigationlist"
], function(ko, $, MessageDetailModel, resourceBundle) {
  "use strict";

  return function(params) {
    ko.utils.extend(self, params.rootModel);
    self.nls = resourceBundle;
    self.messageBody = ko.observable(params.data.messageDetails().messageBody);
    self.subject = ko.observable(params.data.messageDetails().subject);
    self.date = ko.observable(params.data.messageDetails().creationDate);
    self.toShow = ko.observable(false);
    self.mappedAlertList = ko.observableArray();
    self.deletePayload = ko.observableArray();
    params.baseModel.registerElement("action-header");

    self.confirmDelete = function() {
      $("#deleteAlert").trigger("openModal");
    };

    self.closeModal = function() {
      $("#deleteAlert").hide();
    };

    self.loadAction = function(homeComponent,homeModule, args) {
      const obj = JSON.parse( decodeURIComponent(args));

      params.baseModel.registerComponent(homeComponent,homeModule);
      params.dashboard.loadComponent(homeComponent,obj);
    };

    self.back = function() {
      self.alertMessageListLoaded(true);
      self.showDetailedMessage(false);
      self.refreshAlerts();
    };

    self.submit = function() {
      self.toShow(false);
      $("#deleteAlert").hide();

      self.deletePayload = {
        messageId: {
          displayValue: "",
          value: ""
        }
      };

      self.deletePayload.messageId.displayValue = params.data.messageDetails().messageId.displayValue;
      self.deletePayload.messageId.value = params.data.messageDetails().messageId.value;
      self.messageUserMapping = ko.observableArray();

      const statusObject = {
        status: "PD"
      };

      self.messageUserMapping.push(statusObject);
      self.deletePayload.messageUserMappings = self.messageUserMapping();

      const payloadData = ko.toJSON(self.deletePayload);

      self.batchDetailRequestList.push({
        methodType: "PUT",
        uri: {
          value: "/mailbox/alerts/{alertId}",
          params: {
            alertId: self.deletePayload.messageId.value
          }
        },
        payload: payloadData,
        headers: {
          "Content-Id": 0,
          "Content-Type": "application/json"
        }
      });

      MessageDetailModel.fireBatch({
        batchDetailRequestList: self.batchDetailRequestList()
      }).done(function() {
        self.showHeaderMenu(false);
        self.refreshAlerts();
        self.mappedAlertList([]);
        self.showDetailedMessage(false);
      });
    };
  };
});