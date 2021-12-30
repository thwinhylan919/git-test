define([
  "baseService"
], function(BaseService) {
  "use strict";

  /**
   * This file contains the view model for the Cheque stop unblock  section.
   *
   * @namespace ChequeStopUnblock~viewModel
   * @member
   * @implements [ChequeStopUnblockModel]{@link ChequeStopUnblock~ChequeStopUnblockModel}
   * @constructor ChequeStopUnblockViewModel
   * @property {string} stopUnblockCheque.chequeInstructionType -To store the reference number.
   * @property {string} stopUnblockCheque.startChequeNumber -To store the starting cheque number.
   * @property {string} stopUnblockCheque.endChequeNumber -To store the starting end cheque number.
   * @property {string} chequeInstructionType -To store type of action user wants to do with the cheqe i.e.
   * @property {string} reason -To store the reason of stopping the cheque
   * @property {Object} chequeNo - an Object for storing the start cheque number range
   * @property {Object} stopUnblockCheque - an Object for storing the payload (details) of the cheque which is being stopped or unblocked.
   */
  const StopUnblockChequeModel = function() {
    /**
     * In case more than one instance of StopUnblockChequeModel model is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf StopUnblockChequeModel
     */
    const Model = function() {
        return {
          stopUnblockCheque: {
            chequeInstructionType: "STOP",
            reason: "",
            startChequeNumber: "",
            endChequeNumber: ""
          },
          chequeNo: {
            startChequeNumber: null,
            endChequeNumber: null
          }
        };
      },
      /**
      POST method to stop/unblock cheques
      @accountId - account id for particular account for which new debitcard is requested,
      @payload - expected request payload to service
      @deferred - returns deferred resolve or reject
      **/
      baseService = BaseService.getInstance();

    return {
      postRequest: function(accountId, payload) {

        const params = {
          accountId: accountId
        }, options = {
          url: "accounts/demandDeposit/{accountId}/issuedCheques",
          data: payload
        };

        return baseService.patch(options, params);
      },
      getNewModel: function() {
        return new Model();
      }
    };
  };

  return new StopUnblockChequeModel();
});