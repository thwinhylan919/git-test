define([
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/process-management-approval",
  "text!./process-management-approval.json",
  "ojs/ojbutton",
  "ojs/ojaccordion"
], function (ko, $, ProcessmanagementApprovalModel, resourceBundle, SegmentMap) {
  "use strict";

  return function (params) {
    const self = this,
      segmentMap = JSON.parse(SegmentMap);

    ko.utils.extend(self, params.rootModel);
    self.nls = resourceBundle;
    self.back = params.rootModel.back;
    self.datasegments = ko.observableArray();
    self.datasegmentLoaded = ko.observable(false);
    self.Dto = params.rootModel.transactionDetails().transactionSnapshot.requestPayload;
    self.confirmScreenExtensions=params.rootModel.confirmScreenExtensions;
    self.productCode = self.Dto.basicapplicationDetails.businessProductCode;
    self.facilityFlag = ko.observable(false);
    self.facility = ko.observableArray();
    self.documentFlag = ko.observable(false);
    self.documentList = ko.observableArray();

    params.baseModel.registerComponent("loan-film-strip", "process-management");
    params.baseModel.registerComponent("application-tracker-film-strip", "process-management");

    self.documetsRequired = {
      code: "fsgbu-ob-clmo-ds-document-upload",
      id: "document-upload",
      name: "Document Upload"
    };

    self.productDisplayName = self.Dto.basicapplicationDetails.loanPurpose;

    self.getConfirmScreenMsg = function(jqXHR) {
      if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") {
        return self.nls.approvalMessages.FAILED.successmsg;
      }
      else if (jqXHR.responseJSON.transactionAction) {
         return self.nls.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
      }
    };

    self.getConfirmScreenStatus = function(jqXHR) {
        if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec") {
         return self.nls.approvalMessages.FAILED.statusmsg;
        } else if (jqXHR.responseJSON.transactionAction) {
          return self.nls.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
        }
    };

    $.extend(self.confirmScreenExtensions, {
        isSet: true,
        confirmScreenMsgEval: self.getConfirmScreenMsg,
        confirmScreenStatusEval: self.getConfirmScreenStatus,
        template: "confirm-screen/loan-origination-template"
    });

    self.productData = ko.observable({
      productId: "loan",
      module: null,
      rests: null,
      dataSegments: [],
      payload: self.Dto,
      data: {
        productId: self.productCode,
        productName: self.productDisplayName,
        module: "OBCLPM",
        confirmPage: "loan-origination-confirm",
        mode: "approval"
      }
    });

    ProcessmanagementApprovalModel.fetchDatasegment(self.productCode).then(function (data) {
      data.jsonNode.Stages[0].DataSegments.forEach(function (segment) {
        if (segmentMap.segments[segment.code]) {
          params.baseModel.registerComponent(
            segmentMap.segments[segment.code],
            "process-management"
          );

          const tempSegm = {
            code: segment.code,
            id: segmentMap.segments[segment.code].id,
            name: segmentMap.segments[segment.code].name
          },
           fieldName = segmentMap.segments[segment.code].data,
            keyArray = Object.keys(self.Dto[fieldName]);

          for (let i = 0; i < keyArray.length; i++) {
            if (self.Dto[fieldName][keyArray[i]] === "" || self.Dto[fieldName][keyArray[i]] === null) {
              self.Dto[fieldName][keyArray[i]] = "-";
            }

            if (keyArray[i] === "yearWiseDetails") {
              const yearWiseArray = Object.keys(self.Dto[fieldName][keyArray[i]][0]);

              for (let j = 0; j < yearWiseArray.length; j++) {
                if (self.Dto[fieldName][keyArray[i]][0][yearWiseArray[j]] === "" || self.Dto[fieldName][keyArray[i]][0][yearWiseArray[j]] === null) {
                  self.Dto[fieldName][keyArray[i]][0][yearWiseArray[j]] = "-";
                }
              }
            }
          }

          self.datasegments.push(tempSegm);
        }
      });

      if (data.jsonNode.Stages[0].documentsList && data.jsonNode.Stages[0].documentsList.length > 0) {
        self.datasegments.push(self.documetsRequired);
      }

      if (self.Dto.applicantDetails.applicantDetailsDocument.length > 0) {
          for (let j = 0; j < self.Dto.applicantDetails.applicantDetailsDocument.length; j++) {
            self.documentList.push(self.Dto.applicantDetails.applicantDetailsDocument[j].documentName);
          }

        self.documentFlag(true);
      }

      self.productData().dataSegments = self.datasegments();
      self.calcLoanTenor();
      self.datasegmentLoaded(true);
    });

    self.calcLoanTenor = function () {
      self.years = Math.floor(self.Dto.loanDetails.loanTenor / 12);

      const fraction = (self.Dto.loanDetails.loanTenor / 12) - self.years;

      self.months = Math.round(fraction * 12);
      self.datasegmentLoaded(true);
    };

    self.loadFilmStrip = function () {
      params.dashboard.loadComponent("loan-film-strip", self);
    };

    self.loadAppTracker = function () {
      params.dashboard.loadComponent("application-tracker-film-strip", self);
    };

    if (self.Dto.liability && self.Dto.liability.facilitiesLinkage.length > 0) {
      for (let i = 0; i < self.Dto.liability.facilitiesLinkage.length; i++) {
        self.facility.push(self.Dto.liability.facilitiesLinkage[i]);
      }

      self.facilityFlag(true);
    }
  };
});