define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/rules-admin-approvals",
  "ojs/ojinputtext",
  "ojs/ojradioset",
  "ojs/ojlistview",
  "ojs/ojarraytabledatasource"
], function (oj, ko, $, RulesAdminModel, resourceBundle) {
  "use strict";

  return function (rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    rootParams.baseModel.registerComponent("rules-admin-list", "admin-approvals");
    rootParams.baseModel.registerComponent("rules-admin-create", "admin-approvals");
    rootParams.baseModel.registerComponent("rules-admin-search", "admin-approvals");
    rootParams.baseModel.registerElement("action-header");
    self.nls = resourceBundle;
    rootParams.dashboard.headerName(self.nls.adminrules.rules.adminRuleMaintainance);
    self.heading = ko.observable(self.nls.headers.rulesAdmin);
    self.ruleDescription = ko.observable("");
    self.searchRulesList = ko.observableArray([]);
    self.noSearchResults = ko.observable(false);

    const getNewKoModel = function () {
      const KoModel = RulesAdminModel.getNewModel();

      return ko.mapping.fromJS(KoModel);
    };

    self.rootModelInstance = ko.observable(getNewKoModel());
    self.ruleDetails = self.rootModelInstance().approvals;

    self.createNew = function () {

      self.mode = "CREATE";

      rootParams.dashboard.loadComponent("rules-admin-create", {
        mode: ko.toJS(self.mode),
        approvalUser: ko.toJS(rootParams.rootModel.params.approvalUser)
      });
    };

    self.fetchRuleDetails = function () {
      self.ruleDetails.ruleDetailsFetched();

      RulesAdminModel.fetchDetails(self.ruleDetails).then(function (data) {
        if (self.ruleDetails.ruleName() !== "") {
          self.ruleDescription(data.ruleDTOs[0].ruleName);
        } else {
          self.ruleDescription("");
        }

        if (data.ruleDTOs && data.ruleDTOs.length > 0) {
          self.searchRulesList(data.ruleDTOs);

          self.datasource = new oj.ArrayTableDataSource(self.searchRulesList(), {
            idAttribute: "ruleId"
          });

          self.ruleDetails.ruleDetailsFetched(true);
          self.noSearchResults(false);
          $("#searchRuleListView").ojListView("refresh");
        } else {
          self.noSearchResults(true);
        }

        self.ruleDetails.ruleDetailsFetched(true);
      });
    };
  };
});