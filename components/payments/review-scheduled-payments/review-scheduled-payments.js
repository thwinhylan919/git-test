define([
  "ojs/ojcore",
    "knockout",
  "jquery",
  "./model",
    "ojL10n!resources/nls/review-scheduled-payments",
  "ojs/ojinputnumber",
  "ojs/ojavatar"
], function(oj,ko, $, reviewScheduledPaymentsInfoModel, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    self.paymentDetails = ko.observable({});
    self.dataLoaded = ko.observable(false);
    self.confirmScreenDetails = rootParams.rootModel.confirmScreenDetails;
    rootParams.dashboard.headerName(self.params.header);
    self.imageUploadFlag =ko.observable();
    self.initials = ko.observable();
    self.preview = ko.observable();
    self.confirmDelete =self.params.data.confirmDelete;
    self.confirmScreenExtensions = rootParams.rootModel.confirmScreenExtensions;
    reviewScheduledPaymentsInfoModel.init();

    function getPurposeDescription(purpose) {
      reviewScheduledPaymentsInfoModel.getPurposeDesc().done(function(data) {
        if (data.purposeList !== null && data.purposeList.length > 0) {
          for (let i = 0; i < data.purposeList.length; i++) {
            if (purpose === data.purposeList[i].code) {
              self.paymentDetails().purpose = data.purposeList[i].description;
              self.dataLoaded(true);
            }
          }
        }
      });
    }

    self.getConfirmScreenMsg = function(jqXHR) {
      if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
        {return self.resource.common.confirmScreen.approvalMessages.FAILED.successmsg;}
      else if (jqXHR.responseJSON.transactionAction)
        {return self.resource.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;}
    };

    self.getConfirmScreenStatus = function(jqXHR) {
      if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
        {return self.resource.common.confirmScreen.approvalMessages.FAILED.statusmsg;}
      else if (jqXHR.responseJSON.transactionAction)
        {return self.resource.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;}
    };

    function setPreviewImage(data) {
            if (data && data.contentDTOList) {
                self.preview("data:image/gif;base64," + data.contentDTOList[0].content);
            }
        }

    reviewScheduledPaymentsInfoModel.readCancelSI(ko.utils.unwrapObservable(self.params.data.externalReferenceId)).done(function(data) {
      self.paymentDetails({
        payeeName: data.instructionsList[0].payeeNickName,
        accountType: self.resource.reviewUpcomingPayments.type[data.instructionsList[0].paymentType],
        accountNumber: data.instructionsList[0].creditAccountId,
        accountName: "",
        branch: data.instructionsList[0].branchCode,
        fromAccount: data.instructionsList[0].debitAccountId.displayValue,
        amount: data.instructionsList[0].amount.amount,
        currency: data.instructionsList[0].amount.currency,
        frequency: self.getRepeatData(data),
        startDate: data.instructionsList[0].startDate,
        endDate: data.instructionsList[0].endDate,
        type: data.instructionsList[0].type,
        dealId: data.instructionsList[0].dealId,
        remarks: data.instructionsList[0].remarks,
        isDraft: data.instructionsList[0].paymentType ? data.instructionsList[0].paymentType.indexOf("DRAFT") > -1 : "",
        transactionType: data.instructionsList[0].paymentType,
        initials:self.params.data.initials,
        preview:self.params.data.preview
      });

      reviewScheduledPaymentsInfoModel.getMaintenances().then(function(maintenanceData) {
          let propertyValue;

          if (rootParams.dashboard.appData.segment === "CORP") {
              propertyValue = ko.utils.arrayFirst(maintenanceData.configurationDetails, function(element) {
                  return element.propertyId === "CORPORATE_PAYEE_PHOTO_UPLOAD_ENABLED";
              }).propertyValue;
          } else {
              propertyValue = ko.utils.arrayFirst(maintenanceData.configurationDetails, function(element) {
                  return element.propertyId === "RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED";
              }).propertyValue;
          }

          if (propertyValue === "Y") {
              self.imageUploadFlag(true);
          } else {
              self.imageUploadFlag(false);
          }

          if (self.imageUploadFlag()) {
              self.initials(oj.IntlConverterUtils.getInitials(data.instructionsList[0].payeeNickName.split(/\s+/)[0], data.instructionsList[0].payeeNickName.split(/\s+/)[1]));

              if (data.instructionsList[0].contentId && data.instructionsList[0].contentId.value) {
                  reviewScheduledPaymentsInfoModel.retrieveImage(data.instructionsList[0].contentId.value).then(function(imageData) {
                      setPreviewImage(imageData);
                  });
              } else {
                  reviewScheduledPaymentsInfoModel.getGroupDetails(data.instructionsList[0].payeeGroupId).then(function(groupData) {
                      if (groupData.payeeGroup.contentId && groupData.payeeGroup.contentId.value) {
                          reviewScheduledPaymentsInfoModel.retrieveImage(groupData.payeeGroup.contentId.value).then(function(imageData) {
                              setPreviewImage(imageData);
                          });
                      }
                  });
              }

          }
      });

      if (data.instructionsList[0].purpose && data.instructionsList[0].purpose !== "OTH")
        {getPurposeDescription(data.instructionsList[0].purpose);}
      else {
        self.paymentDetails().purpose = data.instructionsList[0].purposeText;
        self.dataLoaded(true);
      }

      const confirmScreenDetailsArray = [
        [{
            label: self.paymentDetails().isDraft ? self.resource.reviewUpcomingPayments.favouring : self.resource.reviewUpcomingPayments.beneficiaryName,
            value: self.paymentDetails().payeeName
          },
          {
            label: self.paymentDetails().isDraft ? self.resource.reviewUpcomingPayments.draftType : self.resource.reviewUpcomingPayments.accountType,
            value: self.paymentDetails().accountType
          }
        ],
        [{
            label: self.resource.reviewUpcomingPayments.amount,
            value: self.paymentDetails().amount,
            currency: self.paymentDetails().currency,
            isCurrency: true
          },
          {
            label: self.resource.reviewUpcomingPayments.fromAccount,
            value: self.paymentDetails().fromAccount
          }
        ],
        [{
          label: self.paymentDetails().type === "NONREC" ? self.resource.reviewUpcomingPayments.transferon : self.resource.reviewUpcomingPayments.endDate,
          value: self.paymentDetails().endDate,
          isDate: true
        }].concat(!self.paymentDetails().isDraft ? [{
          label: self.resource.reviewUpcomingPayments.accountNumber,
          value: self.paymentDetails().accountNumber
        }] : [])
      ].concat(self.paymentDetails().type === "REC" ? [
        [{
            label: self.resource.reviewUpcomingPayments.transFreq,
            value: self.paymentDetails().frequency
          },
          {
            label: self.resource.reviewUpcomingPayments.startDate,
            value: self.paymentDetails().startDate,
            isDate: true
          }
        ]
      ] : []).concat(self.paymentDetails().dealId ? [
        [{
            label: self.resource.reviewUpcomingPayments.dealId,
            value: self.paymentDetails().dealId
        }]
      ] : []);

      if (typeof self.confirmScreenDetails === "function")
        {self.confirmScreenDetails(confirmScreenDetailsArray);}
      else if (self.confirmScreenExtensions) {
        $.extend(self.confirmScreenExtensions, {
          isSet: true,
          eReceiptRequired: true,
          taskCode: "PC_F_PIC",
          confirmScreenDetails: confirmScreenDetailsArray,
          confirmScreenMsgEval: self.getConfirmScreenMsg,
          confirmScreenStatusEval: self.getConfirmScreenStatus,
          template: "confirm-screen/payments-template"
        });
      }
    });

    self.getRepeatData = function(data) {
      if (data.instructionsList[0].type === "REC") {
        if (data.instructionsList[0].freqYears > 1) {
          return rootParams.baseModel.format(self.resource.reviewUpcomingPayments.repeatmsgyears, {
            n: data.instructionsList[0].freqYears
          });
        } else if (data.instructionsList[0].freqMonths > 1) {
          return rootParams.baseModel.format(self.resource.reviewUpcomingPayments.repeatmsgmonths, {
            n: data.instructionsList[0].freqMonths
          });
        } else if (data.instructionsList[0].freqDays > 1) {
          return rootParams.baseModel.format(self.resource.reviewUpcomingPayments.repeatmsgdays, {
            n: data.instructionsList[0].freqDays
          });
        } else if (data.instructionsList[0].freqYears === 1) {
          return rootParams.baseModel.format(self.resource.reviewUpcomingPayments.repeatmsgyear);
        } else if (data.instructionsList[0].freqMonths === 1) {
          return rootParams.baseModel.format(self.resource.reviewUpcomingPayments.repeatmsgmonth);
        } else if (data.instructionsList[0].freqDays === 1) {
          return rootParams.baseModel.format(self.resource.reviewUpcomingPayments.repeatmsgday);
        }
      } else {
        return "";
      }
    };
  };
});
