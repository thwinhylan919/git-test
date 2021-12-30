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
    let params;
    const baseService = BaseService.getInstance();

    return {
      /**
       * FetchDDA - it fetches the all demand Deposit accounts.
       *
       * @return {type}  Description.
       */
      fetchDDA: function () {
        params = {};

        const options = {
          url: "accounts/demandDeposit"
        };

        return baseService.fetch(options, params);
      },
      /**
       * FetchTDA - it fetches the all term Deposit accounts.
       *
       * @return {type}  Description.
       */
      fetchTDA: function () {
        params = {
          noDepositNumber: true
        };

        const options = {
          url: "accounts/deposit?noDepositNumber={noDepositNumber}&module=CON&module=ISL"
        };

        return baseService.fetch(options, params);
      },
      /**
       * FetchSweepInInstructionslist - provies the list of accounts which are linked for sweeep in.
       *
       * @param  {type} selectedAccountNumber - Description.
       * @return {type}                       Description.
       */
      fetchSweepInInstructionslist: function (selectedAccountNumber) {
        params = {
          accNum: selectedAccountNumber
        };

        const options = {
          url: "accounts/demandDeposit/{accNum}/sweepInInstructions"
        };

        return baseService.fetch(options, params);
      },
      /**
       * AddSweepInInstructionsDeferred - to add sweep in instructions.
       *
       * @param  {type} payload               - - - - - - - - - - - - - - - Description.
       * @param  {type} selectedAccountNumber Description.
       * @param  {type} deferred              Description.
       * @return {type}                       Description.
       */
      addSweepInInstructions: function (payload, selectedAccountNumber, deferred) {
        const params = {
            accNum: selectedAccountNumber
          },
          options = {
            url: "accounts/demandDeposit/{accNum}/sweepInInstructions",
            data: payload,
            success: function (data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            }
          };

        return baseService.add(options, params);
      },
      /**
       * DeleteSweepInInstructionsDeferred - delete sweep in instructions.
       *
       * @param  {type} selectedAccountNumber - - - - - - - - - - - - - - - Description.
       * @param  {type} instructionNo         Description.
       * @param  {type} deferred              Description.
       * @return {type}                       Description.
       */
      deleteSweepInInstructions: function (selectedAccountNumber, instructionNo) {
        const params = {
            accNum: selectedAccountNumber,
            instructionNo: instructionNo
          },
          options = {
            url: "accounts/demandDeposit/{accNum}/sweepInInstructions/{instructionNo}"
          };

        return baseService.remove(options, params);
      },
      /**
       * FireBatchDeferred - fires the batch request that creates each sweep in instruction.
       *
       * @param  {type} deferred             - - - - - - - - - - - - - - - Description.
       * @param  {type} batchRequest         Description.
       * @param  {type} type                 Description.
       * @return {type}                      Description.
       */
      fireBatch: function (batchRequest, type) {
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