/**
 * Recurring Deposit Redemption.
 *
 * @module recurring-deposit
 * @requires {ojcore} oj
 * @requires {knockout} ko
 * @requires {jquery} $
 * @requires {object} ResourceBundle
 */
define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/rd-redeem",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup",
  "ojs/ojbutton"
], function(oj, ko, $, redeemModel, ResourceBundle) {
  "use strict";

  /** Reccuring Deposit Redemption.
   *
   *IT allows user to redeem recurring deposit.
   *
   * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
   * @return {Function} Function.
   * @return {Object} GetNewKoModel.
   *
   */
  return function(rootParams) {
    const self = this,
      getNewKoModel = function() {
        const KoModel = ko.mapping.fromJS(redeemModel.getNewModel());

        return KoModel;
      };

    self.redeemRDModel = getNewKoModel().redeemRDModel;
    self.internalAccount =ko.observable();
    ko.utils.extend(self, rootParams.rootModel.previousState ? ko.mapping.fromJS(rootParams.rootModel.previousState) : rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.baseModel.registerElement(["page-section", "row", "account-input", "bank-look-up","internal-account-input"]);
    rootParams.dashboard.headerName(self.resource.header.redemption);
    self.chargesLoaded = ko.observable();
    self.additionalDetails = ko.observable();
    self.payOutOptionsLoaded = ko.observable(false);
    self.payOutOptionList = ko.observableArray();
    self.additionalDetailsTransfer = ko.observable();
    self.branchDetailsLoaded = ko.observable(false);
    self.additionalBankDetails = ko.observable();
    self.validationTracker = ko.observable();
    self.holdingPattern = ko.observable();
    self.groupValid = ko.observable();
    self.codeValid = ko.observable();
    rootParams.baseModel.registerComponent("review-rd-redeem", "recurring-deposit");

    if (self.params && self.params.id) {
      self.redeemRDModel.accountId.value(self.params.id.value);
      self.redeemRDModel.module(self.params.module);
      self.chargesLoaded(false);

      redeemModel.redeemDetails(self.redeemRDModel.accountId.value(), ko.mapping.toJSON(self.redeemRDModel)).then(function(data) {
       delete data.redemptionDetailDTO.payoutInstructions;
        $.extend(true, self.redeemRDModel, ko.mapping.fromJS(data).redemptionDetailDTO);
        self.chargesLoaded(true);
      });
    }

    if (rootParams.rootModel.previousState) {
      self.chargesLoaded(true);
    }

    /** The rest will be called once the component is loaded and html will be loaded only after
     * receiving the rest response.
     * Rest response can be either successful or rejected
     *
     * @instance {object} redeemModel
     * @returns {object} data  It represent list of all payout options.
     */
    redeemModel.getPayOutOptionList().then(function(response) {
      if (response) {
        self.payOutOptionList(response.enumRepresentations[0].data);
        self.payOutOptionsLoaded(true);
      }
    });

    /**
     * This function will open bank lookup modal which allows user to get complete bank details based on clearing code and some bank details.
     *
     * @memberOf rd-redeem
     * @function bankLookupHandler
     * @returns {void}
     */
    self.bankLookupHandler = function() {
      $("#menuButtonDialog").trigger("openModal");
    };

         let cnfaccountValue,
            accountValue;

        self.confirmValue = ko.observable();
        self.accountNumber = ko.observable("");

        /**
         * This function is used validate account Number.
         *
         * @memberOf rd-redeem
         * @function AccountNoValidator_fn
         * @returns {void}
         */
             function AccountNoValidator_fn(value) {
            accountValue = value;

            if (value) {
                if (cnfaccountValue) {
                    if (value === cnfaccountValue) {
                        document.getElementById("confirmAccNumber").validate();
                    } else { throw new oj.ValidatorError("ERROR", self.resource.payoutDetails.accountNoValidation); }
                } else if (self.confirmValue()) {
                    if (value !== self.confirmValue()) { throw new oj.ValidatorError("ERROR", self.resource.payoutDetails.accountNoValidation); }
                }
            }
        }
         /**
         * This function is used validate confirm account Number.
         *
         * @memberOf rd-redeem
         * @function cnfAccountNoValidator_fn
         * @returns {void}
         */

        function cnfAccountNoValidator_fn(value) {
            if ((self.accountNumber() && self.accountNumber() !== "") || value) {
                cnfaccountValue = value;

                if (accountValue !== cnfaccountValue) {
                    if (self.accountNumber() !== value) {
                        self.accountNumber("");
                        throw new oj.ValidatorError("ERROR", self.resource.payoutDetails.accountNoValidation);
                    }
                } else if (accountValue === cnfaccountValue) {
                    self.confirmValue(cnfaccountValue);
                    cnfaccountValue = "";
                    AccountNoValidator_fn(accountValue);
                    document.getElementById("accNumber").validate();
                }
            } else { throw new oj.ValidatorError("ERROR",self.resource.payoutDetails.validationMessage); }
        }

        self.accountNoValidator = [rootParams.baseModel.getValidator("ACCOUNT"), {
            validate: AccountNoValidator_fn
        }];

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

    /**
     * This function will be triggered when payout option is selected by user.
     *
     * @memberOf rd-redeem
     * @function payOutOptionChanged
     * @param {Object} event  - An object containing the current event of field.
     * @returns {void}
     */
    self.payOutOptionChanged = function(event) {
      self.redeemRDModel.payoutInstructions()[0].type(event.detail.value);

      if (self.redeemRDModel.payoutInstructions()[0].type() === "E")
        {self.redeemRDModel.payoutInstructions()[0].networkType("NEFT");}
      else
        {self.redeemRDModel.payoutInstructions()[0].networkType(null);}

      self.branchDetailsLoaded(false);
      self.redeemRDModel.payoutInstructions()[0].accountId.value(null);
      self.redeemRDModel.payoutInstructions()[0].accountId.displayValue(null);
      self.redeemRDModel.payoutInstructions()[0].account(null);
      self.internalAccount(undefined);
      self.redeemRDModel.payoutInstructions()[0].branchId(null);
      self.redeemRDModel.payoutInstructions()[0].beneficiaryName(null);
      self.redeemRDModel.payoutInstructions()[0].bankName(null);
      self.redeemRDModel.payoutInstructions()[0].address.line1(null);
      self.redeemRDModel.payoutInstructions()[0].address.line2(null);
      self.redeemRDModel.payoutInstructions()[0].address.city(null);
      self.redeemRDModel.payoutInstructions()[0].address.country(null);
      self.redeemRDModel.payoutInstructions()[0].clearingCode(null);
    };

    /**
     * This function will be triggered when account is selected by user.
     *
     * @memberOf rd-redeem
     * @function additionalDetailsSubscribe
     * param1 {object} additionalDetails An object containing the details of current account
     * @returns {void}
     */
    const additionalDetailsSubscribe = self.additionalDetails.subscribe(function(value) {
        self.redeemRDModel.accountId.displayValue(value.account.id.displayValue);
        self.redeemRDModel.redemptionAmount.currency(value.account.currencyCode);
        self.redeemRDModel.module(value.account.module);
        self.holdingPattern(value.account.holdingPattern);
      }),
      /**
       * This function will be triggered when account for Payout is selected by user.
       *
       * @memberOf rd-redeem
       * @function subscriptionAdditionalDetailsTransfer
       * param1 {object} additionalDetailsTransfer An object containing the details of current account
       * @returns {void}
       */
      subscriptionAdditionalDetailsTransfer = self.additionalDetailsTransfer.subscribe(function(newValue) {
        if (newValue) {
          self.redeemRDModel.payoutInstructions()[0].accountId.displayValue(self.additionalDetailsTransfer().account.id.displayValue);
          self.redeemRDModel.payoutInstructions()[0].beneficiaryName(self.additionalDetailsTransfer().account.partyName);
          self.redeemRDModel.payoutInstructions()[0].branchId(self.additionalDetailsTransfer().account.branchCode);
          self.redeemRDModel.payoutInstructions()[0].bankName(self.additionalDetailsTransfer().address.branchName);
          self.redeemRDModel.payoutInstructions()[0].address.line1(self.additionalDetailsTransfer().address.branchAddress.postalAddress.line1);
          self.redeemRDModel.payoutInstructions()[0].address.line2(self.additionalDetailsTransfer().address.branchAddress.postalAddress.line2);
          self.redeemRDModel.payoutInstructions()[0].address.city(self.additionalDetailsTransfer().address.branchAddress.postalAddress.city);
          self.redeemRDModel.payoutInstructions()[0].address.country(self.additionalDetailsTransfer().address.branchAddress.postalAddress.country);
        }
      });

    /**
     * This function will be triggered to fetch bank details based on clearing code and network type.
     *
     * @memberOf rd-redeem
     * @function  bankDetails
     * @returns {void}
     */
    self.bankDetails = function() {
      self.branchDetailsLoaded(false);

      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("codeTracker")))
        {return;}

      redeemModel.fetchBranch(self.redeemRDModel.payoutInstructions()[0].networkType(), self.redeemRDModel.payoutInstructions()[0].clearingCode()).then(function(data) {
        self.redeemRDModel.payoutInstructions()[0].address.line1(data.branchAddress.line1);
        self.redeemRDModel.payoutInstructions()[0].address.line2(data.branchAddress.line2);
        self.redeemRDModel.payoutInstructions()[0].address.city(data.branchAddress.city);
        self.redeemRDModel.payoutInstructions()[0].address.country(data.branchAddress.country);
        self.redeemRDModel.payoutInstructions()[0].bankName(data.name);
        self.branchDetailsLoaded(true);
      });
    };

    /**
     * This function will validate all the details entered by user  for redemption if all credentials are correct then
     *user is prompted to next screen for further processing.
     *
     * @memberOf rd-redeem
     * @function  redeemRD
     * @returns {void}
     */
    self.redeemRD = function() {
      const tracker = document.getElementById("tracker");

      if (tracker.valid !== "valid") {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");

        return;
      }

      if (self.redeemRDModel.payoutInstructions()[0].type() === "I")
         {
        self.redeemRDModel.payoutInstructions()[0].account(self.internalAccount());
             }

      self.redeemRDModel.redemptionAmount.amount(self.redeemRDModel.netCreditAmt.amount());
      self.redeemRDModel.redemptionAmount.currency(self.redeemRDModel.netCreditAmt.currency());

      redeemModel.redeemDetails(self.redeemRDModel.accountId.value(), ko.mapping.toJSON(self.redeemRDModel)).then(function(data) {
        delete data.redemptionDetailDTO.payoutInstructions;
        $.extend(true, self.redeemRDModel, ko.mapping.fromJS(data).redemptionDetailDTO);

        rootParams.dashboard.loadComponent("review-rd-redeem", ko.mapping.toJS({
                  redeemRDModel: self.redeemRDModel,
                  internalAccount:self.internalAccount
                }));
      });
    };

    /**
     * This function will be triggered to cleanup the memory allocated to subscribed functions.
     *
     * @memberOf rd-redeem
     * @function dispose
     * @returns {void}
     */
    self.dispose = function() {
      additionalDetailsSubscribe.dispose();
      subscriptionAdditionalDetailsTransfer.dispose();
    };
  };
});