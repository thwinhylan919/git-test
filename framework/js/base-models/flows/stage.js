/**
 * This is the stage instance for the OBDX Framework Flows.
 * @module stage
 */
define(["base-models/flows/contract"], function (Contract) {
    "use strict";

    /**
     * @class
     * @alias Stage
     * @memberof module:stage
     * @description This function returns constructor for stage.
     */

    const Stage = function (initializationContext) {
        if (typeof initializationContext === "string") {
            this.contracts = [];

            return this.component = initializationContext;
        }

        this.component = initializationContext.component;
        this.helpComponent = initializationContext.helpComponent;

        this.contracts = (initializationContext.contracts && initializationContext.contracts.filter(function (contract) {
            return Object.prototype.isPrototypeOf.call(Object.getPrototypeOf(contract), Contract[contract]);
        })) || [];
    };

    Stage.prototype.addContract = function (contract) {
        return this.contracts.push(Contract[contract]);
    };

    return Stage;
});