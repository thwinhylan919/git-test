define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const LCDetailsModel = function() {
    const baseService = BaseService.getInstance();
    let fetchProductDetailsDeferred;
    const fetchProductDetails = function (productId, state, deferred) {
      const params = {
          productId: productId
        },
        options = {
          url: "products/letterofcredits/{productId}",
          success: function(data) {
            deferred.resolve(data, state);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchSGProductDetailsDeferred;
    const fetchSGProductDetails = function (productId, state, deferred) {
      const params = {
        productId: productId
      },
        options = {
          url: "products/shippingGuarantee/{productId}",
          success: function (data) {
            deferred.resolve(data, state);
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
    let fetchCreditAvailaibleByTypeDeferred;
    const fetchCreditAvailaibleByType = function(deferred){
        const options = {
          url: "enumerations/creditAvailableByType",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
    };
    let fetchConfirmationPartyDeferred;
    const fetchConfirmationParty = function (deferred) {
      const options = {
        url: "enumerations/confirmationParty",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchConfirmationInstructionDeferred;
    const fetchConfirmationInstruction = function (deferred) {
      const options = {
        url: "enumerations/confirmationInstruction",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      fetchProductDetails: function (productId, state) {
        fetchProductDetailsDeferred = $.Deferred();
        fetchProductDetails(productId, state, fetchProductDetailsDeferred);

        return fetchProductDetailsDeferred;
      },
      fetchSGProductDetails: function (productId, state) {
        fetchSGProductDetailsDeferred = $.Deferred();
        fetchSGProductDetails(productId, state, fetchSGProductDetailsDeferred);

        return fetchSGProductDetailsDeferred;
      },
      fetchPartyDetails: function(partyID) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyID, fetchPartyDetailsDeferred);

        return fetchPartyDetailsDeferred;
      },
      fetchBeneficiaryDetails: function(beneficiaryId) {
        fetchBeneficiaryDetailsDeferred = $.Deferred();
        fetchBeneficiaryDetails(beneficiaryId, fetchBeneficiaryDetailsDeferred);

        return fetchBeneficiaryDetailsDeferred;
      },
      fetchCurrency: function() {
        fetchCurrencyDeferred = $.Deferred();
        fetchCurrency(fetchCurrencyDeferred);

        return fetchCurrencyDeferred;
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
      },
      fetchCreditAvailaibleByTypes: function(){
        fetchCreditAvailaibleByTypeDeferred = $.Deferred();
        fetchCreditAvailaibleByType(fetchCreditAvailaibleByTypeDeferred);

        return fetchCreditAvailaibleByTypeDeferred;
      },
      fetchConfirmationParty: function () {
        fetchConfirmationPartyDeferred = $.Deferred();
        fetchConfirmationParty(fetchConfirmationPartyDeferred);

        return fetchConfirmationPartyDeferred;
      },
      fetchConfirmationInstruction: function () {
        fetchConfirmationInstructionDeferred = $.Deferred();
        fetchConfirmationInstruction(fetchConfirmationInstructionDeferred);

        return fetchConfirmationInstructionDeferred;
      }
    };
  };

  return new LCDetailsModel();
});