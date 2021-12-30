define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * BalanceTransferModel - Model file for Balance Transfer for Credit Card product.
   *
   * @return {void}  Description.
   */
  return function BalanceTransferModel() {
    /**
     * Let Model - Model for balance transfer object.
     *
     * @param  {Object} modelData - Description.
     * @return {void}           Description.
     */
    const Model = function(modelData) {
        this.transferCard = {
          cardIssuerName: modelData ? modelData.cardIssuerName ? modelData.cardIssuerName : "" : "",
          payeeName: modelData ? modelData.payeeName ? modelData.payeeName : "" : "",
          cardId: modelData ? modelData.cardId ? modelData.cardId : "" : "",
          temp_maskedCardNumber: "",
          temp_maskedNumber: "",
          temp_isActive: false,
          balanceTransferAmount: modelData ? modelData.balanceTransferAmount ? modelData.balanceTransferAmount : "" : "",
          currencyCode: modelData ? modelData.currencyCode ? modelData.currencyCode : "" : ""
        };
      },
      baseService = BaseService.getInstance();
    let fetchCardIssuerNamesDeferred;
    /**
     * FetchCardIssuerNames - Method to fetch card issuer names for balance transfer.
     *
     * @param  {Object} deferred - Description.
     * @return {void}          Description.
     */
    const fetchCardIssuerNames = function(deferred) {
      const options = {
        url: "enumerations/cardIssuerNames",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let updateBalanceTransferDetailsDeferred;
    /**
     * UpdateBalanceTransferDetails - Method to update balance details transfer for the credit card product.
     *
     * @param  {Object} submissionId - - - - - - - - - - - - - Description.
     * @param  {Object} payload      Description.
     * @param  {object} deferred     Description.
     * @return {void}              Description.
     */
    const updateBalanceTransferDetails = function(submissionId, payload, deferred) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/creditCardApplications/balanceTransfer",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.update(options, params);
    };
    let fetchBalanceTransferDetailsDeferred;
    /**
     * FetchBalanceTransferDetails - Method to fetch balance transfer details for the credit card product.
     *
     * @param  {Object} submissionId - - - - - - - - - - - Description.
     * @param  {Object} facilityId   Description.
     * @param  {object} simulationId Description.
     * @param  {object} offerId      Description.
     * @param  {object} deferred     Description.
     * @return {void}              Description.
     */
    const fetchBalanceTransferDetails = function(submissionId, facilityId, simulationId, offerId, deferred) {
      const params = {
          submissionId: submissionId,
          facilityId: facilityId,
          simulationId: simulationId,
          offerId: offerId
        },
        options = {
          url: "submissions/{submissionId}/creditCardApplications/balanceTransfer?offerId={offerId}&facilityId={facilityId}&simulationId={simulationId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };

    return {
      /**
       * GetNewModel - description.
       *
       * @param  {Object} modelData - Description.
       * @return {Object} Model.
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      /**
       * FetchCardIssuerNames - description.
       *
       * @return {Object} FetchCardIssuerNamesDeferred.
       */
      fetchCardIssuerNames: function() {
        fetchCardIssuerNamesDeferred = $.Deferred();
        fetchCardIssuerNames(fetchCardIssuerNamesDeferred);

        return fetchCardIssuerNamesDeferred;
      },
      /**
       * UpdateBalanceTransferDetails - description.
       *
       * @param  {Object} submissionId - - - - - - - - - - - - - - Description.
       * @param  {Object} payload      Description.
       * @return {object} UpdateBalanceTransferDetailsDeferred.
       */
      updateBalanceTransferDetails: function(submissionId, payload) {
        updateBalanceTransferDetailsDeferred = $.Deferred();
        updateBalanceTransferDetails(submissionId, payload, updateBalanceTransferDetailsDeferred);

        return updateBalanceTransferDetailsDeferred;
      },
      /**
       * FetchBalanceTransferDetails - description.
       *
       * @param  {Object} submissionId - - - - - - - - - - - - Description.
       * @param  {Object} facilityId   Description.
       * @param  {object} simulationId Description.
       * @param  {object} offerId      Description.
       * @return {object} FetchBalanceTransferDetailsDeferred.
       */
      fetchBalanceTransferDetails: function(submissionId, facilityId, simulationId, offerId) {
        fetchBalanceTransferDetailsDeferred = $.Deferred();
        fetchBalanceTransferDetails(submissionId, facilityId, simulationId, offerId, fetchBalanceTransferDetailsDeferred);

        return fetchBalanceTransferDetailsDeferred;
      }
    };
  };
});