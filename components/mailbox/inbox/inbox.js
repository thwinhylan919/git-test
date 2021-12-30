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
  "ojs/ojarraytabledatasource",
  "ojs/ojknockout"
], function (oj, ko, $, InboxModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.nls = resourceBundle;
    self.MailsListLoaded = ko.observable(false);
    self.messages = ko.observableArray();
    self.s = ko.observable();
    self.inboxMailsList = ko.observableArray([]);
    self.deletePayload = ko.observableArray();
    self.inboxMailsPayload = ko.observableArray();
    self.mappedInboxMails = ko.observableArray();
    self.referenceNoPresent = ko.observable(false);
    self.unreadmailCount = ko.observable();
    self.totalMailboxCount = ko.observable();
    self.isSentMails = ko.observable(false);
    self.moreThanOnePartyExist(false);
    self.selectMailAllowed(true);

    if (self.miniMailboxObj === undefined) { self.miniMailboxObj = ko.observable(); }

    params.baseModel.registerElement("modal-window");
    params.baseModel.registerElement("action-header");
    params.baseModel.registerElement("confirm-screen");

    let inboxMailsListMap;

    self.mappingDatasource = new oj.ArrayTableDataSource([], {
      idAttribute: "mailid"
    });

    self.closeModal = function () {
      $("#deleteInboxMailsConfirmation").hide();
    };

    function updateMailboxCount() {
      $(document).ready(function() {
        $(".badge").text(self.totalMailboxCount());
      });

      if (self.mailbox) {
        self.mailbox.unreadmailCount(self.unreadmailCount());
      }
    }

    self.getMailCount = function(){
      InboxModel.getMailCount().then(function(data) {
        self.totalMailboxCount(data.summary.items[0].unReadCount + data.summary.items[1].unReadCount + data.summary.items[2].unReadCount);
        self.unreadmailCount(data.summary.items[0].unReadCount);
        updateMailboxCount();
        self.unReadCountCall(self.unreadmailCount());
     });
    };

    self.showModalWindow = function () {
      self.messages($("input[name=selection]:checked").map(function () {
        return params.baseModel.large() ? this.value : this.offsetParent.key;
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

      $("#deleteInboxMailsConfirmation").trigger("openModal");
      self.inboxMailsPayload().messageId = self.messages();
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
          let statusData;

          self.deletePayload.messageId.displayValue = self.messages()[i];
          self.deletePayload.messageId.value = self.messages()[i];

          for (let t = 0; t < self.inboxMailsList().length; t++) {
            for (let m = 0; m < self.inboxMailsList()[t].messageUserMappings.length; m++) {
              if (self.messages()[i] === self.inboxMailsList()[t].mailid && self.inboxMailsList()[t].messageUserMappings[m].msgFlag === "T" &&
                self.inboxMailsList()[t].messageUserMappings[m].userId === params.dashboard.userData.userProfile.userName) {
                statusData = self.inboxMailsList()[t].messageUserMappings[m].status;
              }
            }
          }

          const statusObject = {
            status: statusData,
            deleteStatus: true
          };

          self.messageUserMapping.push(statusObject);
          self.deletePayload.messageUserMappings = self.messageUserMapping();
        }

        const payload = ko.toJSON(self.deletePayload);

        self.mappedInboxMails.push({
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

      InboxModel.fireBatch({
        batchDetailRequestList: self.mappedInboxMails()
      }).done(function () {
        ko.tasks.runEarly();
        self.refreshMails();
        self.getMailCount();
        self.toShow(false);
        $("#deleteInboxMailsConfirmation").hide();
        self.inboxMailsPayload([]);
        self.mappedInboxMails([]);
      });
    };

    self.renderCheckBox = function (context) {
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

    self.renderHeadCheckBox = function (context) {
      const checkBox = $(document.createElement("input")),
        label = $(document.createElement("label"));

        if (self.inboxMailsList().length <= 0) {
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

    self.refreshMails = function () {
      InboxModel.getMails().done(function (data) {
        self.inboxMailsList(self.formatMailsForCustomerID(data.mails, "F", false));

        self.getMailCount();
        inboxMailsListMap = self.inboxMailsList();

        inboxMailsListMap = $.map(self.inboxMailsList(), function (mail) {
          mail.mailid = mail.messageId.value;

          return mail;
        });

        if (((self.inboxMailsList().length > 0) && $("#headerbox_labelID").attr("disabled")) || ((self.inboxMailsList().length > 0) && $("#headerbox_labelID").attr("disabled"))) {
          $("#headerbox_labelID").removeAttr("disabled");
        }

        if (((self.inboxMailsList().length <= 0) && $("#headerbox_labelID").attr("enabled")) || ((self.inboxMailsList().length <= 0 && $("#headerbox_labelID").attr("enabled")))) {
          $("#headerbox_labelID").attr("disabled", "disabled");
        }

        self.mappingDatasource.reset(inboxMailsListMap || [], {
          idAttribute: "mailid"
        });

        self.arrayDataSource = new oj.PagingTableDataSource(self.mappingDatasource);
        self.MailsListLoaded(false);
        self.MailsListLoaded(true);
        $("#headerbox_labelID").prop("checked", false);
      });
    };

    self.onMessageRowClicked = function (data) {
      if (self.selectMailAllowed()) {
        self.selectMailAllowed(false);
        self.messageDetails(data);
        self.attachments([]);

        const numberOfAttachments = data.contentDTO.length;
        let retrieved = 0;

        if (numberOfAttachments > 0) {
          for (let i = 0; i < numberOfAttachments; i++) {
            InboxModel.retrieveAttachment(data.contentDTO[i].contentId.value).done(function (data) {
              if (self.attachments().length < numberOfAttachments && data.contentDTOList[0].contentId.value) {
                self.attachments.push(data.contentDTOList[0]);
              }
            }).always(function () {
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

    InboxModel.getMails().done(function (data) {
      self.inboxMailsList(self.formatMailsForCustomerID(data.mails, "F", false));

      if (self.inboxMailsList() && self.inboxMailsList()[0] && self.inboxMailsList()[0].interactionId) {
        self.referenceNoPresent(true);
      }

      inboxMailsListMap = self.inboxMailsList();

      inboxMailsListMap = $.map(self.inboxMailsList(), function (mail) {
        mail.mailid = mail.messageId.value;

        return mail;
      });

      self.mappingDatasource.reset(inboxMailsListMap || [], {
        idAttribute: "mailid"
      });

      self.arrayDataSource = new oj.PagingTableDataSource(self.mappingDatasource);

      if (self.miniMailboxObj()) {
        if (self.miniMailboxObj().data.messageId) {
          if (self.miniMailboxObj().tab.toUpperCase() === "MAILS") {
            let deleteItem;
            const messageId = self.miniMailboxObj().data.messageId.value;

            ko.utils.arrayForEach(self.inboxMailsList(), function (item) {
              if (messageId === item.messageId.value) {
                self.onMessageRowClicked(item);
                self.updateMailDatasource(true);

                ko.utils.arrayForEach(self.mailsArray(), function (item) {
                  if (self.miniMailboxParamsObj().data.messageId.value === item.messageId.value) {
                    deleteItem = item;
                  }
                });

                self.mailsArray.remove(deleteItem);
              }
            });

            self.MailsListLoaded(false);
            self.miniMailboxObj(undefined);
          }
        } else {
          self.MailsListLoaded(false);
          self.MailsListLoaded(true);
        }
      } else {
        self.MailsListLoaded(false);
        self.MailsListLoaded(true);
      }
    });
  };

});