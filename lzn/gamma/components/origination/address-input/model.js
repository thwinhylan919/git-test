/*jslint plusplus: true newcap: false*/
define([
  "baseService"
], function(BaseService) {
  "use strict";

  const AddressService = function() {
    /* Extending predefined baseService to get ajax functions. */
    let params;
    const baseService = BaseService.getInstance();

    /*
     * This function will fetch and return list of countries.
     *
     * @param function successHandler function
     */
    this.fetchCountryList = function(successHandler) {
      const options = {
        url: "enumerations/country",
        success: function(data) {
          successHandler(data);
        }
      };

      baseService.fetch(options, params);
    };

    /*
     * This function will fetch and return list of states.
     *
     * @param function successHandler function
     */
    this.fetchStates = function(country, successHandler) {
      params = {
        country: country
      };

      const options = {
        url: "enumerations/country/{country}/state",
        success: function(data) {
          successHandler(data);
        }
      };

      baseService.fetch(options, params);
    };
  };

  return new AddressService();
});