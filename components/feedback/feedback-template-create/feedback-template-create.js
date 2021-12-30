define([

  "knockout",

  "./model",
  "ojL10n!resources/nls/feedback",
  "ojs/ojbutton"
], function (ko, FeedbackModel, resourceBundle) {
  "use strict";

  /**
   * File contains the view model for listing of properties realated to db table digx_fw_configallb.
   *
   * @property {boolean}  templateLoaded       - Initially self flag is set to false until data is fetched from server
   *                                            and ready to display on UI.
   * return function - description
   *
   * @param  {Object} params - Parent context.
   * @return {void}
   */
  return function (params) {
    const self = this;

    if (params.rootModel.params.fromApproval) {
      params.rootModel.params.feedbackHomeDTO = params.rootModel.params.feedbackHomeDTO();
      params.rootModel.params.feedbackDefinitionDTO = params.rootModel.params.feedbackDefinitionDTO();
      ko.utils.extend(self, params.rootModel.params);
    } else {
      ko.utils.extend(self, params.rootModel);
      params.rootModel.params.feedbackDefinitionDTO = ko.observable(params.rootModel.params.feedbackDefinitionDTO);
    }

    self.resource = resourceBundle;
    self.fromApproval = ko.observable(false);
    self.fromReview = ko.observable(false);
    self.templateLoaded = ko.observableArray(false);
    params.dashboard.headerName(self.resource.title);
    self.transactionName = ko.observable(self.resource.message);
    params.baseModel.registerElement("confirm-screen");
    self.selectedStepValue = ko.observable();
    self.disableInputsGlobal = ko.observable();
    self.fetchedTransactions = ko.observable();

    if (params.rootModel.params.fetchedTxn) {
      self.fetchedTransactions(params.rootModel.params.fetchedTxn);

    }

    self.reviewTemplate = ko.observable(params.rootModel.params.reviewTemplate);
    self.selectedScale = ko.observable(params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleId);
    self.showViewFlag = ko.observable(params.rootModel.params.isViewFlag ? params.rootModel.params.isViewFlag : false);

    self.componentsToLoad = [{
      label: self.resource.titleForTemplate,
      id: "feedback-template-landing"
    },
    {
      label: self.resource.selectScale,
      id: "feedback-scale-configuration"
    },
    {
      label: self.resource.selectQuestions,
      id: "feedback-question-configurations"
    },
    {
      label: self.resource.linkTransaction,
      id: "feedback-transaction-configuration"
    }
    ];

    self.backToSearch = function () {
      params.dashboard.loadComponent("feedback-template-search", self);
    };

    self.addTemplate = function () {
      let transactionsList = [],
        feedbackObject = null;
      const definitionDTOs = [];
      let transactionCount = 0;

      params.rootModel.params.feedbackDefinitionDTO().forEach(function (dto) {
        transactionCount++;

        if (typeof dto.temp_transactions === "object") {
          if (dto.temp_transactions.length > 1) {
            dto.transactionId(dto.temp_transactions[0]);
            dto.transactionGroupId(transactionCount);
            transactionsList = dto.temp_transactions;
            definitionDTOs.push(dto);

            for (let k = 1; k < transactionsList.length; k++) {
              feedbackObject = JSON.parse(JSON.stringify(dto));
              feedbackObject.transactionId = transactionsList[k];
              feedbackObject.transactionGroupId = transactionCount;
              feedbackObject.ratings = ko.mapping.fromJS(dto.ratings());
              definitionDTOs.push(feedbackObject);
            }

          } else if (dto.temp_transactions.length === 1) {
            dto.transactionId = JSON.parse(JSON.stringify(dto.temp_transactions[0]));
            dto.transactionGroupId = transactionCount;
            definitionDTOs.push(dto);
          }
        } else if (dto.temp_transactions().length > 1) {
          dto.transactionId = dto.temp_transactions()[0];
          dto.transactionGroupId = transactionCount;
          transactionsList = dto.temp_transactions();
          definitionDTOs.push(dto);

          for (let v = 1; v < transactionsList.length; v++) {
            feedbackObject = JSON.parse(JSON.stringify(dto));
            feedbackObject.transactionId = transactionsList[v];
            feedbackObject.transactionGroupId = transactionCount;
            feedbackObject.ratings = ko.mapping.fromJS(dto.ratings());
            definitionDTOs.push(feedbackObject);
          }
        } else if (dto.temp_transactions().length === 1) {
          dto.transactionId = JSON.parse(JSON.stringify(dto.temp_transactions()[0]));
          dto.transactionGroupId = transactionCount;
          definitionDTOs.push(dto);
        }
      });

      let flag = false,
        transactionObj = null,
        tempOption = null;
      const newDefDTO = [];
      let defdto = null;

      self.tempTransArray = [];

      if(self.fetchedTransactions() !== undefined){
        for (let i = 0; i < self.fetchedTransactions().length; i++) {
          self.tempTransArray.push(self.fetchedTransactions()[i].transactionId);
        }
      }

      definitionDTOs.forEach(function (dto) {
        defdto = null;

        defdto = JSON.parse(ko.toJSON(dto));

        if (self.tempTransArray[0] === undefined) {
          flag = false;
        } else {
          flag = self.tempTransArray.includes(defdto.transactionId);

        }

        if (flag) {
          self.fetchedTransactions().forEach(function (transaction) {
            if (transaction.transactionId === defdto.transactionId) {
              transactionObj = JSON.parse(JSON.stringify(transaction));

            }
          });

          transactionObj.ratings.reverse();
          defdto.version = transactionObj.version;
          defdto.ratings = transactionObj.ratings;

          for (let a = 0; a < defdto.ratings.length; a++) {
            defdto.ratings[a].version = transactionObj.ratings[a].version;

            for (let b = 0; b < defdto.ratings[a].questionRequestList.length; b++) {
              if (defdto.ratings[a].questionRequestList[b].questionId === transactionObj.ratings[a].questionRequestList[b].questionId) {
                defdto.ratings[a].questionRequestList[b].version = JSON.parse(JSON.stringify(transactionObj.ratings[a].questionRequestList[b].version));
                defdto.ratings[a].questionRequestList[b].questionDefintionId = JSON.parse(JSON.stringify(transactionObj.ratings[a].questionRequestList[b].questionDefintionId));
              }

              for (let c = 0; c < defdto.ratings[a].questionRequestList[b].optionsRequestList.length; c++) {
                if (transactionObj.ratings[a].questionRequestList[b].optionsRequestList[c]) {
                  tempOption = null;

                  tempOption = ko.utils.arrayFilter(transactionObj.ratings[a].questionRequestList[b].optionsRequestList, function (obj) {
                    if (obj.optionId === defdto.ratings[a].questionRequestList[b].optionsRequestList[c].optionId) {
                      return obj;
                    }
                  });

                  if (tempOption[0]) {
                    defdto.ratings[a].questionRequestList[b].optionsRequestList[c].version = tempOption[0].version;
                  }
                }
              }
            }
          }
        } else {
          defdto.ratings.forEach(function (rating) {
            rating.questionRequestList.forEach(function (question) {
              question.questionDefintionId = null;
            });
          });
        }

        newDefDTO.push(JSON.parse(JSON.stringify(defdto)));
      });

      const enterpriseRolesModified = [];

      for (let e = 0; e < params.rootModel.params.feedbackHomeDTO.roles.length; e++) {
        enterpriseRolesModified.push(params.rootModel.params.feedbackHomeDTO.roles[e].toLowerCase());
      }

      const feedbackDefinitionDTO = {
        templateIdentifier: params.rootModel.params.feedbackHomeDTO.templateIdentifier,
        templateName: params.rootModel.params.feedbackHomeDTO.templateName,
        templateDescription: params.rootModel.params.feedbackHomeDTO.templateDescription,
        scaleDTO: {
          scaleId: params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleId,
          scaleType: params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleType
        },
        templateId: params.rootModel.params.feedbackHomeDTO.templateId ? params.rootModel.params.feedbackHomeDTO.templateId : null,
        version: params.rootModel.params.feedbackHomeDTO.version ? params.rootModel.params.feedbackHomeDTO.version : null,
        enterpriseRoles: enterpriseRolesModified,
        definitionDTOs: newDefDTO
      };

      FeedbackModel.addTemplate(ko.mapping.toJSON(feedbackDefinitionDTO, {
        ignore: ["temp_questionSelected", "temp_optionsRequestList", "temp_questionDescription", "temp_selectedOptions", "temp_transactions", "temp_txnCollection", "transactions_count"]
      }), params.rootModel.params.feedbackHomeDTO.templateId).done(function (data, status, jqXhr) {
        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.transactionName(),
          template: "feedback/feedback-create-confirmation",
          resource: self.resource
        }, self);
      });
    };

    self.edit = function (event) {
      self.fromReview(true);

      if (event.id === "feedback-template-landing") {

        params.dashboard.loadComponent(event.id, {
          feedbackHomeDTO: params.rootModel.params.feedbackHomeDTO,
          fromApproval: false,
          reviewTemplate: false,
          feedbackDefinitionDTO: params.rootModel.params.feedbackDefinitionDTO,
          fetchedTxn: self.fetchedTransactions()

        }, self);
      } else {

        self.disableInputsGlobal(false);

        params.dashboard.loadComponent("feedback-home", {
          feedbackHomeDTO: params.rootModel.params.feedbackHomeDTO,
          selectedStepValue: self.selectedStepValue(event.id),
          fromReview: true,
          feedbackDefinitionDTO: params.rootModel.params.feedbackDefinitionDTO
        }, self);
      }
    };

    self.toLastStep = function (event) {

      params.dashboard.loadComponent("feedback-home", {
        feedbackHomeDTO: params.rootModel.params.feedbackHomeDTO,
        feedbackDefinitionDTO: params.rootModel.params.feedbackDefinitionDTO,
        fromApproval: false,
        reviewTemplate: false,
        fromReview: true,
        forBackOnly: true

      }, self);

    };
  };
});