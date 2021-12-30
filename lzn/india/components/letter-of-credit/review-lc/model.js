define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    ReviewTradeFinanceModel = function() {
      let initiateLCDeferred;
      const initiateLC = function(model, deferred) {
        const options = {
          url: "letterofcredits",
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
      let fetchProductDeferred;
      const fetchProduct = function(productID, deferred) {
        const params = {
            productId: productID
          },
          options = {
            url: "products/letterofcredits/{productId}",
            success: function(data) {
              deferred.resolve(data);
            }
          };

        baseService.fetch(options, params);
      };
      let fetchIncotermDeferred;
      const fetchIncoterm = function(code, deferred) {
        const options = {
          url: "letterofcredits/incoterms?code=" + code,
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
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

      return {
        initiateLC: function(model) {
          initiateLCDeferred = $.Deferred();
          initiateLC(model, initiateLCDeferred);

          return initiateLCDeferred;
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
        fetchIncoterm: function(code) {
          fetchIncotermDeferred = $.Deferred();
          fetchIncoterm(code, fetchIncotermDeferred);

          return fetchIncotermDeferred;
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
        }
      };
    };

  return new ReviewTradeFinanceModel();
});