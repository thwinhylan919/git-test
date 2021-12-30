 /**
  * Function to split bill.
  *
  * @param {Object} payload  - An object containg the data to be sent to host.
  * @returns {Promise}  Returns the promise object.
  */
define(["baseService"], function (BaseService) {
    "use strict";

    const Model = function () {
        const baseService = BaseService.getInstance();

        return {
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

                return baseService.add(options, params);
            }
        };
    };

    return new Model();
});
