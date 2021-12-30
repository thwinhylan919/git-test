define([
    "baseService"
], function (BaseService) {
    "use strict";

    /**
     * Main file for MultiCurrency Model. This file contains the model definition
     * for list of VA enabled real Account fetched from the host through the pass through REST call.<br/><br/>
     * The injected Model Class will have below properties:
     * <ul>
     *      <li>Service abstractions to fetch the list of remittance:
     *          <ul>
     *              <li>[init()]{@link MultiCurrencyModel.init}</li>
     *
     *              <li>[getProperty()]{@link MultiCurrencyModel.fetchVAEnabledRealAccount}</li>
     *
     *          </ul>
     *      </li>
     * </ul>
     *
     * @namespace Categories~MultiCurrencyModel
     * @class MultiCurrencyModel
     */
    const MultiCurrencyModel = function () {
        const baseService = BaseService.getInstance(),
            /**
             * Private method to fetch the list of VA Enabled Real Accounts. This
             * method will resolve a passed promise, which can be returned
             * from calling function to the parent.
             *
             * @function fetchVAEnabledRealAccount
             * @memberOf MultiCurrencyModel
             * @param {String} taskCode - task code for create or edit
             * @private
             */
            fetchVAEnabledRealAccount = function (taskCode) {
                const options = {
                        url: "accounts/vamAccounts?taskCode={taskCode}"
                    },
                    params = {
                        taskCode: taskCode
                    };

                return baseService.fetch(options, params);
            },

            /**
             * Private method to validate virtual multi currency account id. This
             * method will resolve a passed promise, which can be returned
             * from calling function to the parent.
             *
             * @function validateMultiCurrencyAccountId
             * @memberOf MultiCurrencyModel
             * @param {String} realCustomerNo - real customer number
             * @param {String} accGroupId - virtual multi-currency group Id
             * @private
             */
            validateMultiCurrencyAccountId = function (virtualMCA) {
                const options = {
                        url: "multiCurrencyAccounts/{virtualMCA}"
                    },
                    params = {
                        virtualMCA: virtualMCA
                    };

                return baseService.fetch(options, params);
            },
            /**
             * Private method to create the multi-currency payload. This
             * method will resolve a payload, which can be returned
             * from calling function to the parent.
             *
             * @function multiCurrencyPayload
             * @memberOf MultiCurrencyModel
             * @private
             */
            multiCurrencyPayload = function () {
                return {
                    multiccyaccountgroups: {
                        accGroupDesc: "",
                        accGroupId: "",
                        realCustomerNo: "",
                        VacTmCcyAccGroupDetailDTO: [],
                        VAEnabledRealAccounts: []
                    }
                };
            },
            /**
             * Private method to create virtual multi currency account. This
             * method will resolve a passed deferred object, which can be returned
             * from calling function to the parent.
             *
             * @function createVirtualMultiCurrencyAccount
             * @memberOf ReviewMultiCurrencyModel
             * @param {Object} createDTO - data to create a virtual multicurrency group
             * @returns {void}
             * @private
             */
            createVirtualMultiCurrencyAccount = function (createDTO) {
                const option = {
                    url: "multiCurrencyAccounts",
                    data: createDTO
                };

                return baseService.add(option);
            },

            /**
             * Private method to update the existing virtual multi-currency account. This
             * method will resolve a passed deferred object, which can be returned
             * from calling function to the parent.
             *
             * @function updateVirtualMultiCurrencyAccount
             * @memberOf ReviewMultiCurrencyModel
             * @param {Object} updateDTO - data to create a virtual multicurrency group
             * @param {String} id - Virtual Multi Currency Account Id for the multi-currency grounp to be updated
             * @returns {void}
             * @private
             */
            updateVirtualMultiCurrencyAccount = function (updateDTO, id) {
                const option = {
                        url: "multiCurrencyAccounts/{id}",
                        data: updateDTO
                    },
                    params = {
                        id: id
                    };

                return baseService.update(option, params);
            },
            /**
             * Private method to update the existing virtual multi-currency account. This
             * method will resolve a passed deferred object, which can be returned
             * from calling function to the parent.
             *
             * @function readVirtualMultiCurrencyAccount
             * @memberOf ReviewMultiCurrencyModel
             * @param {Object} updateDTO - data to create a virtual multicurrency group
             * @param {String} id - Virtual Multi Currency Account Id for the multi-currency grounp to be read
             * @returns {void}
             * @private
             */
            readVirtualMultiCurrencyAccount = function (id) {
                const option = {
                        url: "multiCurrencyAccounts/{id}"
                    },
                    params = {
                        id: id
                    };

                return baseService.fetch(option, params);
            };

        return {
            fetchVAEnabledRealAccount: function (taskCode) {
                return fetchVAEnabledRealAccount(taskCode);
            },
            validateMultiCurrencyAccountId: function (virtualMCA) {
                return validateMultiCurrencyAccountId(virtualMCA);
            },
            getNewModel: function () {
                return multiCurrencyPayload();
            },
            createVirtualMultiCurrencyAccount: function (createDTO) {
                return createVirtualMultiCurrencyAccount(createDTO);
            },
            updateVirtualMultiCurrencyAccount: function (updateDTO, id) {
                return updateVirtualMultiCurrencyAccount(updateDTO, id);
            },
            readVirtualMultiCurrencyAccount: function ( id) {
                return readVirtualMultiCurrencyAccount( id);
            }
        };

    };

    return new MultiCurrencyModel();
});