define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/remittance-view",
  "ojs/ojbutton",
  "ojs/ojinputtext",
  "ojs/ojswitch",
  "ojs/ojcheckboxset"
], function (oj, ko, $, RemittanceModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.title);
    params.baseModel.registerComponent("remittance-search", "virtual-account-management");
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerElement("modal-window");
    self.feedbackReviewHeader = ko.observable(true);
    self.updateMessage = ko.observable(self.resource.deleteConfirm);
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.remittanceViewDTO = params.rootModel.params.remittanceListDTO;
    self.editRemittanceViewDTO = ko.observable(ko.mapping.fromJS(self.remittanceViewDTO));
    self.remitterDesc = params.rootModel.params.fullDataInfo.jsonNode.data[0].remitterDesc;
    self.keyId = params.rootModel.params.fullDataInfo.jsonNode.data[0].remitterListId;
    self.fullPayload = params.rootModel.params.fullDataInfo.jsonNode.data;
    self.recordStatusTemplateLoaded = ko.observable();
    self.recordStatusList = ko.observable([]);
    self.editMode = ko.observable();
    self.review = ko.observable();
    self.minDate = ko.observable(self.remittanceViewDTO.validityStartDate);

    self.recordStatusList().push({
      code: "O",
      description: self.resource.open
    }, {
        code: "C",
        description: self.resource.close
      }, {
        code: "I",
        description: self.resource.inactive
      });

    if (!self.editRemittanceViewDTO().additionalInfo) {
      self.editRemittanceViewDTO().additionalInfo = ko.observable();
    }

    if (!self.editRemittanceViewDTO().reconInfo) {
      self.editRemittanceViewDTO().reconInfo = ko.observable();
    }

    if (!self.editRemittanceViewDTO().recordStatus) {
      self.editRemittanceViewDTO().recordStatus = ko.observable();
    }

    if (self.remittanceViewDTO.recordStatus === "O") {
      self.recordStatus = self.resource.open;
    } else if (self.remittanceViewDTO.recordStatus === "C") {
      self.recordStatus = self.resource.close;
    } else if(self.remittanceViewDTO.recordStatus === "I") {
      self.recordStatus = self.resource.inactive;
    }

    self.backToSearch = function () {
      params.dashboard.loadComponent("remittance-search", self);
    };

    self.edit = function () {
      self.editMode(true);

      self.recordStatusTemplateLoaded(true);
    };

    self.confirmUpdateScreenMessage = function () {
      return resourceBundle.updateSuccessMessage;
    };

    self.confirmDeleteScreenMessage = function () {
      return resourceBundle.deleteSuccessMessage;
    };

    self.save = function () {

      if (!self.checkDateValidity()) {
        self.review(true);
      }
      else {
        params.baseModel.showMessages(null, [self.resource.dateValidityErrorMessage], "error");
      }
    };

    self.confirm = function () {
      for (let i = 0; i < self.fullPayload[0].RemitterIdDetailServiceDTO.length; i++) {
        if (self.editRemittanceViewDTO().remitterId() === self.fullPayload[0].RemitterIdDetailServiceDTO[i].remitterId) {
          self.fullPayload[0].RemitterIdDetailServiceDTO.splice(i, 1);

          const remittanceView = {
            additionalInfo: self.editRemittanceViewDTO().additionalInfo(),
            reconInfo: self.editRemittanceViewDTO().reconInfo(),
            recordStatus: self.editRemittanceViewDTO().recordStatus(),
            remitterId: self.editRemittanceViewDTO().remitterId(),
            remitterListId: self.editRemittanceViewDTO().remitterListId(),
            validityEndDate: self.editRemittanceViewDTO().validityEndDate(),
            validityStartDate: self.editRemittanceViewDTO().validityStartDate()
          };

          self.fullPayload[0].RemitterIdDetailServiceDTO.push(remittanceView);
          break;
        }
      }

      const payloadOnEdit = {
        modNo: self.fullPayload[0].modNo,
        realCustomerNo: self.realCustomerNo,
        remitterDesc: self.fullPayload[0].remitterDesc,
        remitterListId: self.fullPayload[0].remitterListId,
        RemitterIdDetailServiceSaveDTO: self.fullPayload[0].RemitterIdDetailServiceDTO
      };

      RemittanceModel.updateRemittanceList(ko.toJSON(payloadOnEdit), self.keyId).done(function (data, status, jqXhr) {
        if ((data.jsonNode && data.jsonNode.messages.status === "FAILURE") || (data.status && data.status.result === "FAILURE")) {
          params.baseModel.showMessages(null, [data.jsonNode.messages.codes[0].desc], "error");
        } else if (data.status && data.status.message.code === "DIGX_APPROVAL_REQUIRED") {
          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.resource.title,
            confirmScreenExtensions: {
              resourceBundle: resourceBundle,
              isSet: true,
              confirmScreenDetails: [{
                remitterListId: payloadOnEdit.remitterListId,
                remitterId: payloadOnEdit.remitterId,
                remitterDesc: payloadOnEdit.remitterDesc
              }],
              template: "confirm-screen/remittance-update-confirmation"
            }
          });
        } else {
          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.resource.title,
            confirmScreenExtensions: {
              resourceBundle: resourceBundle,
              confirmScreenMsgEval: self.confirmUpdateScreenMessage,
              isSet: true,
              confirmScreenDetails: [{
                remitterListId: payloadOnEdit.remitterListId,
                remitterId: payloadOnEdit.remitterId,
                remitterDesc: payloadOnEdit.remitterDesc
              }],
              template: "confirm-screen/remittance-update-confirmation"
            }
          });
        }
      });
    };

    self.doNotDelete = function () {
      $("#remittanceDelete").trigger("closeModal");
    };

    self.deleteConfirm = function () {
      $("#remittanceDelete").trigger("openModal");
    };

    self.deleteRemittance = function () {
      for (let i = 0; i < self.fullPayload[0].RemitterIdDetailServiceDTO.length; i++) {
        if (self.fullPayload[0].RemitterIdDetailServiceDTO[i].remitterId === self.remittanceViewDTO.remitterId) {
          self.fullPayload[0].RemitterIdDetailServiceDTO.splice(i, 1);
        }
      }

      const finalPayload = {
        modNo: self.fullPayload[0].modNo,
        realCustomerNo: self.realCustomerNo,
        remitterDesc: self.fullPayload[0].remitterDesc,
        remitterListId: self.fullPayload[0].remitterListId,
        RemitterIdDetailServiceSaveDTO: self.fullPayload[0].RemitterIdDetailServiceDTO
      };

      RemittanceModel.deleteRemittance(ko.toJSON(finalPayload), self.keyId).done(function (data, status, jqXhr) {
        if ((data.jsonNode && data.jsonNode.messages.status === "FAILURE") || (data.status && data.status.result === "FAILURE")) {
          params.baseModel.showMessages(null, [data.jsonNode.messages.codes[0].desc], "error");
          $("#remittanceDelete").trigger("closeModal");
        } else if (data.status && data.status.message.code === "DIGX_APPROVAL_REQUIRED") {
          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.resource.title,
            confirmScreenExtensions: {
              resourceBundle: resourceBundle,
              confirmScreenMsgEval: self.confirmDeleteScreenMessage,
              isSet: true,
              template: "confirm-screen/remittance-delete-confirmation"
            }
          });
        } else {
          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.resource.title,
            confirmScreenExtensions: {
              resourceBundle: resourceBundle,
              confirmScreenMsgEval: self.confirmDeleteScreenMessage,
              isSet: true,
              template: "confirm-screen/remittance-delete-confirmation"
            }
          });
        }
      });
    };

    self.backToView = function () {
      self.editMode(false);
    };

    self.backFromReview = function () {
      self.review(false);
      self.edit();
    };

    self.fromDateChanged = function (data) {
      let date2 = new Date(data.detail.value);

      date2.setDate(date2.getDate());
      date2.setHours(0, 0, 0, 0);
      date2 = oj.IntlConverterUtils.dateToLocalIso(date2);

      if (date2) {
        self.minDate(date2);
      }
    };

    self.checkDateValidity = function () {
      let flag = false;

      const from = Date.parse(self.editRemittanceViewDTO().validityStartDate()), to = Date.parse(self.editRemittanceViewDTO().validityEndDate());

      if (from > to) {
        flag = true;
      }

      return flag;
    };
  };
});
