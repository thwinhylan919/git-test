define([

  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/feedback",
  "promise",
  "load!./feedback-mapping-scales.json",
  "ojs/ojbutton",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup",
  "ojs/ojselectcombobox",
  "ojs/ojcheckboxset",
  "ojs/ojaccordion"
], function (ko, $, FeedbackModel, resourceBundle, Promise, Scales) {
  "use strict";

  /**
   * File contains the view model for listing of properties realated to db table digx_fw_configallb
   *
   * @property {String}   selectedTransaction          - preference name for selection of transactions selected by user
   *
   * @property {String}  selectedWeightage       - preference name for selection of weightage selected by user
   *
   * @property {Array}    transactionList          - Array that maintains the list of transactionList fetched from the server
   *                                            and loops over it to display on UI.
   * @property {Array}    weightage         - Array that maintains the list of weightage fetched from the server
   *                                            and loops over it to display on UI.
   *
   * @property {Boolean} dataLoaded        - flag for use to show transaction page or hide.
   */
  /**
   * Return function - description.
   *
   * @param  {Object} params - Parent context.
   * @return {void}
   */
  return function (params) {
    const self = this,
      feedbackModel = new FeedbackModel(),
      getNewKoModel = function () {
        const FeedbackTemplateModel = feedbackModel.getNewModel();

        FeedbackTemplateModel.feedbackDefinitionDTO = ko.observable(FeedbackTemplateModel.feedbackDefinitionDTO);

        return FeedbackTemplateModel;
      };

    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    self.question = ko.observableArray([]);
    self.weightage = ko.observableArray([]);
    self.transactionList = ko.observableArray([]);
    self.dataLoaded = ko.observable(false);
    self.addAnotherTransactionInput = ko.observable(false);
    self.feedbackDefinitionDTODefault = ko.observableArray([]);
    self.newFeedbackDefinitionDTO = ko.observableArray([]);
    self.selectedTransactions = ko.observableArray([]);
    self.groupValid = ko.observable();
    params.baseModel.registerElement("modal-window");
    params.baseModel.registerComponent("feedback-template-create", "feedback");
    self.feedbackDefinitionDTO = ko.observableArray([]);
    self.customShape = ko.observable();
    self.scaleSVGLoaded = ko.observable(false);
    self.feedbackType = ko.observable([]);
    self.showGenericSection = ko.observable(false);
    self.showTransactionSection = ko.observable(false);
    self.feedbackDefinitionDTOFactory = ko.observableArray([]);
    self.feedbackReviewHeader = ko.observable(false);
    self.defaultRole = ko.observable();
    self.fetchedTxn = ko.observable();

    const feedbackWeightages = [{
      Id: "1"
    },
    {
      Id: "2"
    },
    {
      Id: "3"
    }, {
      Id: "4"
    }, {
      Id: "5"
    }
    ];

    if (params.rootModel.params.selectedStepValue) {
      self.fetchedTxn(ko.toJS(params.rootModel.params.feedbackDefinitionDTO()));
      params.rootModel.params.feedbackDefinitionDTO = ko.observable(params.rootModel.params.selectedStepValue.params.feedbackDefinitionDTO());
    } else if(ko.toJS(params.rootModel.params.feedbackDefinitionDTO()).length>0){
      self.fetchedTxn(ko.toJS(params.rootModel.params.feedbackDefinitionDTO()));
      params.rootModel.params.feedbackDefinitionDTO = ko.mapping.fromJS(ko.toJS(params.rootModel.params.feedbackDefinitionDTO()));
    } else{
      params.rootModel.params.feedbackDefinitionDTO(undefined);
    }

    self.customShape(Scales.scaleSVG[self.selectedScale() - 1].value);
    self.scaleSVGLoaded(true);

    self.convertToInt = function (data) {
      return parseInt(data());
    };

    self.addAnotherTransaction = function () {
      self.addAnotherTransactionInput(false);

      const ratings = [];

      self.weightage().forEach(function (item) {
        const feedbackModelInstance = getNewKoModel();

        feedbackModelInstance.feedbackDefinitionDTO()[0].ratings[0].weightId = item.Id;
        ratings.push(JSON.parse(JSON.stringify(feedbackModelInstance.feedbackDefinitionDTO()[0].ratings[0])));
      });

      self.newFeedbackDefinitionDTO().push({
        transactionId: null,
        temp_transactions: ko.observableArray([]),
        ratings: ko.mapping.fromJS(ratings)
      });

      ko.tasks.runEarly();
      self.addAnotherTransactionInput(true);
    };

    self.fetchChildLimitTasks = function (task, nestingLevel) {
      nestingLevel = nestingLevel - 1;

      const taskCodeList = [];

      if (task.childTasks) {
        for (let i = 0; i < task.childTasks.length; i++) {
          if (task.childTasks[i].id.toLowerCase() !== "or_n") {
            const currentTask = task.childTasks[i],
              taskObject = {};

            taskObject.label = currentTask.name;
            taskObject.value = currentTask.id;

            if (currentTask.childTasks && nestingLevel > 1) {
              taskObject.value = "";
              taskObject.isParent = true;
              taskObject.children = self.fetchChildLimitTasks(currentTask, nestingLevel);
            }

            taskCodeList.push(taskObject);
          }
        }
      }

      return taskCodeList;
    };

    self.feedbackTypeChangedHandler = function (event) {
      if (event.detail.value) {
        self.showGenericSection(false);
        self.showTransactionSection(false);
        ko.tasks.runEarly();

        event.detail.value.forEach(function (type) {
          if (type === "generic") {
            if (self.feedbackDefinitionDTODefault().length < 1) {
              self.feedbackDefinitionDTODefault().push({
                ratings: ko.observableArray([]),
                transactionId: "GENERIC",
                temp_transactions: ko.observableArray(["GENERIC"])
              });

              const ratings = [];

              self.weightage().forEach(function (item) {
                const feedbackModelInstance = getNewKoModel();

                feedbackModelInstance.feedbackDefinitionDTO()[0].ratings[0].weightId = item.Id;
                ratings.push(JSON.parse(JSON.stringify(feedbackModelInstance.feedbackDefinitionDTO()[0].ratings[0])));
              });

              self.feedbackDefinitionDTODefault()[0].ratings = ko.mapping.fromJS(ratings);
              self.showGenericSection(true);
            } else {
              self.showGenericSection(true);
            }
          }

          if (type === "transactions") {
            if (self.feedbackDefinitionDTO().length === 0) {
              self.fromCreate();
            }

            self.showTransactionSection(true);
          }
        });
      }
    };

    self.transactionHandler = function (event) {
      if (event.detail.value) {
        let children = "";

        event.detail.value.forEach(function (task) {
          self.transactionList().forEach(function (transaction) {
            if ((task === transaction.value) && transaction.isParent && (transaction.isParent === true)) {
              self.selectedTransactions().splice(transaction.value, 1);
              children = transaction.children;
              transaction.value = "";
            }
          });
        });

        if (children) {
          children.forEach(function (child) {
            self.selectedTransactions().push(child.value);
          });
        }
      }
    };

    self.createFeedbackTransaction = function () {
      self.feedbackReviewHeader(true);

      const tracker = document.getElementById("tracker");

      if (tracker.valid === "valid") {
        if (params.rootModel.params.feedbackHomeDTO) {
          self.templateId(params.rootModel.params.feedbackHomeDTO.templateId);
          self.inputTemplateName(params.rootModel.params.feedbackHomeDTO.templateName);
          self.overallQuestion(params.rootModel.params.feedbackHomeDTO.templateDescription);
          self.defaultRole(params.rootModel.params.feedbackHomeDTO.roles);
          self.version(params.rootModel.params.feedbackHomeDTO.version);
          self.inputTemplateIdentifier(params.rootModel.params.feedbackHomeDTO.templateIdentifier);
        }

        self.feedbackDefinitionDTO().push.apply(self.feedbackDefinitionDTO(), self.newFeedbackDefinitionDTO());

        if (!self.feedbackType().includes("transactions") && self.feedbackDefinitionDTO().length > 0) {
          self.feedbackDefinitionDTO().length = 0;
        }

        if (!self.feedbackType().includes("generic") && self.feedbackDefinitionDTODefault()[0]) {
          self.feedbackDefinitionDTODefault().length = 0;

          let deleteEntry = -1;

          for (let t = 0; t < self.feedbackDefinitionDTO().length; t++) {
            if (self.feedbackDefinitionDTO()[t].transactionId() === "GENERIC") {
              deleteEntry = t;
            }
          }

          if (deleteEntry > -1) {
            self.feedbackDefinitionDTO().splice(deleteEntry, 1);
          }
        }

        if (self.feedbackDefinitionDTODefault()[0] && self.feedbackDefinitionDTODefault()[0].ratings && self.feedbackDefinitionDTODefault()[0].ratings()[4].temp_questionDescription) {
          self.feedbackDefinitionDTO().push.apply(self.feedbackDefinitionDTO(), self.feedbackDefinitionDTODefault());
        }

        for (let a = self.feedbackDefinitionDTO().length - 1; a >= 0; a--) {
          if (self.feedbackDefinitionDTO()[a].temp_transactions().length === 0) {
            self.feedbackDefinitionDTO().splice(a, 1);
          }
        }

        self.reviewTemplate(true);

        const feedbackHomeDTO = {
          templateIdentifier: self.inputTemplateIdentifier(),
          templateName: self.inputTemplateName(),
          templateDescription: self.overallQuestion(),
          templateId: self.templateId(),
          version: self.version(),
          scaleDTO: {
            scaleId: self.selectedScale(),
            scaleType: self.scaleTypeText() + self.selectedScale()
          },
          roles: self.defaultRole() ? self.defaultRole() : params.rootModel.params.defaultRole(),
          reviewTemplate: true
        };

        params.dashboard.loadComponent("feedback-template-create", {
          feedbackHomeDTO: feedbackHomeDTO,
          feedbackDefinitionDTO: self.feedbackDefinitionDTO(),
          fetchedTxn : self.fetchedTxn(),
          reviewTemplate: self.reviewTemplate()
        }, self);
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };

    self.closePopup = function () {
      $("#createFeedback").hide();
    };

    const promiseFeedbackTransaction = new Promise(function (resolve) {
      feedbackModel.getFeedbackTransaction().done(function (data) {
        if (data.taskList) {
          resolve(data);
        }
      });
    }),
      promiseFeedbackQuestion = new Promise(function (resolve) {
        feedbackModel.getFeedbackQuestion().done(function (data) {
          if (data.questionResponseList) {
            resolve(data);
          }
        });
      });

    self.getQualifiedName = function (id) {
      for (let i = 0; i < self.transactionList().length; i++) {
        if (self.transactionList()[i].children) {
          for (let j = 0; j < self.transactionList()[i].children.length; j++) {
            if (self.transactionList()[i].children[j].value === id) {
              return self.transactionList()[i].children[j].label;
            }
          }
        } else if (self.transactionList()[i].value === id) {
          return self.transactionList()[i].label;
        }
      }
    };

    self.fromSearch = function () {
      params.rootModel.params.feedbackDefinitionDTO().forEach(function (dto) {
        dto.ratings().reverse();

        dto.ratings().forEach(function (rating) {
          rating.temp_questionSelected = ko.observable(true);
          rating.temp_questionDescription = ko.mapping.fromJS(rating.questionRequestList()[0].questionId());

          self.question().forEach(function (question) {
            if (question.questionId === rating.questionRequestList()[0].questionId()) {
              rating.temp_optionsRequestList = ko.observableArray(question.optionsRequestList);
            }
          });

          rating.temp_selectedOptions = ko.observableArray([]);

          rating.questionRequestList()[0].optionsRequestList().forEach(function (option) {
            rating.temp_selectedOptions().push(option.optionId());
          });
        });
      });

      let maxTxnGroupId = 0;

      for (let p = 0; p < params.rootModel.params.feedbackDefinitionDTO().length; p++) {
        if (params.rootModel.params.feedbackDefinitionDTO()[p].transactionGroupId() > maxTxnGroupId) {
          maxTxnGroupId = params.rootModel.params.feedbackDefinitionDTO()[p].transactionGroupId();
        }
      }

      for (let n = 0; n < maxTxnGroupId; n++) {
        const obj = {
          txn: n
        };

        self.feedbackDefinitionDTOFactory.push(obj);
      }

      for (let x = 0; x < params.rootModel.params.feedbackDefinitionDTO().length; x++) {
        if (!self.feedbackDefinitionDTOFactory()[parseInt(params.rootModel.params.feedbackDefinitionDTO()[x].transactionGroupId()) - 1].temp_txnCollection) {
          self.feedbackDefinitionDTOFactory()[parseInt(params.rootModel.params.feedbackDefinitionDTO()[x].transactionGroupId()) - 1] = params.rootModel.params.feedbackDefinitionDTO()[x];

          const txnObjFirst = {
            temp_txnCollection_name: params.rootModel.params.feedbackDefinitionDTO()[x].transactionId()
          };

          self.temp_txnCollection = ko.observableArray([]);
          self.temp_txnCollection.push(txnObjFirst);
          self.feedbackDefinitionDTOFactory()[parseInt(params.rootModel.params.feedbackDefinitionDTO()[x].transactionGroupId()) - 1].temp_txnCollection = self.temp_txnCollection();
        } else {
          const txnObj = {
            temp_txnCollection_name: params.rootModel.params.feedbackDefinitionDTO()[x].transactionId()
          };

          self.temp_txnCollection = ko.observableArray(self.feedbackDefinitionDTOFactory()[parseInt(params.rootModel.params.feedbackDefinitionDTO()[x].transactionGroupId()) - 1].temp_txnCollection);
          self.temp_txnCollection.push(txnObj);
          self.feedbackDefinitionDTOFactory()[parseInt(params.rootModel.params.feedbackDefinitionDTO()[x].transactionGroupId()) - 1].temp_txnCollection = self.temp_txnCollection();
        }
      }

      for (let a = 0; a < self.feedbackDefinitionDTOFactory().length; a++) {
        self.transactionCollection = ko.observableArray([]);

        for (let t = 0; t < self.feedbackDefinitionDTOFactory()[a].temp_txnCollection.length; t++) {
          self.transactionCollection.push(self.feedbackDefinitionDTOFactory()[a].temp_txnCollection[t].temp_txnCollection_name);
        }

        self.feedbackDefinitionDTOFactory()[a].temp_transactions = self.transactionCollection();
        self.feedbackDefinitionDTOFactory()[a].transactions_count = self.transactionCollection().length;
      }

      self.feedbackDefinitionDTO(self.feedbackDefinitionDTOFactory());

      let genIndex = -1;

      for (let h = 0; h < self.feedbackDefinitionDTO().length; h++) {
        if (self.feedbackDefinitionDTO()[h].transactionId() === "GENERIC") {
          self.feedbackDefinitionDTODefault().push(JSON.parse(JSON.stringify(getNewKoModel())));
          self.feedbackDefinitionDTODefault()[0].transactionId = self.feedbackDefinitionDTO()[h].transactionId();
          self.feedbackDefinitionDTODefault()[0].version = self.feedbackDefinitionDTO()[h].version();
          self.feedbackDefinitionDTODefault()[0].temp_transactions = ko.mapping.fromJS(self.feedbackDefinitionDTO()[h].temp_transactions);
          self.feedbackDefinitionDTODefault()[0].ratings = ko.mapping.fromJS(self.feedbackDefinitionDTO()[h].ratings);
          self.showGenericSection(true);
          self.feedbackType().push("generic");
          genIndex = h;
        }
      }

      if (genIndex > -1) {
        self.feedbackDefinitionDTO().splice(genIndex, 1);
      }

      if (self.feedbackDefinitionDTO().length > 0) {
        self.feedbackType().push("transactions");
      }

      self.dataLoaded(true);
    };

    self.fromSearchAndReview = function () {
      let dtoLength = params.rootModel.params.feedbackDefinitionDTO().length;

      for (let b = 0; b < dtoLength; b++) {
        if (!params.rootModel.params.feedbackDefinitionDTO()[b].temp_transactions) {
          params.rootModel.params.feedbackDefinitionDTO().splice(b, 1);
          b--;
          dtoLength--;
        }
      }

      for (let c = 0; c < params.rootModel.params.feedbackDefinitionDTO().length; c++) {
        self.feedbackDefinitionDTO().push(JSON.parse(JSON.stringify(getNewKoModel())));

        for (let g = 0; g < params.rootModel.params.feedbackDefinitionDTO().length; g++) {
          if (c === parseInt(params.rootModel.params.feedbackDefinitionDTO()[g].transactionGroupId()) - 1) {
            self.feedbackDefinitionDTO()[c].transactionId = params.rootModel.params.feedbackDefinitionDTO()[g].transactionId;
            self.feedbackDefinitionDTO()[c].version = params.rootModel.params.feedbackDefinitionDTO()[g].version;

            self.feedbackDefinitionDTO()[c].temp_transactions = ko.mapping.fromJS(params.rootModel.params.feedbackDefinitionDTO()[g].temp_transactions);
            self.feedbackDefinitionDTO()[c].ratings = ko.mapping.fromJS(params.rootModel.params.feedbackDefinitionDTO()[g].ratings);
          }
        }
      }

      let deleteIndex = -1;

      for (let d = 0; d < self.feedbackDefinitionDTO().length; d++) {
        if (self.feedbackDefinitionDTO()[d].transactionId() === "GENERIC" || self.feedbackDefinitionDTO()[d].transactionId === "GENERIC") {
          deleteIndex = d;
        }
      }

      if (deleteIndex > -1) {
        self.feedbackDefinitionDTODefault().push(JSON.parse(JSON.stringify(getNewKoModel())));
        self.feedbackDefinitionDTODefault()[0].transactionId = self.feedbackDefinitionDTO()[deleteIndex].transactionId;
        self.feedbackDefinitionDTODefault()[0].version = self.feedbackDefinitionDTO()[deleteIndex].version;

        self.feedbackDefinitionDTODefault()[0].temp_transactions = ko.mapping.fromJS(self.feedbackDefinitionDTO()[deleteIndex].temp_transactions);
        self.feedbackDefinitionDTODefault()[0].ratings = ko.mapping.fromJS(self.feedbackDefinitionDTO()[deleteIndex].ratings);
        self.showGenericSection(true);
        self.feedbackType().push("generic");
        self.feedbackDefinitionDTO().splice(deleteIndex, 1);
      }

      if (deleteIndex > -1 && self.feedbackDefinitionDTO().length > 1) {
        self.feedbackType().push("transactions");
      }
    };

    self.fromCreateAndReview = function () {
      for (let f = 0; f < params.rootModel.params.feedbackDefinitionDTO().length; f++) {
        if (params.rootModel.params.feedbackDefinitionDTO()[f].transactionId && (params.rootModel.params.feedbackDefinitionDTO()[f].transactionId === "GENERIC" || params.rootModel.params.feedbackDefinitionDTO()[f].transactionId() === "GENERIC")) {
          self.feedbackDefinitionDTODefault().push(JSON.parse(JSON.stringify(getNewKoModel())));
          self.feedbackDefinitionDTODefault()[0].transactionId = params.rootModel.params.feedbackDefinitionDTO()[f].transactionId;
          self.feedbackDefinitionDTODefault()[0].version = params.rootModel.params.feedbackDefinitionDTO()[f].version;

          self.feedbackDefinitionDTODefault()[0].temp_transactions = ko.mapping.fromJS(params.rootModel.params.feedbackDefinitionDTO()[f].temp_transactions());
          self.feedbackDefinitionDTODefault()[0].ratings = ko.mapping.fromJS(params.rootModel.params.feedbackDefinitionDTO()[f].ratings());
          self.feedbackType().push("generic");
          self.showGenericSection(true);
        } else {
          self.feedbackType().push("transactions");
          self.feedbackDefinitionDTO().push(JSON.parse(JSON.stringify(getNewKoModel())));
          self.feedbackDefinitionDTO()[f].transactionId = params.rootModel.params.feedbackDefinitionDTO()[f].transactionId;
          self.feedbackDefinitionDTO()[f].version = params.rootModel.params.feedbackDefinitionDTO()[f].version;
          self.feedbackDefinitionDTO()[f].temp_transactions = ko.mapping.fromJS(params.rootModel.params.feedbackDefinitionDTO()[f].temp_transactions());
          self.feedbackDefinitionDTO()[f].ratings = ko.mapping.fromJS(params.rootModel.params.feedbackDefinitionDTO()[f].ratings());
          self.showTransactionSection(true);
        }
      }

      self.dataLoaded(true);
    };

    Promise.all([promiseFeedbackQuestion, promiseFeedbackTransaction]).then(function (data) {
      self.question(data[0].questionResponseList);

      self.question().forEach(function (question) {
        question.optionsRequestList.forEach(function (option) {
          if (!option.optionDescription) {
            option.optionDescription = "";
          }
        });
      });

      const fetchedTasks = [];
      let fetchedTaskObject = [];

      for (let k = 0; k < data[1].taskList.length; k++) {
        if (data[1].taskList[k].id.toLowerCase() !== "mt") {
          fetchedTaskObject = self.fetchChildLimitTasks(data[1].taskList[k], 3);

          if (fetchedTaskObject.length > 0) {
            fetchedTasks.push.apply(fetchedTasks, fetchedTaskObject);
          }
        }
      }

      for (let j = 0; j < fetchedTasks.length; j++) {
        self.transactionList().push(fetchedTasks[j]);
      }

      self.weightage(feedbackWeightages);

      if (params.rootModel.fromApproval()) {
        params.rootModel.feedbackDefinitionDTO = ko.mapping.fromJS(params.rootModel.feedbackDefinitionDTO);
      }

      if (params.rootModel.params.feedbackDefinitionDTO()) {

        if (!params.rootModel.fromApproval()) {
          let foundGeneric = false;

          for (let l = 0; l < params.rootModel.params.feedbackDefinitionDTO().length; l++) {
            if ((params.rootModel.params.feedbackDefinitionDTO()[l].transactionId === "GENERIC") || (typeof params.rootModel.params.feedbackDefinitionDTO()[l].transactionId !== "object" && params.rootModel.params.feedbackDefinitionDTO()[l].transactionId() === "GENERIC")) {
              self.feedbackType().push("generic");
              self.showGenericSection(true);
              foundGeneric = true;
            }
          }

          if (foundGeneric && (params.rootModel.params.feedbackDefinitionDTO().length > 1)) {
            self.feedbackType().push("transactions");
            self.showTransactionSection(true);
          } else if (!foundGeneric && (params.rootModel.params.feedbackDefinitionDTO().length > 0)) {
            self.feedbackType().push("transactions");
            self.showTransactionSection(true);
          }

          if (!params.rootModel.params.feedbackDefinitionDTO()[0].ratings()[0].temp_questionDescription) {
            self.fromSearch();

          } else {
            if (params.rootModel.params.feedbackDefinitionDTO()[0].transactionGroupId) {
              self.fromSearchAndReview();
            } else {
              self.fromCreateAndReview();
            }

            self.dataLoaded(true);
          }
        } else {
          let foundGenericApp = false;

          for (let la = 0; la < params.rootModel.params.feedbackDefinitionDTO().length; la++) {
            if (params.rootModel.params.feedbackDefinitionDTO()[la].transactionId() === "GENERIC") {
              self.feedbackType().push("generic");
              self.showGenericSection(true);
              foundGenericApp = true;
            }
          }

          if (foundGenericApp && (params.rootModel.params.feedbackDefinitionDTO().length > 1)) {
            self.feedbackType().push("transactions");
            self.showTransactionSection(true);
          } else if (!foundGenericApp && (params.rootModel.params.feedbackDefinitionDTO().length > 0)) {
            self.feedbackType().push("transactions");
            self.showTransactionSection(true);
          }

          self.fromSearch();
        }
      } else {
        self.fromCreate();
      }
    });

    self.fromCreate = function () {
      self.feedbackDefinitionDTO().push({
        transactionId: null,
        temp_transactions: ko.observableArray([]),
        ratings: ko.observableArray([])
      });

      const ratings = [];

      self.weightage().forEach(function (item) {
        const feedbackModelInstance = getNewKoModel();

        feedbackModelInstance.feedbackDefinitionDTO()[0].ratings[0].weightId = item.Id;
        ratings.push(JSON.parse(JSON.stringify(feedbackModelInstance.feedbackDefinitionDTO()[0].ratings[0])));
      });

      self.feedbackDefinitionDTO()[0].ratings = ko.mapping.fromJS(ratings);
      self.dataLoaded(true);
    };

    self.deleteAddNewTransaction = function (data) {
      self.addAnotherTransactionInput(false);
      self.newFeedbackDefinitionDTO().splice(data, 1);
      ko.tasks.runEarly();
      self.addAnotherTransactionInput(true);
    };

    self.questionChangeHandler = function (event, data) {
      self.question().forEach(function (item) {
        if (item.questionId === event.detail.value) {
          data.temp_questionSelected(false);
          data.temp_optionsRequestList(item.optionsRequestList);
          data.questionRequestList()[0].questionId(item.questionId);
          data.questionRequestList()[0].questionDescription(item.questionDescription);
          ko.tasks.runEarly();
          data.temp_questionSelected(true);
        }
      });
    };

    self.OptionRequestChangedHandler = function (event, data) {
      if (event.detail.value.length) {
        const option = [];

        data.temp_optionsRequestList().forEach(function (item) {
          for (let i = 0; i < event.detail.value.length; i++) {
            if (typeof item.optionId === "string" && event.detail.value[i] === item.optionId) {
              option.push({
                optionDescription: item.optionDescription,
                optionId: item.optionId
              });
            } else if (typeof item.optionId !== "string") {
              if (event.detail.value[i] === item.optionId()) {
                option.push({
                  optionDescription: item.optionDescription(),
                  optionId: item.optionId()
                });
              }
            }
          }
        });

        data.questionRequestList()[0].optionsRequestList(JSON.parse(JSON.stringify(option)));
      }
    };
  };
});
