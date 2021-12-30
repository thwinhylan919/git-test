define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "ojL10n!resources/nls/mailers",
  "ojs/ojknockout-validation",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset",
  "ojs/ojradioset",
  "ojs/ojtreeview",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojtimezonedata",
  "ojs/ojvalidationgroup"
], function(oj, ko, CreateMailersModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this,
      getNewKoModel = function() {
        return ko.mapping.fromJS(CreateMailersModel.getNewModel());
      };

    ko.utils.extend(self, rootParams.rootModel.params);
    self.validationTracker = ko.observable();
    self.nls = resourceBundle;
    rootParams.baseModel.registerElement("text-editor");
    rootParams.baseModel.registerComponent("message-template-maintenance", "mailers");
    self.todayDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));
    self.mailersPayload = ko.observable();
    self.mailersPayload(getNewKoModel().mailersModel);
    self.activationDate = rootParams.rootModel.params.activationDate;
    self.expiryDate = rootParams.rootModel.params.expiryDate || ko.observable();
    self.triggerType = rootParams.rootModel.params.triggerType || ko.observable();
    self.emailSubject = rootParams.rootModel.params.emailSubject || ko.observable();
    self.emailContent = rootParams.rootModel.params.emailContent || ko.observable();
    self.selectedRecipients = rootParams.rootModel.params.selectedRecipients || ko.observableArray([]);
    self.selectedRecipientsType = rootParams.rootModel.params.selectedRecipientsType || ko.observableArray([]);
    self.laterSelected = rootParams.rootModel.params.laterSelected || ko.observable();
    self.priority = rootParams.rootModel.params.priority;
    self.manualEnteredUsers = rootParams.rootModel.params.manualEnteredUsers || ko.observable();
    self.manualEnteredParties = rootParams.rootModel.params.manualEnteredParties || ko.observable();
    self.showUserInput = rootParams.rootModel.params.showUserInput || ko.observable(false);
    self.showPartyInput = rootParams.rootModel.params.showPartyInput || ko.observable(false);
    self.recipientsList = rootParams.rootModel.params.recipientsList || ko.observableArray();
    self.sendHour = rootParams.rootModel.params.sendHour || ko.observable();
    self.sendMinute = rootParams.rootModel.params.sendMinute || ko.observable();
    self.showPartyClose = rootParams.rootModel.params.showPartyClose || ko.observable(true);
    self.showUserClose = rootParams.rootModel.params.showUserClose || ko.observable(true);
    self.recipientsListLoaded = ko.observable(false);
    self.validateEmail = ko.observable();
    rootParams.baseModel.registerComponent("review-mailer-create", "mailers");
    self.partyList = ko.observableArray();
    self.userLists = ko.observableArray();
    self.selectedUsers = ko.observableArray();
    self.selectedParties = ko.observableArray();
    self.userSelection = ko.observable();
    self.hours = ko.observableArray();
    self.minutes = ko.observableArray();
    self.selectedTriggerType = ko.observable(true);
    self.selectedSegmentList = rootParams.rootModel.params.selectedSegmentList || ko.observableArray();
    self.isSegmentListLoaded = rootParams.rootModel.params.isSegmentListLoaded || ko.observable(false);
    self.segmentList = ko.observableArray();

    self.retailTypes = [{
        value: "segment",
        text: self.nls.fieldname.segment
      },
      {
        value: "nonSegment",
        text: self.nls.fieldname.nonSegment
      }
    ];

    rootParams.dashboard.headerName(self.nls.headers.heading);

    for (let i = 1; i < 25; i++) {
      self.hours.push(i);
    }

    for (let j = 0; j < 60; j++) {
      self.minutes.push(j);
    }

    self.showAddUserComponent = function() {
      self.showUserInput(true);
    };

    self.showPartyAddComponent = function() {
      self.showPartyInput(true);
    };

    self.showUserCloseInput = function() {
      self.showUserInput(false);
    };

    self.showPartyCloseInput = function() {
      self.showPartyInput(false);
    };

    self.goBack = function() {
      self.activationDate("");
      self.triggerType("IMMEDIATE");
      self.emailSubject("");
      self.emailContent("");
      self.selectedRecipients([]);
      self.priority("L");
      self.manualEnteredUsers("");
      self.manualEnteredParties("");
      self.showUserInput(false);
      self.showPartyInput(false);
      rootParams.dashboard.hideDetails();
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
          self.f1(self.selectedSegmentList, self.segmentList()[i].id, checked);
        }
      }
    };

    self.segmentRecipientsChangeHandler = function(event) {
      const value = event.target.defaultValue,
        checked = event.target.checked;

      self.f1(self.selectedRecipientsType, value, checked);

      if (value === "segment") {
        for (let i = 0; i < self.segmentList().length; i++) {
          self.f1(self.selectedSegmentList, self.segmentList()[i].id, checked);
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

      self.f1(self.selectedSegmentList, value, checked);

      if (self.selectedSegmentList().length === self.segmentList().length) {
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

    const searchParameter = {
      selectedUser: "retailuser"
    };

    CreateMailersModel.fetchUserSegments(searchParameter).done(function(data) {
      self.segmentList([]);

      for (let j = 0; j < data.segmentdtos.length; j++) {
        self.segmentList.push({
          text: data.segmentdtos[j].name,
          id: data.segmentdtos[j].code
        });
      }

      self.isSegmentListLoaded(true);
    });

    CreateMailersModel.listEnterpriseRoles().done(function(data) {
      self.recipientsList([]);

      for (let m = 0; m < data.enterpriseRoleDTOs.length; m++) {
        if (data.enterpriseRoleDTOs[m].enterpriseRoleId === "corporateuser") {
          self.recipientsList.push({
            enterpriseRoleName: self.nls.roles.corp,
            enterpriseRoleId: "corporateuser",
            segmentList: []

          });
        } else if (data.enterpriseRoleDTOs[m].enterpriseRoleId === "retailuser") {
          self.recipientsList.push({
            enterpriseRoleName: self.nls.roles.retail,
            enterpriseRoleId: "retailuser",
            segmentList: self.segmentList()
          });
        } else if (data.enterpriseRoleDTOs[m].enterpriseRoleId === "administrator") {
          self.recipientsList.push({
            enterpriseRoleName: self.nls.roles.admin,
            enterpriseRoleId: "administrator",
            segmentList: []
          });
        }
      }

      self.recipientsListLoaded(true);
      self.isSegmentListLoaded(true);
    });

    const manualEnteredPartiesSubscription = self.manualEnteredParties.subscribe(function() {
      if (self.manualEnteredParties() === undefined || self.manualEnteredParties() === "") {
        self.showPartyClose(true);
      } else {
        self.showPartyClose(false);
      }
    });

    self.manualEnteredUsers.subscribe(function() {
      if (self.manualEnteredUsers() === undefined || self.manualEnteredUsers() === "") {
        self.showUserClose(true);
      } else {
        self.showUserClose(false);
      }
    });

    self.showReview = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
        if(!self.emailContent() || self.emailContent() === ""){
          rootParams.baseModel.showMessages(null, [self.nls.errorMsg.emptyBody], "ERROR");
        }

        return;
      }

      if (self.selectedRecipients().length === 0 && !self.manualEnteredParties() && !self.manualEnteredUsers() && self.selectedSegmentList().length === 0 && self.selectedRecipientsType().length === 0) {
        rootParams.baseModel.showMessages(null, [self.nls.errorMsg.noRecipient], "INFO");

        return;
      }

      if (self.manualEnteredUsers() && self.manualEnteredUsers().length > 0) {
        if (self.manualEnteredUsers().indexOf(",") !== -1) {
          self.selectedUsers = self.manualEnteredUsers().split(",");
        } else {
          self.selectedUsers().push(self.manualEnteredUsers());
        }
      }

      if (self.manualEnteredParties() && self.manualEnteredParties().length > 0) {
        if (self.manualEnteredParties().indexOf(",") !== -1) {
          self.selectedParties = self.manualEnteredParties().split(",");
        } else {
          self.selectedParties().push(self.manualEnteredParties());
        }
      }

      self.mailersPayload().messageType = "B";
      self.mailersPayload().subject = self.emailSubject();
      self.mailersPayload().messageBody = self.emailContent();

      if (self.activationDate() === "00:00:00") {
        self.triggerType("IMMEDIATE");
      } else {
        self.triggerType("MANUAL");
      }

      self.mailersPayload().description = self.description();
      self.mailersPayload().activationDate = self.activationDate();
      self.mailersPayload().expiryDate = self.expiryDate();
      self.mailersPayload().code = self.code();
      self.mailersPayload().priority = self.priority();
      self.mailersPayload().triggerType = self.triggerType();

      for (let i = 0; i < self.selectedRecipients().length; i++) {
        if (self.selectedRecipients()[i] === "corporateuser" || self.selectedRecipients()[i] === "administrator" || self.selectedRecipients()[i] === "retailuser") {
          self.mailersPayload().recipients().push({
            type: "ROLE",
            value: self.selectedRecipients()[i]
          });
        }
      }

      if (self.selectedRecipients().indexOf("retailuser") === -1) {
        for (let i = 0; i < self.selectedSegmentList().length; i++) {
          self.mailersPayload().recipients().push({
            type: "SEGMENT",
            value: self.selectedSegmentList()[i]
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

      if (self.selectedUsers.length > 1) {
        ko.utils.arrayForEach(self.selectedUsers, function(item) {
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

      if (self.selectedParties.length > 1) {
        ko.utils.arrayForEach(self.selectedParties, function(item) {
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

      rootParams.dashboard.loadComponent("review-mailer-create", {
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
        selectedSegmentList : self.selectedSegmentList
      });
    };

    self.dispose = function() {
      manualEnteredPartiesSubscription.dispose();
    };
  };
});
