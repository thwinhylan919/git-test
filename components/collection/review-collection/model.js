define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    ReviewCollectionModel = function() {
      let initiateCollectionDeferred;
      const initiateCollection = function(model, deferred) {
        const options = {
          url: "bills",
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
      let fetchIncotermDeferred;
      const fetchIncoterm = function(q, deferred) {
        const options = {
          url: "tradeIncoterms?q=" + q,
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let fetchProductDetailsDeferred;
      const fetchProductDetails = function(productID, deferred) {
        const params = {
            productId: productID
          },
          options = {
            url: "products/bills/{productId}",
            success: function(data) {
              deferred.resolve(data);
            }
          };

        baseService.fetch(options, params);
      };
      let getProductsDeferred;
      const getProductsList = function(payload, deferred) {
        const options = {
          url: "products/bills?paymentType=" + payload.paymentType() + "&lcLinkage=" + payload.lcLinked() + "&docAttached=" + payload.docAttached(),
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      };
      let fetchDraweeCountryDeferred;
      const fetchDraweeCountry = function(deferred) {
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
      let getBaseDateDescriptionDefered;
      const getBaseDateDescrption = function(deferred) {
        const options = {
          url: "bills/baseDateDescriptions",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };

      return {
        initiateCollection: function(model) {
          initiateCollectionDeferred = $.Deferred();
          initiateCollection(model, initiateCollectionDeferred);

          return initiateCollectionDeferred;
        },
        fetchPartyDetails: function(partyID) {
          fetchPartyDetailsDeferred = $.Deferred();
          fetchPartyDetails(partyID, fetchPartyDetailsDeferred);

          return fetchPartyDetailsDeferred;
        },
        getProductsList: function(payload) {
          getProductsDeferred = $.Deferred();
          getProductsList(payload, getProductsDeferred);

          return getProductsDeferred;
        },
        fetchIncoterm: function(q) {
          fetchIncotermDeferred = $.Deferred();
          fetchIncoterm(q, fetchIncotermDeferred);

          return fetchIncotermDeferred;
        },
        fetchProductDetails: function(productID) {
          fetchProductDetailsDeferred = $.Deferred();
          fetchProductDetails(productID, fetchProductDetailsDeferred);

          return fetchProductDetailsDeferred;
        },
        fetchDraweeCountry: function() {
          fetchDraweeCountryDeferred = $.Deferred();
          fetchDraweeCountry(fetchDraweeCountryDeferred);

          return fetchDraweeCountryDeferred;
        },
        fetchBranch: function() {
          fetchBranchDeferred = $.Deferred();
          fetchBranch(fetchBranchDeferred);

          return fetchBranchDeferred;
        },
        getBankDetailsBIC: function(code) {
          getBankDetailsBICDeferred = $.Deferred();
          getBankDetailsBIC(code, getBankDetailsBICDeferred);

          return getBankDetailsBICDeferred;
        },
        getBaseDateDescrption: function() {
          getBaseDateDescriptionDefered = $.Deferred();
          getBaseDateDescrption(getBaseDateDescriptionDefered);

          return getBaseDateDescriptionDefered;
        }
      };
    };

  return new ReviewCollectionModel();
});