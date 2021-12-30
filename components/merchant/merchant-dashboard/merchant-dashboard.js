define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/merchant",
    "ojs/ojinputnumber",
    "ojs/ojinputtext",
    "ojs/ojlistview",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource",
    "ojs/ojknockout-validation",
    "ojs/ojbutton"
], function (oj, ko, $, merchantModel, ResourceBundle) {
    "use strict";

    return function (rootParams) {
        const self = this,
            getNewKoModel = function () {
                const KoModel = ko.mapping.fromJS(merchantModel.getNewModel());

                return KoModel;
            };

        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.componentName = ko.observable(self.resource.merchant.merchant_header);

        rootParams.dashboard.headerName(self.resource.merchant.header);
        self.validationTracker = ko.observable();
        self.commissionAccountFlag = ko.observable();
        self.stageOne = ko.observable(true);
        self.merchantAccount = ko.observable();
        self.commissionAccount = ko.observable();
        self.userAccountFlag = ko.observable();
        self.accountType = ko.observable();
        self.code = ko.observable();
        self.description = ko.observable();
        self.failureUrl = ko.observable();
        self.successUrl = ko.observable();
        self.branch = ko.observable();
        self.isBranchesLoaded = ko.observable(true);
        self.branches = ko.observableArray();
        self.branchesMap = {};
        self.stageTwo = ko.observable(false);
        self.merchants = [];
        self.merchantsList = ko.observableArray();
        self.merchantDetails = ko.observable();
        self.merchantId = ko.observable();
        self.merchantDescription = ko.observable();
        self.searchValue = ko.observable();
        self.componentId = ko.observable();
        self.isDataCleared = ko.observable();
        self.checksumType = ko.observable();
        self.checksumAlgorithmList = ko.observableArray("");
        self.checksumAlgorithm = ko.observable();
        self.securityKey = ko.observable();
        self.commissionBranch = ko.observable();
        self.commissionAccountType = ko.observable();
        self.merchantPayload = ko.observable();
        self.merchantPayload(getNewKoModel().merchantModel);
        self.dataSource = ko.observable();
        self.remittanceType = ko.observable();
        self.redirectionUrl = ko.observable(null);
        self.show = ko.observable(false);

        rootParams.baseModel.registerComponent("create-merchant", "merchant");
        rootParams.baseModel.registerComponent("view-merchant", "merchant");

        self.goToDashoard = function () {
            location.replace("dashboard.html");
        };

        self.reset = function () {
            self.merchantId(null);
            self.merchantDescription(null);
            self.stageTwo(false);
            self.isSearchClicked(false);
            self.merchantsList.removeAll();
        };

        self.isSearchClicked = ko.observable(false);

        self.search = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }

            self.isSearchClicked(true);
            self.merchantsList.removeAll();

            merchantModel.listMerchant(self.merchantDescription(), self.merchantId()).done(function (data) {
                self.stageTwo(false);

                if (data.response) {
                    self.merchantsList(data.response);
                }

                let merchantsListArray = [];

                merchantsListArray = $.map(self.merchantsList(), function (u) {
                    const obj = {
                        description: u.merchantDetailsDTO.description ? u.merchantDetailsDTO.description : "-",
                        code: u.merchantDetailsDTO.code ? u.merchantDetailsDTO.code : "-"
                    };

                    return obj;
                });

                self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(merchantsListArray), {
                    idAttribute: "code"
                }));

                ko.tasks.runEarly();
                self.stageTwo(true);
            });
        };

        self.isCreateMerchant = ko.observable(false);

        self.create = function () {
            self.stageOne(false);
            self.stageTwo(false);
            self.isCreateMerchant(true);

            rootParams.dashboard.loadComponent("create-merchant", {
                createMode: true
            }, self);
        };

        self.viewMerchant = function (data) {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }

            self.merchantsList.removeAll();
            self.merchantDetails(data);
            rootParams.dashboard.headerName(self.resource.merchant.header);
            self.stageOne(false);
            self.stageTwo(false);
            self.searchValue(data.code);

            merchantModel.readMerchant(data.code).done(function (data1) {
                delete data1.status;
                self.merchantPayload(ko.mapping.fromJS(data1.merchantDetailsDTO));
                self.code(data1.merchantDetailsDTO.code);
                self.description(data1.merchantDetailsDTO.description);
                self.accountType(data1.merchantDetailsDTO.accountType);
                self.checksumAlgorithm(data1.merchantDetailsDTO.checksumAlgorithm);
                self.securityKey(data1.merchantDetailsDTO.securityKey);
                self.checksumType(data1.merchantDetailsDTO.checksumType);
                self.failureUrl(data1.merchantDetailsDTO.failureUrl);
                self.successUrl(data1.merchantDetailsDTO.successUrl);
                self.userAccountFlag(data1.merchantDetailsDTO.userAccountFlag);
                self.merchantAccount(data1.merchantDetailsDTO.merchantAccount);
                self.remittanceType(data1.merchantDetailsDTO.remittanceType);

                if (self.remittanceType() === "OUTWARD") {
                    self.show(false);
                } else {
                    self.show(true);
                    self.redirectionUrl(data1.merchantDetailsDTO.redirectionUrl);
                }

                if (data1.merchantDetailsDTO.commissionAccountFlag === "ENABLED") {
                    self.commissionAccountFlag(true);
                    self.commissionAccountType(data1.merchantDetailsDTO.commissionAccountType);
                    self.commissionAccount(data1.merchantDetailsDTO.commissionAccount);
                } else {
                    self.commissionAccountFlag(false);
                }

                rootParams.dashboard.loadComponent("view-merchant", {
                    viewMode: true,
                    merchantCode: self.code(),
                    payload:self.merchantPayload()
                });
            });
        };
    };
});