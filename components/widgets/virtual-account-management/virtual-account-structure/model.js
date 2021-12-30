define([
  "baseService"
], function (BaseService) {
  "use strict";

  /**
   * Main file for virtaul account management Model. This file contains the model definition
   * for list of properties fetched from the host through the pass through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch the list of properties:
   *          <ul>
   *              <li>[init()]{@link VirtualAccountStructureModel.init}</li>.
   *
   *
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~VirtualAccountStructureModel
   * @class VirtualAccountStructureModel
   */
  const VirtualAccountStructureModel = function () {
    const baseService = BaseService.getInstance(),
      /**
       * Private method to fetch the list of virtual structures based on search. This
       * method will resolve passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function fetchVirtualStructureList
       * @memberOf VirtualAccountStructureModel
       * @param {string} realCustomerNo - Real customer number.
       * @param {string} structureCode - Structure code for virtual structure.
       * @param {string} structureDesc - Structure Description for virtual structure.
       * @param {string} limit - Limit for virtual structure.
       * @param {string} offset - Offset for virtual structure.
       * @returns {void}
       * @private
       */
      fetchVirtualStructureList = function (query,count) {
        const options = {
            url: "virtualAccountStructures?q={query}&count={count}",
            mockedUrl: "framework/json/design-dashboard/virtual-account-management/account-balances/virtual-account-structure.json"
          },
          params = {
            query: query,
            count: count
          };

        return baseService.fetchWidget(options, params);
      },
      /**
       * Private method to fetch the list of virtual structures based on search. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function viewStructure
       * @memberOf VirtualAccountStructureModel
       * @param {string} id - Id for individual structure data.
       * @param {string} realCustomerNo - Real account number for virtual structure.
       * @returns {void}
       * @private
       */
      viewStructure = function (id) {
        const options = {
            url: "virtualAccountStructures/{id}?levelNo=1",
            mockedUrl: "framework/json/design-dashboard/virtual-account-management/structure-details.json"
          },
          params = {
            id: id
          };

        return baseService.fetchWidget(options, params);
      };

    return {
      fetchVirtualStructureList: function (query, count) {
        return fetchVirtualStructureList(query, count);
      },
      viewStructure: function (id) {
        return viewStructure(id);
      }
    };
  };

  return new VirtualAccountStructureModel();
});