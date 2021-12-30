define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
    "ojL10n!resources/nls/bank-details",
  "ojs/ojinputtext",
  "ojs/ojlistview",
  "ojs/ojtrain",
  "ojs/ojselectcombobox"
], function(oj, ko, $, GlobalPayeeModel, ResourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this,
      getNewKoModel = function() {
        const KoModel = ko.mapping.fromJS(GlobalPayeeModel.getNewModel());

        return KoModel;
      };

    ko.utils.extend(self, rootParams.rootModel);
    self.bankdetailsModel = getNewKoModel().bankdetailsModel;
    self.otherBankSelected=ko.observable(false);
    self.payments = ResourceBundle.payments;
    self.common = ResourceBundle.common;
    self.onBoardingModel = getNewKoModel().onBoardingModel;
    self.externalReferenceId = ko.observable();
    self.validationTracker = ko.observable();
    self.accountName = ko.observable();
    self.isBranchListLoaded = ko.observable(false);
    self.stageOne = ko.observable(true);
    self.stageTwo = ko.observable(false);
    self.branchList = ko.observableArray();
    self.srcAccount = ko.observable();
    self.ifsc = ko.observable();
    self.version = ko.observable();
    self.etagArray = ko.observableArray();
    self.partyId = ko.observable();
    self.uid = ko.observable();
    self.selectedBranch = ko.observable();
    self.bankCodeLocal = ko.observable();
    self.performUpdate = ko.observable(false);
    self.bankDetailsCode = ko.observable();
    self.additionalBankDetails = ko.observable();
    self.clearingCodeType = ko.observable();
    self.region = ko.observable();
    self.ConfirmaccountNumber = ko.observable();
    rootParams.dashboard.headerName(self.payments.peertopeer.titleRetail);

    rootParams.baseModel.registerElement("internal-account-input");

    self.accountWithArray = [{
        id: "thisBank",
        label: self.payments.peertopeer.globalpayee.thisBank
      },
      {
        id: "otherBank",
        label: self.payments.peertopeer.globalpayee.otherBank
      }
    ];

    self.accountWith = ko.observable(self.accountWithArray[0].id);
    self.showIFSC = ko.observable(false);

    self.accountWithChange = function(event) {
      self.srcAccount("");
      self.confirmValue("");
      self.bankdetailsModel.accountId("");

      if (self.accountWith(event.detail.value)) {
        if (self.accountWith() === "thisBank")
        {
          self.otherBankSelected(false);
          self.additionalBankDetails(null);
          self.showIFSC(false);
        } else {
          self.otherBankSelected(true);
          self.showIFSC(true);
        }
      }
    };

    GlobalPayeeModel.init();

    GlobalPayeeModel.fetchBankConfiguration().done(function(data) {
      self.region(data.bankConfigurationDTO.region);

      if(self.region() === "SEPA"){
        self.clearingCodeType("SWI");
      } else {
        self.clearingCodeType("NEFT");
      }
    });

    self.bankdetailsModel.firstName(self.partyDetails() !== "" ? self.partyDetails().firstName : self.userDetails().firstName);
    self.lastName = ko.observable(self.partyDetails() !== "" ? self.partyDetails().lastName : self.userDetails().lastName);
    self.email = ko.observable(self.partyDetails() !== "" ? self.partyDetails().email : self.userDetails().email.displayValue);

    self.etagHandler = function(data) {
      self.version(data.getResponseHeader("ETag") ? data.getResponseHeader("ETag") : 1);

      if (self.performUpdate()) {
        const payload = ko.toJSON(self.bankdetailsModel);

        GlobalPayeeModel.confirmUser(self.version() !== null ? self.version() : rootParams.rootModel.version() !== null ? rootParams.rootModel.version() : "1", payload).done(function() {
          self.srcAccount(self.bankdetailsModel.accountId());
          self.stageOne(false);
          self.stageTwo(true);
        });
      }
    };

        let cnfaccountValue,
        accountValue;

        self.confirmValue = ko.observable();

        function AccountNoValidator_fn(value) {
            accountValue = value;

            if (value) {
                if (cnfaccountValue) {
                    if (value === cnfaccountValue) {
                        document.getElementById("confirmAccNumber").validate();
                    } else { throw new oj.ValidatorError("ERROR", self.payments.peertopeer.claimPayment.accountNoValidation); }
                } else if (self.confirmValue()) {
                    if (value !== self.confirmValue()) { throw new oj.ValidatorError("ERROR", self.payments.peertopeer.claimPayment.accountNoValidation); }
                }
            }
        }

        function cnfAccountNoValidator_fn(value) {
            if ((self.srcAccount() && self.srcAccount() !== "") || value) {
                cnfaccountValue = value;

                if (accountValue !== cnfaccountValue) {
                    if (self.srcAccount() !== value) {
                        self.srcAccount("");
                        throw new oj.ValidatorError("ERROR", self.payments.peertopeer.claimPayment.accountNoValidation);
                    }
                } else if (accountValue === cnfaccountValue) {
                    self.confirmValue(cnfaccountValue);
                    cnfaccountValue = "";
                    AccountNoValidator_fn(accountValue);
                    document.getElementById("accNumber").validate();
                }
            } else { throw new oj.ValidatorError("ERROR", self.payments.peertopeer.claimPayment.validationMessage); }
        }

        self.accountNoValidator = ko.observableArray([rootParams.baseModel.getValidator("ACCOUNT")]);

        self.accountNoValidator.push({
            validate: AccountNoValidator_fn
        });

        self.confirmAccountNoValidator = [{
            validate: cnfAccountNoValidator_fn
        }];

        self.restrictedEvent = function() {
            $("#accNumber").bind("copy paste cut", function(e) {
                e.preventDefault();
            });

            $("#confirmAccNumber").bind("copy paste cut", function(e) {
                e.preventDefault();
            });
        };

    self.createUser = function() {
      rootParams.dashboard.headerName(self.payments.peertopeer.titleRetail);
      rootParams.dashboard.headerCaption(false);
      self.version(null);

      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }

      GlobalPayeeModel.readUser(self.aliasValue().toLowerCase(), self.aliasType()).done(function(data) {
        data = data.globalPayee;
        self.version(data.version);

        if (data.aliasValue) {
          self.isGlobalPayeeCreated(true);
          self.confirmUser();
        } else {
          self.onBoardingModel.aliasValue(self.aliasValue().toLowerCase());
          self.onBoardingModel.aliasType(self.aliasType());
          self.onBoardingModel.emailId.value(self.userDetails().email.value || self.email());
          self.onBoardingModel.firstName(self.partyDetails() !== "" ? self.partyDetails().firstName : self.userDetails().firstName);
          self.onBoardingModel.lastName(self.partyDetails() !== "" ? self.partyDetails().lastName : self.userDetails().lastName);
          self.onBoardingModel.paymentId(self.paymentId());

          const payload = ko.toJSON(self.onBoardingModel);

          GlobalPayeeModel.createUser(payload).done(function(data) {
            self.globalPayeeData(data);
            self.version(1);
            self.confirmUser();
          });
        }
      });
    };

    self.cancelUser = function() {
      window.location = "/index.html?module=home";
    };

    self.confirmUser = function() {
      self.bankdetailsModel.aliasValue(self.aliasValue().toLowerCase());
      self.bankdetailsModel.aliasType(self.aliasType());
      self.bankdetailsModel.partyId(rootParams.rootModel.partyId());

      if (self.accountWith() === "thisBank") {
        self.bankdetailsModel.payeeType("INTERNAL");

        const accountId = self.bankdetailsModel.accountId();

        self.bankdetailsModel.accountId(accountId);
      } else if (self.accountWith() === "otherBank") {
        const accountId = self.confirmValue();

        self.bankdetailsModel.accountId(accountId);
        self.bankdetailsModel.payeeType("DOMESTIC");

        if (self.additionalBankDetails() !== null) {
          self.ifsc(self.additionalBankDetails().code);
        }

        self.bankdetailsModel.bankCode(self.ifsc());
      }

      self.bankdetailsModel.paymentId(self.paymentId());
      self.bankdetailsModel.uid(self.globalPayeeData().uid ? self.globalPayeeData().uid : null);
      self.bankdetailsModel.accountName = self.accountName() !== undefined && self.accountName().length > 0 ? self.accountName() : null;

      self.performUpdate(true);

      if (self.version()) {
        const payload = ko.toJSON(self.bankdetailsModel);

        GlobalPayeeModel.confirmUser(self.version(), payload).done(function() {
          self.srcAccount(self.bankdetailsModel.accountId());
          self.stageOne(false);
          self.stageTwo(true);
        }).fail(function() {
          self.bankdetailsModel.accountId(null);
        });
      }
    };

    self.confirmPayment = function() {
      GlobalPayeeModel.confirmPayment(self.paymentId()).done(function(data, status, jqXHR) {
        self.externalReferenceId(data.transactionNumber);

        const confirmScreenDetailsArray = [
             [{
                 label: self.payments.peertopeer.globalpayee.firstName,
                 value: self.bankdetailsModel.firstName
               }]];

               if(self.lastName().length>0)
              {
                confirmScreenDetailsArray.push([{
                 label: self.payments.peertopeer.globalpayee.lastName,
                 value: self.lastName
               }
                ]);
               }

             confirmScreenDetailsArray.push([{
                 label: self.payments.peertopeer.globalpayee.email,
                 value: self.email
               }]);

               confirmScreenDetailsArray.push([{
                label: self.payments.peertopeer.globalpayee.amount,
                value: rootParams.baseModel.formatCurrency(parseFloat(self.amount()),self.currency())
              }]);

              confirmScreenDetailsArray.push([{
                label: self.payments.peertopeer.globalpayee.transferTo,
                account: self.srcAccount,
                otherBankSelected:self.otherBankSelected
              }]);

             if(self.bankdetailsModel.payeeType()==="DOMESTIC")
             {
               if(self.region()=== "SEPA"){

           confirmScreenDetailsArray.push([{
            label: self.payments.peertopeer.globalpayee.bankcodebic,
            value: self.ifsc
          }]);
        }
       else{
            confirmScreenDetailsArray.push([{
              label: self.payments.peertopeer.globalpayee.ifsc,
              value: self.ifsc
            }]);

      }
    }

    if(self.additionalBankDetails())
    {
      self.branch=ko.observable(self.additionalBankDetails().branchAddress);

      confirmScreenDetailsArray.push([{
        label: self.payments.peertopeer.globalpayee.branch,
        branch: self.branch,
        otherBankSelected:self.otherBankSelected
      }]);

    }

        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXHR,
          hostReferenceNumber: data.transactionNumber,
          transactionName: self.payments.peertopeer.titleRetail,
          logOut: self.logOut,
          confirmScreenExtensions: {
               isSet: true,
               confirmScreenDetails: confirmScreenDetailsArray,
               template: "confirm-screen/claim-payment-template"
             }
        }, self);
      });
    };

    self.cancelPayment = function() {
      self.bankdetailsModel.accountId(self.bankdetailsModel.accountId());
      self.stageOne(true);
      self.additionalBankDetails(null);
      self.stageTwo(false);
    };

    self.done = function() {
      window.location = "/index.html?module=home";
    };

    self.openLookup = function() {
      $("#menuButtonDialog").trigger("openModal");
    };

    self.resetCode = function() {
      self.additionalBankDetails(null);
      self.bankDetailsCode(null);
    };

    let error;

    self.verifyCode = function() {
      if (self.bankDetailsCode()) {
        self.ifsc(self.bankDetailsCode());
      }

      if (self.bankDetailsCode().length < 1) {
        error = true;
      } else if (self.bankDetailsCode().length > 11) {
        error = true;
        throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.payments.peertopeer.globalpayee.invalidError));
      }

      if (!error) {
        if(self.region() === "SEPA"){
          GlobalPayeeModel.getBankDetails(self.ifsc()).done(function(data) {
            self.additionalBankDetails(data);
          }).fail(function() {
            self.resetCode();
          });
        } else {
          GlobalPayeeModel.getBankDetailsDCC(self.ifsc()).done(function(data) {
            self.additionalBankDetails(data);
          }).fail(function() {
            self.resetCode();
          });
        }
      }

      error = false;
    };
  };
});