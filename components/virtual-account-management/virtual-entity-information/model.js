define([
  "baseService"
], function(BaseService) {
  "use strict";

  /**
   * Main file for virtaul entity management Model. This file contains the model definition
   * for list of properties fetched from the host through the pass through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch the list of properties:
   *          <ul>
   *              <li>[init()]{@link VirtualEntityModel.init}</li>.
   *
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~VirtualEntityModel
   * @class VirtualEntityModel
   */
  const VirtualEntityModel = function() {
    const baseService = BaseService.getInstance(),
      /**
       * Private method to fetch the list of countries.
       *
       * @function fetchCountryList
       * @memberOf VirtualEntityModel
       * @param {string} limit - Additional param.
       * @param {string} offset - Additional param.
       * @returns {void}
       * @private
       */
      fetchCountryList = function(limit, offset) {
        return baseService.fetch({
          url: "countries?limit={limit}&offset={offset}",
          apiType: "extended"
        }, {
          limit: limit,
          offset: offset
        });
      },
      /**
       * Private method to fetch the list of gender.
       *
       * @function fetchGenderList
       * @memberOf VirtualEntityModel
       * @returns {void}
       * @private
       */
      fetchGenderList = function() {
        return baseService.fetch({
          url: "enumerations/gender"
        });
      };

    return {
      fetchCountryList: function(limit, offset) {
        return fetchCountryList(limit, offset);
      },
      fetchGenderList: function() {
        return fetchGenderList();
      }
    };
  };

  return new VirtualEntityModel();
});
