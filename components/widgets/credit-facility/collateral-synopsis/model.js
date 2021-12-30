define(["jquery", "baseService"], function($, BaseService) {
  "use strict";

  const CollateralModel = function() {
    const baseService = BaseService.getInstance();
    let fetchCollateralListDeferred;
    const fetchCollateralList = function(liability, branchCode, partyId ,currencyCode,deferred) {
      const options = {
        url: "liabilities/{liability}/collaterals?partyId=" + partyId+"&branchCode=" + branchCode+"&currencyCode=" + currencyCode,
        mockedUrl: "framework/json/design-dashboard/credit-facility/collateral.json",
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
      fetchCollateralList: function(liability, branchCode, partyId ,currencyCode) {
        fetchCollateralListDeferred = $.Deferred();
        fetchCollateralList(liability, branchCode, partyId ,currencyCode,fetchCollateralListDeferred);

        return fetchCollateralListDeferred;
      },
      fetchLiabilityId: function () {
        liabilityDeferred = $.Deferred();
        fetchLiabilityId(liabilityDeferred);

        return liabilityDeferred;
    }

    };
  };

  return new CollateralModel();
});
