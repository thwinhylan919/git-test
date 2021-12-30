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
], function(ko, FeedbackModel, resourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);

    if (!params.rootModel.params.feedbackHomeDTO) {
      params.rootModel.params.feedbackHomeDTO = params.rootModel.feedbackHomeDTO;
      params.rootModel.params.feedbackDefinitionDTO = params.rootModel.feedbackDefinitionDTO;
    }

    self.resource = resourceBundle;
    self.groupValid = ko.observable();
    self.defaultRole = ko.observableArray([]);
    self.inputTemplateIdentifier = ko.observable();
    self.inputTemplateName = ko.observable();
    self.feedbackUserRole = ko.observable([]);
    self.feedbackUserRoleLoaded = ko.observable(false);
    self.hideButtons = ko.observable(false);
    self.overallQuestion = ko.observable();
    params.dashboard.headerName(self.resource.title);
    self.applicableRoles = ko.observable();
    self.onEdit = ko.observable(false);
    self.version = ko.observable();
    self.templateId = ko.observable();
    self.selectedScale = ko.observable();
    self.selectedScaleType = ko.observable();
    self.reviewTemplate = ko.observable();
    self.feedbackDefinitionDTO = ko.observableArray([]);
    params.baseModel.registerComponent("feedback-home", "feedback");
    params.baseModel.registerComponent("feedback-template-search", "feedback");

    if(params.rootModel.params.reviewTemplate){

      self.reviewTemplate = ko.observable(params.rootModel.params.reviewTemplate);
    }

    self.back = function() {
      params.dashboard.loadComponent("feedback-template-search", self);
    };

    if (params.rootModel.params.feedbackHomeDTO) {
      self.hideButtons(params.rootModel.params.reviewTemplate);
      self.inputTemplateIdentifier(params.rootModel.params.feedbackHomeDTO.templateIdentifier);
      self.inputTemplateName(params.rootModel.params.feedbackHomeDTO.templateName);
      self.defaultRole(params.rootModel.params.feedbackHomeDTO.roles);

      if(params.rootModel.params.feedbackHomeDTO.version !== undefined){
        self.onEdit(true);
        self.version(params.rootModel.params.feedbackHomeDTO.version);
        self.templateId(params.rootModel.params.feedbackHomeDTO.templateId);
        self.selectedScale(params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleId);
        self.selectedScaleType(params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleType);
        self.feedbackDefinitionDTO(params.rootModel.params.feedbackDefinitionDTO);

      }

      self.applicableRoles(self.defaultRole());
      self.overallQuestion(params.rootModel.params.feedbackHomeDTO.templateDescription);
    }
    else {
      self.reviewTemplate = ko.observable(false);
    }

    FeedbackModel.getFeedbackUserRole().done(function(data) {
      for (let j = 0; j < data.enterpriseRoleDTOs.length; j++) {
        if (data.enterpriseRoleDTOs[j].enterpriseRoleId !== "administrators" && data.enterpriseRoleDTOs[j].enterpriseRoleId !== "administrator") {
          self.feedbackUserRole().push(data.enterpriseRoleDTOs[j]);
        }
      }

      self.feedbackUserRoleLoaded(true);
    });

    self.showGlobalscreenNext = function() {
      const tracker = document.getElementById("tracker");

      if (tracker.valid === "valid") {
        self.applicableRoles(self.defaultRole().join());

        if (params.rootModel.params.fromApproval) {
          self.reviewTemplate(true);

          const feedbackHomeDTO = {
            templateIdentifier: self.inputTemplateIdentifier(),
            templateName: self.inputTemplateName(),
            templateDescription: self.overallQuestion(),
            templateId: self.templateId(),
            version: self.version(),
            roles: self.applicableRoles(),
            scaleDTO: {
              scaleId: self.selectedScale(),
              scaleType: self.selectedScaleType()
            }
          };

          params.dashboard.loadComponent("feedback-home", {
            feedbackHomeDTO: feedbackHomeDTO,
            feedbackDefinitionDTO: self.feedbackDefinitionDTO(),
            fromLanding: true
          }, self);
        } else {
          params.dashboard.loadComponent("feedback-home",self);
        }
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.showGlobalscreenSave = function() {
      const tracker = document.getElementById("tracker");

      if (tracker.valid === "valid") {
        self.applicableRoles(self.defaultRole().join());

        if (!params.rootModel.params.fromApproval) {
          self.reviewTemplate(true);

          const feedbackHomeDTO = {
            templateIdentifier: self.inputTemplateIdentifier(),
            templateName: self.inputTemplateName(),
            templateDescription: self.overallQuestion(),
            templateId: self.templateId(),
            version: self.version(),
            scaleDTO: {
              scaleId: params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleId,
              scaleType: params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleType
            },
            roles: self.defaultRole()
          };

          params.dashboard.loadComponent("feedback-template-create", {
            feedbackHomeDTO: feedbackHomeDTO,
            feedbackDefinitionDTO: params.rootModel.params.feedbackDefinitionDTO(),
            reviewTemplate : true,
            fetchedTxn: params.rootModel.params.fetchedTxn
          }, self);
        }
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };
  };
});