define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/mailbox",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"
], function (oj, ko, $, AlertModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.nls = resourceBundle;
    self.messageDetails = ko.observable();
    params.dashboard.headerName(self.nls.mailbox.headers.alerts);
    self.alertMessageListLoaded = ko.observable(false);
    self.messages = ko.observableArray();
    self.s = ko.observable();
    self.totalMailboxCount = ko.observable();
    self.deletePayload = ko.observableArray();
    self.deleteAlertPayload = ko.observableArray();
    self.batchDetailRequestList = ko.observableArray([]);
    self.updatePayload = ko.observableArray();
    self.mappedAlertList = ko.observableArray();
    self.toShow = ko.observable(false);
    self.showHeaderMenu = ko.observable(false);
    self.deleteEnableBatch = ko.observable(false);

    if (self.miniMailboxObj === undefined) { self.miniMailboxObj = ko.observable(); }

    self.arrayDataSource = new oj.ArrayTableDataSource([], {
      idAttribute: "alertid"
    });

    self.paginationDataSource = new oj.PagingTableDataSource(self.arrayDataSource);

    if (self.messages().length > 0) {
      self.toShow(true);
    }

    self.alertMessageList = ko.observableArray([]);
    self.showDetailedMessage = ko.observable(false);
    params.baseModel.registerComponent("alert-detail", "mailbox");
    self.messages = ko.observableArray();
    self.unreadCount = ko.observable(0);

    if (!self.unreadAlertCount) { self.unreadAlertCount = ko.observable(0); }

    let unreadcountcheck;

    self.unReadCountCall = function (count) {
      self.unreadCount(count);
    };

    function updateMailboxCount() {
      if (self.mailbox) {
        self.mailbox.unreadAlertCount(self.unreadAlertCount());
      }

      $(document).ready(function() {
        $(".badge").text(self.totalMailboxCount());
      });
    }

    function getMailBoxCount(){
      AlertModel.getMailCount().done(function(data) {
        self.totalMailboxCount(data.summary.items[0].unReadCount + data.summary.items[1].unReadCount + data.summary.items[2].unReadCount);
        self.unreadAlertCount(data.summary.items[1].unReadCount);
        updateMailboxCount();
      });
    }

    params.baseModel.registerElement("date-time");
    params.baseModel.registerElement("modal-window");

    AlertModel.fetchAlertList().done(function (data) {
      const inboxalerts = self.formatAlertForCustomerID(data.alertDTOs, "T");

      self.alertMessageList(inboxalerts);

      const searchedAlertsMap = $.map(self.alertMessageList(), function (alert) {
        alert.alertid = alert.messageId.value;

        return alert;
      });

      self.arrayDataSource.reset(searchedAlertsMap || [], {
        idAttribute: "alertid"
      });

      if (self.miniMailboxObj()) {
        if (self.miniMailboxObj().data.messageId) {
          let deleteItem;

          if (self.miniMailboxObj().tab.toUpperCase() === "ALERTS") {
            const messageId = self.miniMailboxObj().data.messageId.value;

            ko.utils.arrayForEach(self.alertMessageList(), function (item) {
              if (messageId === item.messageId.value) {
                self.onMessageRowClicked(item);
                self.params.updateAlertDatasource(true);

                ko.utils.arrayForEach(self.params.alertsArray(), function (item) {
                  if (self.miniMailboxObj().data.messageId.value === item.messageId.value) {
                    deleteItem = item;
                  }
                });

                self.params.alertsArray.remove(deleteItem);
              }
            });

            self.alertMessageListLoaded(false);
            self.miniMailboxObj(null);
          }
        } else {
          self.alertMessageListLoaded(false);
          self.alertMessageListLoaded(true);
        }
      } else {
        self.alertMessageListLoaded(false);
        self.alertMessageListLoaded(true);
      }
    });

    $(document).on("change", "#mailBoxPaging_nav_input", function () {
      $("#headerbox_labelID").prop("checked", false);
    });

    $(document).ready(function () {
      $(document).on("change", "input[name*=_selection]", function () {
        self.toShow(!!$("input[name*=_selection]:checked").length);
        $("input[name=selectionParent]").prop("checked", $("input[name*=_selection]:checked").length === $("input[name*=_selection]").length);
      });

      $(document).on("change", "input[name=selectionParent]", function () {
        $("input[name*=_selection]").prop("checked", $("input[name=selectionParent]").prop("checked"));
        self.toShow(!!$("input[name*=_selection]").length && !!$("input[name=selectionParent]").prop("checked"));
      });
    });

    self.showModalWindow = function () {
      self.messages($("input[name*=_selection]:checked").map(function () {
        return this.value;
      }).get());

      if (self.messages()) {
        if (self.messages().length >= 2) {
          self.s("s");
        } else {
          self.s("");
        }

        if (self.messages().length <= 0) {
          return false;
        }
      }

      $("#deleteAlertsConfirmation").trigger("openModal");
      self.deleteAlertPayload().messageId = self.messages();
    };

    self.closeModal = function () {
      $("#deleteAlertsConfirmation").hide();
    };

    self.renderCheckBox = function (context) {
      const checkBox = $(document.createElement("input")),
        label = $(document.createElement("label"));

      checkBox.attr("type", "checkbox");
      checkBox.attr("value", context.row.messageId.value);
      checkBox.attr("name", context.row.messageId.value + "_selection");
      label.attr("class", "oj-checkbox-label hide-label");
      checkBox.attr("id", context.row.messageId.value + "_labelID");
      label.attr("for", context.row.messageId.value + "_labelID");
      label.text(self.nls.mailbox.headers.notification);
      $(context.cellContext.parentElement).append(checkBox);
      $(context.cellContext.parentElement).append(label);
      $("#headerbox_labelID").prop("checked", false);
      self.toShow(false);
    };

    self.renderHeadCheckBox = function (context) {
      const checkBox = $(document.createElement("input")),
        label = $(document.createElement("label"));

        if (self.alertMessageList().length <= 0) {
          checkBox.attr("disabled", "disabled");
        } else {
          checkBox.attr("enabled", "enabled");
        }

      checkBox.attr("type", "checkbox");
      checkBox.attr("value", "selectAll");
      checkBox.attr("name", "selectionParent");
      checkBox.attr("id", "headerbox_labelID");
      label.attr("class", "oj-checkbox-label hide-label");
      label.attr("for", "headerbox_labelID");
      label.text(self.nls.mailbox.headers.notification);
      $(context.headerContext.parentElement.firstElementChild.firstChild).append(checkBox);
      $(context.headerContext.parentElement.firstElementChild.firstChild).append(label);
    };

    self.refreshAlerts = function () {
      AlertModel.fetchAlertList().done(function (data) {
        const inboxalerts = self.formatAlertForCustomerID(data.alertDTOs, "X");

        self.alertMessageList(inboxalerts);
        getMailBoxCount();

        const searchedAlertsMap = $.map(self.alertMessageList(), function (alert) {
          alert.alertid = alert.messageId.value;

          return alert;
        });

        if (((self.alertMessageList().length > 0) && $("#headerbox_labelID").attr("disabled")) || ((self.alertMessageList().length > 0) && $("#headerbox_labelID").attr("disabled"))) {
          $("#headerbox_labelID").removeAttr("disabled");
        }

        if (((self.alertMessageList().length <= 0) && $("#headerbox_labelID").attr("enabled")) || ((self.alertMessageList().length <= 0 && $("#headerbox_labelID").attr("enabled")))) {
          $("#headerbox_labelID").attr("disabled", "disabled");
        }

        self.arrayDataSource.reset(searchedAlertsMap || [], {
          idAttribute: "alertid"
        });

        self.alertMessageListLoaded(false);
        self.alertMessageListLoaded(true);
        $("#headerbox_labelID").prop("checked", false);
      });

      self.batchDetailRequestList([]);
    };

    self.refreshAlertsCount = function () {
      AlertModel.fetchAlertList().done(function (data) {
        const inboxalerts = self.formatAlertForCustomerID(data.alertDTOs, "X");

        getMailBoxCount();

        self.alertMessageList(inboxalerts);

        const searchedAlertsMap = $.map(self.alertMessageList(), function (alert) {
          alert.alertid = alert.messageId.value;

          return alert;
        });

        self.arrayDataSource.reset(searchedAlertsMap || [], {
          idAttribute: "alertid"
        });
      });
    };

    self.formatAlertForCustomerID = function (alerts) {
      unreadcountcheck = 0;

      for (let i = 0; i < alerts.length; i++) {
        const MessageUserMappings = alerts[i].messageUserMappings;

        for (let j = 0; j < MessageUserMappings.length; j++) {
          const messageUserMapping = MessageUserMappings[j];

          if (messageUserMapping.userId === params.dashboard.userData.userProfile.userName) {
            if (messageUserMapping.status === "U") {
              alerts[i].readStatus = true;
              unreadcountcheck++;
            } else { alerts[i].readStatus = false; }
          }
        }
      }

      self.unReadCountCall(unreadcountcheck);
      self.unreadAlertCount(unreadcountcheck);

      return alerts;
    };

    self.submit = function () {
      for (let i = 0; i < self.messages().length; i++) {
        self.deletePayload = {
          messageId: {
            displayValue: "",
            value: ""
          }
        };

        self.messageUserMapping = ko.observableArray();

        if (self.messages()) {
          self.deletePayload.messageId.displayValue = self.messages()[i];
          self.deletePayload.messageId.value = self.messages()[i];

          const statusObject = {
            status: "PD"
          };

          self.messageUserMapping.push(statusObject);
          self.deletePayload.messageUserMappings = self.messageUserMapping();
        }

        const payload = ko.toJSON(self.deletePayload);

        self.batchDetailRequestList.push({
          methodType: "PUT",
          uri: {
            value: "/mailbox/alerts/{alertId}",
            params: {
              alertId: self.deletePayload.messageId.value
            }
          },
          payload: payload,
          headers: {
            "Content-Id": i,
            "Content-Type": "application/json"
          }
        });
      }

      AlertModel.fireBatch({
        batchDetailRequestList: self.batchDetailRequestList()
      }).done(function () {
        self.showHeaderMenu(false);
        self.toShow(false);
        $("#deleteAlertsConfirmation").hide();
        self.deleteAlertPayload([]);
        self.refreshAlerts();
        self.mappedAlertList([]);
      });
    };

    self.onMessageRowClicked = function (data) {
      self.messageDetails(data);
      self.showDetailedMessage(true);

      self.updatePayload = {
        messageId: {
          displayValue: "",
          value: ""
        }
      };

      self.updatePayload.messageId.displayValue = data.messageId.displayValue;
      self.updatePayload.messageId.value = data.messageId.value;
      self.messageUserMapping = ko.observableArray();

      if (self.messages()) {
        const statusObject = {
          status: "R"
        };

        self.messageUserMapping.push(statusObject);
        self.updatePayload.messageUserMappings = self.messageUserMapping();
      }

      const payload = ko.toJSON(self.updatePayload);

      self.batchDetailRequestList.push({
        methodType: "PUT",
        uri: {
          value: "/mailbox/alerts/{alertId}",
          params: {
            alertId: self.updatePayload.messageId.value
          }
        },
        payload: payload,
        headers: {
          "Content-Id": 0,
          "Content-Type": "application/json"
        }
      });

      AlertModel.fireBatch({
        batchDetailRequestList: self.batchDetailRequestList()
      }).done(function () {
        self.toShow(false);
        self.deleteAlertPayload([]);
        self.refreshAlertsCount();
        self.mappedAlertList([]);
        self.deleteEnableBatch(true);
      });

      self.alertMessageListLoaded(false);
      self.deleteEnableBatch(false);
    };
  };
});