define([

  "knockout",

  "./model",

  "ojL10n!resources/nls/authorization",
  "ojs/ojinputtext"
], function(ko, EntitlementSearchModel, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.moduleName = ko.observableArray();
    self.isModuleFetched = ko.observable(false);
    self.isCategoryFetched = ko.observable(true);
    self.selectedModule = ko.observable();
    self.selectedCategory = ko.observable();
    self.showResults = ko.observable(false);
    self.categoryName = ko.observableArray();
    self.category = ko.observableArray();
    self.entitlementNames = ko.observableArray();
    self.fetchEntitlementsList = ko.observableArray();
    self.validationTracker = ko.observable();
    self.results = ko.observableArray();
    self.module = ko.observableArray();
    self.actions = ko.observableArray();
    self.resources = ko.observableArray();

    EntitlementSearchModel.fetchModuleName().done(function(data) {
      if (data.enumRepresentations) {
        for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.moduleName().push({
            text: data.enumRepresentations[0].data[i].description,
            value: data.enumRepresentations[0].data[i].code
          });
        }

        self.isModuleFetched(true);
      }
    });

    self.resetForm = function() {
      self.showResults(false);
      self.selectedModule([]);
      self.selectedCategory([]);
      self.entitlementNames("");
      self.validationTracker(null);
    };

    self.moduleChangeHandler = function(event) {
      self.isCategoryFetched(false);

      EntitlementSearchModel.fetchCategoryName(event.detail.value).done(function(data) {
        self.categoryName([]);

        if (data.enumRepresentations) {
          for (let i = 0; i < data.enumRepresentations[0].data.length; i++) {
            self.categoryName().push({
              text: data.enumRepresentations[0].data[i].description,
              value: data.enumRepresentations[0].data[i].code
            });
          }

          self.isCategoryFetched(true);
        }
      });
    };

    self.showResult = function() {
      self.showResults(false);

      if (self.selectedModule() !== null && self.selectedCategory() === undefined) {
        rootParams.baseModel.showMessages(null, [self.nls.information.selectCatgeory], "ERROR");

        return;
      }

      const searchParameters = {
        module: self.selectedModule(),
        categoryName: self.selectedCategory(),
        entitlementName: self.entitlementNames()
      };

      EntitlementSearchModel.fetchEntitlements(searchParameters).done(function(data) {
        if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
          return;
        }

        self.module(data.entitlementGroupDTOs);

        ko.utils.arrayForEach(self.module(), function(item) {
          ko.utils.arrayForEach(item.subGroupDTOs, function(item) {
            self.entitlements = ko.observableArray();

            ko.utils.arrayForEach(item.entitlements, function(item) {
              const menuOption = {
                  id: null,
                  data: null,
                  disabled: false
                },
                action = {
                  actionType: null,
                  resources: []
                };

              self.entitlementFound = ko.observable(false);

              if (self.entitlements().length !== 0) {
                for (let l = 0; l < self.entitlements().length; l++) {
                  if (self.entitlements()[l].name === item.entitlementName) {
                    action.actionType = item.entitlementId.split( "_" )[ item.entitlementId.split( "_" ).length - 1 ];
                    action.resources = item.resourceDTOs;
                    action.entitlmentId = item.entitlementId;
                    self.entitlements()[l].actions.push(action);
                    self.actions.push(action);
                    menuOption.id = item.entitlementId;
                    menuOption.data = item.entitlementId.split( "_" )[ item.entitlementId.split( "_" ).length - 1 ];
                    menuOption.label = item.entitlementId.split( "_" )[ item.entitlementId.split( "_" ).length - 1 ];
                    menuOption.disabled = false;
                    self.entitlements()[l].menuOptions().push(menuOption);
                    self.entitlementFound(true);
                    break;
                  }
                }
              }

              if (!self.entitlementFound()) {
                const entitlement = {
                    name: null,
                    actions: [],
                    menuOptions: ko.observableArray()
                  },
                  name = item.entitlementName;

                entitlement.name = name;
                action.actionType = item.entitlementId.split( "_" )[ item.entitlementId.split( "_" ).length - 1 ];
                action.resources = item.resourceDTOs;
                action.entitlmentId = item.entitlementId;
                self.actions.push(action);
                entitlement.actions.push(action);
                menuOption.id = item.entitlementId;
                menuOption.data = item.entitlementId.split( "_" )[ item.entitlementId.split( "_" ).length - 1 ];
                menuOption.label = item.entitlementId.split( "_" )[ item.entitlementId.split( "_" ).length - 1 ];
                menuOption.disabled = false;
                entitlement.menuOptions().push(menuOption);
                self.entitlements.push(entitlement);
              }
            });

            item.entitlements = self.entitlements();
          });
        });

        for (let i = 0; i < self.module().length; i++) {
          self.category(self.module()[i].subGroupDTOs[i]);
          self.showResults(true);
        }
      });
    };
  };
});
