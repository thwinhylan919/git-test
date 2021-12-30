define(["baseService", "jquery"], function(BaseService, $) {
    "use strict";

    const ListingModel = function() {
        /**
         * baseService instance through which all the rest calls will be made.
         *
         * @attribute baseService
         * @type {Object} BaseService Instance
         * @private
         */
        const baseService = BaseService.getInstance();
        /**
         * This function fires a GET request to fetch the product flow details
         * and delegates control to the successhandler along with response data
         * once the details are successfully fetched
         *
         * @function fetchProductFlow
         * @memberOf ProductService
         * @param {String} productCode      - String indicating the product code of the product whose flow details are to be fetched
         * @param {Function} successHandler - function to be called once the flow details are successfully fetched
         * @example ProductService.fetchProductFlow('productCode',handler);
         */
        let fetchCardInfoDeferred;
        const fetchCardInfo = function(deferred) {
            const options = {
                url: "accounts/cards/credit?expand=ALL",
                mockedUrl:"framework/json/design-dashboard/accounts/financial-summary/cards.json",
                showMessage: false,
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetchWidget(options);

        };
        let fetchAccountsDeferred;
        const fetchAccounts = function(deferred) {
            const options = {
                url: "accounts",
                mockedUrl:"framework/json/design-dashboard/accounts/financial-summary/accounts.json",
                showMessage: false,
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetchWidget(options);

        };
        let fetchAccesstokenDeferred;
        const fetchAccesstoken = function(deferred) {
            const options = {
                url: "accesstokens",
                showMessage: false,
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);

        };
        let fetchBankConfigurationDeferred;
        const fetchBankConfiguration = function(deferred) {
            const options = {
                url: "bankConfiguration",
                showMessage: false,
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);

        };
        let fetchExchangeRateDeferred;
        const fetchExchangeRate = function(branchCode, baseCurrency, toCurrency, deferred) {
            const options = {
                url: "forex/rates?branchCode=" + branchCode + "&ccy1Code=" + baseCurrency + "&ccy2Code=" + toCurrency,
                showMessage: false,
                success: function(data) {
                    deferred.resolve(data);
                },
                error: function(data) {
                    deferred.reject(data);
                }
            };

            baseService.fetch(options);
        };
        let fetchexternalbankAccountsDeferred;
        const fetchexternalbankAccounts = function(bankCode, deferred) {
            const options = {
                url: "externalBankAccounts?bankCode=" + bankCode,
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
            fetchCardInfo: function() {
                fetchCardInfoDeferred = $.Deferred();
                fetchCardInfo(fetchCardInfoDeferred);

                return fetchCardInfoDeferred;
            },
            fetchAccounts: function() {
                fetchAccountsDeferred = $.Deferred();
                fetchAccounts(fetchAccountsDeferred);

                return fetchAccountsDeferred;
            },
            fetchAccesstoken: function() {
                fetchAccesstokenDeferred = $.Deferred();
                fetchAccesstoken(fetchAccesstokenDeferred);

                return fetchAccesstokenDeferred;
            },
            fetchBankConfiguration: function() {
                fetchBankConfigurationDeferred = $.Deferred();
                fetchBankConfiguration(fetchBankConfigurationDeferred);

                return fetchBankConfigurationDeferred;
            },
            fetchExchangeRate: function(branchCode, baseCurrency, toCurrency) {
                fetchExchangeRateDeferred = $.Deferred();
                fetchExchangeRate(branchCode, baseCurrency, toCurrency, fetchExchangeRateDeferred);

                return fetchExchangeRateDeferred;
            },
            fetchexternalbankAccounts: function(bankCode) {
                fetchexternalbankAccountsDeferred = $.Deferred();
                fetchexternalbankAccounts(bankCode, fetchexternalbankAccountsDeferred);

                return fetchexternalbankAccountsDeferred;
            }
        };
    };

    return new ListingModel();
});