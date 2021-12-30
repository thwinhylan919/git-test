define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ReviewAmendLcModel = function() {
    const baseService = BaseService.getInstance(),
      Model = function() {
        this.ExportAmendAcceptanceDetails = {
          customerAcceptanceStatus: null,
          counterPartyName: null,
          newAmount: {
            currency: null,
            amount: null
          }
        };
      };
    let initiateAmendmentDeferred;
    const initiateAmendment = function(letterOfCreditId, model, deferred) {
      const params = {
          letterOfCreditId: letterOfCreditId
        },
        options = {
          url: "letterofcredits/{letterOfCreditId}/amendments",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

      baseService.add(options, params);
    };
    let acceptanceDeferred;
    const exportAmendAcceptance = function(letterOfCreditId, noOfAmendment, model, deferred) {
      const params = {
          letterOfCreditId: letterOfCreditId,
          noOfAmendment: noOfAmendment
        },
        options = {
          url: "letterofcredits/{letterOfCreditId}/amendments/{noOfAmendment}/acceptance",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

      baseService.add(options, params);
    };
    let getImportLCDeferred;
    const getImportLC = function(lcNumber, versionNo, deferred) {
      const options = {
          url: "letterofcredits/{lcNumber}?versionNo=" + versionNo,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          lcNumber: lcNumber
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
    let getAmmendmentDetailsDeferred;
    const getAmendmentDetails = function(letterOfCreditId, amendmentId, deferred) {
      const options = {
          url: "letterofcredits/{letterOfCreditId}/amendments/{amendmentId}?amendStatus=UNCONFIRMED&authStatus=UNAUTHORIZED",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          letterOfCreditId: letterOfCreditId,
          amendmentId: amendmentId
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
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      initiateAmendment: function(letterOfCreditId, model) {
        initiateAmendmentDeferred = $.Deferred();
        initiateAmendment(letterOfCreditId, model, initiateAmendmentDeferred);

        return initiateAmendmentDeferred;
      },
      exportAmendAcceptance: function(letterOfCreditId, noOfAmendment, model) {
        acceptanceDeferred = $.Deferred();
        exportAmendAcceptance(letterOfCreditId, noOfAmendment, model, acceptanceDeferred);

        return acceptanceDeferred;
      },
      getImportLC: function(lcNumber, versionNo) {
        getImportLCDeferred = $.Deferred();
        getImportLC(lcNumber, versionNo, getImportLCDeferred);

        return getImportLCDeferred;
      },
      fetchPartyDetails: function(partyID) {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(partyID, fetchPartyDetailsDeferred);

        return fetchPartyDetailsDeferred;
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
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);

        return getBankDetailsBICDeferred;
      },
      fetchBranchDate: function(code) {
        fetchBranchDateDeferred = $.Deferred();
        fetchBranchDate(code, fetchBranchDateDeferred);

        return fetchBranchDateDeferred;
      },
      getAmendmentDetails: function(letterOfCreditId, amendmentId) {
        getAmmendmentDetailsDeferred = $.Deferred();
        getAmendmentDetails(letterOfCreditId, amendmentId, getAmmendmentDetailsDeferred);

        return getAmmendmentDetailsDeferred;
      },
      fetchIncoterm: function(q) {
        fetchIncotermDeferred = $.Deferred();
        fetchIncoterm(q, fetchIncotermDeferred);

        return fetchIncotermDeferred;
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

  return new ReviewAmendLcModel();
});