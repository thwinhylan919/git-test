define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const DomesticPayoutModel = function() {
    const baseService = BaseService.getInstance();

    let getFrequencyDescDeferred;
    const getFrequencyDesc = function(deferred) {
      const options = {
        url: "enumerations/paymentFrequency",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      getPurpose: function() {
        return baseService.fetch({
          url: "purposes/PC"
        });
      },
      getBankDetailsDCC: function(code) {
        return baseService.fetch({
          url: "financialInstitution/domesticClearingDetails/{domesticClearingCodeType}/{domesticClearingCode}"
        }, {
          domesticClearingCodeType: "INDIA",
          domesticClearingCode: code
        });
      },
      getBankDetails: function(code) {
        return baseService.fetch({
          url: "financialInstitution/bicCodeDetails/{BICCode}"
        }, {
          BICCode: code
        });
      },
      getBankDetailsNCC: function(region, code) {
        return baseService.fetch({
          url: "financialInstitution/nationalClearingDetails/{nationalClearingCodeType}/{nationalClearingCode}"
        }, {
          nationalClearingCodeType: region,
          nationalClearingCode: code
        });
      },
      getFrequencyDesc: function() {
        getFrequencyDescDeferred = $.Deferred();
        getFrequencyDesc(getFrequencyDescDeferred);

        return getFrequencyDescDeferred;
      },
      /**
       * Fetches service charges maintenances.
       *
       * @returns {Promise}  Returns the promise object.
       */
      getChargesMaintenances: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      },
      getCharges: function() {
        return baseService.fetch({
          url: "enumerations/correspondanceChargeType"
        });
      },
      /**
       * Fetches service charges.
       *
       * @returns {Promise}  Returns the promise object.
       */
      getServiceCharges: function(params) {
        return baseService.fetch({
          url: "charges?paymentType={paymentType}&transactionAmount={transactionAmount}&transactionCurrency={transactionCurrency}&debitAccountId={debitAccountId}&networkType={network}"
        }, params);
      },
      retrieveImage: function(id) {
        return baseService.fetch({
          url: "contents/{id}"
        }, {
          id: id
        });
      },
      getPayeeMaintenance: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      },
      getPayeeDetails: function(payeeGroupId,payeeId) {
        return baseService.fetch({
          url:  "payments/payeeGroup/{payeeGroupId}/payees/domestic/{payeeId}"
        },{
          payeeGroupId :payeeGroupId,
          payeeId :payeeId
        });
      },
      getGroupDetails: function(payeeGroupId) {
        return baseService.fetch({
          url:  "payments/payeeGroup/{payeeGroupId}"
        },{
          payeeGroupId :payeeGroupId
        });
      },
      getPayeeAccountType: function(region) {
        return baseService.fetch({
          url: "enumerations/payeeAccountType?REGION={region}"
        },{
          region :region
        });
      },
      getTransferData: function(paymentId, paymentType, transferType, transferNow) {
        let url;

        if (transferNow) {
          url = "payments/{paymentType}/{transferType}/{paymentId}";
        } else {
          url = "payments/instructions/{paymentType}/{transferType}/{paymentId}";
        }

        return baseService.fetch({
          url: url
        }, {
          paymentType: paymentType,
          transferType :transferType,
          paymentId : paymentId
        });
      }
    };
  };

  return new DomesticPayoutModel();
});