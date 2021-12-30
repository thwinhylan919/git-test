define([

  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/application-list",
  "ojs/ojselectcombobox",
  "ojs/ojprogressbar",
  "ojs/ojbutton"
], function (ko, $, ApplicationListModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;
    let i = 0,
      productGroupSerialNumber;
    const successHandlers = {};

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.applicationsList = ko.observableArray([]);
    self.draftApplications = ko.observableArray([]);
    self.applicationSubmitted = [];
    self.draftsApps = [];
    self.request = $.extend({}, self.baseRequest);
    self.request.party = "";
    self.request.submission = "";
    self.payLoad = ko.observable(true);
    self.applicationValue = ko.observable();
    self.isCustomer = ko.observable(true);
    self.showSubmittedApplications = ko.observable(false);
    self.isSubmittedApplicationsDataFetched = ko.observable(false);
    self.isDraftApplicationsDataFetched = ko.observable(false);
    rootParams.baseModel.registerComponent("product-base", "origination");
    self.sessionStorageData = {};

    for (i = 0; i < self.submissionIdList().length; i++) {
      if (self.submissionIdList()[i].submitted) {
        self.applicationSubmitted.push(self.submissionIdList()[i]);
      } else {
        self.draftsApps.push(self.submissionIdList()[i]);
      }
    }

    self.summarySuccessHandler = function (data, index) {
      self.draftsApps[index].offerId = data.offerId;

      for (i = 0; i < self.draftsApps.length; i++) {
        if (self.draftsApps[i]) {
          if (self.draftsApps[i].products && self.draftsApps[i].products.length > 0) {
            productGroupSerialNumber = self.draftsApps[i].products[0].productGroupSerialNumber;
            self.sessionStorageData.productGroupSerialNumber = productGroupSerialNumber;
          }

          self.draftsApps[i].currency = data.currency;
        }
      }

      self.draftApplications(self.draftsApps);
      self.applicationValue("DRAFT");
      self.showSubmittedApplications(false);
      self.isDraftApplicationsDataFetched(true);
    };

    if (self.draftsApps.length > 0) {
      for (i = 0; i < self.draftsApps.length; i++) {
        ApplicationListModel.fetchApplicationSummary(self.draftsApps[i].submissionId.value, self.summarySuccessHandler, i);
      }
    } else {
      self.isDraftApplicationsDataFetched(true);
    }

    if (self.applicationSubmitted.length > 0) {
      self.applicationsList(self.applicationSubmitted);

      for (i = 0; i < self.applicationsList().length; i++) {
        self.applicationsList()[i].applications.applicationStatusDesc = rootParams.baseModel.getDescriptionFromCode(self.applicationStatusStringMap(), self.applicationsList()[i].applications.applicationStatus);
      }

      self.sessionStorageData.customer = self.isCustomer();

      if (self.draftsApps.length === 0) {
        self.applicationValue("SUBMITTED");
        self.showSubmittedApplications(true);
      }
    } else {
      self.isCustomer(false);
      self.sessionStorageData.customer = self.isCustomer();
    }

    if (self.applicationsList().length > 0) {
      ApplicationListModel.fetchApplications(self.applicationsList()[0].submissionId.value);
    }

    self.isSubmittedApplicationsDataFetched(true);

    successHandlers.applicantDetailsHandler = function (data) {
      if (data.applicants) {
        rootParams.baseModel.switchPage({
          homeComponent: "product-base",
          homeModule: "origination",
          context: "index"
        }, true, true, self.sessionStorageData);
      }
    };

    self.resumeApplication = function (product, data) {
      self.sessionStorageData.submissionId = ko.toJSON(data.submissionId);
      self.sessionStorageData.requirements = JSON.stringify(product);
      self.sessionStorageData.offerId = data.offerId;
      self.sessionStorageData.selectedOfferId = data.offerId;
      self.sessionStorageData.selectedCurrency = data.currency;
      self.sessionStorageData.applicationStartedFromDraft = true;

      if (product[0].demandDepositProduct) {
        self.sessionStorageData.productDescription = self.resource.productSubClass[product[0].demandDepositProduct.productSubClass];
        self.sessionStorageData.productClassName = product[0].demandDepositProduct.productClass;
        self.sessionStorageData.productSubClass = product[0].demandDepositProduct.productSubClass;
      } else if (product[0].loanProduct) {
        self.sessionStorageData.productDescription = self.resource.productSubClass[product[0].loanProduct.productSubClass];
        self.sessionStorageData.productClassName = product[0].loanProduct.productClass;
        self.sessionStorageData.productSubClass = product[0].loanProduct.productSubClass;
      } else if(product[0].cardProduct){
        self.sessionStorageData.productDescription = self.resource.productSubClass[product[0].cardProduct.productSubClass];
        self.sessionStorageData.productClassName = product[0].cardProduct.productClass;
        self.sessionStorageData.productSubClass = product[0].cardProduct.productSubClass;
      }

      ApplicationListModel.fetchProductGroups(self.sessionStorageData.productClassName, self.sessionStorageData.productSubClass).then(function (data) {
        self.sessionStorageData.productCode = data.productGroups[0].id;

        if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
          self.sessionStorageData.applicantId = rootParams.dashboard.userData.userProfile.partyId.value;
          ApplicationListModel.fetchApplicantDetails(JSON.parse(self.sessionStorageData.submissionId).value, successHandlers.applicantDetailsHandler);
        }
      });
    };

    successHandlers.applicantListSucessHandler = function (data) {
      let index;

      if (data && data.applicants) {
        for (index = 0; index < data.applicants.length; index++) {
          if (data.applicants[index].applicantId === self.currentUser().partyId) {
            self.currentUser().isNewParty(data.applicants[index].newParty);

            if (data.applicants[index].applicantRelationshipType && data.applicants[index].applicantRelationshipType === "APPLICANT") {
              self.currentUser().isPrimaryApplicant(true);
            } else {
              self.currentUser().isPrimaryApplicant(false);
            }
          }
        }

        self.currentUser().noOfApplicants = data.applicants.length;
      }
    };

    self.clickApplicationSummary = function (data) {
      self.applicationInfo().currentSubmissionId(data.submissionId.value);
      self.applicationInfo().currentApplicationStatus(data.applications.applicationStatus);
      self.applicationInfo().currentApplicationId(data.applications.applicationId.value);
      self.applicationInfo().currentApplicationIdDisplayValue(data.applications.applicationId.displayValue);
      self.applicationInfo().currentSubmissionStatus(data.applications.submissionStatus);
      self.applicationInfo().currentApplicationProgress(0);
      self.applicationInfo().currentOfferDesc(data.applications.offerDesc);
      self.applicationInfo().productType(data.applications.productType);
      self.applicationInfo().submissionDate(data.applications.submissionDate);
      self.applicationInfo().remarks(data.applications.remarks);
      self.applicationInfo().currentApplicationStatusDesc(data.applications.applicationStatusDesc);
      self.applicationInfo().totalRequestedAmount = data.applications.totalRequestedAmount;

      if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
        self.currentUser(rootParams.dashboard.userData.userProfile);
        ApplicationListModel.fetchApplicationsDetails(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId(), successHandlers.applicantListSucessHandler);
        self.currentUser().isPrimaryApplicant = ko.observable(true);
        self.currentUser().isNewParty = ko.observable();
      }

      if ($.inArray(data.applications.productType, [
          "UPL1",
          "AUTOLOANS",
          "AUTO"
        ]) > -1) {
        self.productClassName("LOANS");
      } else {
        self.productClassName("CASA");
      }

      self.productSubClassName(data.applications.productType);
      self.applicationData().currentStage = "product-tracking-base";
      self.getNextStage();
    };

    self.toggleApplicationsView = function (event) {
      if (event.detail.value === "SUBMITTED") {
        self.showSubmittedApplications(true);
      } else if (event.detail.value === "DRAFT") {
        self.showSubmittedApplications(false);
      }
    };
  };
});