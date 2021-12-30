define(["jquery", "baseService"], function ($, BaseService) {
  "use strict";

  const model = function () {
    const baseService = BaseService.getInstance();
    let fetchFacilityListDeferred;
    const getFacilityList = function (liability, branchCode, partyId, currencyCode, fetchFacilityListDeferred) {

      const options = {
        url: "liabilities/{liability}/facilities?partyId=" + partyId + "&branchCode=" + branchCode + "&currencyCode=" + currencyCode,
        success: function (data) {
          fetchFacilityListDeferred.resolve(data);
        },
        error: function (data) {
          fetchFacilityListDeferred.reject(data);
        }
      },
        params = {
          liability: liability
        };

      baseService.fetch(options, params);

    };

    let liabilityDeferred;
    const fetchLiabilityId = function (deferred) {
      const options = {
        url: "liabilities",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };

    return {
      getFacilityList: function (liability, branchCode, partyId, currencyCode) {
        fetchFacilityListDeferred = $.Deferred();
        getFacilityList(liability, branchCode, partyId, currencyCode, fetchFacilityListDeferred);

        return fetchFacilityListDeferred;
      },
      fetchLiabilityId: function () {
        liabilityDeferred = $.Deferred();
        fetchLiabilityId(liabilityDeferred);

        return liabilityDeferred;
      }
    };
  };

  return new model();
});