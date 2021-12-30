define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",

  "ojL10n!lzn/alpha/resources/nls/account-funding",
  "ojs/ojradioset",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, AccountFundingModelObject, resourceBundle) {
  "use strict";

  return function(rootParams) {
    const self = this,
      AccountFundingModel = new AccountFundingModelObject();
    let count = 0;
    const getNewKoModel = function() {
      const KoModel = AccountFundingModel.getNewModel();

      KoModel.selectedLinkedAccount = {
        id: {
          value: "",
          displayValue: ""
        }
      };

      KoModel.tdRequirements.termDepositApplicationRequirementDTO.requestedAmount.amount = ko.observable(KoModel.tdRequirements.termDepositApplicationRequirementDTO.requestedAmount.amount);
      KoModel.tdRequirements.termDepositApplicationRequirementDTO.requestedAmount.currency = self.productDetails().requirements.currency;
      KoModel.tdRequirements.offerCurrency = self.productDetails().requirements.currency;
      KoModel.tdRequirements.termDepositApplicationRequirementDTO.noOfCoApplicants = self.productDetails().requirements.noOfCoApplicants;
      KoModel.tdRequirements.termDepositApplicationRequirementDTO.requestedTenure.months = ko.observable(KoModel.tdRequirements.termDepositApplicationRequirementDTO.requestedTenure.months);
      KoModel.tdRequirements.termDepositApplicationRequirementDTO.requestedTenure.days = ko.observable(KoModel.tdRequirements.termDepositApplicationRequirementDTO.requestedTenure.days);
      KoModel.tdRequirements.termDepositApplicationRequirementDTO.requestedTenure.years = ko.observable(KoModel.tdRequirements.termDepositApplicationRequirementDTO.requestedTenure.years);
      KoModel.tdRequirements.productGroupSerialNumber = self.productDetails().requirements.productGroupSerialNumber;
      KoModel.tdRequirements.offerId = self.productDetails().offers.offerId;
      KoModel.interestRate = ko.observable(KoModel.interestRate);

      return KoModel;
    };

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.applicantObject = ko.observable(rootParams.applicantObject);
    rootParams.baseModel.registerComponent("loan-tenure", "origination");
    self.clearfrequency = ko.observable(true);
    self.fundingType = ko.observable("");
    self.groupValid = ko.observable();
    self.groupValidCard = ko.observable();
    self.groupValidAccountPayment = ko.observable();
    self.fundingOptionsList = ko.observableArray();
    self.fundingOtionsListLoaded = ko.observable(false);
    self.casaOwnAccountList = ko.observableArray();
    self.casaOwnAccountListLoaded = ko.observable(false);
    self.linkedAccountList = ko.observableArray();
    self.linkedAccountListLoaded = ko.observable(false);
    self.changeLinkedAccount = ko.observable(false);
    self.debitCardFormatsList = ko.observableArray();
    self.creditCardFormatsList = ko.observableArray();
    self.cardFormatsListListLoaded = ko.observable(false);
    self.expiryDateMonth = ko.observableArray();
    self.expiryDateYear = ko.observableArray();
    self.currentCardType = ko.observable("");
    self.currentCardFormat = ko.observable("");
    self.minimumAmount = "";
    self.frequencyOptionsLoaded = ko.observable(false);
    self.repaymentFrequencyData = ko.observableArray();
    self.cardName = ko.observable("");
    self.aanNumber = ko.observable("");
    self.expiryMonth = ko.observable("");
    self.expiryYear = ko.observable("");
    self.cvv = ko.observable("");
    self.cardOptionsRefreshed = ko.observable(true);
    self.cardTypeRefreshed = ko.observable(true);

    self.initialAmount = {
      amount: "",
      currency: self.productDetails().currency
    };

    self.initialAmount.amount = ko.observable(self.initialAmount.amount);
    self.cardMaxLength = ko.observable("19");
    self.cardUnmaskedBits = ko.observable("0");
    self.selectedFrequency = ko.observable("");

    if (self.productDetails().offers.offerAdditionalDetails.demandDepositOfferCurrencyParameterResponseDTOs) {
      self.minimumAmount = ko.mapping.toJS(ko.mapping.fromJS(self.productDetails().offers.offerAdditionalDetails.demandDepositOfferCurrencyParameterResponseDTOs[0].minimumInitialDepositAmount.amount));
    } else if (self.productDetails().offers.offerAdditionalDetails.termDepositOfferCurrencyParameterResponseDTOs) {
      self.minimumAmount = ko.mapping.toJS(ko.mapping.fromJS(self.productDetails().offers.offerAdditionalDetails.termDepositOfferCurrencyParameterResponseDTOs[0].minDepositAmount.amount));
    }

    self.validationTracker = ko.observable();

    self.cardNumberValidate = ko.pureComputed(function() {
      return [{
        type: "length",
        options: {
          min: self.cardMaxLength(),
          max: self.cardMaxLength(),
          messageDetail: {
            tooShort: self.resource.messages.cardNumber,
            tooLong: self.resource.messages.cardNumber
          }
        }
      }];
    });

    self.getAccountFundingList = function(data, event) {
      let eventValue;

      if (event.detail) {
        eventValue = event.detail.value;
      } else {
        eventValue = event.value;
      }

      if (eventValue && eventValue !== null) {
        if (!self.productDetails().sectionBeingEdited()) {
          self.currentCardType(self.currentCardType());
          self.currentCardType("");
          self.cardName("");
          self.aanNumber("");
          self.expiryMonth("");
          self.expiryYear("");

          if (self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails) {
            self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails.aanNumber = "";
          }

          self.cvv("");
        }

        ko.tasks.runEarly();
        self.cardOptionsRefreshed(true);

        if (eventValue === "COLL" && !self.linkedAccountListLoaded()) {
          if (count === 0) {
            count = count + 1;

            AccountFundingModel.getLinkedAccountList().done(function(data) {
              if (data.accounts) {
                self.linkedAccountList(data.accounts);
              }

              self.linkedAccountListLoaded(true);
              count = 0;
            });
          }
        }

        if (eventValue === "DDAO" && !self.casaOwnAccountListLoaded()) {
          if (count === 0) {
            count = count + 1;

            AccountFundingModel.getCasaOwnAccountList().done(function(data) {
              if (data.accounts) {
                self.casaOwnAccountList(data.accounts);
              }

              self.casaOwnAccountListLoaded(true);
              count = 0;
            });
          }
        }

        if ((eventValue === "CARD_CREDIT" || eventValue === "CARD_DEBIT") && !self.cardFormatsListListLoaded()) {
          if (count === 0) {
            count = count + 1;

            AccountFundingModel.getCardFormatsList().done(function(data) {
              if (data.enumRepresentations) {
                if (data.enumRepresentations[0].type.toUpperCase() === "CREDIT") {
                  self.debitCardFormatsList(data.enumRepresentations[1]);
                  self.creditCardFormatsList(data.enumRepresentations[0]);
                } else {
                  self.debitCardFormatsList(data.enumRepresentations[0]);
                  self.creditCardFormatsList(data.enumRepresentations[1]);
                }
              }

              self.cardFormatsListListLoaded(true);
              count = 0;
            });
          }
        }
      }
    };

    self.initializeModel = function() {
      AccountFundingModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value);

      if (!self.applicantObject().accountFunding && !self.productDetails().sectionBeingEdited()) {
        self.applicantObject().accountFunding = getNewKoModel();
      } else {
        if (self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType === "CARD") {
          if (self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails.cardType === "DEBIT") {
            self.fundingType("CARD_DEBIT");
          } else {
            self.fundingType("CARD_CREDIT");
          }
        } else {
          self.fundingType(self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType);
        }

        const data = {
          option: "value",
          value: self.fundingType()
        };

        self.getAccountFundingList(null, data);
      }

      AccountFundingModel.getFundingOptionsList().done(function(data) {
        if (data.fundingOptions && data.fundingOptions.length > 0) {
          self.fundingOptionsList(data.fundingOptions);

          if (self.productDetails().productClassName === "TERM_DEPOSITS") {
            const later = {
              code: "LATER"
            };

            self.fundingOptionsList().push(later);
          }

          self.fundingOtionsListLoaded(true);
          self.fundingOptionsLoaded(true);
        }

        AccountFundingModel.getExistingAccountConfig().done(function(data) {
          if (data.accountConfigDTO) {
            if (data.accountConfigDTO.termDepositApplicationRequirementDTO) {
              if (data.accountConfigDTO.termDepositApplicationRequirementDTO.requestedAmount) {
                self.applicantObject().accountFunding.tdRequirements.termDepositApplicationRequirementDTO.requestedAmount.currency = data.accountConfigDTO.termDepositApplicationRequirementDTO.requestedAmount.currency;
                self.applicantObject().accountFunding.tdRequirements.termDepositApplicationRequirementDTO.requestedAmount.amount(data.accountConfigDTO.termDepositApplicationRequirementDTO.requestedAmount.amount.toString());
                self.productDetails().requirements.requestedAmount.amount = ko.observable(data.accountConfigDTO.termDepositApplicationRequirementDTO.requestedAmount.amount);
              }

              if (data.accountConfigDTO.termDepositApplicationRequirementDTO.requestedTenure) {
                self.applicantObject().accountFunding.tdRequirements.termDepositApplicationRequirementDTO.requestedTenure.years(data.accountConfigDTO.termDepositApplicationRequirementDTO.requestedTenure.years.toString());
                self.applicantObject().accountFunding.tdRequirements.termDepositApplicationRequirementDTO.requestedTenure.months(data.accountConfigDTO.termDepositApplicationRequirementDTO.requestedTenure.months.toString());
                self.applicantObject().accountFunding.tdRequirements.termDepositApplicationRequirementDTO.requestedTenure.days(data.accountConfigDTO.termDepositApplicationRequirementDTO.requestedTenure.days.toString());
                self.productDetails().requirements.requestedTenure.months = ko.observable(data.accountConfigDTO.termDepositApplicationRequirementDTO.requestedTenure.months);
                self.productDetails().requirements.requestedTenure.years = ko.observable(data.accountConfigDTO.termDepositApplicationRequirementDTO.requestedTenure.years);
                self.productDetails().requirements.requestedTenure.days = data.accountConfigDTO.termDepositApplicationRequirementDTO.requestedTenure.days;
              }

              if (data.accountConfigDTO.termDepositApplicationRequirementDTO.frequency) {
                self.applicantObject().accountFunding.tdRequirements.termDepositApplicationRequirementDTO.frequency = data.accountConfigDTO.termDepositApplicationRequirementDTO.frequency;
                self.selectedFrequency(data.accountConfigDTO.termDepositApplicationRequirementDTO.frequency);
                self.clearfrequency(false);
              }
            }

            if (data.accountConfigDTO.maturityInformationDTO) {
              self.applicantObject().accountFunding.interestRate(data.accountConfigDTO.maturityInformationDTO.annualEquivalentRate);
            }

            if (data.accountConfigDTO.settlementMode) {
              if (data.accountConfigDTO.settlementMode.txnAmount) {
                self.initialAmount.amount(data.accountConfigDTO.settlementMode.txnAmount.amount);
                self.initialAmount.currency = data.accountConfigDTO.settlementMode.txnAmount.currency;
              }

              if (self.productDetails().productClassName === "TERM_DEPOSITS") {
                if (data.accountConfigDTO.settlementMode.settlementType !== "DDAO" && data.accountConfigDTO.settlementMode.settlementType !== "COLL" && data.accountConfigDTO.settlementMode.settlementType !== "CARD") {
                  self.fundingType("LATER");
                }
              }

              if (data.accountConfigDTO.settlementMode.settlementType === "DDAO") {
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType = data.accountConfigDTO.settlementMode.settlementType;
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.internalAccountSettlementDetailDTO.accountNo.value = data.accountConfigDTO.settlementMode.internalAccountSettlementDetailDTO.accountNo.value;
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.internalAccountSettlementDetailDTO.accountNo.displayValue = data.accountConfigDTO.settlementMode.internalAccountSettlementDetailDTO.accountNo.displayValue;
              }

              if (data.accountConfigDTO.settlementMode.settlementType === "COLL") {
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType = data.accountConfigDTO.settlementMode.settlementType;
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.counterPartyAccountNo.value = data.accountConfigDTO.settlementMode.collectionDetails.counterPartyAccountNo.value;
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.counterPartyAccountNo.displayValue = data.accountConfigDTO.settlementMode.collectionDetails.counterPartyAccountNo.displayValue;
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.mandateId = data.accountConfigDTO.settlementMode.collectionDetails.mandateId;
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.institutionId = data.accountConfigDTO.settlementMode.collectionDetails.institutionIdValue;
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.institutionType = data.accountConfigDTO.settlementMode.collectionDetails.institutionType;
                self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.counterPartyName = data.accountConfigDTO.settlementMode.collectionDetails.counterPartyName;
              }

              if (self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType === "DDAO" || self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType === "COLL") {
                self.fundingType(self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType);

                if (self.fundingType() === "DDAO") {
                  let account1 = self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.internalAccountSettlementDetailDTO.accountNo;

                  if (count === 0) {
                    count = count + 1;

                    AccountFundingModel.getCasaOwnAccountList().done(function(data) {
                      if (data.accounts) {
                        self.casaOwnAccountList(data.accounts);

                        for (let k = 0; k < self.casaOwnAccountList().length; k++) {
                          if (self.casaOwnAccountList()[k].id.value === account1.value) {
                            account1 = self.casaOwnAccountList()[k];
                            break;
                          }
                        }

                        self.applicantObject().accountFunding.selectedLinkedAccount = account1;
                        self.casaOwnAccountListLoaded(true);
                      }

                      count = 0;
                    });
                  }
                }

                if (self.fundingType() === "COLL") {
                  let account = self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.counterPartyAccountNo;

                  if (count === 0) {
                    count = count + 1;

                    AccountFundingModel.getLinkedAccountList().done(function(data) {
                      if (data.accounts) {
                        self.linkedAccountList(data.accounts);

                        for (let i = 0; i < self.linkedAccountList().length; i++) {
                          if (self.linkedAccountList()[i].id.value === account.value) {
                            account = self.linkedAccountList()[i];
                            break;
                          }
                        }

                        self.applicantObject().accountFunding.selectedLinkedAccount = account;
                        self.linkedAccountListLoaded(true);
                        self.changeLinkedAccount(true);
                      }

                      count = 0;
                    });
                  }
                }
              }
            }
          }

          if (self.productDetails().productClassName === "TERM_DEPOSITS") {
            self.createTDRequirements();
          }
        });
      });

      const monthArray = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12
      ];

      self.expiryDateMonth(monthArray);

      const yearArray = [],
        currentYear = rootParams.baseModel.getDate().getFullYear();

      for (let j = 0; j <= 15; j++) {
        const year = currentYear + j;

        yearArray.push(year);
      }

      self.expiryDateYear(yearArray);
      self.expiryDateMonth(monthArray);
    };

    self.initializeModel();

    if (!self.applicantObject().accountFunding) {
      self.applicantObject().accountFunding = getNewKoModel();
    }

    self.showWhatIsThisText = function(data) {
      if (data === "CARD_CREDIT") {
        $("#whatisThisCredit").trigger("openModal");
      }

      if (data === "CARD_DEBIT") {
        $("#whatisThisDebit").trigger("openModal");
      }
    };

    self.completeAccountFundingSection = function() {
      self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
    };

    self.createTDRequirements = function() {
      const tdReq = ko.mapping.toJS(ko.mapping.fromJS(self.applicantObject().accountFunding.tdRequirements));

      tdReq.termDepositApplicationRequirementDTO.requestedTenure.years = parseInt(self.productDetails().requirements.requestedTenure.years());
      tdReq.termDepositApplicationRequirementDTO.requestedTenure.months = parseInt(self.productDetails().requirements.requestedTenure.months());
      tdReq.termDepositApplicationRequirementDTO.requestedTenure.days = parseInt(self.productDetails().requirements.requestedTenure.days);
      tdReq.termDepositApplicationRequirementDTO.frequency = self.productDetails().requirements.frequency();
      tdReq.termDepositApplicationRequirementDTO.requestedAmount.amount = self.productDetails().requirements.requestedAmount.amount();
      tdReq.termDepositApplicationRequirementDTO.requestedAmount.currency = self.productDetails().requirements.requestedAmount.currency;

      const payLoad = ko.toJSON(tdReq);

      AccountFundingModel.createTDRequirements(payLoad).done(function(data) {
        self.applicantObject().accountFunding.tdRequirements.simulationId = data.simulationId;
      });
    };

    self.linkedAccountChanged = function(event) {
      let account = {
          id: {
            value: "",
            displayValue: ""
          }
        },
        linkedAccount = false,
        i;

      if (event.detail.value) {
        for (i = 0; i < self.linkedAccountList().length; i++) {
          if (self.linkedAccountList()[i].id.value === event.detail.value) {
            account = self.linkedAccountList()[i];
            linkedAccount = true;
            break;
          }
        }

        for (i = 0; i < self.casaOwnAccountList().length; i++) {
          if (self.casaOwnAccountList()[i].id.value === event.detail.value) {
            account = self.casaOwnAccountList()[i];
            break;
          }
        }

        self.applicantObject().accountFunding.selectedLinkedAccount = account;
        self.changeLinkedAccount(linkedAccount);
      }
    };

    self.checkAccountFundingInfo = function(fundingOption) {
      const tracker = document.getElementById("trackerFunding"),
        trackerCardPayment = document.getElementById("trackerCardPayment"),
        trackerCardAccountPayment = document.getElementById("trackerCardAccountPayment");

      if ((tracker === null || tracker.valid === "valid") && (trackerCardPayment === null || trackerCardPayment.valid === "valid") && (trackerCardAccountPayment === null || trackerCardAccountPayment.valid === "valid")) {
        self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.txnAmount.amount = self.initialAmount.amount();
        self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.txnAmount.currency = self.initialAmount.currency;

        if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
          return false;
        } else if (fundingOption.fundingType() === "CARD_CREDIT" || fundingOption.fundingType() === "CARD_DEBIT") {
          $("#SAVEFUNDINGSOURCE").show().trigger("openModal");
        } else {
          self.saveAccountFundingInfo({}, fundingOption);
        }
      } else {
        if (tracker) {
          tracker.showMessages();
          tracker.focusOn("@firstInvalidShown");
        }

        if (trackerCardPayment) {
          trackerCardPayment.showMessages();
          trackerCardPayment.focusOn("@firstInvalidShown");
        }

        if (trackerCardAccountPayment) {
          trackerCardAccountPayment.showMessages();
          trackerCardAccountPayment.focusOn("@firstInvalidShown");
        }
      }
    };

    self.saveAccountFundingInfo = function(event, data) {
      let accConfig = null;

      if (data.fundingType()) {
        if (data.fundingType() !== "LATER") {
          if (data.fundingType() === "CARD_CREDIT" || data.fundingType() === "CARD_DEBIT") {
            if (data.fundingType() === "CARD_CREDIT") {
              self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails.cardType = "CREDIT";
            }

            if (data.fundingType() === "CARD_DEBIT") {
              self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails.cardType = "DEBIT";
            }

            self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType = "CARD";
            self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails.cardName = self.cardName();
            self.applicantObject().accountFunding.selectedValues.cardType = self.currentCardType();
            self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails.cvv = self.cvv();

            const month = ko.utils.unwrapObservable(self.expiryMonth),
              year = ko.utils.unwrapObservable(self.expiryYear);
            let date_temp = rootParams.baseModel.getDate();

            date_temp.setFullYear(year, month - 1, 1);
            date_temp = oj.IntlConverterUtils.dateToLocalIso(date_temp);
            self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails.expiryDate = date_temp.substring(0, 10);
            accConfig = ko.mapping.toJS(ko.mapping.fromJS(self.applicantObject().accountFunding.savingsAccountConfiguration));
            accConfig.settlementMode.collectionDetails = null;
            accConfig.settlementMode.internalAccountSettlementDetailDTO = null;
          }

          if (data.fundingType() === "COLL") {
            self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType = "COLL";
            self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.counterPartyAccountNo.value = self.applicantObject().accountFunding.selectedLinkedAccount.id.value;
            self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.counterPartyAccountNo.displayValue = self.applicantObject().accountFunding.selectedLinkedAccount.id.displayValue;
            self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.mandateId = self.applicantObject().accountFunding.selectedLinkedAccount.mandateId;
            self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.institutionId = self.applicantObject().accountFunding.selectedLinkedAccount.institutionIdValue;
            self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.institutionType = self.applicantObject().accountFunding.selectedLinkedAccount.institutionType;
            self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.collectionDetails.counterPartyName = self.applicantObject().accountFunding.selectedLinkedAccount.counterPartyName;
            accConfig = ko.mapping.toJS(ko.mapping.fromJS(self.applicantObject().accountFunding.savingsAccountConfiguration));
            accConfig.settlementMode.cardDetails = null;
            accConfig.settlementMode.internalAccountSettlementDetailDTO = null;
          }

          if (data.fundingType() === "DDAO") {
            self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType = "DDAO";
            self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.internalAccountSettlementDetailDTO.accountNo.value = self.applicantObject().accountFunding.selectedLinkedAccount.id.value;
            self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.internalAccountSettlementDetailDTO.accountNo.displayValue = self.applicantObject().accountFunding.selectedLinkedAccount.id.displayValue;
            accConfig = ko.mapping.toJS(ko.mapping.fromJS(self.applicantObject().accountFunding.savingsAccountConfiguration));
            accConfig.settlementMode.cardDetails = null;
            accConfig.settlementMode.collectionDetails = null;
          }

          accConfig.offerId = self.productDetails().offers.offerId;
          accConfig.productGroupSerialNumber = self.productDetails().requirements.productGroupSerialNumber;
          accConfig.offerCurrency = self.productDetails().requirements.currency;

          const payLoad = ko.toJSON(accConfig);

          AccountFundingModel.saveModel(payLoad).done(function(data) {
            self.applicantObject().accountFunding.savingsAccountConfiguration.simulationId = data.simulationId;

            const sendData = {
                productGroupSerialNumber: self.applicantObject().accountFunding.savingsAccountConfiguration.productGroupSerialNumber,
                simulationId: self.applicantObject().accountFunding.savingsAccountConfiguration.simulationId
              },
              validatePayLoad = ko.toJSON(sendData);

            AccountFundingModel.validateAccountConfig(validatePayLoad).done(function(data) {
              self.applicantObject().accountFunding.savingsAccountConfiguration.simulationId = data.simulationId;
            });
          });
        } else {
          self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.settlementType = "LATER";
          accConfig = ko.mapping.toJS(ko.mapping.fromJS(self.applicantObject().accountFunding.savingsAccountConfiguration));
          accConfig.settlementMode.collectionDetails = null;
          accConfig.settlementMode.cardDetails = null;
          accConfig.settlementMode.internalAccountSettlementDetailDTO = null;

          const sendData = {
              productGroupSerialNumber: self.applicantObject().accountFunding.tdRequirements.productGroupSerialNumber,
              simulationId: self.applicantObject().accountFunding.tdRequirements.simulationId
            },
            validatePayLoad = ko.toJSON(sendData);

          AccountFundingModel.validateAccountConfig(validatePayLoad).done(function(data) {
            self.applicantObject().accountFunding.savingsAccountConfiguration.simulationId = data.simulationId;
          });
        }
      }

      $("#SAVEFUNDINGSOURCE").trigger("closeModal");
      self.completeAccountFundingSection();
    };

    self.cardTypeChange = function() {
      self.cardTypeRefreshed(false);
      self.cardName("");
      self.aanNumber("");
      self.expiryMonth("");
      self.expiryYear("");
      self.cvv("");

      if (self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails) {
        self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails.aanNumber = "";
      }

      ko.tasks.runEarly();
      self.cardTypeRefreshed(true);
    };

    self.changeCardformat = function(event) {
      self.cardTypeChange();

      if (event.detail.value) {
        let temp = null;

        if (self.fundingType() === "CARD_CREDIT") {
          for (let i = 0; i < self.creditCardFormatsList().data.length; i++) {
            if (self.creditCardFormatsList().data[i].code === event.detail.value) {
              temp = self.creditCardFormatsList().data[i];
              break;
            }
          }
        }

        if (self.fundingType() === "CARD_DEBIT") {
          for (let j = 0; j < self.debitCardFormatsList().data.length; j++) {
            if (self.debitCardFormatsList().data[j].code === event.detail.value) {
              temp = self.debitCardFormatsList().data[j];
              break;
            }
          }
        }

        self.currentCardType(temp.code);
        self.cardMaxLength(temp.format.code.length);
        self.cardUnmaskedBits(temp.format.value);
        self.currentCardFormat(temp.format.code);
      }
    };

    const formatPattern = function(pattern) {
      const arrPattern = pattern.split("-");

      for (let index = 0; index < arrPattern.length; index++) {
        arrPattern[index] = arrPattern[index].length;
      }

      return arrPattern;
    };

    $(document).off("focusin", "#cardNumber");

    $(document).on("focusin", "#cardNumber", function() {
      const val = self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails.aanNumber,
        pattern = formatPattern(self.currentCardFormat());

      self.applySpecificPattern(event.target, val, pattern, 0);
    });

    $(document).off("focusout", "#cardNumber");

    $(document).on("focusout", "#cardNumber", function(event) {
      const val = event.target.value.replace(/\-|\d/g, "");

      if (val.length > 0) {
        event.target.value = null;
        self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails.aanNumber = "";
        self.aanNumber("");
      } else {
        self.applicantObject().accountFunding.savingsAccountConfiguration.settlementMode.cardDetails.aanNumber = event.target.value.replace(/\-/g, "");
        self.aanNumber(event.target.value.replace(/[^\-]/g, "x"));
        event.target.value = event.target.value.replace(/[^\-]/g, "x");
      }
    });

    $(document).on("keyup", "#cardNumber", function(event) {
      const val = event.target.value.replace(/\-/g, ""),
        pattern = formatPattern(self.currentCardFormat());

      self.applySpecificPattern(event.target, val, pattern, 0);

      const cardNumberLength = self.currentCardFormat().replace(/\-/g, "").length;

      self.cardNumberPatternMasked(cardNumberLength - parseInt(self.cardUnmaskedBits()), pattern, event.target);
    });

    self.applySpecificPattern = function(input, val, pattern, startIndex) {
      input.value = self.applyPattern(val, pattern, startIndex);
    };

    self.cardNumberPatternMasked = function(maskedBits, pattern, input) {
      const val = input.value.replace(/\-/g, ""),
        len2 = val.length >= maskedBits ? maskedBits : val.length;

      self.applicantObject().accountFunding.selectedValues.aanNumber = self.applyPattern(self.maskValue(val, len2), pattern, 0);
    };

    self.changeFrqLoaded = function() {
      self.frequencyOptionsLoaded(false);

      if (!isNaN(self.productDetails().requirements.requestedTenure.years) && !isNaN(self.productDetails().requirements.requestedTenure.months) && !isNaN(self.productDetails().requirements.requestedTenure.days) && !isNaN(self.productDetails().requirements.requestedAmount.amount)) {
        AccountFundingModel.fetchFrequencyList(self.productDetails()).done(function(data) {
          if (data.frequencies) {
            self.repaymentFrequencyData(data.frequencies);
            self.applicantObject().accountFunding.tdRequirements.termDepositApplicationRequirementDTO.interestCompoundingFrequency = data.interestCompoundingFrequency;

            if (self.clearfrequency()) {
              self.selectedFrequency("");
            }

            self.frequencyOptionsLoaded(true);
          }
        });
      }
    };

    self.validateTenure = {
      validate: function() {
        if ($("#tenureYears").val()) {
          if (!$("#tenureMonths").val()) {
            self.applicantObject().accountFunding.tdRequirements.termDepositApplicationRequirementDTO.requestedTenure.months(0);
          }

          if (!$("#tenureDays").val()) {
            self.applicantObject().accountFunding.tdRequirements.termDepositApplicationRequirementDTO.requestedTenure.days(0);
          }
        } else if ($("#tenureMonths").val()) {
          if (!$("#tenureYears").val()) {
            self.applicantObject().accountFunding.tdRequirements.termDepositApplicationRequirementDTO.requestedTenure.years(0);
          }

          if (!$("#tenureDays").val()) {
            self.applicantObject().accountFunding.tdRequirements.termDepositApplicationRequirementDTO.requestedTenure.days(0);
          }
        } else if ($("#tenureDays").val()) {
          if (!$("#tenureYears").val()) {
            self.applicantObject().accountFunding.tdRequirements.termDepositApplicationRequirementDTO.requestedTenure.years(0);
          }

          if (!$("#tenureMonths").val()) {
            self.applicantObject().accountFunding.tdRequirements.termDepositApplicationRequirementDTO.requestedTenure.months(0);
          }
        }
      }
    };
  };
});
