define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    AmendBankGuaranteeModel = function() {
      const Model = function() {
        this.AmendedBGDetails = {
          id: null,
          bgId: null,
          issueDate: null,
          newExpiryDate: null,
          newAmount: {
            currency: null,
            amount: null
          },
          partyId: {
            displayValue: null,
            value: null
          },
          amendmentDate: null,
          narrative: null,
          versionNo: null,
          beneName: null,
          newClosureDate: null,
          validityType: null,
          expiryCondition: null,
          termsAndConditions: [],
          transactionType: null
        };
      };
      let fetchBranchDateDeferred;
      const fetchBranchDate = function(code, deferred) {
        const options = {
            url: "branchdate/{branchCode}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            branchCode: code
          };

        baseService.fetch(options, params);
      };
      let fetchProductDetailsDeferred;
      const fetchProductDetails = function(productId, deferred) {
        const params = {
            productId: productId
          },
          options = {
            url: "products/bankguarantees/{productId}",
            success: function(data) {
              deferred.resolve(data);
            }
          };

        baseService.fetch(options, params);
      };

      return {
        getNewModel: function(modelData) {
          return new Model(modelData);
        },
        fetchProductDetails: function(productId) {
          fetchProductDetailsDeferred = $.Deferred();
          fetchProductDetails(productId, fetchProductDetailsDeferred);

          return fetchProductDetailsDeferred;
        },
        fetchBranchDate: function(code) {
          fetchBranchDateDeferred = $.Deferred();
          fetchBranchDate(code, fetchBranchDateDeferred);

          return fetchBranchDateDeferred;
        }
      };
    };

  return new AmendBankGuaranteeModel();
});