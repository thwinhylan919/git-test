define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/user-limit",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function(ko, UserListModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.nls = ResourceBundle;
        self.backLabel = self.nls.generic.common.back;
        self.cancel = self.nls.generic.common.cancel;
        self.cancelButtonFlag = ko.observable(true);
        self.partyIdAvailable = null;
        self.partyIdDisplayValue = null;
        rootParams.dashboard.headerName(self.nls.limitsInquiry.header.userLimits);
        rootParams.baseModel.registerElement("page-section");
        self.selectedUserType = ko.observable("retailuser");
        rootParams.baseModel.registerComponent("user-type", "user-management");
        rootParams.baseModel.registerComponent("users-search", "user-management");
        rootParams.baseModel.registerComponent("user-search-list", "user-management");
        self.username = ko.observable();
        self.firstName = ko.observable();
        self.lastName = ko.observable();
        self.emailId = ko.observable();
        self.mobileNumber = ko.observable();
        self.userTypeSelectionIdle = ko.observable(false);
        self.disableEnterpriseRole = true;
        self.isCorpAdmin = null;

        const partyId = {};

        partyId.value = rootParams.dashboard.userData.userProfile.partyId.value;
        partyId.displayValue = rootParams.dashboard.userData.userProfile.displayValue;

        if (partyId.value) {
            self.isCorpAdmin = true;
        } else {
            self.isCorpAdmin = false;
        }

        if (rootParams.rootModel.usernamesearched) {
            self.username(rootParams.rootModel.usernamesearched());
            self.firstName(rootParams.rootModel.firstNamesearched());
            self.lastName(rootParams.rootModel.lastNamesearched());
            self.emailId(rootParams.rootModel.emailIdsearched());
            self.mobileNumber(rootParams.rootModel.mobileNumbersearched());
            self.usernamesearched = rootParams.rootModel.usernamesearched;
            self.firstNamesearched = rootParams.rootModel.firstNamesearched;
            self.lastNamesearched = rootParams.rootModel.lastNamesearched;
            self.emailIdsearched = rootParams.rootModel.emailIdsearched;
            self.mobileNumbersearched = rootParams.rootModel.mobileNumbersearched;

            self.user = ko.observable({
                showCreateUser: ko.observable(false),
                searchedUserList: rootParams.rootModel.userList,
                loadSearchData: ko.observable(true)
            });
        } else {
            self.usernamesearched = ko.observable();
            self.firstNamesearched = ko.observable();
            self.lastNamesearched = ko.observable();
            self.emailIdsearched = ko.observable();
            self.mobileNumbersearched = ko.observable();

            self.user = ko.observable({
                showCreateUser: ko.observable(false),
                searchedUserList: ko.observableArray([]),
                loadSearchData: ko.observable(false)
            });
        }

        self.fetchMeData = function() {
            if (self.partyIdAvailable) {
                self.rootModelInstance().partyDetails.party.value(self.partyIdAvailable);

                UserListModel.fetchMeWithParty().done(function(dataName) {
                    if (dataName.party.personalDetails.fullName) {
                        self.partyIdFetched(true);
                        self.rootModelInstance().partyDetails.partyName(dataName.party.personalDetails.fullName);
                        self.rootModelInstance().partyDetails.party.displayValue(self.partyIdDisplayValue);
                        self.rootModelInstance().partyDetails.partyDetailsFetched(true);
                    }
                });
            } else {
                self.rootModelInstance().partyDetails.party.value(null);
                self.rootModelInstance().partyDetails.party.displayValue(null);
                self.rootModelInstance().partyDetails.partyName(null);
            }
        };

        self.dataLoaded = ko.observable(false);
        self.datasource = {};
        self.validationTracker = ko.observable();

        rootParams.baseModel.registerElement("row");

        const getNewKoModel = function() {
            const KoModel = UserListModel.getNewModel();

            return ko.mapping.fromJS(KoModel);
        };

        self.rootModelInstance = ko.observable(getNewKoModel());
        self.partyDetails = self.rootModelInstance().partyDetails;
        self.partyIdFetched = ko.observable(false);
        self.loadPartyValidate = ko.observable(true);

        self.reset = function() {
            self.partyDetails.partyDetailsFetched(false);
        };

        self.back = function() {
            self.partyDetails.partyDetailsFetched(false);
            self.rootModelInstance().partyDetails.partyDetailsFetched(false);
            self.rootModelInstance().partyDetails.party.value("");
            self.rootModelInstance().partyDetails.partyName("");
            self.rootModelInstance().partyDetails.additionalDetails("");
        };
    };
});