define([
    "ojL10n!resources/nls/view-finance-details",
    "./model",
    "knockout",
    "ojs/ojcore",
    "ojs/ojformlayout",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton",
    "ojs/ojlabel"
], function (resourceBundle, Model, ko) {
    "use strict";

    function mePartyGetCall() {
        return Model.mePartyGet();
    }

    function financeSearchGetCall(financeRefNo) {
        return Model.financeSearchGet(financeRefNo);
    }

    return function (params) {
        const self = this;

        self.nls = resourceBundle;
        params.dashboard.headerName(self.nls.heading.ViewFinance);
        self.financeRefNo = ko.observable(params.rootModel.params.financeNo);

        if (params.rootModel.params.financeStatusDesc) {
            self.financeStatus = params.rootModel.params.financeStatusDesc;
        } else {
            self.financeStatus = "";
        }

        self.financeSearchResult = ko.observable();
        self.financeDataLoaded = ko.observable(false);
        self.partyName = ko.observable();
        self.partyId = ko.observable();

        params.baseModel.registerComponent("view-finances", "supply-chain-finance");
        params.baseModel.registerComponent("view-finance-linked-invoices", "supply-chain-finance");
        params.baseModel.registerElement("help");

        mePartyGetCall().then(function (response) {
            self.partyId(response.party.id.displayValue);
            self.partyName(response.party.personalDetails.fullName);
        });

        financeSearchGetCall(self.financeRefNo()).then(function (response) {
            if (response.finance) {
                if (response.finance.amounts) {
                    for (let j = 0; j < response.finance.amounts.length; j++) {
                        if (response.finance.amounts[j].type === "OUTSTANDING") {
                            response.finance.principalOutstandingAmount = response.finance.amounts[j].principalAmount ? response.finance.amounts[j].principalAmount : "-";
                            response.finance.interestOutstandingAmount = response.finance.amounts[j].interestAmount ? response.finance.amounts[j].interestAmount : "-";
                            response.finance.overdueOutstandingAmount = response.finance.amounts[j].overdueAmount ? response.finance.amounts[j].overdueAmount : "-";
                            response.finance.totalOutstandingAmount = response.finance.amounts[j].totalAmount ? response.finance.amounts[j].totalAmount : "";
                            break;
                        }
                    }
                }

                self.financeSearchResult(response.finance);
                self.financeDataLoaded(true);
            }
        });

        self.showLinkedInvoices = function () {
            params.dashboard.openRightPanel("view-finance-linked-invoices", {
                invoices: self.financeSearchResult().invoices
            }, self.nls.ViewFinance.linkedInvoices);
        };

        self.onClickBack = function () {
            params.dashboard.hideDetails();
        };

    };
});