define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    ReviewGuaranteeModel = function() {
      let initiateBGDeferred;
      const initiateBG = function(model, deferred) {
        const options = {
          url: "bankguarantees",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

        baseService.add(options);
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
      let fetchGuranteeTypeDeferred;
      const fetchGuranteeType = function(deferred) {
        const options = {
          url: "bankguarantees/types",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let fetchProductDeferred;
      const fetchProduct = function(productID, deferred) {
        const params = {
            productId: productID
          },
          options = {
            url: "products/bankguarantees/{productId}",
            success: function(data) {
              deferred.resolve(data);
            }
          };

        baseService.fetch(options, params);
      };
      let fetchBeniCountryDeferred;
      const fetchBeniCountry = function(deferred) {
        const options = {
          url: "enumerations/country",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let fetchBranchDeferred;
      const fetchBranch = function(deferred) {
        const options = {
          url: "locations/country/all/city/all/branchCode/",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let getAccountDetailDeferred;
      const getAccountDetail = function(accountId, deferred) {
        const params = {
            accountId: accountId
          },
          options = {
            url: "accounts/demandDeposit/{accountId}",
            success: function(data) {
              deferred.resolve(data);
            }
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
      let deleteGuaranteeDeferred;
      const deleteGuarantee = function(guaranteeId, deferred) {
        const options = {
            url: "bankguarantees/{bgId}",
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          },
          params = {
            bgId: guaranteeId
          };

        baseService.remove(options, params);
      };

      return {
        initiateBG: function(model) {
          initiateBGDeferred = $.Deferred();
          initiateBG(model, initiateBGDeferred);

          return initiateBGDeferred;
        },
        fetchPartyDetails: function(partyID) {
          fetchPartyDetailsDeferred = $.Deferred();
          fetchPartyDetails(partyID, fetchPartyDetailsDeferred);

          return fetchPartyDetailsDeferred;
        },
        fetchProduct: function(productID) {
          fetchProductDeferred = $.Deferred();
          fetchProduct(productID, fetchProductDeferred);

          return fetchProductDeferred;
        },
        fetchGuranteeType: function() {
          fetchGuranteeTypeDeferred = $.Deferred();
          fetchGuranteeType(fetchGuranteeTypeDeferred);

          return fetchGuranteeTypeDeferred;
        },
        fetchBeniCountry: function() {
          fetchBeniCountryDeferred = $.Deferred();
          fetchBeniCountry(fetchBeniCountryDeferred);

          return fetchBeniCountryDeferred;
        },
        fetchBranch: function() {
          fetchBranchDeferred = $.Deferred();
          fetchBranch(fetchBranchDeferred);

          return fetchBranchDeferred;
        },
        getAccountDetail: function(accountId) {
          getAccountDetailDeferred = $.Deferred();
          getAccountDetail(accountId, getAccountDetailDeferred);

          return getAccountDetailDeferred;
        },
        getBankDetailsBIC: function(code) {
          getBankDetailsBICDeferred = $.Deferred();
          getBankDetailsBIC(code, getBankDetailsBICDeferred);

          return getBankDetailsBICDeferred;
        },
        deleteGuarantee: function(guaranteeId) {
          deleteGuaranteeDeferred = $.Deferred();
          deleteGuarantee(guaranteeId, deleteGuaranteeDeferred);

          return deleteGuaranteeDeferred;
        }
      };
    };

  return new ReviewGuaranteeModel();
});