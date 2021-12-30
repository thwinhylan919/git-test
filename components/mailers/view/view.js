define([
  "knockout",
  "./model",
  "jquery",
  "ojL10n!resources/nls/mailers",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset",
  "ojs/ojtreeview"
], function (ko, UsersModel, $, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel.params);
    self.nls = resourceBundle;
    self.mailerDetails = rootParams.rootModel.params.context;
    rootParams.baseModel.registerComponent("edit", "mailers");
    self.viewFlag = ko.observable(false);
    self.deleteFlag = ko.observable(false);
    self.version = ko.observable();
    self.status = ko.observable();
    self.isSegmentListLoaded = ko.observable(false);
    self.recipientsListLoaded = ko.observable(false);
    self.segmentList = ko.observableArray();
    self.recipientsList = ko.observableArray();
    self.selectedRecipients = ko.observableArray();
    self.selectedRecipientsType = ko.observableArray();
    rootParams.dashboard.headerName(self.nls.headers.heading);

    const dateobj = new Date(self.mailerDetails.activationDate);

    rootParams.baseModel.registerElement("confirm-screen");

    self.deleteNo = function () {
      $("#deleteMailer").hide();
    };

    self.openModal = function () {
      $("#deleteMailer").trigger("openModal");
    };

    self.retailTypes = [{
      value: "segment",
      text: self.nls.fieldname.segment
    },
    {
      value: "nonSegment",
      text: self.nls.fieldname.nonSegment
    }
    ];

    self.deleteMailer = function () {
      UsersModel.deleteMailer(self.mailerDetails.messageId.value).then(function (data, status, jqXhr) {
        self.httpStatus = jqXhr.status;

        let statusMessage;

        if (self.httpStatus && self.httpStatus !== 202) {
          statusMessage = self.nls.fieldname.completed;
        }

        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.nls.headers.transactionDeleteName,
          transactionResponse: data,
          confirmScreenExtensions: {
            successMessage: self.nls.fieldname.deleteSuccessMessage,
            statusMessages: statusMessage,
            isSet: true,
            template: "confirm-screen/mailers"
          }
        });
      }).fail(function () {
        $("#deleteMailer").hide();
      });
    };

    self.readMailer = function () {
      const searchParameter = {
        selectedUser: "retailuser"
      };

      Promise.all([UsersModel.fetchUserSegments(searchParameter), UsersModel.readMailer(self.mailerDetails.messageId.value), UsersModel.listEnterpriseRoles()]).then(function (response) {
        const data1 = response[0],
          data = response[1],
          data2 = response[2];

        for (let j = 0; j < data1.segmentdtos.length; j++) {
          self.segmentList().push({
            text: data1.segmentdtos[j].name,
            id: data1.segmentdtos[j].code
          });
        }

        for (let m = 0; m < data2.enterpriseRoleDTOs.length; m++) {
          if (data2.enterpriseRoleDTOs[m].enterpriseRoleId === "corporateuser") {
            self.recipientsList.push({
              enterpriseRoleName: self.nls.roles.corp,
              enterpriseRoleId: "corporateuser",
              segmentList: []
            });
          } else if (data2.enterpriseRoleDTOs[m].enterpriseRoleId === "retailuser") {
            self.recipientsList.push({
              enterpriseRoleName: self.nls.roles.retail,
              enterpriseRoleId: "retailuser",
              segmentList: self.segmentList()
            });
          } else if (data2.enterpriseRoleDTOs[m].enterpriseRoleId === "administrator") {
            self.recipientsList.push({
              enterpriseRoleName: self.nls.roles.admin,
              enterpriseRoleId: "administrator",
              segmentList: []
            });
          }
        }

        self.recipientsListLoaded(true);
        self.isSegmentListLoaded(true);
        self.mailerDetails = data.mailer;
        self.mailerName = data.mailer.description;
        self.code = data.mailer.code;
        self.activationDate = data.mailer.activationDate;
        self.expiryDate = data.mailer.expiryDate;
        self.priority = data.mailer.priority;
        self.subject = data.mailer.subject;
        self.mailBody = data.mailer.messageBody;
        self.version = data.mailer.version;
        self.status = data.mailer.status;

        if (self.priority === "L") {
          self.priority = self.nls.fieldname.low;
        } else if (self.priority === "H") {
          self.priority = self.nls.fieldname.high;
        } else if (self.priority === "M") {
          self.priority = self.nls.fieldname.medium;
        }

        if (self.sendTime === "IMMEDIATE") {
          self.sendTime = self.nls.fieldname.immediate;
        } else if (self.mailerDetails.triggerType === "MANUAL") {
          self.sendTime = rootParams.baseModel.format(resourceBundle.fieldname.manualTrigger, {
            hour: dateobj.getHours(),
            minute: dateobj.getMinutes()
          });
        }

        self.mailersPayload = {
          recipients: {
            corp: "",
            retail: "",
            admin: ""
          }
        };

        self.userRecipientsList = ko.observableArray();
        self.partyRecipientsList = ko.observableArray();
        self.selectedSegmentRecipientsList = ko.observableArray();
        self.nonSegmentSelected = ko.observable();

        for (let m = 0; m < data.mailer.recipients.length; m++) {
          if (data.mailer.recipients[m].value === "corporateuser") {
            self.mailersPayload.recipients.corp = self.nls.roles.corp;
            self.selectedRecipients.push(data.mailer.recipients[m].value);
          } else if (data.mailer.recipients[m].value === "retailuser") {
            self.mailersPayload.recipients.retail = self.nls.roles.retail;
            self.selectedRecipients.push(data.mailer.recipients[m].value);
          } else if (data.mailer.recipients[m].value === "administrator") {
            self.mailersPayload.recipients.admin = self.nls.roles.admin;
            self.selectedRecipients.push(data.mailer.recipients[m].value);
          } else if (data.mailer.recipients[m].type === "USER") {
            self.userRecipientsList().push(data.mailer.recipients[m].value);
          } else if (data.mailer.recipients[m].type === "PARTY") {
            self.partyRecipientsList().push(data.mailer.recipients[m].value);
          } else if (data.mailer.recipients[m].type === "NON_SEGMENT") {
            self.nonSegmentSelected(data.mailer.recipients[m].value);
            self.selectedRecipientsType.push("nonSegment");
          } else if (data.mailer.recipients[m].type === "SEGMENT") {
            self.selectedSegmentRecipientsList.push(data.mailer.recipients[m].value);
          }
        }

        self.mailersPayload.userRecipientsList = self.userRecipientsList();
        self.mailersPayload.partyRecipientsList = self.partyRecipientsList();

        for (let f = 0; f < self.selectedRecipients().length; f++) {
          if (self.selectedRecipients()[f] === "retailuser") {
            for (let k = 0; k < self.segmentList().length; k++) {
              self.selectedSegmentRecipientsList.push(self.segmentList()[k].id);
            }

            self.selectedRecipientsType.push("segment");
            self.selectedRecipientsType.push("nonSegment");
          }
        }

        if (self.selectedSegmentRecipientsList().length === self.segmentList().length) {
          self.selectedRecipientsType.push(self.retailTypes[0].value);
        }

        const uniqueselectedRecipientsType = self.selectedRecipientsType().filter(function (item, pos) {
          return self.selectedRecipientsType().indexOf(item) === pos;
        });

        self.selectedRecipientsType.removeAll();

        ko.utils.arrayPushAll(self.selectedRecipientsType(), uniqueselectedRecipientsType);
        self.viewFlag(true);
      });
    };

    self.backOnView = function () {
      rootParams.dashboard.loadComponent("mailers-base", {
        searchFlag: self.searchFlag
      });

      self.searchFlag(true);
      self.viewFlag(false);
    };

    self.edit = function () {
      rootParams.dashboard.loadComponent("edit", {
        file: self.mailerDetails,
        sendHour: dateobj.getHours(),
        sendMinute: dateobj.getMinutes(),
        segmentList: self.segmentList,
        recipientsListLoaded: self.recipientsListLoaded,
        recipientsList: self.recipientsList,
        retailTypes: self.retailTypes,
        isSegmentListLoaded: self.isSegmentListLoaded,
        userRecipientsList: self.userRecipientsList,
        selectedRecipients: self.selectedRecipients,
        selectedRecipientsType: self.selectedRecipientsType,
        selectedSegmentList: self.selectedSegmentList,
        version: self.version,
        selectedSegmentRecipientsList: self.selectedSegmentRecipientsList
      });
    };

    self.readMailer();
  };
});
