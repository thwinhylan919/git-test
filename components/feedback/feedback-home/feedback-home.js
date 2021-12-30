define([
  "knockout",
  "./model",
  "ojL10n!resources/nls/feedback",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtrain",
  "ojs/ojcheckboxset",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup",
  "ojs/ojgauge",
  "ojs/ojselectcombobox"
], function (ko, FeedbackModel, resourceBundle) {
  "use strict";

  return function (params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    self.selectedStepValue = ko.observable("feedback-scale-configuration");
    self.newQuestionsValue = ko.observable("");
    self.newOptionsRequestList = ko.observableArray([]);
    self.weightage = ko.observable([]);
    self.selectedStepLabel = ko.observable(self.resource.selectScale);
    self.question = ko.observable([]);
    self.addAnotherTransactionInput = ko.observable(false);
    self.newQuestions = ko.observable([]);
    self.feedbackUserRole = ko.observable([]);
    self.globalLoaded = ko.observable(false);
    self.reviewTemplate = ko.observable(false);
    self.disableInputsGlobal = ko.observable(false);
    self.disableTrain = ko.observable(false);
    self.selectedScale = ko.observable();
    self.forEdit = ko.observable(true);
    self.newOption = ko.observableArray([]);
    self.options = ko.observable([]);
    self.scaleTypeSelected = ko.observable();
    self.templateId = ko.observable("");
    self.version = ko.observable("");
    self.isViewFlag = ko.observable(false);
    self.hideTemplateInfo = ko.observable(false);
    self.fromApproval = ko.observable(false);
    self.scaleTypeText = ko.observable(self.resource.selectScale);
    self.feedbackHomeDTO = ko.observable();
    self.fetchedTransactions = ko.observable([]);
    self.feedbackOriginalDTO = [];

    if (!params.rootModel.params.templateDetails && !params.rootModel.params.fromReview) {
      self.applicableRoles = ko.observable(params.rootModel.params.defaultRole());
      self.overallQuestion = ko.observable(params.rootModel.params.overallQuestion());

      self.inputTemplateIdentifier = ko.observable(params.rootModel.params.inputTemplateIdentifier());

      self.inputTemplateName = ko.observable(params.rootModel.params.inputTemplateName());
      self.selectedScale = ko.observable(params.rootModel.params.selectedScale());

      self.scaleTypeText = ko.observable(params.rootModel.params.selectedScaleType());

      if (params.rootModel.params.version) {
        self.version = ko.observable(params.rootModel.params.version());
        self.templateId = ko.observable(params.rootModel.params.templateId());

      }

      if(ko.toJS(params.rootModel.params.feedbackDefinitionDTO())){
        self.feedbackDefinitionDTO = ko.observable(ko.toJS(params.rootModel.params.feedbackDefinitionDTO()));

      }

    }
    else if (params.rootModel.params.fromReview) {
      self.applicableRoles = ko.observable(params.rootModel.params.feedbackHomeDTO.roles);
      self.overallQuestion = ko.observable(params.rootModel.params.feedbackHomeDTO.templateDescription);

      self.inputTemplateIdentifier = ko.observable(params.rootModel.params.feedbackHomeDTO.templateIdentifier);

      self.inputTemplateName = ko.observable(params.rootModel.params.feedbackHomeDTO.templateName);
      self.templateId = ko.observable(params.rootModel.params.feedbackHomeDTO.templateId);
      self.version = ko.observable(params.rootModel.params.feedbackHomeDTO.version);

    }

    if (self.fromReview && self.fromReview()) {
      self.hideTemplateInfo(true);
    }

    if (params.rootModel.feedbackOriginalDTO) {
      self.feedbackOriginalDTO = params.rootModel.feedbackOriginalDTO;
    }

    if (params.rootModel.params.feedbackDefinitionDTO) {
      self.fetchedTransactions(ko.toJS(params.rootModel.params.feedbackDefinitionDTO()));
    }

    params.baseModel.registerComponent("feedback-template-landing", "feedback");
    params.baseModel.registerComponent("feedback-scale-configuration", "feedback");
    params.baseModel.registerComponent("feedback-question-configurations", "feedback");
    params.baseModel.registerComponent("feedback-transaction-configuration", "feedback");
    params.dashboard.headerName(self.resource.title);

    self.componentsToLoadable = [{
      label: self.resourcetitleForTemplate,
      id: "feedback-template-create"
    }];

    if (params.rootModel.params.templateDetails) {
      FeedbackModel.getFeedbackTemplate(params.rootModel.params.templateDetails.templateId).done(function (data) {
        if (data.feedbackTemplateDTO) {
          if (data.feedbackTemplateDTO[0].definitionDTOs) {
            self.feedbackDefinitionDTO = ko.mapping.fromJS(data.feedbackTemplateDTO[0].definitionDTOs);
            self.fetchedTransactions(data.feedbackTemplateDTO[0].definitionDTOs);

            for (let v = 0; v < data.feedbackTemplateDTO[0].definitionDTOs.length; v++) {
              self.feedbackOriginalDTO.push(data.feedbackTemplateDTO[0].definitionDTOs[v].transactionId);
            }

            self.reviewTemplate(true);
            self.templateId(data.feedbackTemplateDTO[0].templateId);
            self.version(data.feedbackTemplateDTO[0].version);

            const feedbackHomeDTO = {
              templateIdentifier: data.feedbackTemplateDTO[0].templateIdentifier,
              templateName: data.feedbackTemplateDTO[0].templateName,
              templateDescription: data.feedbackTemplateDTO[0].templateDescription,
              templateId: data.feedbackTemplateDTO[0].templateId,
              version: data.feedbackTemplateDTO[0].version,
              scaleDTO: {
                scaleId: data.feedbackTemplateDTO[0].scaleDTO.scaleId,
                scaleType: self.scaleTypeText() + data.feedbackTemplateDTO[0].scaleDTO.scaleId
              },
              roles: data.feedbackTemplateDTO[0].enterpriseRoles
            };

            self.selectedScale(data.feedbackTemplateDTO[0].scaleDTO.scaleId);
            params.baseModel.registerComponent("feedback-template-create", "feedback");

            if (params.rootModel.params.templateDetails.isView) {
              self.isViewFlag(true);
            } else {
              self.isViewFlag(false);
            }

            params.dashboard.loadComponent("feedback-template-create", {
              feedbackHomeDTO: feedbackHomeDTO,
              feedbackDefinitionDTO: self.feedbackDefinitionDTO(),
              isViewFlag: self.isViewFlag(),
              reviewTemplate: true,
              fetchedTxn: self.fetchedTransactions()
            }, self);

            self.forEdit(true);
          }
        }
      });
    } else if (params.rootModel.params.data) {
      self.feedbackReviewHeader = ko.observable(false);
      self.feedbackDefinitionDTO = ko.mapping.fromJS(params.rootModel.transactionDetails().transactionSnapshot.definitionDTOs);
      self.reviewTemplate(true);
      self.templateId(params.rootModel.transactionDetails().transactionSnapshot.templateId);
      self.version(params.rootModel.transactionDetails().transactionSnapshot.version);

      const feedbackHomeDTO = {
        templateIdentifier: params.rootModel.transactionDetails().transactionSnapshot.templateIdentifier,
        templateName: params.rootModel.transactionDetails().transactionSnapshot.templateName,
        templateDescription: params.rootModel.transactionDetails().transactionSnapshot.templateDescription,
        templateId: params.rootModel.transactionDetails().transactionSnapshot.templateId,
        version: params.rootModel.transactionDetails().transactionSnapshot.version,
        scaleDTO: {
          scaleId: params.rootModel.transactionDetails().transactionSnapshot.scaleDTO.scaleId,
          scaleType: self.scaleTypeText() + params.rootModel.transactionDetails().transactionSnapshot.scaleDTO.scaleId
        },
        roles: params.rootModel.transactionDetails().transactionSnapshot.enterpriseRoles
      };

      self.fromApproval(true);
      self.selectedScale(params.rootModel.transactionDetails().transactionSnapshot.scaleDTO.scaleId);
      params.baseModel.registerComponent("feedback-template-create", "feedback");
      self.feedbackHomeDTO(feedbackHomeDTO);
      self.forEdit(true);
    } else {
      self.globalLoaded(true);
    }

    if (params.rootModel.params.feedbackHomeDTO) {
      self.selectedScale(params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleId);
    }

    if (params.rootModel.params.selectedStepValue) {
      self.selectedStepValue(params.rootModel.params.selectedStepValue.selectedStepValue());
      self.disableTrain(true);
    }

    if (params.rootModel.params.fromLanding) {
      self.selectedStepValue("feedback-scale-configuration");
      self.disableTrain(true);
    }

    if (params.rootModel.params.forBackOnly) {
      self.selectedStepValue("feedback-transaction-configuration");
    }

    self.stepArray =
      ko.observableArray(
        [{
          label: self.resource.selectScale,
          id: "feedback-scale-configuration",
          visited: false,
          disabled: false
        },
        {
          label: self.resource.selectQuestions,
          id: "feedback-question-configurations",
          visited: false,
          disabled: true
        },
        {
          label: self.resource.linkTransaction,
          id: "feedback-transaction-configuration",
          visited: false,
          disabled: true
        }
        ]);

    if (params.rootModel.params.fromReview) {

      for (let j = 0; j < self.stepArray().length; j++) {
        self.stepArray()[j].disabled = false;
      }
    }

    self.backFromScale = function () {
      self.selectedScale(params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleId);
      self.reviewTemplate(false);
      params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleId = self.selectedScale();
      params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleType = self.scaleTypeText() + self.selectedScale();

      params.dashboard.loadComponent("feedback-template-landing", {
        feedbackHomeDTO: params.rootModel.params.feedbackHomeDTO,
        feedbackDefinitionDTO: self.feedbackDefinitionDTO()
      }, self);
    };

    self.saveToReview = function () {
      self.reviewTemplate(true);
      params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleId = self.selectedScale();
      params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleType = self.scaleTypeText() + self.selectedScale();

      params.dashboard.loadComponent("feedback-template-create", {
        feedbackHomeDTO: params.rootModel.params.feedbackHomeDTO,
        feedbackDefinitionDTO: self.feedbackDefinitionDTO()
      }, self);
    };

    self.nextStep = function () {
      const tracker = document.getElementById("tracker"),
        itrain = document.getElementById("train");

      if (tracker.valid === "valid") {
        self.globalLoaded(false);

        for (let j = 0; j < itrain.steps.length; j++) {
          if (itrain.selectedStep === itrain.steps[j].id) {
            itrain.steps[j].visited = true;
            itrain.steps[j].disabled = false;

            if (j < 2) {
              itrain.steps[j + 1].visited = true;
              itrain.steps[j + 1].disabled = false;
            }

            break;
          }
        }

        ko.tasks.runEarly();

        let loadIndex = 0;

        for (let i = 0; i < self.stepArray().length; i++) {
          if (self.stepArray()[i].id === self.selectedStepValue()) {
            loadIndex = i + 1;
            break;
          }
        }

        self.selectedStepValue(self.stepArray()[loadIndex].id);
        self.globalLoaded(true);
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.previousStep = function () {
      self.globalLoaded(false);

      const itrain = document.getElementById("train");

      for (let j = 0; j < itrain.steps.length; j++) {
        if (itrain.selectedStep === itrain.steps[j].id) {
          itrain.steps[j].visited = true;
          itrain.steps[j].disabled = false;

          if (j > 0) {
            itrain.steps[j - 1].visited = true;
            itrain.steps[j - 1].disabled = false;
          }

          break;
        }
      }

      ko.tasks.runEarly();

      let loadIndex = 0;

      for (let i = 0; i < self.stepArray().length; i++) {
        if (self.stepArray()[i].id === self.selectedStepValue()) {
          loadIndex = i - 1;
          break;
        }
      }

      self.selectedStepValue(self.stepArray()[loadIndex].id);
      self.globalLoaded(true);
    };
  };
});
