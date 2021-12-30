define([
    "knockout",
    "ojs/ojcore",
    "jquery",
    "./model",
    "ojL10n!resources/nls/loan-details",
    "framework/js/constants/constants",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource"
], function (ko, oj, $, ViewLoansModel, locale, Constants) {
    "use strict";

    return function (rootParams) {
        const self = this,
        getNewKoModel = function () {
            const KoModel = ko.mapping.fromJS(ViewLoansModel.getNewModel());

            return KoModel;
        };

        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        rootParams.dashboard.headerName(self.locale.loanDetails.viewDetails);
        self.loanViewDetails = ko.observable();
        self.loanAccountDTO = ko.observable();
        self.loanAccountDetailsResponseDTO = ko.observable();
        self.scheduleData = ko.observable();
        self.outstandingData = ko.observable();
        self.dataFetched = ko.observable(false);
        self.linkageDetailsFetched = ko.observable(false);
        self.selectedAccount = ko.observable(self.params.id ? self.params.id.value : self.params.value?self.params.value:null);
        self.additionalLoanDetails = ko.observable();
        self.linksDto = ko.observable();
        self.datasource = ko.observableArray();
        self.linkageDataSource = ko.observable();
        rootParams.baseModel.setwebhelpID("loans-details");
        self.userSegement = Constants.userSegment;

        self.getItemInitialDisplay = function (index) {
            return index < 3 ? "" : "none";
        };

        rootParams.baseModel.registerComponent("loan-schedule", "loans");
        rootParams.baseModel.registerComponent("loan-repayment", "loans");
        rootParams.baseModel.registerComponent("loan-disbursement", "loans");
        rootParams.baseModel.registerComponent("account-nickname", "accounts");
        rootParams.baseModel.registerElement(["page-section", "row", "account-input"]);
        rootParams.baseModel.registerComponent("account-transactions", "accounts");

        self.fetchDetails = function (accountNumber) {
            $.when(ViewLoansModel.fetchAccountInfo(accountNumber), ViewLoansModel.fetchScheduleInfo(accountNumber), ViewLoansModel.fetchOutstandingInfo(accountNumber)).done(function (loanViewDetails, scheduleData, outstandingData) {
                self.loanViewDetails(loanViewDetails.loanAccountDetails);
                self.scheduleData(scheduleData.loanScheduleDTO);
                self.outstandingData(outstandingData.outStandingLoanDetailsDTO);
                self.dataFetched(true);
            });
        };

        self.fetchLinkDetails = function (accountNumber) {
            ViewLoansModel.fetchAccountLinkages(accountNumber).then(function (data) {
                self.datasource.removeAll();

            if(data.loanAccountDetails.linkageDTO){
                ko.utils.arrayForEach(data.loanAccountDetails.linkageDTO, function (item) {
                    const linkData = getNewKoModel().linkageDetails;

                    linkData.linkageType = item.linkageType;
                    linkData.linkedReferenceNumber = item.linkedReferenceNumber;
                    linkData.linkedPercent = item.linkedPercent;
                    linkData.branchCode = item.branchCode;
                    linkData.amount.linkageAmount = item.linkageAmount;
                    linkData.amount.linkageCurrency = item.linkageCurrency;

                    self.datasource.push(linkData);
                });

                self.linkageDetailsFetched(true);

            }

                self.linksDto(data.loanAccountDetails);

                self.linkageDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.datasource, {
                    idAttribute: "linkedReferenceNumber"
                })));
            });
        };

        self.quickLinks = [{
            txt: self.locale.loanDetails.loanRepayment,
            icon: "process-management/loan-repayment.svg",
            link: "loanRepayment"
        }];

        self.quickLinks.push({
            txt: self.locale.loanDetails.loanSchedule,
            icon: "process-management/summary.svg",
            link: "loanschedule"
        });

        self.quickLinks.push({
            txt: self.locale.loanDetails.disbursementEnquiry,
            icon: "process-management/summary.svg",
            link: "disbursementEnquiry"
        });

        self.onSelectClick = function (event) {
            if (event.link === "loanRepayment") {
                rootParams.dashboard.loadComponent("loan-repayment",{
                    id:{
                        value:self.selectedAccount()
                    }});
            } else if (event.link === "loanschedule") {
                rootParams.dashboard.loadComponent("loan-schedule",{
                    id:{
                        value:self.selectedAccount()
                    }});
            } else if (event.link === "disbursementEnquiry") {
                rootParams.dashboard.loadComponent("loan-disbursement",{
                    id:{
                        value:self.selectedAccount()
                    }});
            }
        };

        self.showFloatingPanel = function () {
            $("#panelLoans")[0].dispatchEvent(new CustomEvent("openFloatingPanel"));
        };

        if (self.selectedAccount()) {
            self.fetchDetails(self.selectedAccount());
        }

        self.selectedAccount.subscribe(function (newValue) {
            self.dataFetched(false);
            self.fetchDetails(newValue);
            self.fetchLinkDetails(newValue);
        });

        self.showAccoundDropDown = function () {
            if (Constants.userSegment === "CORP") {
                return false;
            } else if (self.params.id) {
                return true;
            }

            return false;
        };

        self.getTemplate = function () {

            if (rootParams.dashboard.appData.segment !== "CORP") {
                return "retTemplate";
            }

            return "corpTemplate";
        };
    };
});
