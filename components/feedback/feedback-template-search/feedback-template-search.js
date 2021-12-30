define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/feedback",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojcheckboxset",
  "ojs/ojarraydataprovider",
  "ojs/ojtable",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup",
  "ojs/ojgauge",
  "ojs/ojselectcombobox"
], function(oj, ko, $, FeedbackModel, resourceBundle) {
  "use strict";

  return function(params) {
    const self = this;

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    self.inputTemplateIdentifier = ko.observable();
    self.inputTemplateName = ko.observable();
    self.feedbackUserRole = ko.observable([]);
    self.feedbackTemplateList = ko.observable([]);
    self.feedbackTemplateListLoaded = ko.observable(false);
    self.feedbackReviewHeader = ko.observable(false);
    self.feedbackUserRoleLoaded = ko.observable(false);
    self.viewTable = ko.observable(false);
    self.viewTemplate = ko.observable();
    self.dataSource = ko.observable();
    self.overallQuestion = ko.observable();
    self.defaultRole = ko.observableArray([]);
    self.applicableRoles = ko.observable();
    params.dashboard.headerName(self.resource.title);
    self.templateList = ko.observable();
    params.baseModel.registerComponent("feedback-home", "feedback");
    params.baseModel.registerComponent("feedback-template-landing", "feedback");
    params.baseModel.registerComponent("feedback-template-create", "feedback");
    params.baseModel.registerComponent("feedback-home", "feedback");

    self.headerText = ko.observableArray([{
        headerText: self.resource.templateIdentifier,
        renderer: oj.KnockoutTemplateUtils.getRenderer("templateIdentifier", true)
      },
      {
        headerText: self.resource.templateName,
        field: "templateName"
      },
      {
        headerText: self.resource.applicableToRole,
        field: "enterpriseRoles"
      }
    ]);

    FeedbackModel.getFeedbackUserRole().done(function(data) {
      for (let j = 0; j < data.enterpriseRoleDTOs.length; j++) {
        if (data.enterpriseRoleDTOs[j].enterpriseRoleId !== "administrators" && data.enterpriseRoleDTOs[j].enterpriseRoleId !== "administrator") {
          self.feedbackUserRole().push(data.enterpriseRoleDTOs[j]);
        }
      }

      self.feedbackUserRoleLoaded(true);
    });

    self.onSelectedInTable = function(data) {
      if (data.templateId) {
        self.feedbackReviewHeader(false);

        const tempEntity = ko.utils.arrayFilter(self.templateList(), function(entity) {
          if (entity.templateId === data.templateId) {
            return entity;
          }
        });

        if (tempEntity[0].templateId) {
          const templateDetails = {
            templateId: tempEntity[0].templateId,
            templateName: tempEntity[0].templateName,
            isView: true,
            reviewTemplate : true
          };

          params.dashboard.loadComponent("feedback-home", {
            templateDetails: templateDetails
          }, self);
        }
      }
    };

    self.openCreate = function() {
      params.dashboard.loadComponent("feedback-template-landing", self);
    };

    self.searchResult = function() {
      FeedbackModel.fetchTemplateList(self.inputTemplateIdentifier(), self.inputTemplateName(), self.defaultRole()).done(function(data) {
        if (data.feedbackTemplateDTO) {
          self.templateList(data.feedbackTemplateDTO);
          self.feedbackTemplateListLoaded(true);
        }

        let tempData = null;

        tempData = $.map(data.feedbackTemplateDTO, function(v) {
          const newObj = {};

          newObj.templateIdentifier = v.templateIdentifier;
          newObj.templateName = v.templateName;
          newObj.enterpriseRoles = v.enterpriseRoles.join();
          newObj.templateId = v.templateId;

          if(v.enterpriseRoles[0] === "retailuser" && v.enterpriseRoles[1] === "corporateuser"){
            v.enterpriseRoles[0] = self.resource.retailUser;
            v.enterpriseRoles[1] = self.resource.corpUser;
          }

          return newObj;
        });

        self.dataSource(new oj.ArrayDataProvider(tempData, {
          idAttribute: "templateId"
        }));

        self.viewTable(true);
      });
    };

    self.clearFields = function() {
      self.feedbackUserRoleLoaded(false);
      ko.tasks.runEarly();
      self.inputTemplateIdentifier("");
      self.inputTemplateName("");
      self.defaultRole().splice(0, self.defaultRole().length);
      self.feedbackUserRoleLoaded(true);
    };
  };
});