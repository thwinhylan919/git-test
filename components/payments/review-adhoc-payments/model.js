define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ReviewAdhocPaymentModel = function() {
    const baseService = BaseService.getInstance();
    let readAdhocPaymentDeferred;
    const readAdhocPayment = function(paymentId, paymentType, payeeStatus,deferred) {
      const options = {
        url: paymentId,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      if (paymentType === "GENERIC" && payeeStatus==="INT") {
        options.url = "payments/generic/" + options.url;
      }else if (paymentType === "SELFFT") {
        options.url = "payments/transfers/self/" + options.url;
      } else if (paymentType === "INTERNALFT") {
        options.url = "payments/transfers/internal/" + options.url;
      } else if (paymentType === "INDIADOMESTICFT") {
        options.url = "payments/payouts/domestic/" + options.url;
      } else if (paymentType === "DOMESTICDRAFT") {
        options.url = "payments/drafts/domestic/" + options.url;
      } else if (paymentType === "PEER_TO_PEER") {
        options.url = "payments/transfers/peerToPeer/" + options.url;
      }

      baseService.fetch(options);
    };
    let getTransferPurposeDeferred;
    const getPurpose = function(paymentType, deferred) {
      let url;

      if (paymentType === "INTERNALFT" || paymentType === "INTERNALFT_PAYLATER") {
        url = "purposes/linkages?taskCode=PC_F_INTRNL";
      } else if (paymentType === "INDIADOMESTICFT" || paymentType === "INDIADOMESTICFT_PAYLATER" || paymentType === "UKPAYMENTS" || paymentType === "UKPAYMENTS_PAYLATER" || paymentType === "SEPACREDITTRANSFER" || paymentType === "SEPACARDPAYMENT" || paymentType === "SEPACREDITTRANSFER_PAYLATER" || paymentType === "SEPACARDPAYMENT_PAYLATER") {
        url = "purposes/linkages?taskCode=PC_F_DOM";
      }

      const options = {
        url: url,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getChargesDeferred;
    const getCharges = function(deferred) {
      const options = {
        url: "enumerations/correspondanceChargeType",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let getBranchesDeferred;
    const getBranches = function(deferred) {
      const options = {
        url: "locations/country/all/city/all/branchCode/",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      readAdhocPayment: function(paymentId, paymentType,payeeStatus) {
        readAdhocPaymentDeferred = $.Deferred();
        readAdhocPayment(paymentId, paymentType, payeeStatus,readAdhocPaymentDeferred);

        return readAdhocPaymentDeferred;
      },
      getTransferPurpose: function(paymentType) {
        getTransferPurposeDeferred = $.Deferred();
        getPurpose(paymentType, getTransferPurposeDeferred);

        return getTransferPurposeDeferred;
      },
      getBranches: function() {
        getBranchesDeferred = $.Deferred();
        getBranches(getBranchesDeferred);

        return getBranchesDeferred;
      },
      getCharges: function() {
        getChargesDeferred = $.Deferred();
        getCharges(getChargesDeferred);

        return getChargesDeferred;
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
      getPayeeAccountType: function(region) {
        return baseService.fetch({
          url: "enumerations/payeeAccountType?REGION={region}"
        },{
          region :region
        });
      },
      getCountries: function() {
        return baseService.fetch({
          url: "enumerations/country"
        });
      },
      getBankDetailsBIC: function(code) {
        return baseService.fetch({
          url: "financialInstitution/bicCodeDetails/{BICCode}"
        }, {
          BICCode: code
        });
      },
      getRemarks: function() {
        return baseService.fetch({
          url: "enumerations/senderToReceiverInfo"
        });
      },
      getBankDetailsNCC: function(code) {
        return baseService.fetch({
          url: "financialInstitution/nationalClearingDetails/{nationalClearingCodeType}/{nationalClearingCode}"
        }, {
          nationalClearingCodeType: "NCC",
          nationalClearingCode: code
        });
      }
    };
  };

  return new ReviewAdhocPaymentModel();
});
