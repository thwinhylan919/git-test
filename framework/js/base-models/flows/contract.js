/**
 * This is the contract instance for the OBDX Framework Flows.
 * @module contract
 */
define([], function () {
    "use strict";

    /**
     * @class
     * @alias Contract
     * @memberof module:contract
     * @description This function returns enumeration for contract.
     */

    const Contract = function (name) {
        this.name = name;
    };

    Contract.prototype.toString = function () {
        return this.name;
    };

    return Object.freeze({
        submit: new Contract("submit"),
        confirm: new Contract("confirm"),
        next: new Contract("next"),
        back: new Contract("back"),
        cancel: new Contract("cancel"),
        draft: new Contract("draft")
    });
});