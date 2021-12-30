define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const GuaranteeDetailsModel = function() {
    const baseService = BaseService.getInstance();
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
    let fetchPartyDetailsDeferred;
    const fetchPartyDetails = function(partyID, deferred) {
      const params = {
          partyId: partyID
        },
        options = {
          url: "me/party/relations/{partyId}",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchBeneficiaryDetailsDeferred;
    const fetchBeneficiaryDetails = function(beneficiaryId, deferred) {
      const params = {
          beneficiaryId: beneficiaryId
        },
        options = {
          url: "beneficiaries/{beneficiaryId}",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchCurrencyDeferred;
    const fetchCurrency = function(deferred) {
      const options = {
        url: "currency",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchBeneNameDeferred;
    const fetchBeneName = function(deferred) {
      const options = {
        url: "beneficiaries",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
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
    let getBankDetailsBICDeferred;
    const getBankDetailsBIC = function(code, deferred) {
      const options = {
          url: "financialInstitution/bicCodeDetails/{BICCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          BICCode: code
        };

      baseService.fetch(options, params);
    };

    return {
      fetchProductDetails: function(productId) {
        fetchProductDetailsDeferred = $.Deferred();
        fetchProductDetails(productId, fetchProductDetailsDeferred);

        return fetchProductDetailsDeferred;
      },
      fetchPartyDetails: function(partyID) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyID, fetchPartyDetailsDeferred);

        return fetchPartyDetailsDeferred;
      },
      fetchBeneficiaryDetails: function(beneName) {
        fetchBeneficiaryDetailsDeferred = $.Deferred();
        fetchBeneficiaryDetails(beneName, fetchBeneficiaryDetailsDeferred);

        return fetchBeneficiaryDetailsDeferred;
      },
      fetchCurrency: function() {
        fetchCurrencyDeferred = $.Deferred();
        fetchCurrency(fetchCurrencyDeferred);

        return fetchCurrencyDeferred;
      },
      fetchBeneName: function() {
        fetchBeneNameDeferred = $.Deferred();
        fetchBeneName(fetchBeneNameDeferred);

        return fetchBeneNameDeferred;
      },
      fetchBranchDate: function(code) {
        fetchBranchDateDeferred = $.Deferred();
        fetchBranchDate(code, fetchBranchDateDeferred);

        return fetchBranchDateDeferred;
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);

        return getBankDetailsBICDeferred;
      }
    };
  };

  return new GuaranteeDetailsModel();
});