define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/claim-payment",
    "ojs/ojinputnumber",
    "ojs/ojtrain",
    "ojs/ojknockout-validation"
], function(ko, $, DashboardModel, ResourceBundle) {
    "use strict";

    return function(rootParams) {
        const self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.payments = ResourceBundle.payments;
        self.common = ResourceBundle.common;
        self.header = ko.observable(self.payments.peertopeer.recievepayment);
        self.stageOne = ko.observable(false);
        self.aliasValue = ko.observable();
        self.amount = ko.observable();
        self.currency = ko.observable();
        self.paymentId = ko.observable();
        self.user = ko.observable();
        self.aliasType = ko.observable();

        rootParams.baseModel.registerElement([
            "modal-window",
            "row",
            "page-section",
            "confirm-screen",
            "bank-look-up"
        ]);

        self.partyDetails = ko.observable();
        self.userDetails = ko.observable();
        self.externalReferenceId = ko.observable();
        self.isExistingGlobalPayee = ko.observable(true);
        self.isGlobalPayeeCreated = ko.observable(false);
        self.isUpdateDetails = ko.observable(false);
        self.srcAccount = ko.observable(self.payments.peertopeer.accnotselected);
        self.branchName = ko.observable("");
        self.accountType = ko.observable("");
        self.ifscCode = ko.observable("");
        self.version = ko.observable();
        self.partyId = ko.observable();
        self.region=ko.observable();
        self.branch=ko.observable();
        self.isDomestic=ko.observable();
        DashboardModel.init();
        self.globalPayeeData = ko.observable();
        rootParams.dashboard.headerName(self.payments.peertopeer.titleRetail);
        rootParams.baseModel.registerElement("internal-account-input");
        rootParams.baseModel.registerComponent("bank-details", "claim-payment-existing-user");

        let determinantValue;

        self.fetchQueryParams = function(rootData) {
            if (rootData.queryMap) {
                self.aliasValue(rootData.queryMap.value);
                self.paymentId(rootData.queryMap.id);
                self.amount(rootData.queryMap.amount);
                self.currency(rootData.queryMap.currency);
                self.user(rootData.queryMap.user);
                self.aliasType(rootData.queryMap.type);
                determinantValue = rootData.queryMap.determinantValue;
            }

            DashboardModel.fetchBankConfiguration().done(function(data) {
                self.region(data.bankConfigurationDTO.region);
            });

            DashboardModel.fetchLdapUser().done(function(data) {
                self.partyId(data.userProfile.partyId.value);
                self.partyDetails("");

                self.userDetails({
                    firstName: data.userProfile.firstName,
                    lastName: data.userProfile.lastName,
                    email: data.userProfile.emailId
                });

                DashboardModel.readUser(self.aliasValue().toLowerCase(), self.aliasType()).done(function(data) {
                    data = data.globalPayee;
                    self.version(data.version);

                    if (data.accountId) {
                        if (data.payeeType === "DOMESTIC") {
                            self.accountType("DOMESTIC");
                            self.ifscCode(data.bankCode);
                            self.srcAccount(data.accountId);

                            if(self.region() === "SEPA")
                            {
                            DashboardModel.getBankDetailsBIC(self.ifscCode()).done(function(data){
                                self.branch(data.branchAddress);
                              });
                            }
                            else
                            {
                                DashboardModel.getBankDetailsDCC(self.ifscCode()).done(function(data){
                                    self.branch(data.branchAddress);
                                  });
                            }

                            self.isDomestic(true);
                        } else if (data.payeeType === "INTERNAL") {
                            self.accountType("INTERNAL");
                            self.srcAccount(data.accountId);
                            self.isDomestic(false);
                        }
                    } else {
                        if (data.aliasValue !== null) {
                            self.isGlobalPayeeCreated(true);
                        } else {
                            self.isGlobalPayeeCreated(false);
                        }

                        self.isExistingGlobalPayee(false);
                    }

                    self.globalPayeeData(data);
                    self.stageOne(true);
                });
            });
        };

        self.updateDetails = function() {
            self.isExistingGlobalPayee(false);
            self.isUpdateDetails(true);
        };

        self.cancelPayment = function() {
            window.location = "/index.html?module=home";
        };

        self.closeLogoutWarning = function() {
            $("#Warning-logout").trigger("closeModal");
        };

        self.openLogoutWarning = function() {
            $("#Warning-logout").trigger("openModal");
        };

        self.logOut = function() {
            window.dispatchEvent(new CustomEvent("logout"));
        };

        self.confirmPayment = function() {
            DashboardModel.confirmPayment(self.paymentId(), determinantValue).done(function(data,status,jqXhr) {
                self.stageOne(false);
                self.externalReferenceId(data.transactionNumber);

                const confirmScreenDetailsArray = [
                    [{
                        label: self.payments.peertopeer.globalpayee.transferTo,
                        account: self.srcAccount,
                        otherBankSelected:self.isDomestic
                    }]
                ];

                confirmScreenDetailsArray.push([{
                    label: self.payments.peertopeer.amount,
                    value: rootParams.baseModel.formatCurrency(parseFloat(self.amount()),self.currency())
                  }]);

                 if(self.accountType()==="DOMESTIC")
                 {
                   if(self.region()=== "SEPA"){

               confirmScreenDetailsArray.push([{
                label: self.payments.peertopeer.globalpayee.bic,
                value: self.ifscCode
              }]);

                confirmScreenDetailsArray.push([{
                    label: self.payments.peertopeer.globalpayee.branch,
                    branch: self.branch,
                    otherBankSelected:self.isDomestic
                  }]);
            }
           else{
                confirmScreenDetailsArray.push([{
                  label: self.payments.peertopeer.globalpayee.ifsc,
                  value: self.ifscCode
                }]);

                  confirmScreenDetailsArray.push([{
                      label: self.payments.peertopeer.globalpayee.branch,
                      branch: self.branch,
                      otherBankSelected:self.isDomestic
                    }]);

          }
          }

        rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            hostReferenceNumber: data.transactionNumber,
            transactionName: self.payments.peertopeer.titleRetail,
            logOut:self.logOut,
            confirmScreenExtensions: {
                isSet: true,
                confirmScreenDetails: confirmScreenDetailsArray,
                template: "confirm-screen/claim-payment-template"
            }
        }, self);
        });
        };

        self.done = function() {
            window.location = "/index.html?module=home";
        };
    };
});