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

    Params.dashboard.headerName(self.entityResource.fatcaHeader);

    Params.baseModel.registerComponent("fatca-compliance", "compliance");
    Params.baseModel.registerElement("confirm-screen");

    const getSuccessMessage = function () {
      return self.resource.confirmationSuccessMessage;
    };

    self.reviewTransactionName = {
      header: self.entityResource.review,
      reviewHeader: self.resource.reviewHeader
    };

    self.editSection = function (sectionId) {
      self.params.sectionBeingEdited(sectionId);
      self.backFromReview = ko.observable(true);

      Params.dashboard.loadComponent("entity-fatca-compliance", self);
    };

    /**
     * This function is called on the click of confirm button to post fatca compliance data to the server.
     *
     * @return {void}  Description.
     */
    self.confirmFatcaCompliance = function () {
      self.fatcaComplianceData.taxResidencyInfoDTO.domesticEntity(self.fatcaComplianceData.taxResidencyInfoDTO.domesticEntity() === "true");
      self.fatcaComplianceData.taxResidencyInfoDTO.usIncorporatedEntity(self.fatcaComplianceData.taxResidencyInfoDTO.usIncorporatedEntity() === "true");
      self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticBenificialOwners(self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticBenificialOwners() === "true");
      self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[0].tinAvailable(self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[0].tinAvailable() === "true");
      self.fatcaComplianceData.entityCertification.entityFinancialInstitution(self.fatcaComplianceData.entityCertification.entityFinancialInstitution() === "true");
      self.fatcaComplianceData.entityCertification.nonFinancialInstitutionDetails.activeNFE(self.fatcaComplianceData.entityCertification.nonFinancialInstitutionDetails.activeNFE() === "true");
      self.fatcaComplianceData.entityCertification.financialInstitutionDetails.investmentEntity(self.fatcaComplianceData.entityCertification.financialInstitutionDetails.investmentEntity() === "true");
      self.fatcaComplianceData.entityCertification.financialInstitutionDetails.locatedInNonParticipating(self.fatcaComplianceData.entityCertification.financialInstitutionDetails.locatedInNonParticipating() === "true");
      self.fatcaComplianceData.entityCertification.financialInstitutionDetails.giinAvailable(self.fatcaComplianceData.entityCertification.financialInstitutionDetails.giinAvailable() === "true");

      ReviewFatcaComplianceModel.submitFatcaCompliance(ko.mapping.toJSON(self.fatcaComplianceData, {
        ignore: ["selectedValues", "declaration"]
      })).then(function (data) {
        Params.dashboard.loadComponent("confirm-screen", {
          transactionResponse: data,
          transactionName: self.entityResource.fatcaHeader,
          confirmScreenExtensions: {
            confirmScreenMsgEval: getSuccessMessage,
            template: "confirm-screen/fatca-compliance",
            isSet: true,
            taskCode: "AR_N_CMP"
          }
        }, self);
      }, function () {
        self.fatcaComplianceData.taxResidencyInfoDTO.domesticEntity(self.fatcaComplianceData.taxResidencyInfoDTO.domesticEntity().toString());
        self.fatcaComplianceData.taxResidencyInfoDTO.usIncorporatedEntity(self.fatcaComplianceData.taxResidencyInfoDTO.usIncorporatedEntity().toString());
        self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticBenificialOwners(self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticBenificialOwners().toString());
        self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[0].tinAvailable(self.fatcaComplianceData.taxResidencyInfoDTO.nonDomesticTaxResidencyInfo()[0].tinAvailable().toString());
        self.fatcaComplianceData.entityCertification.entityFinancialInstitution(self.fatcaComplianceData.entityCertification.entityFinancialInstitution().toString());
        self.fatcaComplianceData.entityCertification.nonFinancialInstitutionDetails.activeNFE(self.fatcaComplianceData.entityCertification.nonFinancialInstitutionDetails.activeNFE().toString());
        self.fatcaComplianceData.entityCertification.financialInstitutionDetails.investmentEntity(self.fatcaComplianceData.entityCertification.financialInstitutionDetails.investmentEntity().toString());
        self.fatcaComplianceData.entityCertification.financialInstitutionDetails.locatedInNonParticipating(self.fatcaComplianceData.entityCertification.financialInstitutionDetails.locatedInNonParticipating().toString());
        self.fatcaComplianceData.entityCertification.financialInstitutionDetails.giinAvailable(self.fatcaComplianceData.entityCertification.financialInstitutionDetails.giinAvailable().toString());
      });
    };

    self.back = function () {
      self.backFromReview = ko.observable(true);
      Params.dashboard.loadComponent("entity-fatca-compliance", self);
    };
  };
});