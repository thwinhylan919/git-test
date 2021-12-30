define([
    "baseService"
], function (BaseService) {
    "use strict";

    /**
     * Main file for virtaul account management Model. This file contains the model definition
     * for list of properties fetched from the host through the pass through REST call.<br/><br/>
     * The injected Model Class will have below properties:
     * <ul>
     *      <li>Service abstractions to fetch the list of properties:
     *          <ul>
     *              <li>[init()]{@link MoveMoneyModel.init}</li>.
     *
     *              <li>[getProperty()]{@link MoveMoneyModel.paymentTransfer}</li>
     *
     *          </ul>
     *      </li>
     * </ul>
     *
     * @namespace Categories~MoveMoneyModel
     * @class MoveMoneyModel
     */
    const MoveMoneyModel = function () {
        const baseService = BaseService.getInstance(),
            /**
             * Private method to fetch the list of virtual account based on search. This
             * method will resolve a passed deferred object, which can be returned
             * from calling function to the parent.
             *
             * @function paymentTransfer
             * @memberOf MoveMoneyModel
             * @param {Object} payload - Payload for money transfer.
             * @param {Object} deferred - An object type Deferred.
             * @returns {void}
             * @private
             */
            paymentTransfer = function (payload) {
                const option = {
                    url: "payments/virtual",
                    data: payload
                };

                return baseService.add(option);
            };

        return {
            paymentTransfer: function (payload) {
                 return paymentTransfer(payload);
            }
        };
    };

    return new MoveMoneyModel();
});