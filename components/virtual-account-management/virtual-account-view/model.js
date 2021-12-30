define([
    "baseService"
], function (BaseService) {
    "use strict";

    /**
     * Main file for virtual account management Model. This file contains the model definition
     * for list of properties fetched from the host through the pass through REST call.<br/><br/>
     * The injected Model Class will have below properties:
     * <ul>
     *      <li>Service abstractions to fetch the list of properties:
     *          <ul>
     *              <li>[init()]{@link VirtualAccountModel.init}</li>.
     *
     *              <li>[getProperty()]{@link VirtualAccountModel.deleteVirtualAccount}</li>
     *
     *              <li>[getProperty()]{@link VirtualAccountModel.fetchCurrencyList}</li>
     *
     *               <li>[getProperty()]{@link VirtualAccountModel.fetchCountryList}</li>
     *
     *              <li>[getProperty()]{@link VirtualAccountModel.fetchProductList}</li>
     *
     *              <li>[getProperty()]{@link VirtualAccountModel.fetchBalanceDetails}</li>
     *
     *          </ul>
     *      </li>
     * </ul>
     *
     * @namespace Categories~VirtualAccountModel
     * @class VirtualAccountModel
     */
    const VirtualAccountModel = function () {
        const baseService = BaseService.getInstance(),
            /**
             * Private method to close the virtual account based on virtualAccountNo.
             *
             * @function deleteVirtualAccount
             * @memberOf VirtualAccountModel
             * @param {string} virtualAccountNo - VirtualAccountNo for virtul account.
             * @returns {void}
             * @private
             */
            deleteVirtualAccount = function (virtualAccountNo) {
                const options = {
                        url: "accounts/virtual/{virtualAccountNo}"
                    },
                    params = {
                        virtualAccountNo: virtualAccountNo
                    };

                return baseService.remove(options, params);
            },
            /**
             * Private method to fetch the list of currency.
             *
             * @function fetchCurrencyList
             * @memberOf VirtualAccountModel
             * @param {string} limit - Additional param.
             * @param {string} offset - Additional param.
             * @returns {void}
             * @private
             */
            fetchCurrencyList = function (limit, offset) {
                const options = {
                        url: "currencies?limit={limit}&offset={offset}",
                        apiType: "extended"
                    },
                    params = {
                        limit: limit,
                        offset: offset
                    };

                return baseService.fetch(options, params);
            },
            /**
             * Private method to fetch the products.
             *
             * @function fetchProductList
             * @memberOf VirtualAccountModel
             * @param {string} limit - Additional param.
             * @param {string} offset - Additional param.
             * @returns {void}
             * @private
             */
            fetchProductList = function (realCustomerNo, limit, offset) {
                const options = {
                        url: "virtualAccounts/products?realCustomerNo={realCustomerNo}&limit={limit}&offset={offset}",
                        apiType: "extended"
                    },
                    params = {
                        realCustomerNo: realCustomerNo,
                        limit: limit,
                        offset: offset
                    };

                return baseService.fetch(options, params);
            },
            /**
             * Private method to fetch the list of country.
             *
             * @function fetchCountryList
             * @memberOf VirtualAccountModel
             * @param {string} limit - Additional param.
             * @param {string} offset - Additional param.
             * @returns {void}
             * @private
             */
            fetchCountryList = function (limit, offset) {
                const options = {
                        url: "countries?limit={limit}&offset={offset}",
                        apiType: "extended"
                    },
                    params = {
                        limit: limit,
                        offset: offset
                    };

                return baseService.fetch(options, params);
            },
            /**
             * Private method to fetch the balance.
             *
             * @function fetchBalanceDetails
             * @memberOf VirtualAccountModel
             * @param {string} virtualAccountNo - Virtual account number.
             * @param {string} virtualAccountCcy - Virtual account currency.
             * @returns {void}
             * @private
             */
            fetchBalanceDetails = function (virtualAccountNo, virtualAccountCcy) {
                const options = {
                        url: "accounts/virtual/{virtualAccountNo}/balances;currency={virtualAccountCcy}"
                    },
                    params = {
                        virtualAccountNo: virtualAccountNo,
                        virtualAccountCcy: virtualAccountCcy
                    };

                return baseService.fetch(options, params);
            },
            /**
             * Private method to fetch data for maintenance. This
             * method will resolve a passed deferred object, which can be returned
             * from calling function to the parent.
             *
             * @function maintenances
             * @memberOf VirtualAccountModel
             * @returns {void}
             * @private
             */
            maintenances = function () {
                const options = {
                    url: "maintenances/virtualAccounts"
                };

                return baseService.fetch(options);
            },
            /**
             * Private method to fetch the list of transaction for the statement.
             *
             * @function fetchTransactionList
             * @memberOf VirtualAccountStatementModel
             * @param {string} virtualAccount - A real customer number.
             * @param {string} q - The generic filtering parameter.
             * @param {string} media - media content for download.
             * @param {string} mediaFormat - media type for download.
             * @param {string} isdownload - download check
             * @returns {void}
             * @private
             */

            fetchTransactionList = function (virtualAccount, q, media, mediaFormat, isDownload) {
                const options = {
                        url: "accounts/virtual/{virtualAccount}/statements?q={q}&media={media}&mediaFormat={mediaFormat}"
                    },
                    parameters = {
                        virtualAccount: virtualAccount,
                        q: q,
                        media: media,
                        mediaFormat: mediaFormat
                    };

                if (isDownload === true) {
                    return baseService.downloadFile(options, parameters);
                }

                parameters.media = undefined;
                parameters.mediaFormat = undefined;

                return baseService.fetch(options, parameters);

            };

        return {
            deleteVirtualAccount: function (virtualAccountNo) {
                return deleteVirtualAccount(virtualAccountNo);
            },
            fetchCountryList: function (limit, offset) {
                return fetchCountryList(limit, offset);
            },
            fetchCurrencyList: function (limit, offset) {
                return fetchCurrencyList(limit, offset);
            },
            fetchProductList: function (realCustomerNo, limit, offset) {
                return fetchProductList(realCustomerNo, limit, offset);
            },
            fetchBalanceDetails: function (virtualAccountNo, virtualAccountCcy) {
                return fetchBalanceDetails(virtualAccountNo, virtualAccountCcy);
            },
            maintenances: maintenances,
            fetchTransactionList: fetchTransactionList
        };
    };

    return new VirtualAccountModel();
});