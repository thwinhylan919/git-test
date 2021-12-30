define([

  "knockout",

  "./model",
  "ojL10n!resources/nls/api-builder-review",
  "ojs/ojselectcombobox",
  "ojs/ojvalidationgroup",
  "ojs/ojbutton",
  "ojs/ojknockout-validation"
], function (ko, APIBuilderReviewModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    rootParams.baseModel.registerComponent("api-builder-create", "api-builder");
    rootParams.baseModel.registerComponent("api-builder-edit", "api-builder");
    rootParams.baseModel.registerElement("confirm-screen");
    self.resource = resourceBundle;
    rootParams.dashboard.headerName(self.resource.headerName);
    self.redactionType = ko.observable();
    self.header = ko.observable();
    self.apiServiceDTO = ko.observable(rootParams.rootModel.params.apiServiceDTO);
    self.bussPolicyFile = ko.observable(self.apiServiceDTO().refBusinessPolicy());
    self.groupName = ko.observable();
    self.selectedModule = ko.observable();
    self.selectedCategory = ko.observable();
    self.transactionType = ko.observable();
    self.actionTypes = ko.observableArray();
    self.taskAspects = ko.observableArray();
    self.selectedTaskAspects = ko.observableArray();
    self.isTaskAspectFetched = ko.observable(false);

    self.header(ko.mapping.toJS(rootParams.rootModel.params.header()));

    APIBuilderReviewModel.getApiGroups().then(function (data) {
      ko.utils.arrayForEach(data.apiGroupList, function (item) {
        if (item.groupCode === self.apiServiceDTO().apiGroupName()) {
          self.groupName(item.groupDescription);
        }
      });
    });

    APIBuilderReviewModel.fetchActionType().done(function (data) {
      if (data.enumRepresentations) {
        ko.utils.arrayForEach(data.enumRepresentations[0].data, function (item) {
          for (let i = 0; i < self.apiServiceDTO().actionTypes().length; i++) {
            if (item.code === self.apiServiceDTO().actionTypes()[i]) {
              self.actionTypes.push(item.description);
            }
          }
        });
      }
    });

    if (self.apiServiceDTO().taskAspects()) {
      APIBuilderReviewModel.fetchTaskAspect().done(function (data) {
        self.taskAspects.removeAll();

        if (data.enumRepresentations) {
          ko.utils.arrayForEach(data.enumRepresentations[0].data, function (item) {
            for (let i = 0; i < self.apiServiceDTO().taskAspects().length; i++) {
              if (item.code === self.apiServiceDTO().taskAspects()[i]) {
                self.selectedTaskAspects.push(item.code);
              }
            }

            self.taskAspects.push({
              text: item.description,
              value: item.code
            });
          });
        }

        self.isTaskAspectFetched(true);
      });
    }

    APIBuilderReviewModel.fetchTransactionType().done(function (data) {
      if (data.enumRepresentations) {
        ko.utils.arrayForEach(data.enumRepresentations[0].data, function (item) {
          if (item.code === self.apiServiceDTO().transactionType()) {
            self.transactionType(item.description);
          }
        });
      }
    });

    if (self.apiServiceDTO().moduleName()) {
      APIBuilderReviewModel.fetchModuleName().done(function (data) {
        if (data.enumRepresentations) {
          ko.utils.arrayForEach(data.enumRepresentations[0].data, function (item) {
            if (item.code === self.apiServiceDTO().moduleName()) {
              self.selectedModule(item.description);
            }
          });
        }
      });

      APIBuilderReviewModel.fetchCategoryName(self.apiServiceDTO().moduleName()).done(function (data) {
        if (data.enumRepresentations) {
          ko.utils.arrayForEach(data.enumRepresentations[0].data, function (item) {
            if (item.code === self.apiServiceDTO().categoryName()) {
              self.selectedCategory(item.description);
            }
          });
        }
      });
    }

    self.onClickBack = function () {
      if (rootParams.rootModel.params.mode() === "CREATE") {
        rootParams.dashboard.loadComponent("api-builder-create", self);
      } else {
        rootParams.dashboard.loadComponent("api-builder-edit", self);
      }
    };

    self.confirm = function () {
      if (rootParams.rootModel.params.mode() === "CREATE") {
        APIBuilderReviewModel.createApiGroupService(ko.toJSON(self.apiServiceDTO()), self.bussPolicyFile()).done(function (data, status, jqXhr) {
          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr
          }, self);
        });
      } else {
        APIBuilderReviewModel.updateApiGroupService(ko.toJSON(self.apiServiceDTO())).done(function (data, status, jqXhr) {
          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr
          }, self);
        });
      }
    };
  };
});