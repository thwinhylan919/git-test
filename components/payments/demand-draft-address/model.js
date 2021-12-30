/**
 * Model for demand-draft-address
 * @param1 {object} jquery jquery instance
 * @param2 {object} BaseService base service instance for server communication
 * @return {object} CourierAddressModel Modal instance
 */
define([
    "baseService"
], function(BaseService) {
  "use strict";

  const CourierAddressModel = function() {
    const baseService = BaseService.getInstance();

    return {
      /**
       * GetMyAdressDetails - fetches address fot type work,residence and postal.
       *
       * @returns {Promise}  Returns the promise object.
       */
      getMyAdressDetails: function() {
        return baseService.fetch({
          url: "me/party"
        });
      },
      /**
       * GetMyAdressEnum - fetches addess enumeration.
       *
       * @returns {Promise}  Returns the promise object.
       */
      getMyAdressEnum: function() {
        return baseService.fetch({
          url: "enumerations/addressType"
        });
      },
      /**
       * GetCityList- fetches list of cities.
       *
       * @param {string} countryCode - Country Code to be passed to fetches list of cities.
       * @returns {Promise}  Returns the promise object.
       */
      getCityList: function(countryCode) {
        return baseService.fetch({
          url: "locations/country/{countryCode}/city"
        },{
          countryCode :countryCode
        });
      },
      /**
       * GetCountries - fetches list of countries.
       *
       * @returns {Promise}  Returns the promise object.
       */
      getCountries: function() {
        return baseService.fetch({
          url: "enumerations/country"
        });
      },
      /**
       * GetBranches- fetches list of branches for particular city.
       *
       * @param {string} countryname - Country name to be passed to fetch branch.
       * @param {string} city - City to be passed to fetch branch.
       * @returns {Promise}  Returns the promise object.
       */
      getBranches: function(countryname, city) {
        return baseService.fetch({
          url: "locations/country/{countryname}/city/{city}/branchCode"
        },{
          countryname :countryname,
          city :city
        });
      },
      /**
       * GetBranchAddress - fetches product list.
       *
       * @param {string} branchCode - Branch code to frtch branch address.
       * @returns {Promise}  Returns the promise object.
       */
      getBranchAddress: function(branchCode) {
        return baseService.fetch({
          url: "locations/branches?branchCode={branchCode}"
        },{
          branchCode :branchCode
        });
      }
    };
  };

  return new CourierAddressModel();
});