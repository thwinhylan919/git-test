define([
  "baseService"
], function (BaseService) {
  "use strict";

  const AddressModel = function () {
    const baseService = BaseService.getInstance();

    return {
      fetchCity: function () {
        return baseService.fetch({
          url: "locations/country/all/city"
        });
      },
      fetchBranches: function (city) {
        return baseService.fetch({
          url: "locations/country/all/city/{city}/branchCode"
        }, {
          city: city
        });
      },
      fetchBranchAddress: function (branchCode) {
        return baseService.fetch({
          url: "locations/branches?branchCode={branchCode}"
        }, {
          branchCode: branchCode
        });
      },
      fetchMyAddress: function () {
        return baseService.fetch({
          url: "me/party"
        });
      },
      fetchMyAddressEnumeration: function () {
        return baseService.fetch({
          url: "enumerations/addressType"
        });
      }
    };
  };

  return new AddressModel();
});