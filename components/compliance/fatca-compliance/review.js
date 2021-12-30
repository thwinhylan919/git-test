define([

  "knockout",

  "./model",

  "ojL10n!resources/nls/compliance",
  "ojL10n!resources/nls/compliance-entity",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox"
], function (ko, ReviewFatcaComplianceModel, ResourceBundle, ResourceBundleEntity) {
  "use strict";

  return function (Params) {
    const self = this;

    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.entityResource = ResourceBundleEntity;
    self.fatcaComplianceData = self.params.fatcaComplianceData;

    Params.dashboard.headerName(self.resource.fatcaHeader);

    Params.baseModel.registerComponent("fatca-compliance", "compliance");
    Params.baseModel.registerElement("confirm-screen");

    const getSuccessMessage = function () {
      return self.resource.confirmationSuccessMessage;
    };

    self.editSection = function (sectionId) {
      self.params.sectionBeingEdited(sectionId);
      self.backFromReview = ko.observable(true);

      Params.dashboard.loadComponent("fatca-compliance", self);
    };

    self.reviewTransactionName = {
      header: self.entityResource.review,
      reviewHeader: self.resource.reviewHeader
    };

    /**
     * This function is called on the click of confirm button to post fatca compliance data to the server.
     *
     * @return {void}  Description.
     */
    self.confirmFatcaCompliance = function () {
      self.fatcaComplianceData.kycInfo.grossAnnualIncome = Number(self.fatcaComplianceData.kycInfo.grossAnnualIncome);
      self.fatcaComplianceData.taxResidencyInfoDTO.domesticEntity(self.fatcaComplianceData.taxResidencyInfoDTO.domesticEntity() === "true");
      self.fatcaComplianceData.taxResidencyInfoDTO.domesticTaxResident(self.fatcaComplianceData.taxResidencyInfoDTO.domesticTaxResident() === "true");
      self.fatcaComplianceData.taxResidencyInfoDTO.usCitizen(self.fatcaComplianceData.taxResidencyInfoDTO.usCitizen() === "true");
      self.fatcaComplianceData.taxResidencyInfoDTO.sptStatus(self.fatcaComplianceData.taxResidencyInfoDTO.sptStatus() === "true");
      self.fatcaComplianceData.taxResidencyInfoDTO.usGreenCardOwner(self.fatcaComplianceData.taxResidencyInfoDTO.usGreenCardOwner() === "true");
      self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[0].tinAvailable(self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[0].tinAvailable() === "true");

      ReviewFatcaComplianceModel.submitFatcaCompliance(ko.mapping.toJSON(self.fatcaComplianceData, {
        ignore: ["selectedValues"]
      })).then(function (data) {
        Params.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          transactionName: self.resource.fatcaHeader,
          confirmScreenExtensions: {
            confirmScreenMsgEval: getSuccessMessage,
            template: "confirm-screen/fatca-compliance",
            isSet: true,
            taskCode: "AR_N_CMP"
          }
        });
      }, function () {
        self.fatcaComplianceData.taxResidencyInfoDTO.domesticEntity(self.fatcaComplianceData.taxResidencyInfoDTO.domesticEntity().toString());
        self.fatcaComplianceData.taxResidencyInfoDTO.domesticTaxResident(self.fatcaComplianceData.taxResidencyInfoDTO.domesticTaxResident().toString());
        self.fatcaComplianceData.taxResidencyInfoDTO.usCitizen(self.fatcaComplianceData.taxResidencyInfoDTO.usCitizen().toString());
        self.fatcaComplianceData.taxResidencyInfoDTO.sptStatus(self.fatcaComplianceData.taxResidencyInfoDTO.sptStatus().toString());
        self.fatcaComplianceData.taxResidencyInfoDTO.usGreenCardOwner(self.fatcaComplianceData.taxResidencyInfoDTO.usGreenCardOwner().toString());
        self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[0].tinAvailable(self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[0].tinAvailable().toString());
      });
    };

    self.back = function () {
      self.backFromReview = ko.observable(true);

      Params.dashboard.loadComponent("fatca-compliance", self);
    };
  };
});