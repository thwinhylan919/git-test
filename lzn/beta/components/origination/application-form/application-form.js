define([

  "knockout",
  "jquery",
  "./model",
  "ojL10n!lzn/beta/resources/nls/application-form",
  "ojs/ojradioset",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojtrain",
  "ojs/ojdatetimepicker"
], function(ko, $, ApplicationFormModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;
    let i, j;
    const successHandlers = {};

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.applicantType = "PRIMARY";
    self.dataLoaded = ko.observable(false);

    successHandlers.successHandlerfetchApplcantList = function(data) {
      if (data.applicants && data.applicants.length > 0) {
        data.applicants.forEach(function(e) {
          if (e.applicantRelationshipType === "CO_APPLICANT") {
            self.applicantDetails()[1].applicantId(e.applicantId);
          }

          if (e.applicantRelationshipType === "APPLICANT") {
            self.applicantDetails()[0].applicantId(e.applicantId);
          }

          return null;
        });
      }

      self.dataLoaded(true);
    };

    ApplicationFormModel.fetchpplicantList(self.productDetails().submissionId.value, successHandlers.successHandlerfetchApplcantList);

    if (!self.applicantDetails()[0].applicantType) {
      self.applicantDetails()[0].applicantType = ko.observable("anonymous");
      self.applicantDetails()[0].channelUser = ko.observable(false);

      for (i = 1; i <= self.productDetails().requirements.noOfCoApplicants; i++) {
        self.applicantDetails()[i].applicantType = ko.observable("anonymous");
        self.applicantDetails()[i].channelUser = ko.observable(false);
      }
    }

    if (typeof self.productDetails().requirements.requestedTenure !== "undefined" && self.productDetails().requirements.requestedTenure.years() !== 0) {
      self.tenure(self.tenure() + self.productDetails().requirements.requestedTenure.years() + self.resource.years);
    }

    if (typeof self.productDetails().requirements.requestedTenure !== "undefined" && self.productDetails().requirements.requestedTenure.months() !== 0) {
      self.tenure(self.tenure() + self.productDetails().requirements.requestedTenure.months() + self.resource.months);
    }

    if (!self.productDetails().application) {
      self.productDetails().applicantList = ko.observableArray([]);

      self.productDetails().application = ko.observable({
        stages: ko.observableArray([])
      });

      rootParams.baseModel.registerComponent(self.productDetails().currentStage.stages[0].id, "origination");
      self.productDetails().productApplicationComponentName = ko.observable(self.productDetails().currentStage.stages[0].id);

      for (i = 0; i < self.productDetails().currentStage.stages.length; i++) {
        self.productDetails().application().stages.push(self.productDetails().currentStage.stages[i]);

        if (self.productDetails().application().stages()[i].stages !== null) {
          self.productDetails().application().stages()[i].applicantStages = JSON.parse(ko.toJSON(self.productDetails().application().stages()[i].stages));

          for (j = 0; j < self.productDetails().application().stages()[i].stages.length; j++) {
            self.productDetails().application().stages()[i].applicantStages[j].isComplete = ko.observable(false);
          }
        }
      }

      self.productDetails().application().currentApplicationStage = self.productDetails().application().stages()[0];
    }

    self.validateEmploymentProfile = function() {
      if (self.disableFinalContinue(self.productDetails().application().currentApplicationStage.applicantStages)) {
        $("#continueInvalid").trigger("openModal");
      } else if (self.productDetails().sectionBeingEdited()) {
        self.getNextApplicationStage();
      } else {
        ApplicationFormModel.validateEmployment(self.productDetails().submissionId.value, self.applicantDetails()[0].applicantId().value, 0, successHandlers.successHanldervalidateEmployment);
      }
    };

    self.disableFinalContinue = function(obj) {
      for (let i = 0; i < obj.length; i++) {
        if (!JSON.parse(obj[i].isComplete())) {
          return true;
        }
      }

      return false;
    };

    let count = 0;

    successHandlers.successHanldervalidateEmployment = function(data, validateEmploymentIndex) {
      count++;

      if (data.employmentProfiles) {
        self.applicantDetails()[validateEmploymentIndex].financialProfile = [];
        self.employmentProfileIds = ko.observableArray();

        for (let i = 0; i < data.employmentProfiles.length; i++) {
          self.employmentProfileIds().push(data.employmentProfiles[i].id);

          self.applicantDetails()[validateEmploymentIndex].financialProfile.push({
            profileId: data.employmentProfiles[i].id,
            type: data.employmentProfiles[i].type
          });
        }
      }

      if (count === 1 && self.applicantDetails().length > 1) {
        ApplicationFormModel.validateEmployment(self.productDetails().submissionId.value, self.applicantDetails()[1].applicantId().value, 1, successHandlers.successHanldervalidateEmployment);
      }

      if (count === self.applicantDetails().length) {
        self.getNextApplicationStage();
      }
    };
  };
});