 /**
  * New Reccuring Deposit Booking.
  *
  * @module recurring-deposit
  * @requires {ojcore} oj
  * @requires {knockout} ko
  * @requires {jquery} $
  * @requires {object} recurringDepositModel
  * @requires {object} ResourceBundle
  */
 define([
  "ojs/ojcore",
   "knockout",
   "jquery",
   "./model",
   "ojL10n!resources/nls/create-rd",
   "ojs/ojknockout-validation",
   "ojs/ojcheckboxset",
   "ojs/ojradioset",
   "ojs/ojbutton",
   "ojs/ojvalidationgroup"
 ], function(oj,ko, $, recurringDepositModel, ResourceBundle) {
   "use strict";

   /** New Reccuring Deposit Booking.
    *
    *IT allows user to book Recurring Deposit.
    *IT allows to select the product for booking recurring deposit.
    *IN case of joint accounts,it allows user to select the holding pattern as single for creating a new RD and it is booked by default on joint name if single holding pattern is not selected by the user.
    *IT allows user to to select the instructions (Debit account, amount ,tenure , credit account ) for creating new recurring deposits.
    *
    * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
    * @return {Function} Function.
    * @return {Object} GetNewKoModel.
    *
    */
   return function(rootParams) {
     const self = this,
       getNewKoModel = function() {
         const KoModel = ko.mapping.fromJS(recurringDepositModel.getNewModel());

         return KoModel;
       };

     self.createRDModel = getNewKoModel().createRDModel;
     self.holdingPattern = ko.observableArray();
     self.loadedFromReview = ko.observable(false);
     self.depositMessage = rootParams.rootModel.params && rootParams.rootModel.params.depositMessage ? ko.observable(rootParams.rootModel.params.depositMessage) : ko.observable();
     self.url = rootParams.rootModel.params && rootParams.rootModel.params.url ? ko.observable(rootParams.rootModel.params.url) : ko.observable();
     self.tenureMessage = ko.observable();
     self.isNomineeRequired = ko.observable(false);
     self.manageNominee = ko.observable();
     self.addNomineeModel = getNewKoModel().addNomineeModel;
     self.primaryAccHolder = ko.observable();
     self.parties = ko.observableArray();
     self.isMinor = ko.observable(false);
     self.isProductSelected = ko.observable(false);
     self.internalAccount =ko.observable();
     ko.utils.extend(self, rootParams.rootModel.previousState ? ko.mapping.fromJS(rootParams.rootModel.previousState) : rootParams.rootModel);

     if (self.params && self.params.createRDModel) {
       self.createRDModel = ko.mapping.fromJS(self.params.createRDModel);
       self.isProductSelected(true);
     }

     self.viewInterest = ko.observable(false);
     self.isMaturityCalculated = ko.observable(false);
     self.payOutOptionsLoaded = ko.observable(false);
     self.productsLoaded = ko.observable(false);

     const isSimulated = true;

     self.payOutOptionList = ko.observableArray();
     self.minTenure = ko.observable();
     self.maxTenure = ko.observable();

     let productCcyDetails = [];

     self.additionalBankDetails = ko.observable();
     self.component = ko.observable();
     self.branchDetailsLoaded = ko.observable(false);
     self.resource = ResourceBundle;
     self.productList = ko.observableArray();
     self.additionalDetailsAccount = ko.observable();
     self.additionalDetailsTransfer = ko.observable();
     self.tenureYears = ko.observableArray();
     self.ischeckBoxVisible = ko.observable(true);
     self.tenureMonths = ko.observableArray();
     self.isTenureLoaded = ko.observable(false);
     self.isTenureListLoaded = ko.observable(true);
     self.groupValid = ko.observable();
     self.codeValid = ko.observable();
     self.maturityValid = ko.observable();
     self.validationTracker = ko.observable();
     rootParams.baseModel.registerComponent("view-rd-interest-rate", "recurring-deposit");
     rootParams.baseModel.registerComponent("review-create-rd", "recurring-deposit");
     rootParams.baseModel.registerElement(["amount-input","internal-account-input", "page-section", "row", "confirm-screen", "confirm-screen", "account-input", "modal-window", "bank-look-up"]);

     /**
      * This function will be called to fetch all product details based on product id.
      *
      * @memberOf create-rd
      * @function fetchSelectedProduct
      * @param {string} productId  - A string to represent id of the product.
      * @returns {Object} Product An object containing product details for given product id.
      */
     function fetchSelectedProduct(productId) {
       return ko.utils.arrayFirst(self.productList(), function(element) {
         return element.productId === productId;
       });
     }

     self.loadProfilePage = function () {
      rootParams.baseModel.registerComponent("side-menu", "security");
      rootParams.dashboard.loadComponent("side-menu", {});
    };

     /**
      * This function is used set tenure Message for Recurring Deposit.
      *
      * @memberOf create-rd
      * @function formatTenureMessage
      * @param {number} tenureYear  - A number represents year.
      * @param {number} tenureMonth  - A number represents month.
      * @returns {void}
      */
     function formatTenureMessage(tenureYear, tenureMonth) {
       let year, month;

       if (tenureYear <= 1)
         {year = rootParams.baseModel.format(self.resource.depositDetail.tenure.singular.year, {
           n: tenureYear
         });}
       else
         {year = rootParams.baseModel.format(self.resource.depositDetail.tenure.plural.year, {
           n: tenureYear
         });}

       if (tenureMonth <= 1)
         {month = rootParams.baseModel.format(self.resource.depositDetail.tenure.singular.month, {
           n: tenureMonth
         });}
       else
         {month = rootParams.baseModel.format(self.resource.depositDetail.tenure.plural.month, {
           n: tenureMonth
         });}

       if (tenureMonth && tenureYear)
         {return rootParams.baseModel.format(self.resource.depositDetail.tenureDetail, {
           years: year,
           months: month
         });}
       else if (tenureMonth)
         {return month;}
       else if (tenureYear)
         {return year;}
     }

     /**
      * This function is used to calculate maturity amount and date.
      *
      * @memberOf create-rd
      * @function calculateMaturity
      * @returns {void}
      */
     self.calculateMaturity = function() {
       self.isMaturityCalculated(false);

      const ignoreList = ["maturityAmount","payoutInstructions"];

        if (rootParams.baseModel.showComponentValidationErrors(document.getElementById("maturityTracker"))) {
         recurringDepositModel.calculateMaturityAmount(ko.mapping.toJSON(self.createRDModel, {
           ignore: ignoreList
         })).then(function(data) {
           self.isMaturityCalculated(false);
           self.createRDModel.interestRate(data.termDepositDetails.interestRate);
           self.createRDModel.maturityAmount.amount(data.termDepositDetails.maturityAmount.amount);
           self.createRDModel.maturityAmount.currency(data.termDepositDetails.maturityAmount.currency);
           self.isMaturityCalculated(true);
         });
       }
     };

     /** This function will empty fields of the form related to maturity such as interest rate,date and amount on click of reset button.
      *
      * @memberOf create-rd
      * @function resetMaturity
      * @returns {void}
      */
     self.resetMaturity = function() {
       self.createRDModel.interestRate(null);
       self.createRDModel.maturityAmount.currency(null);
       self.createRDModel.maturityAmount.amount(null);
       self.createRDModel.maturityDate(null);
       self.isMaturityCalculated(false);
     };

     /**
      * This function is used to set tenure limit and module for RD.
      *
      * @memberOf create-rd
      * @function fetchSelectedProduct
      * @param {Object} product  - An object represent the product.
      * @returns {void}
      */
     function setTenure(product) {
       self.isTenureListLoaded(false);

       const minTenure = product.tenureParameter.minTenure,
         maxTenure = product.tenureParameter.maxTenure,
         minTenureYear = minTenure.years + Math.round(minTenure.months / 12),
         minTenureMonth = minTenure.months % 12,
         maxTenureYear = maxTenure.years + Math.round(maxTenure.months / 12),
         maxTenureMonth = maxTenure.months % 12;

       self.tenureMessage(rootParams.baseModel.format(self.resource.depositDetail.productTenureMessage, {
         minTenure: formatTenureMessage(minTenureYear, minTenureMonth),
         maxTenure: formatTenureMessage(maxTenureYear, maxTenureMonth)
       }));

       self.createRDModel.module(product.module);
       self.createRDModel.productDTO.depositProductModule(product.module);
       self.tenureMonths.removeAll();
       self.tenureYears.removeAll();

       for (let m = 0; m <= 1; m++) {
         self.tenureMonths.push({
           month: m.toString(),
           value: rootParams.baseModel.format(self.resource.depositDetail.tenure.singular.month, {
             n: m.toString()
           })
         });
       }

       for (let l = 2; l <= 11; l++) {
         self.tenureMonths.push({
           month: l.toString(),
           value: rootParams.baseModel.format(self.resource.depositDetail.tenure.plural.month, {
             n: l.toString()
           })
         });
       }

       for (let k = 0; k <= maxTenureYear; k++) {
         if (maxTenureYear >= k && k <= 1) {
           self.tenureYears.push({
             year: k.toString(),
             value: rootParams.baseModel.format(self.resource.depositDetail.tenure.singular.year, {
               n: k.toString()
             })
           });
         } else {
           self.tenureYears.push({
             year: k.toString(),
             value: rootParams.baseModel.format(self.resource.depositDetail.tenure.plural.year, {
               n: k.toString()
             })
           });
         }
       }

       ko.tasks.runEarly();
       self.isTenureListLoaded(true);
       self.isTenureLoaded(true);
     }

     /** The rest will be called once the component is loaded and html will be loaded only after
      * receiving the rest response.
      * Rest response can be either successful or rejected
      *
      * @instance {object} recurringDepositModel
      * @returns {object} data  It represent list of RD products.
      */
     recurringDepositModel.getProductList().then(function(data) {
       self.productList(data.tdProductDTOList);
       self.productsLoaded(true);

       if (self.createRDModel.productDTO.productId()) {
         const productObj = fetchSelectedProduct(self.createRDModel.productDTO.productId());

         self.createRDModel.productDTO.name(productObj.name);
         self.isProductSelected(true);
         setTenure(productObj);
       }
     });

     recurringDepositModel.getPayOutOptionList().then(function(response) {
       if (response) {
         self.payOutOptionList(response.enumRepresentations[0].data);
         self.payOutOptionsLoaded(true);
       }
     });

     rootParams.dashboard.headerName(self.resource.header.newRecurringDeposit);

     /**
      * This function will open bank lookup modal which allows user to get complete bank details based on clearing code and some bank details.
      *
      * @memberOf create-rd
      * @function bankLookupHandler
      * @returns {void}
      */
     self.bankLookupHandler = function() {
       $("#menuButtonDialog").trigger("openModal");
     };

     /**
      * This function will be triggered when payout option is selected by user.
      *
      * @memberOf create-rd
      * @function payOutOptionChanged
      * @param {Object} event  - An object containing the current event of field.
      * @returns {void}
      */
     self.payOutOptionChanged = function(event) {
       self.createRDModel.payoutInstructions()[0].type(event.detail.value);

       if (self.createRDModel.payoutInstructions()[0].type() === "E")
         {self.createRDModel.payoutInstructions()[0].networkType("NEFT");}
       else
         {self.createRDModel.payoutInstructions()[0].networkType(null);}

       self.branchDetailsLoaded(false);
       self.createRDModel.payoutInstructions()[0].accountId.value(null);
       self.createRDModel.payoutInstructions()[0].accountId.displayValue(null);
       self.createRDModel.payoutInstructions()[0].account(null);
       self.internalAccount(undefined);
       self.createRDModel.payoutInstructions()[0].branchId(null);
       self.createRDModel.payoutInstructions()[0].beneficiaryName(null);
       self.createRDModel.payoutInstructions()[0].bankName(null);
       self.createRDModel.payoutInstructions()[0].address.line1(null);
       self.createRDModel.payoutInstructions()[0].address.line2(null);
       self.createRDModel.payoutInstructions()[0].address.city(null);
       self.createRDModel.payoutInstructions()[0].address.country(null);
       self.createRDModel.payoutInstructions()[0].clearingCode(null);
     };

     /**
      * This function will be triggered when account for Payout is selected by user.
      *
      * @memberOf create-rd
      * @function subscriptionAdditionalDetailsTransfer
      * param1 {object} additionalDetailsTransfer An object containing the details of current account
      * @returns {void}
      */
     const subscriptionAdditionalDetailsTransfer = self.additionalDetailsTransfer.subscribe(function(newValue) {
         if (newValue) {
           self.createRDModel.payoutInstructions()[0].accountId.displayValue(self.additionalDetailsTransfer().account.id.displayValue);
           self.createRDModel.payoutInstructions()[0].beneficiaryName(self.additionalDetailsTransfer().account.partyName);
           self.createRDModel.payoutInstructions()[0].branchId(self.additionalDetailsTransfer().account.branchCode);
           self.createRDModel.payoutInstructions()[0].bankName(self.additionalDetailsTransfer().address.branchName);
           self.createRDModel.payoutInstructions()[0].address.line1(self.additionalDetailsTransfer().address.branchAddress.postalAddress.line1);
           self.createRDModel.payoutInstructions()[0].address.line2(self.additionalDetailsTransfer().address.branchAddress.postalAddress.line2);
           self.createRDModel.payoutInstructions()[0].address.city(self.additionalDetailsTransfer().address.branchAddress.postalAddress.city);
           self.createRDModel.payoutInstructions()[0].address.country(self.additionalDetailsTransfer().address.branchAddress.postalAddress.country);
         }
       }),
       /**
        * This function will be triggered when account for PayIn is selected by user.
        *
        * @memberOf create-rd
        * @function subscriptionAdditionalDetailsAccount
        * param1 {object} additionalDetailsTransfer An object containing the details of current account
        * @returns {void}
        */
       subscriptionAdditionalDetailsAccount = self.additionalDetailsAccount.subscribe(function() {
         if (self.loadedFromReview()) {
           if (self.additionalDetailsAccount().account.holdingPattern === "JOINT") {
             self.ischeckBoxVisible(true);
           } else
             {self.ischeckBoxVisible(false);}

           self.loadedFromReview(false);
         } else {
           self.createRDModel.holdingPattern(self.additionalDetailsAccount().account.holdingPattern);
           self.ischeckBoxVisible(self.createRDModel.holdingPattern() === "JOINT");

           if (self.createRDModel.holdingPattern() === "SINGLE")
             {self.holdingPattern.removeAll();}

           self.createRDModel.partyName(self.additionalDetailsAccount().account.partyName);
           self.primaryAccHolder(self.additionalDetailsAccount().account.partyName);
           self.createRDModel.payInInstruction()[0].accountId.displayValue(self.additionalDetailsAccount().account.id.displayValue);
         }
       });

     /**
      * This function will be triggered when products for RD  is selected by user.
      *
      * @memberOf create-rd
      * @function productChangeHandler
      * @param {Object} event  - An object containing the current event of field.
      * @returns {void}
      */
     self.productChangeHandler = function() {
       self.url("products/deposit/" + self.createRDModel.productDTO.productId());

       if (self.productList().length > 0) {
         const productObj = fetchSelectedProduct(self.createRDModel.productDTO.productId());

         self.createRDModel.productDTO.name(productObj.name);
         self.isProductSelected(true);
         setTenure(productObj);
       }
     };

     /**
      * This function is used to fetch currency list,minimum and maximum amount limit with respect to product.
      *
      * @memberOf create-rd
      * @function currencyParser
      * @param {Object} data  - An object represent list of products.
      * @returns {void}
      */
     self.currencyParser = function(data) {
       productCcyDetails = [];

       const output = {};

       output.currencies = [];

       if (self.createRDModel.productDTO.productId()) {
         if (data.tdProductDTOList.length > 0) {
           if (data.tdProductDTOList[0].amountParameters) {
             for (let i = 0; i < data.tdProductDTOList[0].amountParameters.length; i++) {
               output.currencies.push({
                 code: data.tdProductDTOList[0].amountParameters[i].currency,
                 description: data.tdProductDTOList[0].amountParameters[i].currency
               });

               productCcyDetails.push({
                 ccy: data.tdProductDTOList[0].amountParameters[i].currency,
                 minAmount: data.tdProductDTOList[0].amountParameters[i].minAmount.amount,
                 maxAmount: data.tdProductDTOList[0].amountParameters[i].maxAmount.amount
               });
             }
           }
         }
       }

       return output;
     };

     let cnfaccountValue,
            accountValue;

        self.confirmValue = ko.observable();
        self.accountNumber = ko.observable("");

        /**
         * This function is used validate account Number.
         *
         * @memberOf create-rd
         * @function AccountNoValidator_fn
         * @returns {void}
         */
        function AccountNoValidator_fn(value) {
            accountValue = value;

            if (value) {
                if (cnfaccountValue) {
                    if (value === cnfaccountValue) {
                        document.getElementById("confirmAccNumber").validate();
                    } else { throw new oj.ValidatorError("ERROR", self.resource.maturityDetail.accountNoValidation); }
                } else if (self.confirmValue()) {
                    if (value !== self.confirmValue()) { throw new oj.ValidatorError("ERROR", self.resource.maturityDetail.accountNoValidation); }
                }
            }
        }
        /**
         * This function is used validate confirm account Number.
         *
         * @memberOf create-rd
         * @function cnfAccountNoValidator_fn
         * @returns {void}
         */

        function cnfAccountNoValidator_fn(value) {
            if ((self.accountNumber() && self.accountNumber() !== "") || value) {
                cnfaccountValue = value;

                if (accountValue !== cnfaccountValue) {
                    if (self.accountNumber() !== value) {
                        self.accountNumber("");
                        throw new oj.ValidatorError("ERROR", self.resource.maturityDetail.accountNoValidation);
                    }
                } else if (accountValue === cnfaccountValue) {
                    self.confirmValue(cnfaccountValue);
                    cnfaccountValue = "";
                    AccountNoValidator_fn(accountValue);
                    document.getElementById("accNumber").validate();
                }
            } else { throw new oj.ValidatorError("ERROR",self.resource.maturityDetail.validationMessage); }
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
      * This function will be triggered when currency for principal amount is selected by user.
      *
      * @memberOf create-rd
      * @function subscriptionCurrency
      * @returns {void}
      */
     const subscriptionCurrency = self.createRDModel.principalAmount.currency.subscribe(function(newValue) {
       for (let i = 0; i < productCcyDetails.length; i++) {
         if (productCcyDetails[i].ccy === newValue) {
           self.depositMessage({
            nls: self.resource.depositDetail.productAmountMessage,
            minAmount: {amount: productCcyDetails[i].minAmount,
currency: newValue},
            maxAmount: {amount: productCcyDetails[i].maxAmount,
currency: newValue}
           });

           break;
         }
       }
     });

     /**
      * This function will be triggered to cleanup the memory allocated to subscribed functions.
      *
      * @memberOf create-rd
      * @function dispose
      * @returns {void}
      */
     self.dispose = function() {
       subscriptionCurrency.dispose();
       subscriptionAdditionalDetailsAccount.dispose();
       subscriptionAdditionalDetailsTransfer.dispose();
     };

     /**
      * This function is triggered when user checks or uncheck the checkbox.
      *
      * @memberOf create-rd
      * @function holdingPatternChangeHandler
      * @returns {void}
      */
     self.holdingPatternChangeHandler = function() {
       self.createRDModel.holdingPattern(self.holdingPattern()[0] || "JOINT");
     };

     /**
      * This function is used set tenure of Recurring Deposit .
      *
      * @memberOf create-rd
      * @function formatTenure
      * @returns {void}
      */
     self.formatTenure = function() {
       let year, month;

       if (self.createRDModel.tenure.years() <= 1)
         {year = rootParams.baseModel.format(self.resource.depositDetail.tenure.singular.year, {
           n: self.createRDModel.tenure.years()
         });}
       else
         {year = rootParams.baseModel.format(self.resource.depositDetail.tenure.plural.year, {
           n: self.createRDModel.tenure.years()
         });}

       if (self.createRDModel.tenure.months() <= 1)
         {month = rootParams.baseModel.format(self.resource.depositDetail.tenure.singular.month, {
           n: self.createRDModel.tenure.months()
         });}
       else
         {month = rootParams.baseModel.format(self.resource.depositDetail.tenure.plural.month, {
           n: self.createRDModel.tenure.months()
         });}

       return rootParams.baseModel.format(self.resource.depositDetail.tenureDetail, {
         years: year,
         months: month
       });
     };

     /** This function will empty all the fields of addNomineeModel.
      *
      * @memberOf create-rd
      * @function resetNomineeModel
      *  @returns {void}
      */
     function resetNomineeModel() {
       self.addNomineeModel.dateOfBirth(null);
       self.addNomineeModel.relation("");
       self.addNomineeModel.minor(false);
       self.isMinor(false);
       self.addNomineeModel.name(null);
       self.addNomineeModel.address.country("");
       self.addNomineeModel.address.state(null);
       self.addNomineeModel.address.city(null);
       self.addNomineeModel.address.zipCode(null);
       self.addNomineeModel.address.line1(null);
       self.addNomineeModel.address.line2(null);
       self.addNomineeModel.guardian = null;
     }

     /**
      * This function will validate all the details entered by user  for booking RD if all credentials are correct then
      *user is prompted to next screen for further processing.
      *
      * @memberOf create-rd
      * @function  newRdDeposit
      * @returns {void}
      */
     self.newRdDeposit = function() {
       const rdValidationFailed = !rootParams.baseModel.showComponentValidationErrors(document.getElementById("RdTracker"));
       let nomineeValidationFailed = self.isNomineeRequired();

       if (self.isNomineeRequired())
         {nomineeValidationFailed = !rootParams.baseModel.showComponentValidationErrors(document.getElementById("nomineeTracker"));}

       if (rdValidationFailed || nomineeValidationFailed)
         {return;}

       const ignoreProp = [];

          if(!self.createRDModel.maturityAmount.amount() && !self.createRDModel.maturityAmount.currency()){
            ignoreProp.push("maturityAmount");
          }

          if (self.createRDModel.payoutInstructions()[0].type() === "I")
         {ignoreProp.push("address");
        self.createRDModel.payoutInstructions()[0].account(self.internalAccount());
             }

       if (self.createRDModel.holdingPattern() === "JOINT") {
         resetNomineeModel();
         self.createRDModel.nomineeDTO(null);
         self.isNomineeRequired(false);
       }

       recurringDepositModel.openRd(ko.mapping.toJSON(self.createRDModel, {
         ignore: ignoreProp
       }), isSimulated).then(function(data) {
           self.createRDModel.interestRate(data.termDepositDetails.interestRate);
           self.createRDModel.maturityDate(data.termDepositDetails.maturityDate);
           self.createRDModel.maturityAmount.amount(data.termDepositDetails.maturityAmount.amount);
           self.createRDModel.maturityAmount.currency(data.termDepositDetails.maturityAmount.currency);
           self.parties([]);

           if (self.createRDModel.holdingPattern() === "JOINT" && data.termDepositDetails.parties) {
             const jointParties = data.termDepositDetails.parties;

             for (let i = 0; i < jointParties.length; i++) {
               if (jointParties[i].relationship === "JAF" || jointParties[i].relationship === "JOF")
                 {self.primaryAccHolder(jointParties[i].partyName);}
               else
                 {self.parties.push({
                   partyName: jointParties[i].partyName,
                   partyId: jointParties[i].partyId,
                   relationship: jointParties[i].relationship
                 });}
             }
           }

           self.loadedFromReview(true);

           rootParams.dashboard.loadComponent("review-create-rd", ko.mapping.toJS({
                        createRDModel: self.createRDModel,
                        holdingPattern: self.holdingPattern,
                        tenureMessage: self.tenureMessage,
                        depositMessage: self.depositMessage,
                        loadedFromReview: self.loadedFromReview,
                        url: self.url,
                        addNomineeModel: self.addNomineeModel,
                        primaryAccHolder: self.primaryAccHolder,
                        parties: self.parties,
                        isMinor: self.isMinor,
                        manageNominee: self.manageNominee,
                        isNomineeRequired: self.isNomineeRequired,
                        internalAccount :self.internalAccount
                      }));
       });
     };

     /**
      * This function will be triggered to fetch bank details baed on clearing code and network type.
      *
      * @memberOf create-rd
      * @function  bankDetails
      * @returns {void}
      */
     self.bankDetails = function() {
       self.branchDetailsLoaded(false);

       const codeTracker = document.getElementById("codeTracker");

       if (codeTracker.valid === "valid") {
         recurringDepositModel.fetchBranch(self.createRDModel.payoutInstructions()[0].networkType(), self.createRDModel.payoutInstructions()[0].clearingCode()).then(function(data) {
           self.createRDModel.payoutInstructions()[0].address.line1(data.branchAddress.line1);
           self.createRDModel.payoutInstructions()[0].address.line2(data.branchAddress.line2);
           self.createRDModel.payoutInstructions()[0].address.city(data.branchAddress.city);
           self.createRDModel.payoutInstructions()[0].address.country(data.branchAddress.country);
           self.createRDModel.payoutInstructions()[0].bankName(data.name);
           self.branchDetailsLoaded(true);
         });
       } else {
         codeTracker.showMessages();
         codeTracker.focusOn("@firstInvalidShown");
       }
     };

     self.nomineeDetails = [{
       id: "no",
       label: self.resource.generic.common.no
     }, {
       id: "yes",
       label: self.resource.generic.common.yes
     }];

     self.manageNominee(self.manageNominee() ? self.manageNominee() : self.nomineeDetails[0].id);

     if (self.manageNominee() === self.nomineeDetails[1].id) {
       self.component("add-edit-nominee");
       self.isNomineeRequired(true);
     }

     rootParams.baseModel.registerComponent("add-edit-nominee", "nominee");

     self.nomineeDetailsChanged = function(event) {
       if (event.detail.value === self.manageNominee() && event.detail.value !== event.detail.previousValue) {
         if (self.manageNominee() === self.nomineeDetails[1].id) {
           self.component("add-edit-nominee");
           self.isNomineeRequired(true);
           self.createRDModel.nomineeDTO(self.addNomineeModel);
           resetNomineeModel();
         } else if (self.manageNominee() === self.nomineeDetails[0].id) {
           self.isNomineeRequired(false);
           self.createRDModel.nomineeDTO(null);
         }
       }
     };

     /**
      * This function is used display interest rates in Recurring Deposit .
      *
      * @memberOf create-rd
      * @function openInterestSlabs
      * @returns {void}
      */
     self.openInterestSlabs = function() {
       if (!self.isProductSelected()) {
         rootParams.baseModel.showMessages(null, [self.resource.validate.product], "ERROR");
       } else
       if (rootParams.baseModel.large()) {
         self.viewInterest(true);
         $("#intrestslabs").trigger("openModal");
       } else
         {rootParams.dashboard.loadComponent("view-rd-interest-rate", ko.mapping.toJS({
           createRDModel: self.createRDModel,
           holdingPattern: self.holdingPattern,
           newRdDeposit: self.newRdDeposit,
           tenureMessage: self.tenureMessage,
           depositMessage: self.depositMessage,
           addNomineeModel: self.addNomineeModel,
           minor: self.isMinor,
           manageNominee: self.manageNominee,
           isNomineeRequired: self.isNomineeRequired,
           productId: self.createRDModel.productDTO.productId()
         }));}
     };

     self.closeModelWindow = function() {
       $("#intrestslabs").hide();
       self.viewInterest(false);
     };
   };
 });