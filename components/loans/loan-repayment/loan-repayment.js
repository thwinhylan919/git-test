define([
    "knockout",
    "./model",
    "ojL10n!resources/nls/loan-repayment",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation"
], function (ko, ViewLoansRepayModel, locale) {
    "use strict";

    return function (rootParams) {
        const self = this;

        self.loanAccountAdditionalDetails = ko.observable();
        self.settlementAccountAdditionalDetails = ko.observable();
        self.validationTracker = ko.observable();
        self.outstandingDataFetched = ko.observable(false);
        self.isOverdue = ko.observable(false);

        ko.utils.extend(self, rootParams.rootModel.previousState ? ko.mapping.fromJS(rootParams.rootModel.previousState.data) : rootParams.rootModel);
        self.locale = locale;

        const confirmScreenExtensions = {};

        rootParams.baseModel.setwebhelpID("loans-repayment");
        rootParams.baseModel.registerElement("amount-input");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("account-input");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerComponent("account-nickname", "accounts");
        rootParams.baseModel.registerComponent("review-loan-repayment", "loans");
        rootParams.dashboard.headerName(self.locale.repayment.heading);

        const getNewKoModel = function () {
            return ko.mapping.fromJS(ViewLoansRepayModel.getNewModel());
        };

        self.rootModelInstance = rootParams.rootModel.previousState ? ko.mapping.fromJS(rootParams.rootModel.previousState.rootModelInstance) : getNewKoModel();

        function getOutstandingData() {
            self.outstandingDataFetched(false);

            const date=self.params?self.params.dueDate:null;

            ViewLoansRepayModel.fetchOutstandingInfo(self.rootModelInstance.loanAccountId.value(),date).done(function (data) {
                self.rootModelInstance.installmentArrears.amount(data.outStandingLoanDetailsDTO.installmentArrear.amount);
                self.rootModelInstance.installmentArrears.currency(data.outStandingLoanDetailsDTO.installmentArrear.currency);
                self.rootModelInstance.principalBalance.amount(data.outStandingLoanDetailsDTO.principalBalance.amount);
                self.rootModelInstance.principalBalance.currency(data.outStandingLoanDetailsDTO.principalBalance.currency);

                if (self.params && !self.params.accountNo) {
                    self.rootModelInstance.amount.currency(data.outStandingLoanDetailsDTO.principalBalance.currency);
                }else if(self.params && self.params.accountNo) {
                    self.rootModelInstance.amount.amount(data.outStandingLoanDetailsDTO.repaymentAmount?data.outStandingLoanDetailsDTO.repaymentAmount.amount:0);
                    self.rootModelInstance.amount.currency(data.outStandingLoanDetailsDTO.repaymentAmount?data.outStandingLoanDetailsDTO.repaymentAmount.currency:null);
                }

                rootParams.dashboard.helpComponent.componentName("loan-repayment");
                rootParams.dashboard.helpComponent.params(self.loanAccountAdditionalDetails());
                self.outstandingDataFetched(true);
            });
        }

        self.loanAccountIdsubscription = self.rootModelInstance.loanAccountId.value.subscribe(function () {
            getOutstandingData();
        });

            self.outstanding=rootParams.rootModel.previousState?getOutstandingData():null;

         if (self.params && self.params.accountNo) {
            self.rootModelInstance.loanAccountId.value(self.params.value);
            self.rootModelInstance.date(self.params.dueDate);
            self.isOverdue(true);
        }

        if (self.params && self.params.id) {
            self.rootModelInstance.loanAccountId.value(self.params.id.value);
            getOutstandingData();
        }

        self.submitRepaymentRequest = function () {
            ViewLoansRepayModel.createRepaymentRequest(self.rootModelInstance.loanAccountId.value(), ko.mapping.toJSON(self.rootModelInstance, {
                ignore: ["loanAccountId"]
            })).done(function (data, status, jqXhr) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.locale.repayment.heading,
                    eReceiptRequired: true,
                    hostReferenceNumber: data.repaymentDetail ? data.repaymentDetail.key : null,
                    confirmScreenExtensions: confirmScreenExtensions,
                    template: "confirm-screen/loan-template"
                }, self);
            });
        };

        self.tracker = ko.observable();

        self.dispose = function () {
            self.loanAccountIdsubscription.dispose();
        };

        self.confirmButton = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("loanRepaymentID"))) {
                return;
            }

            self.rootModelInstance.loanAccountId.displayValue(self.loanAccountAdditionalDetails().account.id.displayValue);
            self.rootModelInstance.settlementAccountId.displayValue(self.settlementAccountAdditionalDetails().account.id.displayValue);

            rootParams.dashboard.loadComponent("review-loan-repayment", {
                mode: "review",
                data: ko.mapping.toJS(self.rootModelInstance),
                rootModelInstance:ko.mapping.toJS(self.rootModelInstance),
                confirmScreenExtensions: confirmScreenExtensions
                }, self);
        };
    };
});
