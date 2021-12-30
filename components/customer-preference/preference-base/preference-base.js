define([
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/customer-preference",
  "ojs/ojinputtext",
  "ojs/ojpopup"
], function (ko, $, PreferenceBaseModel, resourceBundle) {
  "use strict";

  return function viewModel(rootParams) {
    const self = this;

    self.nls = resourceBundle;
    self.customerPreferenceValidated = ko.observable(false);
    self.partyPreferenceLoaded = ko.observable(false);
    self.partyValidated = ko.observable(false);
    self.isDataReceived = ko.observable(false);
    self.done = ko.observable(false);
    self.showCreateCustomerScreen = ko.observable(false);
    self.enabled = ko.observable(true);
    self.userLimitDataLoaded = ko.observable(false);
    self.cummulativeDataLoaded = ko.observable(false);
    self.isUserlimitLoaded = ko.observable(false);
    self.isselectedCCLLoaded = ko.observable(false);
    self.isGracePeriodLoaded = ko.observable(false);
    self.showReviewForCreate = ko.observable(false);
    self.modifyButtonPressed = ko.observable(false);
    self.showConfirmation = ko.observable(false);
    self.userLimitData = ko.observable([]);
    self.selectedUserLimit = ko.observable();
    self.selectedCCL = ko.observable();
    self.selectedUserLimitDescription = ko.observable();
    self.selectedCCLDescription = ko.observable();
    self.gracePeriod = ko.observable();
    self.selectedApprovalTypeDescription = ko.observable();
    self.cumLevelData = ko.observable([]);
    self.validationTracker = ko.observable();
    self.gracePeriod = ko.observable();
    self.pathForBrandCSS = ko.observable();
    self.selectedApprovalType = ko.observable(["ZE"]);
    self.previousSelectedUserLimit = ko.observable();
    self.previousSelectedPartyLimit = ko.observable();
    self.isEnabledChecked = ko.observable(["true"]);
    self.isForexDealCreationChecked = ko.observable(false);
    self.isAccessibleRoles = ko.observable(false);
    self.partyID = ko.observable();
    self.partyName = ko.observable();
    self.partyIDdisplayValue = ko.observable();
    self.isForexDealCreationEnabled = ko.observable(false);
    self.corpAdminEnabled = ko.observable("DISABLED");
    self.isForexDealCreationAllowed = ko.observable("false");
    self.selectedAllowedRoles = ko.observable();
    self.allowedRoles = ko.observableArray();
    self.isEnabledSelected = ko.observable("true");
    self.done = ko.observable(false);
    self.isDataReceived = ko.observable(false);
    self.isCorpAdmin = ko.observable();
    self.parames = null;
    ko.utils.extend(self, rootParams.rootModel.params);

    self.searchParameters = {
      assignableEntities: [{
        key: {
          type: "ROLE",
          value: "corporateuser"
        }
      }]
    };

    self.approvalType = ko.observable([{
        value: "SE",
        displayValue: self.nls.headings.sequential
      },
      {
        value: "NSE",
        displayValue: self.nls.headings.nonSequential
      },
      {
        value: "ZE",
        displayValue: self.nls.headings.noApproval
      }
    ]);

    self.payload = ko.observable({
      approvalType: "",
      partyId: "",
      partyName: "",
      enabled: "",
      limitPackageUtilizedByUser: {},
      limitPackageUtilizedByParty: {},
      corpAdminEnabled: "",
      allowedRoles: "",
      version: "",
      dealCreationAllowed: ""
    });

    self.isCorporateAdminEnabled = ko.observable(false);
    rootParams.baseModel.registerComponent("preference-search", "customer-preference");
    rootParams.baseModel.registerComponent("create-customer-preference", "customer-preference");
    rootParams.baseModel.registerComponent("review-create-customer-preference", "customer-preference");
    rootParams.baseModel.registerComponent("review-modify-customer-preference", "customer-preference");
    rootParams.baseModel.registerComponent("confirmation", "account-access-management");
    rootParams.dashboard.headerName(self.nls.headings.partyPreferences);

    PreferenceBaseModel.fetchLimitGroups(JSON.parse(ko.toJSON(self.searchParameters))).done(function (data) {
      self.userLimitData(data.limitPackageDTOList);
      self.cumLevelData(data.limitPackageDTOList);
      self.cummulativeDataLoaded(true);
      self.userLimitDataLoaded(true);
    });

    self.selectedCCL.subscribe(function () {
      $.each(self.cumLevelData(), function (index) {
        if (self.cumLevelData()[index].key.id === self.selectedCCL()) {
          self.selectedCCLDescription(self.cumLevelData()[index].key.id);
        }
      });
    });

    self.selectedUserLimit.subscribe(function () {
      $.each(self.userLimitData(), function (index) {
        if (self.userLimitData()[index].key.id === self.selectedUserLimit()) {
          self.selectedUserLimitDescription(self.userLimitData()[index].key.id);
        }
      });
    });

    self.selectedApprovalType.subscribe(function () {
      $.each(self.approvalType(), function (index) {
        if (typeof self.selectedApprovalType() === "object") {
          if (self.selectedApprovalType() !== null) {
            if (self.approvalType()[index].value === self.selectedApprovalType()[0]) {
              self.selectedApprovalTypeDescription(self.approvalType()[index].displayValue);
            }
          }else{
            self.selectedApprovalType( self.approvalType()[2].value);
            self.selectedApprovalTypeDescription( self.approvalType()[2].displayValue);
            self.payload().approvalType = self.selectedApprovalType();
          }
        } else {
          if (self.approvalType()[index].value === self.selectedApprovalType()) {
            self.selectedApprovalTypeDescription(self.approvalType()[index].displayValue);
          }

          self.payload().approvalType = self.selectedApprovalType();
        }
      });
    });
  };
});