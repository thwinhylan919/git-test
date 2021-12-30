/**
 * Model for account aggregation payment
 * @param {object} BaseService base service instance for server communication
 * @param {object} constants constants to be fetched
 * @return {object} assembleStructureModel Modal instance
 */
define(["baseService", "jquery"], function(BaseService, $) {
    "use strict";

    const AccountActivity = function() {
        /**
         * In case more than one instance of createStructure is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        const Model = function() {
                this.transferMoneyModel = {
                    externalAccountDetails: {
                        accountNumber: null,
                        accountName: null,
                        branchCode: null,
                        transferMode: "ACC",
                        accountType: null,
                        network: null,
                        bankDetails: {
                            name: null,
                            branch: null,
                            address: null,
                            city: null,
                            country: null,
                            codeType: null,
                            code: null
                        },
                        name: null,
                        nickName: null,
                        groupId: null,
                        sepaType: null,
                        ukPaymentType: null
                    },
                    sourceAccountDetails: {
                        charges: null,
                        otherDetails: {
                            line1: null
                        },
                        partyId: {
                            displayValue: null,
                            value: null
                        },
                        amount: {
                            currency: null,
                            amount: null
                        },
                        userReferenceNo: null,
                        remarks: null,
                        purpose: null,
                        purposeText: null,
                        debitAccountId: {
                            displayValue: null,
                            value: null
                        },
                        creditAccountId: null,
                        valueDate: null,
                        frequency: null,
                        startDate: null,
                        endDate: null,
                        nextExecutionDate: null,
                        instances: null,
                        externalReferenceNumber: null,
                        freqDays: 0,
                        freqMonths: 0,
                        freqYears: 0
                    },
                    paymentType: null,
                    externalAccount: {
                        displayValue: null,
                        value: null
                    }
                };

                this.networkSuggestionModel = {
                    txnAmount: {
                        amount: null,
                        currency: null
                    },
                    taskCodes: "PC_F_CGNDP",
                    bankCode: null,
                    payeeId: null
                };

                this.selfPaymentModel = {
                    amount: {
                        currency: null,
                        amount: null
                    },
                    remarks: null,
                    purpose: null,
                    purposeText: null,
                    debitAccountId: {
                        displayValue: null,
                        value: null
                    },
                    creditAccountId: {
                        displayValue: null,
                        value: null
                    },
                    status: null,
                    dealId: null
                };
            },
            baseService = BaseService.getInstance();
        /**
         * Method to fetch Accounts information data.
         *  deferred object is resolved once the accounts information list is successfully fetched
         */
        let getNetworkTypesDeferred;
        const getNetworkTypes = function(deferred) {
            const options = {
                    url: "enumerations/networkType?REGION={region}",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                },
                params = {
                    region: "INDIA"
                };

            baseService.fetch(options, params);
        };
        let getCountriesDeferred;
        const getCountries = function(deferred) {
            const options = {
                url: "enumerations/country",
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let getBankDetailsDCCDeferred;
        const getBankDetailsDCC = function(code, deferred) {
            const options = {
                    url: "financialInstitution/domesticClearingDetails/{domesticClearingCodeType}/{domesticClearingCode}",
                    success: function(data) {
                        deferred.resolve(data);
                    },
                    error: function(data) {
                        deferred.reject(data);
                    }
                },
                params = {
                    domesticClearingCodeType: "INDIA",
                    domesticClearingCode: code
                };

            baseService.fetch(options, params);
        };
        let listAccessPointDeferred;
        const listAccessPoint = function(deferred) {
            const options = {
                url: "accessPoints",
                success: function(data) {
                    deferred.resolve(data);
                }
            };

            baseService.fetch(options);
        };
        let makePaymentDeferred;
        const makePayment = function(payload, transactionType, deferred) {
            let url;

            if (transactionType === "SELF") {
                url = "payments/transfers/self";
            } else {
                url = "accountaggregation/payment";
            }

            const options = {
                url: url,
                data: payload,
                success: function(data, status, jqXHR) {
                    deferred.resolve(data, status, jqXHR);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.add(options);
        };
        let verifyPaymentDeferred;
        const verifyPayment = function(paymentId, deferred) {
            const options = {
                    url: "payments/transfers/self/{paymentId}",
                    success: function(data, status, jqXHR) {
                        deferred.resolve(data, status, jqXHR);
                    }
                },
                params = {
                    paymentId: paymentId
                };

            baseService.patch(options, params);
        };
        let getTransferPurposeDeferred;
        const getTransferPurpose = function(deferred) {
            const options = {
                url: "purposes/linkages?taskCode=PC_F_DOM",
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };

        return {
            /**
             * Method to get new modal instance.
             *
             * @returns {Object}  Returns the modelData.
             */
            getNewModel: function() {
                return new Model();
            },
            /**
             * FetchexternalbankAccounts - fetches all external bank accounts.
             *
             * @param {Object} bankCode - For each bank.
             * @returns {Promise}  Returns the promise object.
             */
            fetchexternalbankAccounts: function(bankCode) {
                const options = {
                    url: "externalBankAccounts?bankCode=" + bankCode
                };

                return baseService.fetch(options);
            },
            /**
             * FetchAccesstoken - fetches all bank access tokens.
             *
             * @returns {Promise}  Returns the promise object.
             */
            fetchAccesstoken: function() {
                const options = {
                    url: "accesstokens",
                    showMessage: false
                };

                return baseService.fetch(options);
            },
            /**
             * FetchAccounts - fetches all internal bank accounts.
             *
             * @returns {Promise}  Returns the promise object.
             */
            fetchAccounts: function() {
                const options = {
                    url: "accounts",
                    showMessage: false,
                    mockUrl: "framework/json/design-dashboard/accounts/demand-deposit.json"
                };

                return baseService.fetchWidget(options);

            },
            /**
             * GetNetworkTypes - fetches network types for the transaction.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getNetworkTypes: function() {
                getNetworkTypesDeferred = $.Deferred();
                getNetworkTypes(getNetworkTypesDeferred);

                return getNetworkTypesDeferred;
            },
            /**
             * GetCountries - fetches countries for the available networks.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getCountries: function() {
                getCountriesDeferred = $.Deferred();
                getCountries(getCountriesDeferred);

                return getCountriesDeferred;
            },
            /**
             * GetMaintenances - fetches the bank maintenance.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getMaintenances: function() {
                return baseService.fetch({
                    url: "maintenances/payments"
                });
            },
            /**
             * GetNetworkPreferences - fetches the network preferences.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getNetworkPreferences: function() {
                return baseService.fetch({
                    url: "maintenances/payments/networkPreferences"
                });
            },
            /**
             * GetSuggestedNetwork - fetches suitable network for the transaction.
             *
             * @param {Object} model - Amount information model.
             * @returns {Promise}  Returns the promise object.
             */
            getSuggestedNetwork: function(model) {
                return baseService.add({
                    url: "payments/derivingNetworkType",
                    data: model
                });
            },

            /**
             * GetBankDetailsDCC - fetches the bank information.
             *
             * @param {Object} code - The ifsc code.
             * @returns {Promise}  Returns the promise object.
             */
            getBankDetailsDCC: function(code) {
                getBankDetailsDCCDeferred = $.Deferred();
                getBankDetailsDCC(code, getBankDetailsDCCDeferred);

                return getBankDetailsDCCDeferred;
            },

            /**
             * ListAccessPoint - list the all access points that are available.
             *
             * @returns {Promise}  Returns the promise object.
             */
            listAccessPoint: function() {
                listAccessPointDeferred = $.Deferred();
                listAccessPoint(listAccessPointDeferred);

                return listAccessPointDeferred;
            },
            /**
             * MakePayment - create the transaction.
             *
             * @param {Object} payload - - - - - - - - - - - - - The data required for transaction.
             * @param {Object} transactionType The data required for transaction.
             * @returns {Promise}  Returns the promise object.
             */
            makePayment: function(payload, transactionType) {
                makePaymentDeferred = $.Deferred();
                makePayment(payload, transactionType, makePaymentDeferred);

                return makePaymentDeferred;
            },

            /**
             * VerifyPayment - create the transaction.
             *
             * @param {Object} paymentId - The data required for transaction.
             * @returns {Promise}  Returns the promise object.
             */
            verifyPayment: function(paymentId) {
                verifyPaymentDeferred = $.Deferred();
                verifyPayment(paymentId, verifyPaymentDeferred);

                return verifyPaymentDeferred;
            },

            /**
             * GetTransferPurpose - fetch the purpose.
             *
             * @returns {Promise}  Returns the promise object.
             */
            getTransferPurpose: function() {
                getTransferPurposeDeferred = $.Deferred();
                getTransferPurpose(getTransferPurposeDeferred);

                return getTransferPurposeDeferred;
            },

            /**
             * FetCurrentDate - fetch the host date.
             *
             * @returns {Promise}  Returns the promise object.
             */
            fetCurrentDate: function() {
                const options = {
                    url: "payments/currentDate"
                };

                return baseService.fetch(options);
            }
        };
    };

    return new AccountActivity();
});