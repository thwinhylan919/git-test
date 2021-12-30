/**
 * Model for split-bill-request
 * @param {object} BaseService base service instance for server communication
 * @return {object} Model Modal instance
 */
define(["baseService"], function (BaseService) {
    "use strict";
    /**
     * In case more than one instance of recurringDepositModel is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     */

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
            /**
             * bankConfigurationget - fetches bank configuration details.
             *
             * @returns {Promise}  Returns the promise object.
             */
            bankConfigurationget: function () {
                const params = {},
                 options = {
                    url: "/bankConfiguration",
                    version: "v1"
                };

                return baseService.fetch(options, params);
            },
            /**
            * Function to split bill.
            *
            * @param {Object} payload  - An object containg the data to be sent to host.
            * @returns {Promise}  Returns the promise object.
            */
            paymentstransfersupiFundRequestsplitBillpost: function (payload) {
                const params = {},
                 options = {
                    url: "/payments/transfers/upi/splitBill",
                    version: "v1",
                    data: payload
                };

                options.headers = {};
                options.headers["X-Validate-Only"] = "Y";

                return baseService.add(options, params);
            },
            /**
             * mepartyget - fetches party details.
             *
             * @returns {Promise}  Returns the promise object.
             */
            mepartyget: function () {
                const params = {},
                 options = {
                    url: "/me/party",
                    version: "v1"
                };

                return baseService.fetch(options, params);
            },
            /**
             * virtualPaymentAddressesget - fetches Payment Address.
             *
             * @returns {Promise}  Returns the promise object.
             */
            virtualPaymentAddressesget: function () {
                const params = {},
                 options = {
                    url: "/virtualPaymentAddresses",
                    version: "v1"
                };

                return baseService.fetch(options, params);
            },
            /**
             * getPayeeMaintenance - fetches maintenance details.
             *
             * @returns {Promise}  Returns the promise object.
             */
              getPayeeMaintenance: function() {
                      return baseService.fetch({
                          url: "maintenances/payments"
                      });
                  },
                  /**
                   * getHostDate - fetches host date.
                   *
                   * @returns {Promise}  Returns the promise object.
                   */
                  getHostDate: function() {
                      return baseService.fetch({
                          url: "payments/currentDate"
              });
          }
        };
    };

    return new Model();
});
