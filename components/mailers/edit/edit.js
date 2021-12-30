define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/edit-mailer",
  "ojs/ojvalidation",
  "ojs/ojknockout-validation",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset",
  "ojs/ojradioset",
  "ojs/ojtreeview"
], function(oj, ko, EditMailerModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this,
      getNewKoModel = function() {
        const KoModel = ko.mapping.fromJS(EditMailerModel.getNewModel());

        return KoModel;
      };
    let i;

    ko.utils.extend(self, rootParams.rootModel.params);
    self.validationTracker = ko.observable();
    self.nls = resourceBundle;
    rootParams.baseModel.registerElement("text-editor");
    rootParams.baseModel.registerComponent("message-template-maintenance", "mailers");
    self.manualEnteredUsers = rootParams.rootModel.manualEnteredUsers || ko.observable();
    self.manualEnteredParties = rootParams.rootModel.manualEnteredParties || ko.observable();
    self.showUserInput = rootParams.rootModel.showUserInput || ko.observable(false);
    self.showPartyInput = rootParams.rootModel.showPartyInput || ko.observable(false);
    self.mailersPayload = ko.observable();
    self.mailersPayload(getNewKoModel().mailersModel);

    if (self.approverFlag === undefined) {
      self.mailerDetails = rootParams.rootModel.params.file;
    }

    self.description = ko.observable(self.mailerDetails.description);
    self.code = ko.observable(self.mailerDetails.code);
    self.activationDate = ko.observable(self.mailerDetails.activationDate);
    self.expiryDate = ko.observable(self.mailerDetails.expiryDate);
    self.triggerType = ko.observable(self.mailerDetails.triggerType);
    self.emailSubject = ko.observable(self.mailerDetails.subject);
    self.emailContent = ko.observable(self.mailerDetails.messageBody);
    self.validateEmail = ko.observable();
    self.laterSelected = self.mailerDetails.triggerType === "MANUAL" ? ko.observable(true) : ko.observable(false);
    self.priority = ko.observable(self.mailerDetails.priority);
    rootParams.dashboard.headerName(self.nls.headers.heading);
    rootParams.baseModel.registerComponent("review-mailer-edit", "mailers");
    self.showUserClose = rootParams.rootModel.showUserClose || ko.observable(true);
    self.showPartyClose = rootParams.rootModel.showPartyClose || ko.observable(true);
    self.todayDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));

    if (rootParams.rootModel.params.sendHour) {
      self.sendHour = [rootParams.rootModel.params.sendHour.toString()];
    } else {
      self.sendHour = rootParams.rootModel.sendHour;
    }

    if (rootParams.rootModel.params.sendMinute) {
      self.sendMinute = [rootParams.rootModel.params.sendMinute.toString()];
    } else {
      self.sendMinute = rootParams.rootModel.sendMinute;
    }

    self.partyList = ko.observableArray();
    self.userLists = ko.observableArray();
    self.selectedUsers = ko.observableArray();
    self.selectedParties = ko.observableArray();
    self.hours = ko.observableArray();
    self.minutes = ko.observableArray();

    self.retailTypes = [{
        value: "segment",
        text: self.nls.fieldname.segment
      },
      {
        value: "nonSegment",
        text: self.nls.fieldname.nonSegment
      }
    ];

    self.showAddUserComponent = function() {
      self.showUserInput(true);
    };

    self.showPartyAddComponent = function() {
      self.showPartyInput(true);
    };

    self.f1 = function(observableArray, value, checked) {
      if (checked) {
        if (observableArray.indexOf(value) === -1) {
          observableArray.push(value);
        }
      } else {
        observableArray.remove(value);
      }
    };

    self.recipientsChangeHandler = function(event) {
      const value = event.target.defaultValue,
        checked = event.target.checked;

      if (value === "retailuser") {
        self.f1(self.selectedRecipients, value, checked);

        for (let i = 0; i < self.retailTypes.length; i++) {
          self.f1(self.selectedRecipientsType, self.retailTypes[i].value, checked);
        }

        for (let i = 0; i < self.segmentList().length; i++) {
          self.f1(self.selectedSegmentRecipientsList, self.segmentList()[i].id, checked);
        }
      }
    };

    self.segmentRecipientsChangeHandler = function(event) {
      const value = event.target.defaultValue,
        checked = event.target.checked;

      self.f1(self.selectedRecipientsType, value, checked);

      if (value === "segment") {
        for (let i = 0; i < self.segmentList().length; i++) {
          self.f1(self.selectedSegmentRecipientsList, self.segmentList()[i].id, checked);
        }
      }

      if (self.selectedRecipientsType().length === self.retailTypes.length) {
        self.f1(self.selectedRecipients, "retailuser", true);
      } else {
        self.f1(self.selectedRecipients, "retailuser", false);
      }
    };

    self.segmentChangeHandler = function(event) {
      const value = event.target.defaultValue,
        checked = event.target.checked;

      self.f1(self.selectedSegmentRecipientsList, value, checked);

      if (self.selectedSegmentRecipientsList().length === self.segmentList().length) {
        self.f1(self.selectedRecipientsType, "segment", true);
      } else {
        self.f1(self.selectedRecipientsType, "segment", false);
      }

      if (self.selectedRecipientsType().length === self.retailTypes.length) {
        self.f1(self.selectedRecipients, "retailuser", true);
      } else {
        self.f1(self.selectedRecipients, "retailuser", false);
      }
    };

    for (i = 0; i < self.mailerDetails.recipients.length; i++) {
      if (self.mailerDetails.recipients[i].type === "USER") {
        if (!rootParams.rootModel.manualEnteredUsers) {
          self.manualEnteredUsers(self.manualEnteredUsers() ? self.manualEnteredUsers() +","+self.mailerDetails.recipients[i].value:self.mailerDetails.recipients[i].value);
        }

        self.showUserInput(true);
      }

      if (self.mailerDetails.recipients[i].type === "PARTY") {
        if (!rootParams.rootModel.manualEnteredParties) {
          self.manualEnteredParties(self.manualEnteredParties() ? self.manualEnteredParties() +","+self.mailerDetails.recipients[i].value: self.mailerDetails.recipients[i].value);
        }

        self.showPartyInput(true);
      }
    }

    for (i = 1; i < 25; i++) {
      self.hours.push(i);
    }

    for (let j = 0; j < 60; j++) {
      self.minutes.push(i);
    }

    self.changehandler = function(event) {
      if (event.detail.value) {
        if (event.detail.value === "MANUAL") {
          self.laterSelected(true);
        } else {
          self.laterSelected(false);
        }
      }
    };

    self.showUserCloseInput = function() {
      self.showUserInput(false);
    };

    self.showPartyCloseInput = function() {
      self.showPartyInput(false);
    };

    const manualEnteredUsersSubscription = self.manualEnteredUsers.subscribe(function() {
        if (self.manualEnteredUsers() === undefined || self.manualEnteredUsers() === "") {
          self.showUserClose(true);
        } else {
          self.showUserClose(false);
        }
      }),
      manualEnteredPartiesSubscription = self.manualEnteredParties.subscribe(function() {
        if (self.manualEnteredParties() === undefined || self.manualEnteredParties() === "") {
          self.showPartyClose(true);
        } else {
          self.showPartyClose(false);
        }
      });

    self.updateMailer = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      for (let j = 0; j < self.selectedRecipients().length; j++) {
        if (!self.selectedRecipients()[j]) {
          self.selectedRecipients().splice(j, 1);
        }
      }

      if (self.selectedRecipients().length === 0 && !self.manualEnteredParties() && !self.manualEnteredUsers()) {
        rootParams.baseModel.showMessages(null, [self.nls.errorMsg.noRecipient], "INFO");

        return;
      }

      self.mailersPayload().messageType = "B";
      self.mailersPayload().subject = self.emailSubject();
      self.mailersPayload().messageBody = self.emailContent();
      self.mailersPayload().activationDate = self.activationDate();
      self.mailersPayload().expiryDate = self.expiryDate();
      self.mailersPayload().description = self.description();
      self.mailersPayload().code = self.code();
      self.mailersPayload().priority = self.priority();
      self.mailersPayload().triggerType = self.triggerType();
      self.mailersPayload().messageId = self.mailerDetails.messageId;
      self.mailersPayload().version = self.version;

      if (self.manualEnteredUsers() && self.manualEnteredUsers().length > 0) {
        if (self.manualEnteredUsers().indexOf(",") !== -1) {
          self.selectedUsers(self.manualEnteredUsers().split(","));
        } else {
          self.selectedUsers().push(self.manualEnteredUsers());
        }
      }

      if (self.manualEnteredParties() && self.manualEnteredParties().length > 0) {
        if (self.manualEnteredParties().indexOf(",") !== -1) {
          self.selectedParties(self.manualEnteredParties().split(","));
        } else {
          self.selectedParties().push(self.manualEnteredParties());
        }
      }

      for (let i = 0; i < self.selectedRecipients().length; i++) {
        if (self.selectedRecipients()[i].toLowerCase() === "corporateuser" || self.selectedRecipients()[i].toLowerCase() === "retailuser" || self.selectedRecipients()[i].toLowerCase() === "administrator") {
          self.mailersPayload().recipients().push({
            type: "ROLE",
            value: self.selectedRecipients()[i]
          });
        }
      }

      if (self.selectedRecipients().indexOf("retailuser") === -1) {
        for (let i = 0; i < self.selectedSegmentRecipientsList().length; i++) {
          self.mailersPayload().recipients().push({
            type: "SEGMENT",
            value: self.selectedSegmentRecipientsList()[i]
          });
        }

        for (let j = 0; j < self.selectedRecipientsType().length; j++) {
          if (self.selectedRecipientsType()[j] === "nonSegment") {
            self.mailersPayload().recipients().push({
              type: "NON_SEGMENT",
              value: "NON_SEGMENT"
            });
          }
        }
      }

      if (self.selectedUsers().length > 1) {
        ko.utils.arrayForEach(self.selectedUsers(), function(item) {
          if (item !== "") {
            self.mailersPayload().recipients().push({
              type: "USER",
              value: item
            });
          }
        });
      } else if (self.selectedUsers().length === 1) {
        self.mailersPayload().recipients().push({
          type: "USER",
          value: self.selectedUsers()[0]
        });
      }

      if (self.selectedParties().length > 1) {
        ko.utils.arrayForEach(self.selectedParties(), function(item) {
          if (item !== "") {
            self.mailersPayload().recipients().push({
              type: "PARTY",
              value: item
            });
          }
        });
      } else if (self.selectedParties().length === 1) {
        self.mailersPayload().recipients().push({
          type: "PARTY",
          value: self.selectedParties()[0]
        });
      }

      rootParams.dashboard.loadComponent("review-mailer-edit", {
        data: self.mailersPayload(),
        sendHour: self.sendHour,
        sendMinute: self.sendMinute,
        segmentList : self.segmentList,
        recipientsListLoaded : self.recipientsListLoaded,
        recipientsList : self.recipientsList,
        retailTypes : self.retailTypes,
        isSegmentListLoaded : self.isSegmentListLoaded,
        userRecipientsList : self.userRecipientsList,
        selectedRecipients : self.selectedRecipients,
        selectedRecipientsType : self.selectedRecipientsType,
        selectedSegmentRecipientsList : self.selectedSegmentRecipientsList
      });
    };

    self.dispose = function() {
      manualEnteredPartiesSubscription.dispose();
      manualEnteredUsersSubscription.dispose();
    };
  };
});
