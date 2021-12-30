define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ViewBillDetailsModel = function() {
    const baseService = BaseService.getInstance();
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
    let getAdviceDetailsDeferred;
    const getAdviceDetails = function(billId, adviceId, deferred) {
      const options = {
          url: "bills/{billId}/advices/{adviceId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          billId: billId,
          adviceId: adviceId
        };

      baseService.fetch(options, params);
    };
    let getSwiftDetailsDeferred;
    const getSwiftDetails = function(billId, swiftId, deferred) {
      const options = {
          url: "bills/{billId}/swiftMessages/{swiftId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          billId: billId,
          swiftId: swiftId
        };

      baseService.fetch(options, params);
    };
    let fetchAdvicePDFDeferred;
    const fetchAdvicePDF = function(billId, adviceId) {
      const options = {
        url: "bills/" + billId + "/advices/" + adviceId + "?media=application/pdf"
      };

      baseService.downloadFile(options);
    };
    let fetchSwiftPDFDeferred;
    const fetchSwiftPDF = function(billId, swiftId) {
      const options = {
        url: "bills/" + billId + "/swiftMessages/" + swiftId + "?media=application/pdf"
      };

      baseService.downloadFile(options);
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

    return {
      getAdviceDetails: function(billId, adviceId) {
        getAdviceDetailsDeferred = $.Deferred();
        getAdviceDetails(billId, adviceId, getAdviceDetailsDeferred);

        return getAdviceDetailsDeferred;
      },
      getSwiftDetails: function(billId, swiftId) {
        getSwiftDetailsDeferred = $.Deferred();
        getSwiftDetails(billId, swiftId, getSwiftDetailsDeferred);

        return getSwiftDetailsDeferred;
      },
      fetchAdvicePDF: function(billId, adviceId) {
        fetchAdvicePDFDeferred = $.Deferred();
        fetchAdvicePDF(billId, adviceId, fetchAdvicePDFDeferred);

        return fetchAdvicePDFDeferred;
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);

        return getBankDetailsBICDeferred;
      },
      fetchSwiftPDF: function(billId, swiftId) {
        fetchSwiftPDFDeferred = $.Deferred();
        fetchSwiftPDF(billId, swiftId, fetchSwiftPDFDeferred);

        return fetchSwiftPDFDeferred;
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
      fetchIncoterm: function(q) {
        fetchIncotermDeferred = $.Deferred();
        fetchIncoterm(q, fetchIncotermDeferred);

        return fetchIncotermDeferred;
      }
    };
  };

  return new ViewBillDetailsModel();
});