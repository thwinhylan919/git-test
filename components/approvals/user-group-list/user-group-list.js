define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/user-group",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function(oj, ko, $, UserGroupListModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;
        let partyData;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = ResourceBundle;
        self.backLabel = self.nls.common.back;
        self.cancel = self.nls.common.cancel;
        rootParams.dashboard.headerName(self.nls.userGroup.userGroupDetails);
        self.createNewLabel = self.nls.common.create;
        self.userGroupCode = self.nls.userGroup.groupCode;
        self.userGroupDescription = self.nls.userGroup.groupDescription;
        self.users = self.nls.userGroup.users;
        self.partyIdAvailable = null;
        self.partyIdDisplayValue = null;
        self.partyDetailsFromApprovalNavBar = rootParams.rootModel.params.partyDetailsFromApprovalNavBar;

        self.fetchMeData = function() {
            if (self.partyIdAvailable) {
                self.rootModelInstance().approvals.party.value(self.partyIdAvailable);

                UserGroupListModel.fetchMeWithParty().then(function(dataName) {
                    if (dataName.party.personalDetails.fullName) {
                        self.partyIdFetched(true);
                        self.rootModelInstance().approvals.partyName(dataName.party.personalDetails.fullName);
                        self.rootModelInstance().approvals.party.displayValue(self.partyIdDisplayValue);
                        self.rootModelInstance().approvals.partyDetailsFetched(true);
                    }
                });
            } else {
                self.rootModelInstance().approvals.party.value(null);
                self.rootModelInstance().approvals.party.displayValue(null);
                self.rootModelInstance().approvals.partyName(null);
            }
        };

        self.dataLoaded = self.dataLoaded || ko.observable(false);
        self.userGroupList = ko.observableArray();
        self.datasource = self.datasource || ko.observableArray();
        self.validationTracker = ko.observable();

        rootParams.baseModel.registerComponent("party-validate", "common");
        self.mode = ko.observable("");

        self.setDatasource = function() {
            self.datasource = new oj.ArrayTableDataSource(partyData, {
                idAttribute: "name"
            });

            self.dataLoaded(true);
        };

        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerComponent("user-group-view", "approvals");

        const getNewKoModel = function() {
            const KoModel = UserGroupListModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.rootModelInstance = self.rootModelInstance || ko.observable(getNewKoModel());
        self.partyDetails = self.rootModelInstance().approvals;
        self.partyIdFetched = self.partyIdFetched || ko.observable(false);

        if (!self.partyDetailsFromApprovalNavBar.value) {
            self.partyIdFetched(true);
        } else {
            self.partyIdAvailable = self.partyDetailsFromApprovalNavBar.value;
            self.partyIdDisplayValue = self.partyDetailsFromApprovalNavBar.displayValue;
            self.fetchMeData();
        }

        self.createNew = function() {
            self.mode("CREATE");

            const data = {};

            data.partyDetails = self.rootModelInstance().approvals;

            rootParams.dashboard.loadComponent("user-group-view", {
                data: ko.toJS(data),
                mode: ko.toJS(self.mode)
            });
        };

        self.search = function() {
            if (self.rootModelInstance().approvals.partyDetailsFetched()) {
                if (self.rootModelInstance().approvals.party.value()) {
                    UserGroupListModel.fetchUserGroupSearchList("", self.rootModelInstance().approvals.party.value(), "", "").then(function(data) {
                        const partyDataNew = $.map(data.userGroupDTOs, function(userData) {
                            userData.usercount = userData.users.length;
                            userData.partyDetails = self.partyDetails;

                            userData.mode = function() {
                                return "VIEW";
                            };

                            return userData;
                        });

                        if (partyDataNew.length > 0) {
                            partyData = partyDataNew;
                            self.setDatasource();
                        }
                    });
                } else {
                    rootParams.baseModel.showMessages(null, [self.nls.userGroup.missingSearchCriteria], "INFO");
                }
            }

            self.partyIdFetched(true);
        };

        const partyDetailsFetchedSubscriptions = self.rootModelInstance().approvals.partyDetailsFetched.subscribe(function() {
            self.search();
        });

        self.dispose = function() {
            partyDetailsFetchedSubscriptions.dispose();
        };

        self.cancelSearch = function() {
            rootParams.dashboard.switchModule();
        };

        self.onUserGroupSelected = function(data) {
            if (data) {
                const context = data;

                context.mode = ko.observable("VIEW");
                self.mode("VIEW");

                rootParams.dashboard.loadComponent("user-group-view", {
                    data: ko.toJS(data),
                    mode: ko.toJS(self.mode)
                });
            }
        };

        self.goToMap = function(data) {
            rootParams.dashboard.loadComponent("user-group-view", {
                data: ko.toJS(data)
            });
        };

        self.reset = function() {
            self.partyDetails.partyDetailsFetched(false);
        };

        self.back = function() {
            self.partyDetails.partyDetailsFetched(false);
            self.rootModelInstance().approvals.partyDetailsFetched(false);
            self.rootModelInstance().approvals.party.value("");
            self.rootModelInstance().approvals.partyName("");
            self.rootModelInstance().approvals.additionalDetails("");
        };
    };
});