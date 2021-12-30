define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "jquery",
    "ojL10n!resources/nls/adhoc-transfer-vpa",
    "ojs/ojinputtext",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojknockout",
    "ojs/ojvalidationgroup",
    "ojs/ojradioset",
    "ojs/ojselectcombobox"
], function(oj, ko, adhocVpaModel, $, ResourceBundle) {
    "use strict";

    /** Adhoc VPA Transfer.
     *
     * @param {Object} rootParams  - An object which contains contect of dashboard and param values.
     * @return {Function} Function.
     * @return {Object} GetNewKoModel.
     *
     */
    return function(rootParams) {
        const self = this,
            getNewKoModel = function() {
                const KoModel = ko.mapping.fromJS(adhocVpaModel.getNewModel());

                return KoModel;
            };

        self.adhocTransferVpaModel = getNewKoModel().adhocTransferVpaModel;
        self.resource = ResourceBundle;
        self.payments = ResourceBundle.payments;
        self.transferMode = ko.observable();
        self.vpaList = ko.observableArray([]);
        self.vpaListMap = ko.observable({});
        self.vpaListLoaded = ko.observable();
        self.openBankLookup = ko.observable(false);
        self.additionalBankDetails = ko.observable();
        self.groupValid = ko.observable();
        self.modeSelected = ko.observable(true);
        self.payeeName = ko.observable();
        self.taskCode = ko.observable("PC_F_UT");
        self.ConfirmaccountNumber = ko.observable();
        ko.utils.extend(self, rootParams.rootModel.previousState ? ko.mapping.fromJS(rootParams.rootModel.previousState) : rootParams.rootModel);
        self.accountNumber = self.adhocTransferVpaModel.accountTransferDetails.accountNumber;
        self.accountName = self.adhocTransferVpaModel.accountTransferDetails.accountName;

        rootParams.dashboard.headerName(self.resource.adhocTransferVpa.header);

        rootParams.baseModel.registerComponent("review-adhoc-transfer-vpa", "upi");
        rootParams.baseModel.registerComponent("available-limits", "financial-limits");

        rootParams.baseModel.registerElement([
            "modal-window",
            "confirm-screen",
            "row",
            "amount-input",
            "bank-look-up"
        ]);

        self.transferOptions = ko.observableArray([{
            value: "VPA",
            text: self.resource.adhocTransferVpa.vpa
        }, {
            value: "ACC",
            text: self.resource.adhocTransferVpa.account
        }]);

            self.transferMode(self.transferOptions()[0].value);

            Promise.all([adhocVpaModel.fetchList(), adhocVpaModel.fetchBankConfig()]).then(function(response) {
                self.vpaListLoaded(false);

                for (let i = 0; i < response[0].virtualPaymentAddressDTOs.length; i++) {
                    self.vpaList.push(response[0].virtualPaymentAddressDTOs[i]);

                    self.vpaListMap()[response[0].virtualPaymentAddressDTOs[i].id] = {
                        displayValue: response[0].virtualPaymentAddressDTOs[i].accountId.displayValue,
                        value: response[0].virtualPaymentAddressDTOs[i].accountId.value
                    };
                }

                self.adhocTransferVpaModel.amount.currency(response[1].bankConfigurationDTO.localCurrency);
                self.vpaListLoaded(true);
            });

        /**
         * This function will handle the operation of currency parser.
         *
         * @memberOf adhoc-transfer-vpa
         * @function reset
         * @param {string} transferMode - Resets all the details.
         * @returns {Array} Currencies contains the array of currency array.
         */
        function reset(transferMode) {
            self.adhocTransferVpaModel.amount.amount(null);
            self.adhocTransferVpaModel.debitVPAId(null);
            self.adhocTransferVpaModel.remarks(null);

            if (transferMode !== self.transferOptions()[0].value) {
                self.adhocTransferVpaModel.creditVPAId(null);
            } else {
                self.ConfirmaccountNumber(null);
                self.adhocTransferVpaModel.accountTransferDetails.transferMode(null);
                self.adhocTransferVpaModel.accountTransferDetails.accountNumber(null);
                self.adhocTransferVpaModel.accountTransferDetails.accountName(null);
                self.adhocTransferVpaModel.accountTransferDetails.accountType(null);
                self.adhocTransferVpaModel.accountTransferDetails.bankDetails.name(null);
                self.adhocTransferVpaModel.accountTransferDetails.bankDetails.branch(null);
                self.adhocTransferVpaModel.accountTransferDetails.bankDetails.address(null);
                self.adhocTransferVpaModel.accountTransferDetails.bankDetails.city(null);
                self.adhocTransferVpaModel.accountTransferDetails.bankDetails.country(null);
                self.adhocTransferVpaModel.accountTransferDetails.bankDetails.codeType(null);
                self.adhocTransferVpaModel.accountTransferDetails.bankDetails.code(null);
            }
        }

        self.transferOptionsHandler = function(event) {
            self.modeSelected(false);
            reset(event.detail.value);
            ko.tasks.runEarly();
            self.modeSelected(true);
        };

if(rootParams.rootModel.previousState && self.adhocTransferVpaModel.creditVPAId()===null)
{
  self.transferMode("ACC");
  self.ConfirmaccountNumber(self.adhocTransferVpaModel.accountTransferDetails.accountNumber());
}

        self.reviewTransfer = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("adhocTransferVpaTracker"))) { return; }

            const fetchBankDetails = self.transferMode() !== "VPA" ? self.verifyCode() : Promise.resolve();

            Promise.all([fetchBankDetails]).then(function(){
                adhocVpaModel.validateRequest(ko.toJSON(self.adhocTransferVpaModel)).then(function(response) {
                    self.payeeName(response.upiTransferDetails.receiverName);

const parameters={
  // transferMode: self.transferMode,
  // vpaList: self.vpaList,
  // vpaListMap: self.vpaListMap,
  // vpaListLoaded: self.vpaListLoaded,
  // ConfirmaccountNumber: self.ConfirmaccountNumber,
  // additionalBankDetails: self.additionalBankDetails,
  // debitAccountNo: self.vpaListMap()[self.adhocTransferVpaModel.debitVPAId()].displayValue,
  payeeName: self.payeeName,
  adhocTransferVpaModel: self.adhocTransferVpaModel
};

                    rootParams.dashboard.loadComponent("review-adhoc-transfer-vpa", ko.mapping.toJS(parameters));
                });
            });
        };

        self.verifyCode = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("verify-code-tracker"))) { return; }

            return adhocVpaModel.getBankDetailsDCC(self.adhocTransferVpaModel.accountTransferDetails.bankDetails.code()).then(function(data) {
                ko.tasks.runEarly();
                self.additionalBankDetails(data);
                self.adhocTransferVpaModel.accountTransferDetails.bankDetails.name(data.branchName);
                self.adhocTransferVpaModel.accountTransferDetails.bankDetails.branch(data.branchAddress.line1);
                self.adhocTransferVpaModel.accountTransferDetails.bankDetails.address(null);
                self.adhocTransferVpaModel.accountTransferDetails.bankDetails.city(data.branchAddress.city);
                self.adhocTransferVpaModel.accountTransferDetails.bankDetails.country(data.branchAddress.country);
                self.adhocTransferVpaModel.accountTransferDetails.bankDetails.codeType(data.financialInstitutionCodeType);
            });
        };

        self.resetCode = function() {
            self.adhocTransferVpaModel.accountTransferDetails.bankDetails.code(null);
            ko.tasks.runEarly();
            self.additionalBankDetails(null);
        };

        self.openLookup = function() {
            self.openBankLookup(true);
            $("#menuButtonDialog").trigger("openModal");
        };

        let cnfaccountValue,
            accountValue;

        self.confirmValue = ko.observable();

        /**
         * This function will handle the operation of currency parser.
         *
         * @memberOf adhoc-transfer-vpa
         * @function AccountNoValidator_fn
         * @param {string} value - Account number validator.
         * @returns {Array} Currencies contains the array of currency array.
         */
        function AccountNoValidator_fn(value) {
            accountValue = value;

            if (value) {
                if (cnfaccountValue) {
                    if (value === cnfaccountValue) {
                        document.getElementById("confirmAccNumber").validate();
                    } else { throw new oj.ValidatorError("ERROR", self.payments.accountNoValidation); }
                } else if (self.confirmValue()) {
                    if (value !== self.confirmValue()) { throw new oj.ValidatorError("ERROR", self.payments.accountNoValidation); }
                }
            }
        }

        /**
         * This function will handle the operation of currency parser.
         *
         * @memberOf adhoc-transfer-vpa
         * @function cnfAccountNoValidator_fn
         * @param {string} value - Confirm account number validator.
         * @returns {Array} Currencies contains the array of currency array.
         */
        function cnfAccountNoValidator_fn(value) {
            if ((self.accountNumber() && self.accountNumber() !== "") || value) {
                cnfaccountValue = value;

                if (accountValue !== cnfaccountValue) {
                    if (self.accountNumber() !== value) {
                        self.accountNumber("");
                        throw new oj.ValidatorError("ERROR", self.payments.accountNoValidation);
                    }
                } else if (accountValue === cnfaccountValue) {
                    self.confirmValue(cnfaccountValue);
                    cnfaccountValue = "";
                    AccountNoValidator_fn(accountValue);
                    document.getElementById("accNumber").validate();
                }
            } else { throw new oj.ValidatorError("ERROR", self.payments.validationMessage); }
        }

        self.accountNoValidator = [rootParams.baseModel.getValidator("ACCOUNT"), {
            validate: AccountNoValidator_fn
        }];

        self.confirmAccountNoValidator = [{
            validate: cnfAccountNoValidator_fn
        }];

        self.showLimits = ko.observable(false);

        self.viewLimits = function() {
            self.showLimits(true);
            ko.tasks.runEarly();
            $("#view-limits").trigger("openModal");
        };

        self.done = function() {
            $("#view-limits").hide();
            self.showLimits(false);
        };

    };
});
