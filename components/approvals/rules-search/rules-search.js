define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/rules",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojknockout-validation",
    "ojs/ojcheckboxset",
    "ojs/ojbutton",
    "ojs/ojlistview"
], function(oj, ko, $, RulesSearchModel, resourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        self.nls = resourceBundle;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("amount-input");
        rootParams.baseModel.registerComponent("rules-create", "approvals");
        rootParams.baseModel.registerComponent("party-validate", "common");
        rootParams.dashboard.headerName(self.nls.rules.ruleMaintainance);
        self.partyName = rootParams.rootModel.partyname;
        self.loadPartyValidate = ko.observable(true);
        self.ruleType = ko.observable("ALL");
        self.validationTracker = ko.observable();
        self.userGroupListLoaded = ko.observable(false);
        self.userGroupList = ko.observable();
        self.ruleName = ko.observable();
        self.partyDetails = ko.observable();
        self.approvalRequired = ko.observable("OPTION_NO");
        self.searchRulesList = ko.observableArray([]);
        self.currencyListLoaded = ko.observable(false);
        self.workFlowLoaded = ko.observable(false);
        self.workFlowList = ko.observable();
        self.lookUpData = ko.observableArray([]);
        self.listShow = ko.observable(false);
        self.ruleSearch = self.ruleSearch || ko.observable(false);
        self.noRuleSearch = ko.observable(false);
        self.noSearchResults = ko.observable(false);
        self.userSelect = ko.observable();

        self.selectedRule = ko.observable();
        self.datasource = self.datasource || ko.observableArray([]);
        self.partyDetailsFromApprovalNavBar = rootParams.rootModel.partyDetailsFromApprovalNavBar;

        let ruleList;

        self.setDatasource = function() {
            self.datasource = new oj.ArrayTableDataSource(ruleList, {
                idAttribute: "ruleId"
            });

            self.ruleSearch(true);
        };

        self.columnArray = [{
                headerText: self.nls.rules.ruleCode,
                renderer: oj.KnockoutTemplateUtils.getRenderer("rule_code", true)
            },
            {
                headerText: self.nls.rules.maker,
                field: "usergroupCode"
            },
            {
                headerText: self.nls.rules.approvalsRequired,
                field: "approvalRequired"
            }
        ];

        self.back = function() {
            self.rootModelInstance().approvals.partyDetailsFetched(false);
            self.rootModelInstance().approvals.party.value("");
            self.rootModelInstance().approvals.party.displayValue("");
            self.rootModelInstance().approvals.partyName("");
            self.rootModelInstance().approvals.additionalDetails("");
        };

        self.cancelSearch = function() {
            rootParams.dashboard.switchModule();
        };

        self.viewRule = function(data) {
            if (rootParams.baseModel.small()) {
                data.partyDetails = self.rootModelInstance().approvals;
                data.mode = "VIEW";

                rootParams.dashboard.loadComponent("rules-create", {
                    ruleId: ko.toJS(data.ruleId),
                    partyDetails: ko.toJS(self.rootModelInstance().approvals),
                    mode: data.mode,
                    approvalUser: ko.toJS(rootParams.rootModel.params.approvalUser)
                });
            } else {
                let context = {
                    party: {}
                };

                if (data.ruleName) {
                    context = data;
                    context.partyDetails = self.rootModelInstance().approvals;
                    context.mode = "VIEW";

                    rootParams.dashboard.loadComponent("rules-create", {
                        ruleId: ko.toJS(data.ruleId),
                        data: ko.toJS(context),
                        partyDetails: ko.toJS(self.rootModelInstance().approvals),
                        mode: context.mode,
                        approvalUser: ko.toJS(rootParams.rootModel.params.approvalUser)
                    });
                }
            }
        };

        self.createNew = function() {
            const context = {
                party: {}
            };

            context.mode = "CREATE";
            context.partyDetails = self.rootModelInstance().approvals;

            rootParams.dashboard.loadComponent("rules-create", {
                partyDetails: ko.toJS(self.rootModelInstance().approvals),
                mode: context.mode,
                approvalUser: ko.toJS(rootParams.rootModel.params.approvalUser)
            });
        };

        const getNewKoModel = function() {
            const KoModel = RulesSearchModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.rootModelInstance = self.rootModelInstance || ko.observable(getNewKoModel());
        self.partyDetails = ko.observable(self.rootModelInstance().approvals);

        const partyId = {};

        partyId.value = rootParams.dashboard.userData.userProfile.partyId.value;
        partyId.displayValue = rootParams.dashboard.userData.userProfile.partyId.displayValue;

        const valueSubscriptions = self.rootModelInstance().approvals.party.value.subscribe(function() {
                if (self.rootModelInstance().approvals.party.value() !== "") {
                    self.search();
                }
            }),
            partyDetailsFetchedSubscriptions = self.rootModelInstance().approvals.partyDetailsFetched.subscribe(function(newValue) {
                if (newValue) {
                    self.fetchDetails();
                    self.rootModelInstance().rulesSearchPayload.ruleName("");
                    self.rootModelInstance().rulesSearchPayload.userGroupName("");
                    self.rootModelInstance().rulesSearchPayload.name("");
                    self.ruleSearch(false);
                    self.noSearchResults(false);
                }
            });

        if (partyId.value) {
            self.rootModelInstance().approvals.party.value(partyId.value);
            self.rootModelInstance().approvals.party.displayValue(partyId.displayValue);
            self.rootModelInstance().approvals.partyDetailsFetched(true);
            self.loadPartyValidate(true);
        }

        self.fetchDetails = function() {
            RulesSearchModel.getUserGroupsList(self.rootModelInstance().approvals.party.value(), self.rootModelInstance().approvals.userType()).then(function(userGroupData) {
                self.partyDetails(userGroupData.party);
                self.userGroupList(userGroupData.userGroupDTOs);
                self.userGroupListLoaded(true);
            });

            RulesSearchModel.getWorkflow(self.rootModelInstance().approvals.party.value()).then(function(workflowData) {
                self.workFlowList(workflowData.workFlowDTOs);
                self.workFlowLoaded(true);
            });
        };

        self.fetchPartyDetails = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }

            RulesSearchModel.getPartyDetails(self.rootModelInstance().approvals.party.value()).then(function(data) {
                self.fetchDetails();
                self.rootModelInstance().approvals.partyName(data.party.personalDetails.fullName);
            });
        };

        self.searchUrl = ko.computed(function() {
            return "approvalRules?partyId=" + self.rootModelInstance().approvals.party.value() + "&initiatorUserGroup=" + self.rootModelInstance().rulesSearchPayload.userGroupName() + "&ruleName=" + self.rootModelInstance().rulesSearchPayload.ruleName() + "&workflowId=" + self.rootModelInstance().rulesSearchPayload.name();
        });

        self.search = function() {
            self.ruleSearch(false);

            RulesSearchModel.searchRules(self.searchUrl()).then(function(data) {
                if (data.ruleDTOs && data.ruleDTOs.length > 0) {
                    self.searchRulesList(data.ruleDTOs);

                    const ruleListNew = $.map(data.ruleDTOs, function(rule) {
                        if (rule.approvalRequired) {
                            if (rule.workflowDto) {
                                rule.workflowCode = rule.workflowDto.name;
                            }
                        }

                        rule.usergroupCode = rule.initiatorUserGroup.name;
                        rule.approvalRequired = rule.approvalRequired ? self.nls.common.yes : self.nls.common.no;

                        return rule;
                    });

                    ruleList = ruleListNew;
                    self.setDatasource();
                } else {
                    self.noSearchResults(true);
                }
            });
        };

        self.dispose = function() {
            valueSubscriptions.dispose();
            self.searchUrl.dispose();
            partyDetailsFetchedSubscriptions.dispose();
        };

        self.partyIdAvailable = null;
        self.partyIdDisplayValue = null;
        self.partyIdFetched = ko.observable(false);

        self.fetchMeData = function() {
            if (self.partyIdAvailable) {
                self.rootModelInstance().approvals.party.value(self.partyIdAvailable);

                RulesSearchModel.fetchMeWithParty().then(function(data) {
                    if (data.party.personalDetails.fullName) {
                        self.rootModelInstance().approvals.partyDetailsFetched(true);
                        self.rootModelInstance().approvals.partyName(data.party.personalDetails.fullName);
                        self.rootModelInstance().approvals.party.displayValue(self.partyIdDisplayValue);
                    }
                });
            } else {
                self.rootModelInstance().approvals.partyName(null);
                self.rootModelInstance().approvals.party.value(null);
                self.rootModelInstance().approvals.party.displayValue(null);
            }
        };

        if (!self.partyDetailsFromApprovalNavBar.value) {
            self.partyIdFetched(true);
        } else {
            self.partyIdAvailable = self.partyDetailsFromApprovalNavBar.value;
            self.partyIdDisplayValue = self.partyDetailsFromApprovalNavBar.displayValue;
            self.fetchMeData();
        }
    };
});