define(["jquery", "baseService"], function($, BaseService) {
  "use strict";

  const FacilityModel = function() {
    const baseService = BaseService.getInstance();
    let fetchFacilityListDeferred;
    const fetchFacilityList = function(liability, branchCode, partyId, currencyCode,deferred) {
      const options = {
        url: "liabilities/{liability}/facilities?partyId=" + partyId + "&branchCode=" + branchCode + "&currencyCode=" + currencyCode,
        mockedUrl: "framework/json/design-dashboard/credit-facility/facility.json",
        success: function(data) {
          deferred.resolve(data);
        }
      },
      params = {
        liability: liability
      };

      baseService.fetchWidget(options,params);
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
      fetchFacilityList: function(liability, branchCode, partyId, currencyCode) {
        fetchFacilityListDeferred = $.Deferred();
        fetchFacilityList(liability, branchCode, partyId, currencyCode,fetchFacilityListDeferred);

        return fetchFacilityListDeferred;
      },
      fetchLiabilityId: function () {
        liabilityDeferred = $.Deferred();
        fetchLiabilityId(liabilityDeferred);

        return liabilityDeferred;
      }
    };
  };

  return new FacilityModel();
});