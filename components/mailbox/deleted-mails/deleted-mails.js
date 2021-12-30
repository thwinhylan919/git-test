define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/mailbox",
  "ojs/ojtoolbar",
  "ojs/ojnavigationlist",
  "ojs/ojtable",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojarraytabledatasource"
], function(oj, ko, $, DeletedMailsModel, resourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.nls = resourceBundle;
    self.deletedMailsListLoaded = ko.observable(false);
    self.mappingDatasource = new oj.ArrayTableDataSource([]);
    self.messages = ko.observableArray();
    self.referenceNoPresent = ko.observable(false);
    self.s = ko.observable();
    self.deletedMailsList = ko.observableArray([]);
    self.deletePayload = ko.observableArray();
    self.restorePayload = ko.observableArray();
    self.mappedDeletedMails = ko.observableArray();
    self.isSentMails = ko.observable(false);
    params.baseModel.registerElement("modal-window");
    params.baseModel.registerElement("action-header");
    params.baseModel.registerElement("confirm-screen");
    self.moreThanOnePartyExist(false);
    self.selectMailAllowed(true);

    let deletedMailsListMap;

    self.mappingDatasource = new oj.ArrayTableDataSource([], {
      idAttribute: "mailid"
    });

    self.renderCheckBox = function(context) {
      const checkBox = $(document.createElement("input")),
        label = $(document.createElement("label"));

      checkBox.attr("type", "checkbox");
      checkBox.attr("value", context.row.messageId.value);
      checkBox.attr("name", "selection");
      label.attr("class", "oj-checkbox-label hide-label");
      checkBox.attr("id", context.row.messageId.value + "_labelID");
      label.attr("for", context.row.messageId.value + "_labelID");
      label.text(self.nls.mailbox.headers.notification);
      $(context.cellContext.parentElement).append(checkBox);
      $(context.cellContext.parentElement).append(label);
      $("#headerbox_labelID").prop("checked", false);
      self.toShow(false);
    };

    self.renderHeadCheckBox = function(context) {
      const checkBox = $(document.createElement("input")),
        label = $(document.createElement("label"));

        if (self.deletedMailsList().length <= 0) {
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

    self.refreshMails = function() {
      DeletedMailsModel.fetchAllDeletedMails().done(function(data) {
        self.deletedMailsList(self.formatMailsForCustomerID(data.mails, "F", true));
        deletedMailsListMap = self.deletedMailsList();

        deletedMailsListMap = $.map(self.deletedMailsList(), function(mail) {
          mail.mailid = mail.messageId.value;

          return mail;
        });

        if (((self.deletedMailsList().length > 0) && $("#headerbox_labelID").attr("disabled")) || ((self.deletedMailsList().length > 0) && $("#headerbox_labelID").attr("disabled"))) {
          $("#headerbox_labelID").removeAttr("disabled");
        }

        if (((self.deletedMailsList().length <= 0) && $("#headerbox_labelID").attr("enabled")) || ((self.deletedMailsList().length <= 0 && $("#headerbox_labelID").attr("enabled")))) {
          $("#headerbox_labelID").attr("disabled", "disabled");
        }

        self.mappingDatasource.reset(deletedMailsListMap || [], {
          idAttribute: "mailid"
        });

        self.arrayDataSource = new oj.PagingTableDataSource(self.mappingDatasource);
        self.deletedMailsListLoaded(false);
        self.deletedMailsListLoaded(true);
        $("#headerbox_labelID").prop("checked", false);
      });
    };

    self.showModalWindow = function() {
      self.messages($("input[name=selection]:checked").map(function() {
        return this.value;
      }).get());

      if (self.messages()) {
        if (self.messages().length >= 2) {
          self.s("s");
        } else {
          self.s("");
        }

        $("#deleteDeletedMailsConfirmation").trigger("openModal");
      }
    };

    self.closeModal = function() {
      $("#deleteDeletedMailsConfirmation").hide();
    };

    self.submit = function() {
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
            status: "PD",
            deleteStatus: true
          };

          self.messageUserMapping.push(statusObject);
          self.deletePayload.messageUserMappings = self.messageUserMapping();
        }

        const payload = ko.toJSON(self.deletePayload);

        self.mappedDeletedMails.push({
          methodType: "PUT",
          uri: {
            value: "/mailbox/mails/{mailId}",
            params: {
              mailId: self.deletePayload.messageId.value
            }
          },
          payload: payload,
          headers: {
            "Content-Id": i,
            "Content-Type": "application/json"
          }
        });
      }

      DeletedMailsModel.fireBatch({
        batchDetailRequestList: self.mappedDeletedMails()
      }).done(function() {
        ko.tasks.runEarly();
        self.refreshMails();
        self.toShow(false);
        $("#deleteDeletedMailsConfirmation").hide();
        self.mappedDeletedMails([]);
      });
    };

    self.onMessageRowClicked = function(data) {
      if (self.selectMailAllowed()) {
        self.selectMailAllowed(false);
        self.messageDetails(data);
        self.attachments([]);

        const numberOfAttachments = data.contentDTO.length;
        let retrieved = 0;

        if (numberOfAttachments > 0) {
          for (let i = 0; i < numberOfAttachments; i++) {
            DeletedMailsModel.retrieveAttachment(data.contentDTO[i].contentId.value).done(function(data) {
              if (self.attachments().length < numberOfAttachments && data.contentDTOList[0].contentId.value) {
                self.attachments.push(data.contentDTOList[0]);
              }
            }).always(function() {
              if (++retrieved === numberOfAttachments) {
                self.showDetailedMessage(true);
                self.selectMailAllowed(true);
              }
            });
          }
        } else {
          self.showDetailedMessage(true);
          self.selectMailAllowed(true);
        }
      }
    };

    self.restoreMails = function() {
      self.messages($("input[name=selection]:checked").map(function() {
        return this.value;
      }).get());

      for (let i = 0; i < self.messages().length; i++) {
        self.restorePayload = {
          messageId: {
            displayValue: "",
            value: ""
          }
        };

        self.messageUserMapping = ko.observableArray();

        if (self.messages() !== undefined) {
          self.restorePayload.messageId.displayValue = self.messages()[i];
          self.restorePayload.messageId.value = self.messages()[i];

          let statusData;

          for (let t = 0; t < self.deletedMailsList().length; t++) {
            for (let m = 0; m < self.deletedMailsList()[t].messageUserMappings.length; m++) {
              if (self.messages()[i] === self.deletedMailsList()[t].mailid && self.deletedMailsList()[t].messageUserMappings[m].deleteStatus === true &&
                self.deletedMailsList()[t].messageUserMappings[m].userId === params.dashboard.userData.userProfile.userName) {
                statusData = self.deletedMailsList()[t].messageUserMappings[m].status;
              }
            }
          }

          const statusObject = {
            status: statusData,
            deleteStatus: false
          };

          self.messageUserMapping.push(statusObject);
          self.restorePayload.messageUserMappings = self.messageUserMapping();
        }

        const payload = ko.toJSON(self.restorePayload);

        self.mappedDeletedMails.push({
          methodType: "PUT",
          uri: {
            value: "/mailbox/mails/{mailId}",
            params: {
              mailId: self.restorePayload.messageId.value
            }
          },
          payload: payload,
          headers: {
            "Content-Id": i,
            "Content-Type": "application/json"
          }
        });
      }

      DeletedMailsModel.fireBatch({
        batchDetailRequestList: self.mappedDeletedMails()
      }).done(function() {
        ko.tasks.runEarly();
        self.refreshMails();
        self.toShow(false);
        self.mappedDeletedMails([]);
      });
    };

    DeletedMailsModel.fetchAllDeletedMails().done(function(data) {
      self.deletedMailsList(self.formatMailsForCustomerID(data.mails, "F", true));

      if (self.deletedMailsList() && self.deletedMailsList()[0] && self.deletedMailsList()[0].interactionId) {
        self.referenceNoPresent(true);
      }

      deletedMailsListMap = self.deletedMailsList();

      deletedMailsListMap = $.map(self.deletedMailsList(), function(mail) {
        mail.mailid = mail.messageId.value;

        return mail;
      });

      self.mappingDatasource.reset(deletedMailsListMap || [], {
        idAttribute: "mailid"
      });

      self.arrayDataSource = new oj.PagingTableDataSource(self.mappingDatasource);
      self.deletedMailsListLoaded(true);
    });
  };
});