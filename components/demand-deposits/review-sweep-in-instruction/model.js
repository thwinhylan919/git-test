define([
  "baseService"
], function (BaseService) {
  "use strict";

  /**
   * Model file for Selected Account detail section. This file contains the model definition
   * for Details section and exports the sweepInInstructionModel model which can be used
   * as a component in any form in which specific account detail information are required.
   *
   * @namespace sweepInInstructionModel~sweepInInstructionModel
   * @property {Object} params -To store data passed
   * @property {Object} baseService -To store baseService object
   * @return {type}  Description.
   */
  const sweepInInstructionModel = function () {
    const baseService = BaseService.getInstance();

    return {
      /**
       * ConfirmSweepInInstructions - fires the batch request that creates each sweep in instruction.
       *
       * @param  {type} batchRequest         - - - - - - - - - - - - - - - - Description.
       * @param  {type} type                 Description.
       * @return {type}                      Description.
       */
      confirmSweepInInstructions: function (batchRequest, type) {
        const options = {
          url: "batch"
        };

        return baseService.batch(options, {
          type: type
        }, batchRequest);
      }
    };
  };

  return new sweepInInstructionModel();
});