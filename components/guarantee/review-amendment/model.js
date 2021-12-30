define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const baseService = BaseService.getInstance(),
    ReviewAmendmentModel = function() {
      const Model = function() {
        this.AmendAcceptanceDetails = {
          customerAcceptanceStatus: null,
          counterPartyName: null,
          newAmount: {
            currency: null,
            amount: null
          }
        };
      };
      let getOutwardBGDeferred;
      const getOutwardBG = function(bankGuaranteeId, versionNo, deferred) {
        const options = {
            url: "bankguarantees/{bankGuaranteeId}?versionNo=" + versionNo,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            bankGuaranteeId: bankGuaranteeId
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
      let initiateAmendmentDeferred;
      const initiateAmendment = function(bankGuaranteeId, model, deferred) {
        const params = {
            bankGuaranteeId: bankGuaranteeId
          },
          options = {
            url: "bankguarantees/{bankGuaranteeId}/amendments",
            data: model,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            }
          };

        baseService.add(options, params);
      };
      let acceptanceDeferred;
    const amendAcceptance = function(bankGuaranteeId, noOfAmendment, model, deferred) {
      const params = {
          bankGuaranteeId: bankGuaranteeId,
          noOfAmendment: noOfAmendment
        },
        options = {
          url: "bankguarantees/{bankGuaranteeId}/amendments/{noOfAmendment}/acceptance",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

      baseService.add(options, params);
    };

      return {
        getNewModel: function(modelData) {
        return new Model(modelData);
        },
        getOutwardBG: function(bankGuaranteeId, versionNo) {
          getOutwardBGDeferred = $.Deferred();
          getOutwardBG(bankGuaranteeId, versionNo, getOutwardBGDeferred);

          return getOutwardBGDeferred;
        },
        fetchPartyDetails: function(partyID) {
          fetchPartyDetailsDeferred = $.Deferred();
          fetchPartyDetails(partyID, fetchPartyDetailsDeferred);

          return fetchPartyDetailsDeferred;
        },
        initiateAmendment: function(bankGuaranteeId, model) {
          initiateAmendmentDeferred = $.Deferred();
          initiateAmendment(bankGuaranteeId, model, initiateAmendmentDeferred);

          return initiateAmendmentDeferred;
        },
        fetchBeniCountry: function() {
          fetchBeniCountryDeferred = $.Deferred();
          fetchBeniCountry(fetchBeniCountryDeferred);

          return fetchBeniCountryDeferred;
        },
        fetchBranchDate: function(code) {
          fetchBranchDateDeferred = $.Deferred();
          fetchBranchDate(code, fetchBranchDateDeferred);

          return fetchBranchDateDeferred;
        },
        fetchGuranteeType: function() {
          fetchGuranteeTypeDeferred = $.Deferred();
          fetchGuranteeType(fetchGuranteeTypeDeferred);

          return fetchGuranteeTypeDeferred;
        },
        fetchBranch: function() {
          fetchBranchDeferred = $.Deferred();
          fetchBranch(fetchBranchDeferred);

          return fetchBranchDeferred;
        },
        amendAcceptance: function(bankGuaranteeId, noOfAmendment, model) {
          acceptanceDeferred = $.Deferred();
          amendAcceptance(bankGuaranteeId, noOfAmendment, model, acceptanceDeferred);

          return acceptanceDeferred;
        },
        getBankDetailsBIC: function(code) {
          getBankDetailsBICDeferred = $.Deferred();
          getBankDetailsBIC(code, getBankDetailsBICDeferred);

          return getBankDetailsBICDeferred;
        }
      };
    };

  return new ReviewAmendmentModel();
});