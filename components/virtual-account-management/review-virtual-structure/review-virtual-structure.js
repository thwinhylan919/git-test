define([
  "knockout",
  "ojL10n!resources/nls/review-virtual-structure",
  "./model",
  "ojs/ojbutton"
], function (ko, resourceBundle, VirtualStructureModel) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel || params.rootModel.previousState);
    self.resource = resourceBundle;
    params.dashboard.headerName(self.resource.title);
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("structure-configuration", "virtual-account-management");
    self.reviewTemplate = ko.observable(true);
    self.fromApproval = ko.observable(!!params.rootModel.params.data);
    self.realCustomerName = params.dashboard.userData.userProfile.accessibleEntityDTOs[0].partyName;
    self.realCustomerNo = params.dashboard.userData.userProfile.partyId.value;
    self.virtualStructureCreateDTO = params.rootModel.params.virtualStructureCreateDTO;
    self.structureDetails = ko.observable(!self.fromApproval() ? JSON.parse(params.rootModel.params.structureDetails): "");
    self.virtualAccountData = ko.observable(!self.fromApproval() ? JSON.parse(params.rootModel.params.virtualAccountData): "");
    self.virtualAccountNo = params.rootModel.params.virtualAccountNo;
    self.mode = params.rootModel.params.mode;
    self.methodType = params.rootModel.params.mode;
    self.showDisplayGroupId = ko.observable();
    self.deleteFlag = ko.observable(true);

    if (self.fromApproval()) {
      if (params.rootModel.params.taskCode === "VAMS_M_DVAS") {
        if(params.rootModel.params.data.virtualAccountStructure.mainAccountId !== undefined){
          self.virtualStructureCreateDTO = params.rootModel.params.data.virtualAccountStructure;
        } else {
          self.deleteFlag(false);

          const q = {
            criteria: [{
              operand: "virtualAccountStructureKey.code",
              operator: "CONTAINS",
              value: [params.rootModel.params.data.virtualAccountStructure.code]
            }]
          };

          VirtualStructureModel.fetchVirtualStructureList(JSON.stringify(q), params.rootModel.params.taskCode).then(function(data){
            if ((data && data !== []) || (data.virtualAccountStructures && data.virtualAccountStructures.length > 0)){
              self.virtualStructureCreateDTO = data.virtualAccountStructures[0];
              self.deleteFlag(true);
              self.approvalFlow();
            }
          });
        }
      } else {
        self.virtualStructureCreateDTO = params.rootModel.params.data;
      }
    }

    self.approvalFlow = function(){
      self.headerVirtualAccount = self.virtualStructureCreateDTO.mainAccountId;

      if(self.virtualStructureCreateDTO.realAccountNo){
        self.displayAccountNumber = self.virtualStructureCreateDTO.realAccountNo.displayValue;
      } else {
        self.displayGroupId = self.virtualStructureCreateDTO.groupId;
        self.showDisplayGroupId(true);
      }

      if (self.virtualStructureCreateDTO.interestCalcReq) {
        self.interestCalcRequired = self.resource.yes;
      } else if (!self.virtualStructureCreateDTO.interestCalcReq) {
        self.interestCalcRequired = self.resource.no;
      }
    };

    if (params.rootModel.params.additionalDetails) {
       self.displayAccountNumber = JSON.parse(params.rootModel.params.additionalDetails).displayValue;
    } else if (self.fromApproval() && self.deleteFlag()) {
      self.approvalFlow();
    } else if(!self.fromApproval() && self.virtualStructureCreateDTO.realAccountNo() !== ""){
      self.displayAccountNumber = self.virtualStructureCreateDTO.realAccountNo().displayValue;
      self.showDisplayGroupId(false);
    } else if(!self.fromApproval()){
      self.displayGroupId = self.virtualStructureCreateDTO.groupId();
      self.showDisplayGroupId(true);
    }

    if (params.rootModel.params.headerVirtualAccount) {
      self.headerVirtualAccount = params.rootModel.params.headerVirtualAccount;
    } else if (ko.isObservable(self.structureDetails()) && self.structureDetails()) {
      self.headerVirtualAccount = self.structureDetails().account.childAccountId;
    } else if (!self.fromApproval()) {
      self.headerVirtualAccount = self.virtualStructureCreateDTO.accountMapDetails.account.mainAccountId;
    }

    if(!self.fromApproval()){
      if (self.virtualStructureCreateDTO.interestCalcReq()) {
        self.interestCalcRequired = self.resource.yes;
      } else if (!self.virtualStructureCreateDTO.interestCalcReq()) {
        self.interestCalcRequired = self.resource.no;
      }
    }

    self.previewStructure = function () {
      params.dashboard.loadComponent("structure-configuration", {
        mode: "REVIEW",
        methodType: self.methodType,
        structureDetails: JSON.stringify(self.structureDetails()),
        additionalDetails : params.rootModel.params.additionalDetails,
        displayGroupId : params.rootModel.params.accountGroupId,
        virtualStructureCreateDTO: self.virtualStructureCreateDTO,
        headerVirtualAccount: self.headerVirtualAccount,
        editStructureData : params.rootModel.params.editStructureData
      });
    };

    self.backtoConfiguration = function () {
      params.dashboard.loadComponent("structure-configuration", {
        structureDetails: JSON.stringify(self.structureDetails()),
        virtualStructureCreateDTO: self.virtualStructureCreateDTO,
        HeaderVirtualAccount: self.headerVirtualAccount,
        selectedAccountArray: params.rootModel.selectedAccountArray,
        virtualAccountData: JSON.stringify(self.virtualAccountData()),
        additionalDetails: params.rootModel.params.additionalDetails,
        mode: self.methodType,
        fromReview : "fromReview",
        editStructureData : params.rootModel.params.editStructureData
      });
    };
  };
});
