define([
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/td-details"
], function(ko, $, TDdetailsModel, locale) {
  "use strict";

  return function(rootParams) {
    const self = this;

    ko.utils.extend(self, rootParams.rootModel);
    self.valueDate = ko.observable();
    self.depositDate = ko.observable();
    self.payoutInstructions = ko.observableArray([]);
    self.viewDetails = ko.observable(false);
    self.editDetails = ko.observable(false);
    self.maturityDate = ko.observable();
    self.matured = false;
    self.closeTDdetails = ko.observable();
    self.payoutFromRedemptionFetched = ko.observable(false);
    self.tdDetailsLocale = locale;
    self.closeTDdetailsLoaded = ko.observable(false);
    rootParams.dashboard.headerName(locale.termDepositDetails.depositDetails);
    self.accountNickNameData = ko.observable();
    self.viewDetailsLoaded = ko.observable(false);
    self.tdViewDetails = ko.observable();
    rootParams.baseModel.registerComponent("td-amend", "term-deposits");
    rootParams.baseModel.registerComponent("td-topup", "term-deposits");
    rootParams.baseModel.registerComponent("td-redeem", "term-deposits");
    rootParams.baseModel.registerComponent("account-nickname", "accounts");
    rootParams.baseModel.registerElement("account-input");
    rootParams.baseModel.registerElement("page-section");
    rootParams.baseModel.registerElement("row");
    self.selectedAccount = ko.observable(self.params.id ? self.params.id.value : null);
    self.additionalDetails = ko.observable();
    self.isSweepinProvider = ko.observable(locale.termDepositDetails.sweepInFlags.inactive);

    self.showFloatingPanel = function() {
      $("#panelTermDeposit")[0].dispatchEvent(new CustomEvent("openFloatingPanel"));
    };

    self.formatTenure = function(tenure) {
      return rootParams.baseModel.format(self.tdDetailsLocale.termDepositDetails.tenureFormat, {
        years: tenure.years,
        months: tenure.months,
        days: tenure.days
      });
    };

    self.amendData = self.params;

    self.fetchDetails = function(accountNumber) {
      TDdetailsModel.fetchTdDetails(accountNumber).then(function(data) {
        self.tdViewDetails(data.termDepositDetails);
        self.payoutFromRedemptionFetched(false);

        if (self.tdViewDetails().status !== "CLOSED") {
          if(self.tdViewDetails().availableBalance && self.tdViewDetails().accrualDetails && self.tdViewDetails().accrualDetails.accruedInterest){
            self.tdViewDetails().availableBalance.amount += self.tdViewDetails().accrualDetails.accruedInterest.amount;
          }
        }

        if (self.tdViewDetails().status === "CLOSED") {
          const count = 0;

          if(self.tdViewDetails().maturityDate <= self.tdViewDetails().closureDate){
          self.matured= true;

          TDdetailsModel.fetchClosedTDdetails(accountNumber).then(function(data) {
            self.closeTDdetails(data);

            let bankURL;

            if (data.redemptionDetail.length > 0) {
              self.payoutFromRedemptionFetched(true);
            } else {
              self.fetchpayoutInstructions(accountNumber);
            }

            for (let i = 0; i < data.redemptionDetail.length; i++) {
              if (data.redemptionDetail[i].typeRedemption === "F") {
                if (data.redemptionDetail[i].payOutInstructions[0].type !== "E") {
                  bankURL = "locations/branches?branchCode=" + data.redemptionDetail[i].payOutInstructions[0].branchId;

                  TDdetailsModel.fetchBankDetails(bankURL).then(function(bankDetails) {
                    self.closeTDdetails().redemptionDetail[count].payOutInstructions[0].branchAddress = bankDetails.addressDTO[0].branchAddress.postalAddress;
                    self.closeTDdetails().redemptionDetail[count].payOutInstructions[0].branchName = bankDetails.addressDTO[0].branchName;
                    self.closeTDdetailsLoaded(true);
                  });
                } else {
                  bankURL = "financialInstitution/domesticClearingDetails/" + data.redemptionDetail[i].payOutInstructions[0].networkType + "/" + data.redemptionDetail[i].payOutInstructions[0].clearingCode;

                  TDdetailsModel.fetchBankDetails(bankURL).then(function(domesticBankDetails) {
                    self.closeTDdetails().redemptionDetail[count].payOutInstructions[0].branchAddress = domesticBankDetails.addressDTO[0].branchAddress.postalAddress;
                    self.closeTDdetails().redemptionDetail[count].payOutInstructions[0].branchName = domesticBankDetails.addressDTO[0].branchName;
                    self.closeTDdetailsLoaded(true);
                  });
                }
              }
            }
          });
        }
        }

        if (self.tdViewDetails().rollOverType !== "I" && ((!self.payoutFromRedemptionFetched() && self.matured) || self.tdViewDetails().status !== "CLOSED")) {
          self.fetchpayoutInstructions(accountNumber);
        }

        if (self.tdViewDetails && ko.isObservable(self.tdViewDetails) && self.tdViewDetails().sweepinProvider) {
          self.isSweepinProvider(locale.termDepositDetails.sweepInFlags.active);
        }

        self.viewDetailsLoaded(true);
      });
    };

    if (self.selectedAccount()) {
      self.fetchDetails(self.selectedAccount());
    }

    self.selectedAccount.subscribe(function(newValue) {
      self.viewDetailsLoaded(false);
      self.fetchDetails(newValue);
    });

    self.fetchpayoutInstructions = function(accountNumber) {
      TDdetailsModel.fetchpayoutInstructions(accountNumber).then(function(data) {
        self.payoutInstructions(data.payOutInstructions);

        let count = 0,
          bankURL;
        const totalPayout = data.payOutInstructions.length;

        for (let i = 0; i < data.payOutInstructions.length; i++) {
          if (data.payOutInstructions[i].type !== "E") {
            bankURL = "locations/branches?branchCode=" + data.payOutInstructions[i].branchId;

            TDdetailsModel.fetchBankDetails(bankURL).then(function(bankDetails) {
              self.payoutInstructions()[count].branchAddress = bankDetails.addressDTO[0].branchAddress.postalAddress;
              self.payoutInstructions()[count].branchName = bankDetails.addressDTO[0].branchName;
              count++;

              if (count === totalPayout) {
                self.viewDetails(true);
              }
            });
          } else {
            bankURL = "financialInstitution/domesticClearingDetails/" + data.payOutInstructions[i].networkType + "/" + data.payOutInstructions[i].clearingCode;

            TDdetailsModel.fetchBankDetails(bankURL).then(function(domesticBankDetails) {
              self.payoutInstructions()[count].branchAddress = domesticBankDetails.branchAddress;
              self.payoutInstructions()[count].branchName = domesticBankDetails.name;
              count++;

              if (count === totalPayout) {
                self.viewDetails(true);
              }
            });
          }
        }
      });
    };

    self.amendTD = function() {
          rootParams.dashboard.loadComponent("td-amend", {
                        rolloverType: self.tdViewDetails().rollOverType,
                        payoutInstructions: self.payoutInstructions(),
                        id: self.params.id,
                        productDTO: self.params.productDTO
                    }, self);
        };
  };
});