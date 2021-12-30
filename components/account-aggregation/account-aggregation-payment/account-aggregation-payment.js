/**
 * Account Aggregation Payment used to transfer money to internal or external account
 *
 * @module account-aggregation
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} assembleStructureModel
 * @requires {object} ResourceBundle
 */
define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/aggregate-register-payment",
  "ojs/ojbutton",
  "ojs/ojselectcombobox",
  "ojs/ojradioset",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, AccountActivity, ResourceBundle) {
  "use strict";

  /**
   * Account Aggregation Payment component is used to transfer money to internal or external account.
   *
   * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
   * @return {Function} Function.
   */
  return function(rootParams) {
    const self = this,
      getNewKoModel = function() {
        const KoModel = AccountActivity.getNewModel();

        return ko.mapping.fromJS(KoModel);
      };

    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.header.transferMoney);
    self.externalPayload = getNewKoModel().transferMoneyModel;
    self.selfPayload = getNewKoModel().selfPaymentModel;
    self.accountsLoaded = ko.observable(false);
    self.toAccountValue = ko.observable();
    self.fromAccountValue = ko.observable();
    self.amount = ko.observable();
    self.currency = ko.observable();

    rootParams.baseModel.registerElement([
      "comment-box",
      "amount-input",
      "confirm-screen",
      "account-input"
    ]);

    self.accountsMatched = ko.observableArray();
    self.accountsMatchedLoaded = ko.observable(false);
    self.ifsc = ko.observable();
    self.loadIfsc = ko.observable(false);
    self.isNetworkTypesLoaded = ko.observable(false);
    self.networkTypesMap = {};
    self.network = ko.observable();
    self.currentAccountType = ko.observable("DOMESTIC");

    self.domesticNetworkTypesObj = {};
    self.region = ko.observable("INDIA");
    self.groupValid = ko.observable();
    self.additionalBankDetails = ko.observable();
    self.refreshLookup = ko.observable(false);
    self.isViewlimits = ko.observable(false);
    self.parentTaskCode = ko.observable();
    self.transferTo = ko.observable();
    self.selectedChannelIndex = ko.observable();
    self.channelList = ko.observableArray();
    self.selectedChannel = ko.observable(false);
    self.selectedChannelType = ko.observable();
    self.selectedChannelTypeName = ko.observable();
    self.loadAccessPointList = ko.observable(false);
    self.myBankName = ko.observable(self.resource.myBankName);
    self.paymentId = "";
    self.customCurrencyURL = ko.observable();
    self.otherPurpose = ko.observable();
    self.purpose = ko.observable();
    self.otherPurposeValue = ko.observable();
    self.isPurposeListLoaded = ko.observable(false);
    self.transactionPurposeList = ko.observableArray();
    self.networkSuggestionModel = getNewKoModel().networkSuggestionModel;
    self.networkSuggestionModel.txnAmount.amount = self.amount;
    self.networkSuggestionModel.txnAmount.currency = self.currency;
    self.networkSuggestionModel.bankCode = self.ifsc;
    self.imageUploadFlag = ko.observable(false);
    self.validationTracker = ko.observable();
    self.additionalDetailsFrom = ko.observable();
    self.isCommentRequired = ko.observable(true);
    self.note = ko.observable();
    self.loadReview = ko.observable(false);
    self.currentDate = "";

    AccountActivity.fetCurrentDate().then(function(data) {
      self.currentDate = data.currentDate;
    });

    const networkPriority = {};
    let nonSuggestedNetworkSelected = false,
      suggestNetwork = function(enable) {
        if (!rootParams.rootModel.previousState) {
          if (enable) {
            AccountActivity.getNetworkPreferences().then(function(data) {
              for (let i = 0; i < data.networkpreferencedtos.length; i++) {
                networkPriority[data.networkpreferencedtos[i].networkType] = data.networkpreferencedtos[i].weightage;
              }
            });
          }

          return function() {
            if (enable && self.transferTo() === "EXTERNAL" && self.networkSuggestionModel.bankCode()) {
              AccountActivity.getSuggestedNetwork(ko.toJSON(self.networkSuggestionModel)).then(function(data) {
                if (data.suggestedType.length) {
                  self.isNetworkTypesLoaded(false);

                  let suggestedNetwork;

                  for (let i = 0; i < data.suggestedType.length; i++) {
                    self.domesticNetworkTypesObj[data.suggestedType[i].code].suggested(false);

                    if (data.suggestedType[i].payeeBankSupport && data.suggestedType[i].workingWindowSet && data.suggestedType[i].limitAvailable) {
                      if (!suggestedNetwork || networkPriority[data.suggestedType[i].code] > networkPriority[suggestedNetwork]) {
                        suggestedNetwork = data.suggestedType[i].code;
                      }

                      self.domesticNetworkTypesObj[data.suggestedType[i].code].disabled(false);
                    } else {
                      self.domesticNetworkTypesObj[data.suggestedType[i].code].disabled(true);
                    }
                  }

                  if (suggestedNetwork) {
                    self.domesticNetworkTypesObj[suggestedNetwork].suggested(true);

                    if (!self.network() || (self.network() && self.domesticNetworkTypesObj[self.network()].disabled()) || !nonSuggestedNetworkSelected) {
                      self.network(suggestedNetwork);
                    }
                  } else {
                    self.network(null);
                    rootParams.baseModel.showMessages(null, [self.resource.noNetworkSuggested], "ERROR");
                  }

                  ko.tasks.runEarly();
                  self.isNetworkTypesLoaded(true);
                }
              });
            }
          };
        }
      };

    if (rootParams.rootModel.previousState && rootParams.rootModel.previousState.mode && rootParams.rootModel.previousState.mode === "review") {
      ko.utils.extend(self, rootParams.rootModel);
    }

    if (!rootParams.rootModel.previousState) {
      AccountActivity.getMaintenances().then(function(data) {
        const configurationDetails = {};

        for (let k = 0; k < data.configurationDetails.length; k++) {
          configurationDetails[data.configurationDetails[k].propertyId] = data.configurationDetails[k].propertyValue;
        }

        suggestNetwork = suggestNetwork(configurationDetails.NETWORK_SUGGESTION_ENABLED === "Y");
        self.imageUploadFlag(configurationDetails.RETAIL_PAYEE_PHOTO_UPLOAD_ENABLED === "Y" ? 1 : 0);
      });
    }

    /**
     * This function will be used to handle the changes in network type.
     *
     * @memberOf account-aggregation-payment
     * @function callSuggestNetwork
     * @param {Object} newValue - To be passed for specific operation.
     * @returns {void}
     */
    function callSuggestNetwork(newValue) {
      if (newValue) {
        suggestNetwork();
      }
    }

    const transferAmountSubscribe = self.amount.subscribe(callSuggestNetwork),
      bankDetailsSubscribe = self.ifsc.subscribe(callSuggestNetwork),
      transferCurrencySubscribe = self.currency.subscribe(callSuggestNetwork);

    /**
     * This function will be used to dispose the subscribes.
     *
     * @memberOf account-aggregation-payment
     * @function dispose
     * @returns {void}
     */
    self.dispose = function() {
      transferAmountSubscribe.dispose();
      bankDetailsSubscribe.dispose();
      transferCurrencySubscribe.dispose();
    };

    if (!rootParams.rootModel.previousState) {
      AccountActivity.listAccessPoint().done(function(data) {
        self.channelList(data.accessPointListDTO);

        for (let i = 0; i < data.accessPointListDTO.length; i++) {
          if (data.accessPointListDTO[i].currentLoggedIn === true) {
            self.selectedChannelIndex(i);
          }
        }

        self.selectedChannel(true);
        self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
        self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
        self.loadAccessPointList(true);
      });
    }

    /**
     * This function will be used to fetch channel list.
     *
     * @memberOf account-aggregation-payment
     * @function channelTypeChangeHandler
     * @returns {void}
     */
    self.channelTypeChangeHandler = function() {
      if (self.selectedChannelIndex() !== null && self.selectedChannelIndex() !== "") {
        self.selectedChannel(false);
        ko.tasks.runEarly();
        self.selectedChannelType(self.channelList()[self.selectedChannelIndex()].id);
        self.selectedChannelTypeName(self.channelList()[self.selectedChannelIndex()].description);
        self.selectedChannel(true);
      }
    };

    /**
     * This function will be used to fetch the purpose list.
     *
     * @memberOf account-aggregation-payment
     * @function getPurposeList
     * @returns {void}
     */
    self.getPurposeList = function() {
      AccountActivity.getTransferPurpose().done(function(data) {
        self.isPurposeListLoaded(false);

        if (data.linkageList.length > 0) {
          if (data.linkageList && data.linkageList[0].purposeList && data.linkageList[0].purposeList.length > 0) {
            self.transactionPurposeList.removeAll();

            for (let i = 0; i < data.linkageList[0].purposeList.length; i++) {
              self.transactionPurposeList.push({
                text: data.linkageList[0].purposeList[i].description,
                value: data.linkageList[0].purposeList[i].code
              });
            }
          }
        }

        ko.tasks.runEarly();
        self.isPurposeListLoaded(true);
      });
    };

    /**
     * This function will be used to handle the changes in purpose.
     *
     * @memberOf account-aggregation-payment
     * @function purposeChanged
     * @param {Object} event - To be passed for specific operation.
     * @returns {void}
     */
    self.purposeChanged = function(event) {
      if (event.detail.value) {
        self.otherPurpose(event.detail.value === "OTH_Other");

        if (event.detail.value !== "OTH_Other") {
          self.otherPurposeValue("");
        }
      }
    };

    /**
     * This function will be used to popup channel window.
     *
     * @memberOf account-aggregation-payment
     * @function channelPopup
     * @returns {void}
     */
    self.channelPopup = function() {
      const popup1 = document.querySelector("#channel-popup");

      if (popup1.isOpen()) {
        popup1.close();
      } else {
        popup1.open("#channel-disclaimer");
      }
    };

    /**
     * This function will be used to lookup the ifsc codes.
     *
     * @memberOf account-aggregation-payment
     * @function openLookup
     * @returns {void}
     */
    self.openLookup = function() {
      self.refreshLookup(false);
      $("#menuButtonDialog").trigger("openModal");
      self.refreshLookup(true);
    };

    rootParams.baseModel.registerElement("bank-look-up");

    self.validateCode = [{
      validate: function(value) {
        if (value.length > 11 || !/^[a-zA-Z0-9]+$/.test(value)) {
          throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.resource.invalidError));
        }
      }
    }];

    /**
     * This function will be used to verify the ifsc code.
     *
     * @memberOf account-aggregation-payment
     * @function verifyCode
     * @returns {void}
     */
    self.verifyCode = function() {
      const tracker = document.getElementById("verify-code-tracker");

      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("ifscValidate"))) {
        return;
      }

      if (tracker.valid === "valid") {
        AccountActivity.getBankDetailsDCC(self.ifsc()).done(function(data) {
          self.additionalBankDetails(data);
          self.loadReview(true);
          ko.tasks.runEarly();
        });
      }
    };

    /**
     * This function will be used to reset the ifsc code.
     *
     * @memberOf account-aggregation-payment
     * @function resetCode
     * @returns {void}
     */
    self.resetCode = function() {
      self.additionalBankDetails(null);
      self.ifsc(null);
    };

    self.viewLimitsModalId = Date.now().toString();
    rootParams.baseModel.registerComponent("available-limits", "financial-limits");

    /**
     * This function will be used to show the available limits.
     *
     * @memberOf account-aggregation-payment
     * @function viewLimits
     * @returns {void}
     */
    self.viewLimits = function() {
      self.isViewlimits(false);
      ko.tasks.runEarly();
      $("#" + self.viewLimitsModalId).trigger("openModal");
      self.isViewlimits(true);
    };

    /**
     * This function will be used to hide model window of limits.
     *
     * @memberOf account-aggregation-payment
     * @function done
     * @returns {void}
     */
    self.done = function() {
      self.selectedChannelIndex("");
      self.selectedChannel(false);
      ko.tasks.runEarly();
      $("#" + self.viewLimitsModalId).hide();
    };

    /**
     * Fetch network type fot payment.
     *
     * @memberOf account-aggregation-payment
     * @function selectHeaderAccount
     * @returns {void}
     */
    function networkTypesForRegions() {
      $.when(AccountActivity.getNetworkTypes()).then(function(networkTypesResponse) {
        if (Object.keys(self.domesticNetworkTypesObj).length === 0 && self.currentAccountType() === "DOMESTIC") {
          for (let i = 0; i < networkTypesResponse.enumRepresentations[0].data.length; i++) {
            self.domesticNetworkTypesObj[networkTypesResponse.enumRepresentations[0].data[i].code] = {
              text: networkTypesResponse.enumRepresentations[0].data[i].description,
              disabled: ko.observable(false),
              suggested: ko.observable(false)
            };

            self.networkTypesMap[networkTypesResponse.enumRepresentations[0].data[i].code] = networkTypesResponse.enumRepresentations[0].data[i].description;
          }
        }

        self.network(networkTypesResponse.enumRepresentations[0].data[0].code);
        ko.tasks.runEarly();
        self.isNetworkTypesLoaded(true);
      });
    }

    /**
     * This function will be used to handle the changes in network type.
     *
     * @memberOf account-aggregation-payment
     * @function networkTypeChanged
     * @param {Object} event - To be passed for specific operation.
     * @returns {void}
     */
    self.networkTypeChanged = function(event) {
      if (event.detail.value) {
        self.network(event.detail.value);
        nonSuggestedNetworkSelected = true;
      }
    };

    /**
     * This function will be used to handle the changes in account number.
     *
     * @memberOf account-aggregation-payment
     * @function toAccountChangedHandler
     * @param {Object} event - To be passed for specific operation.
     * @returns {void}
     */
    self.toAccountChangedHandler = function(event) {
      self.loadIfsc(false);

      if (event.detail.value) {
        self.toAccountValue(event.detail.value);
        ko.tasks.runEarly();
      }

      if (event.detail.value.displayName) {
        self.externalPayload.externalAccountDetails.accountName = event.detail.value.displayName;
      }

      if (event.detail.value.bankName !== self.myBankName()) {
        self.customCurrencyURL("payments/currencies?type=DOMESTICFT");
        self.loadIfsc(true);
        self.parentTaskCode("AA_F_CAC");
        self.transferTo("EXTERNAL");
        self.refreshLookup(true);

        self.getPurposeList();
        networkTypesForRegions();
      } else {
        self.transferTo("SELF");
        self.parentTaskCode("PC_F_SELF");
        self.customCurrencyURL("payments/currencies?type=SELFFT&&currency=" + self.toAccountValue().currencyCode);
      }
    };

    /**
     * This function will be used to handle the changes in account number.
     *
     * @memberOf account-aggregation-payment
     * @function fromAccountChangedHandler
     * @param {Object} event - To be passed for specific operation.
     * @returns {void}
     */
    self.fromAccountChangedHandler = function(event) {
      if (event.detail.value) {
        self.fromAccountValue(event.detail.value);
      }
    };

    /**
     * This function will be used to handle the changes in account type.
     *
     * @memberOf account-aggregation-payment
     * @function orderAccounts
     * @param {Object} data - To be passed for specific operation.
     * @returns {void}
     */
    function orderAccounts(data) {
      self.accountsMatchedLoaded(false);

      ko.utils.arrayForEach(data, function(item) {
        if (item.type === "CSA") {
          item.bankName = item.bankName || self.resource.myBankName;

          if (!self.accountsMatched()[item.bankName]) {
            self.accountsMatched()[item.bankName] = [];
          }

          self.accountsMatched()[item.bankName].push(item);
        }
      });

      ko.tasks.runEarly();
      self.accountsMatchedLoaded(true);
    }

    if (!rootParams.rootModel.previousState) {
      Promise.all([AccountActivity.fetchAccesstoken(), AccountActivity.fetchAccounts()]).then(function(response) {
        const tokens = response[0].accessTokenDTOs;

        if (tokens) {
          for (let i = 0; i < tokens.length; i++) {
            AccountActivity.fetchexternalbankAccounts(tokens[i].bankCode).then(function(data) {
              orderAccounts(data.externalBankAccountDTOs);
              self.accountsLoaded(true);
            });
          }
        }

        orderAccounts(response[1].accounts);
      });
    }

    /**
     * This function will be used to parse the currency for amount input.
     *
     * @memberOf account-aggregation-payment
     * @function currencyParser
     * @param {Object} data - To be passed for specific operation.
     * @returns {void}
     */
    self.currencyParser = function(data) {
      const output = {};

      output.currencies = [];

      if (data) {
        if (data.currencyList && data.currencyList !== null) {
          for (let i = 0; i < data.currencyList.length; i++) {
            output.currencies.push({
              code: data.currencyList[i].code,
              description: data.currencyList[i].code
            });
          }
        }
      }

      return output;
    };

    rootParams.baseModel.registerComponent("review-account-aggregation-payment", "account-aggregation");

    /**
     * This function will be used to close the error model window.
     *
     * @memberOf account-aggregation-payment
     * @function accountSelectionOk
     * @returns {void}
     */
    self.accountSelectionOk = function() {
      $("#accountSelectionWarning").hide();
    };

    /**
     * This function will be used to transfer the amount.
     *
     * @memberOf account-aggregation-payment
     * @function transfer
     * @returns {void}
     */
    self.transfer = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("TaskValidater")) ||
        !rootParams.baseModel.showComponentValidationErrors(document.getElementById("amountInputTracker")) ||
        !rootParams.baseModel.showComponentValidationErrors(document.getElementById("ifscValidate"))) {
        return;
      }

      if (self.toAccountValue().id.value === self.fromAccountValue()) {
        $("#accountSelectionWarning").trigger("openModal");

        return;
      }

      const accountTypeValueMap = {
        CSA: "10"
      };

      if (self.transferTo() === "EXTERNAL") {
        self.externalPayload.sourceAccountDetails.network = self.network();
        self.externalPayload.sourceAccountDetails.debitAccountId.value = self.fromAccountValue();
        self.externalPayload.sourceAccountDetails.amount.currency = self.currency();
        self.externalPayload.sourceAccountDetails.amount.amount = self.amount();
        self.externalPayload.sourceAccountDetails.purpose = self.purpose().value;
        self.externalPayload.sourceAccountDetails.purposeText = self.otherPurposeValue();
        self.externalPayload.sourceAccountDetails.remarks = self.note();
        self.externalPayload.paymentType = "INDIADOMESTICFT";

        self.externalPayload.externalAccountDetails.accountNumber = self.toAccountValue().id.value;
        self.externalPayload.externalAccountDetails.accountName = self.toAccountValue().displayName || "Account Number-" + self.toAccountValue().id.displayValue;
        self.externalPayload.externalAccountDetails.transferMode = "ACC";
        self.externalPayload.externalAccountDetails.accountType = accountTypeValueMap[self.toAccountValue().type];
        self.externalPayload.externalAccountDetails.bankDetails.code = self.ifsc();
        self.externalPayload.externalAccountDetails.name = self.toAccountValue().displayName || "Account Number-" + self.toAccountValue().id.displayValue;
        self.externalPayload.externalAccountDetails.nickName = self.toAccountValue().displayName || "Account Number-" + self.toAccountValue().id.displayValue;

        self.externalPayload.externalAccount.value = self.toAccountValue().id.value;

        if (!self.additionalBankDetails() && self.ifsc()) {
          self.verifyCode();
        }

        self.loadReview(true);

      } else if (self.transferTo() === "SELF") {
        self.selfPayload.amount.amount = self.amount();
        self.selfPayload.amount.currency = self.currency();
        self.selfPayload.creditAccountId.displayValue = "SELF";
        self.selfPayload.creditAccountId.value = self.toAccountValue().id.value;
        self.selfPayload.debitAccountId.value = self.fromAccountValue();
        self.selfPayload.remarks = self.note();

        AccountActivity.makePayment(ko.toJSON(self.selfPayload), self.transferTo()).done(function(data, status) {
          self.paymentId = data.paymentId;
          self.loadReview(true);
        });
      }

      rootParams.dashboard.loadComponent("review-account-aggregation-payment", {
        mode: "review"
      }, self);

    };

    /**
     * This function will be used to confirm the transfer amount.
     *
     * @memberOf account-aggregation-payment
     * @function confirmTransfer
     * @returns {void}
     */
    self.confirmTransfer = function() {
      let successMessage, statusMessages, confirmScreenDetailsArray;

      if (self.transferTo() === "EXTERNAL") {
        confirmScreenDetailsArray = [
          [{
              label: self.resource.toAccount,
              value: self.toAccountValue().id.displayValue
            },
            {
              label: self.resource.amount,
              value: rootParams.baseModel.formatCurrency(self.amount(), self.currency())
            }
          ],
          [{
              label: self.resource.bankdetails,
              value: [
                self.additionalBankDetails().code,
                self.additionalBankDetails().name,
                self.additionalBankDetails().branchAddress.city,
                self.additionalBankDetails().branchAddress.country
              ]
            },
            {
              label: self.resource.payVia,
              value: self.network()
            }
          ],
          [{
              label: self.resource.fromAccount,
              value: self.additionalDetailsFrom().account.id.displayValue
            },
            {
              label: self.resource.transferOn,
              value: self.currentDate.valueDate,
              isDate: true
            }
          ]
        ];

        AccountActivity.makePayment(ko.toJSON(self.externalPayload), self.transferTo()).done(function(data, status, jqXhr) {
          successMessage = self.resource.successMessage;
          statusMessages = self.resource.completed;

          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            hostReferenceNumber: data.accountAggregationPaymentDTO.externalReferenceId,
            transactionName: self.resource.header.transferMoney,
            confirmScreenExtensions: {
              successMessage: successMessage,
              statusMessages: statusMessages,
              isSet: true,
              eReceiptRequired: true,
              taskCode: self.parentTaskCode(),
              confirmScreenDetails: confirmScreenDetailsArray,
              template: "confirm-screen/account-aggregation-payment"
            }
          }, self);
        });
      } else if (self.transferTo() === "SELF") {
        confirmScreenDetailsArray = [
          [{
              label: self.resource.toAccount,
              value: self.toAccountValue().id.displayValue
            },
            {
              label: self.resource.amount,
              value: rootParams.baseModel.formatCurrency(self.amount(), self.currency())
            }
          ],
          [{
            label: self.resource.accountType,
            value: self.resource[self.toAccountValue().type]
          }],
          [{
              label: self.resource.fromAccount,
              value: self.additionalDetailsFrom().account.id.displayValue
            },
            {
              label: self.resource.transferOn,
              value: self.currentDate.valueDate,
              isDate: true
            }
          ]
        ];

        AccountActivity.verifyPayment(self.paymentId).done(function(data, status, jqXhr) {
          successMessage = self.resource.successMessage;
          statusMessages = self.resource.completed;

          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            hostReferenceNumber: data.externalReferenceId,
            transactionName: self.resource.header.transferMoney,
            confirmScreenExtensions: {
              successMessage: successMessage,
              statusMessages: statusMessages,
              isSet: true,
              eReceiptRequired: true,
              taskCode: self.parentTaskCode(),
              confirmScreenDetails: confirmScreenDetailsArray,
              template: "confirm-screen/account-aggregation-payment"
            }
          }, self);
        });
      }
    };

    /**
     * This function will be used to confirm the transfer amount.
     *
     * @memberOf account-aggregation-payment
     * @function morePaymentOptions
     * @returns {void}
     */
    self.morePaymentOptions = function() {
      rootParams.dashboard.loadComponent("account-aggregation-payment", {});
    };
  };
});