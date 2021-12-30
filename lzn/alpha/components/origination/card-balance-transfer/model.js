define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model file for Balance Transfer for Credit Card product.
   *
   * @returns {Function} BalanceTransferModel Balance Transfer Model.
   */
  return function BalanceTransferModel() {
    /**
     * Model for balance transfer object.
     *
     * @param {Object} modelData - Model Data.
     * @returns {void}
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
     * Method to fetch card issuer names for balance transfer.
     *
     * @param {Object} deferred - Deferred object.
     * @returns {void}
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
     * Method to update balance details transfer for the credit card product.
     *
     * @param {string} submissionId - Submission id of the application.
     * @param {string} payload - Request paylaod.
     * @param {string} deferred - Deferred object.
     * @returns {void}
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
     * Method to fetch balance transfer details for the credit card product.
     *
     * @param {string} submissionId - Submission id of the application.
     * @param {string} facilityId - Facility Id.
     * @param {string} simulationId - Simulation Id.
     * @param {string} offerId - OfferId.
     * @param {string} deferred - Deferred object.
     * @returns {void}
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
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      /**
       * Public method to get card issuer name.
       *
       * @returns {Object} FetchCardIssuerNamesDeferred An object of type deferred.
       */
      fetchCardIssuerNames: function() {
        fetchCardIssuerNamesDeferred = $.Deferred();
        fetchCardIssuerNames(fetchCardIssuerNamesDeferred);

        return fetchCardIssuerNamesDeferred;
      },
      /**
       * Public method to update balance transfer details.
       *
       * @param {Object} submissionId - Submission id of the application.
       * @param {Object} payload - Request payload.
       * @returns {Object} UpdateBalanceTransferDetailsDeferred An object of type deferred.
       */
      updateBalanceTransferDetails: function(submissionId, payload) {
        updateBalanceTransferDetailsDeferred = $.Deferred();
        updateBalanceTransferDetails(submissionId, payload, updateBalanceTransferDetailsDeferred);

        return updateBalanceTransferDetailsDeferred;
      },
      /**
       * Public method to fetch balance transfer details.
       *
       * @param {Object} submissionId - Submission Id.
       * @param {Object} facilityId - Facility Id.
       * @param {Object} simulationId - Simulation Id.
       * @param {Object} offerId - Offer Id.
       * @returns {Object} FetchBalanceTransferDetailsDeferred An object of type deferred.
       */
      fetchBalanceTransferDetails: function(submissionId, facilityId, simulationId, offerId) {
        fetchBalanceTransferDetailsDeferred = $.Deferred();
        fetchBalanceTransferDetails(submissionId, facilityId, simulationId, offerId, fetchBalanceTransferDetailsDeferred);

        return fetchBalanceTransferDetailsDeferred;
      }
    };
  };
});