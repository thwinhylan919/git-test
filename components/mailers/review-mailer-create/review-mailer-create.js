define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/review-mailer-create",
  "ojs/ojcheckboxset",
  "ojs/ojtreeview"
], function (ko, ReviewMailerCreateModel, locale) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel.params);
    self.nls = locale;
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("mailers-create", "mailers");
    self.payload = params.rootModel.params.data;
    self.mailersPayload = ko.toJS(self.payload);

    if (!self.transactionId) { params.dashboard.headerName(self.nls.headers.heading); }

    self.segmentList = self.segmentList ? self.segmentList : ko.observableArray([]);
    self.recipientsList = self.recipientsList ? self.recipientsList : ko.observableArray([]);
    self.userRecipientsList = ko.observableArray();
    self.partyRecipientsList = ko.observableArray();
    self.approverFlag = ko.observable(false);
    self.recipientsListLoaded = self.recipientsListLoaded ? self.recipientsListLoaded : ko.observable(false);
    self.isSegmentListLoaded = self.isSegmentListLoaded ? self.isSegmentListLoaded : ko.observable(false);
    self.selectedRecipients = self.selectedRecipients ? self.selectedRecipients : ko.observableArray([]);
    self.selectedSegmentList = self.selectedSegmentList ? self.selectedSegmentList : ko.observableArray([]);
    self.selectedRecipientsType = self.selectedRecipientsType ? self.selectedRecipientsType : ko.observableArray([]);

    self.retailTypes = [{
      value: "segment",
      text: self.nls.fieldname.segment
    },
    {
      value: "nonSegment",
      text: self.nls.fieldname.nonSegment
    }
    ];

    if (self.transactionId) {
      self.approverFlag(true);
    }

    if (self.transactionDetails && self.transactionDetails.transactionSnapshot) {
      const searchParameter = {
        selectedUser: "retailuser"
      };

      Promise.all([ReviewMailerCreateModel.fetchUserSegments(searchParameter), ReviewMailerCreateModel.listEnterpriseRoles()]).then(function (response) {
        const data = response[0],
          data2 = response[1];

        for (let j = 0; j < data.segmentdtos.length; j++) {
          self.segmentList().push({
            text: data.segmentdtos[j].name,
            id: data.segmentdtos[j].code
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

        for (let i = 0; i < self.transactionDetails.transactionSnapshot.recipients.length; i++) {
          if (self.transactionDetails.transactionSnapshot.recipients[i].type === "ROLE") {
            self.selectedRecipients.push(self.transactionDetails.transactionSnapshot.recipients[i].value);
          }

          if (self.transactionDetails.transactionSnapshot.recipients[i].type === "SEGMENT") {
            self.selectedSegmentList.push(self.transactionDetails.transactionSnapshot.recipients[i].value);
          }

          if (self.transactionDetails.transactionSnapshot.recipients[i].type === "USER") {
            self.userRecipientsList.push(self.transactionDetails.transactionSnapshot.recipients[i].value);
          }

          if (self.transactionDetails.transactionSnapshot.recipients[i].type === "PARTY") {
            self.partyRecipientsList.push(self.transactionDetails.transactionSnapshot.recipients[i].value);
          }

          if (self.transactionDetails.transactionSnapshot.recipients[i].type === "NON_SEGMENT") {
            self.selectedRecipientsType.push(self.retailTypes[1].value);
          }
        }

        for (let f = 0; f < self.selectedRecipients().length; f++) {
          if (self.selectedRecipients()[f] === "retailuser") {
            self.selectedSegmentList([]);
            self.selectedRecipientsType([]);

            for (let k = 0; k < self.segmentList().length; k++) {
              self.selectedSegmentList.push(self.segmentList()[k].id);
            }

            self.selectedRecipientsType.push(self.retailTypes[0].value);
            self.selectedRecipientsType.push(self.retailTypes[1].value);
          }
        }

        if (self.selectedSegmentList().length === self.segmentList().length) {
          self.selectedRecipientsType.push(self.retailTypes[0].value);
        }

        const uniqueselectedRecipientsType = self.selectedRecipientsType().filter(function (item, pos) {
          return self.selectedRecipientsType().indexOf(item) === pos;
        });

        self.selectedRecipientsType.removeAll();
        ko.utils.arrayPushAll(self.selectedRecipientsType(), uniqueselectedRecipientsType);
        self.mailersPayload.partyRecipientsList = self.partyRecipientsList();
        self.mailersPayload.userRecipientsList = self.userRecipientsList();
        self.recipientsListLoaded(true);
        self.isSegmentListLoaded(true);
      });
    } else {
      for (let m = 0; m < self.mailersPayload.recipients.length; m++) {
        if (self.mailersPayload.recipients[m].value.toLowerCase() === "corporateuser") {
          self.mailersPayload.recipients[m].value = self.nls.roles.corp;
        } else if (self.mailersPayload.recipients[m].value.toLowerCase() === "retailuser") {
          self.mailersPayload.recipients[m].value = self.nls.roles.retail;
        } else if (self.mailersPayload.recipients[m].value.toLowerCase() === "administrator") {
          self.mailersPayload.recipients[m].value = self.nls.roles.admin;
        } else if (self.mailersPayload.recipients[m].type === "USER") {
          self.userRecipientsList().push(self.mailersPayload.recipients[m].value);
        } else if (self.mailersPayload.recipients[m].type === "PARTY") {
          self.partyRecipientsList().push(self.mailersPayload.recipients[m].value);
        } else if (self.mailersPayload.recipients[m].type === "SEGMENT") {
          for (let h = 0; h < self.segmentList().length; h++) {
            if (self.mailersPayload.recipients[m].value === self.segmentList()[h].id) {
              self.mailersPayload.recipients[m].value = self.segmentList()[h].text;
            }
          }
        }
        else if (self.mailersPayload.recipients[m].type === "NON_SEGMENT") {
          self.mailersPayload.recipients[m].value = self.nls.fieldname.nonSegment;
        }
      }

      self.mailersPayload.userRecipientsList = self.userRecipientsList();
      self.mailersPayload.partyRecipientsList = self.partyRecipientsList();
      self.recipientsListLoaded(true);

    }

    if (self.mailersPayload.priority === "L") {
      self.mailersPayload.priority = self.nls.fieldname.low;
    } else if (self.mailersPayload.priority === "H") {
      self.mailersPayload.priority = self.nls.fieldname.high;
    } else if (self.mailersPayload.priority === "M") {
      self.mailersPayload.priority = self.nls.fieldname.medium;
    }

    self.confirmMailer = function () {
      ReviewMailerCreateModel.createMailers(ko.toJSON(self.payload)).done(function (data, status, jqXHR) {
        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXHR,
          transactionName: self.nls.headers.transactionName,
          transactionResponse: data
        });
      });
    };
  };
});
