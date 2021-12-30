define([
  "baseService"
], function (BaseService) {
  "use strict";

  /**
   * Main file for virtual entity management Model. This file contains the model definition
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
  const EntitySummaryModel = function () {
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    const baseService = BaseService.getInstance(),
      /**
       * Private method to read virtual entity
       *
       * @function readEntity
       * @memberOf EntityModel
       * @param {string} virtualEntityId - Virtual entity Id.
       * @returns {void}
       * @private
       */
      readEntity = function (virtualEntityId) {
        return baseService.fetchWidget({
          url: "virtualEntities/{virtualEntityId}",
          mockedUrl: "framework/json/design-dashboard/virtual-account-management/virtual-entity-summary/virtual-entities.json"
        }, {
          virtualEntityId: virtualEntityId
        });
      },
      /**
       * Private method to fetch the real entity address.
       *
       * @function getRealEntityAddress
       * @memberOf EntityModel
       * @returns {void}
       * @private
       */
      getRealEntityAddress = function () {
        return baseService.fetchWidget({
          url: "me/party",
          mockedUrl: "framework/json/design-dashboard/virtual-account-management/party.json"
        });
      },
      /**
       * Private method to list virtual entities
       *
       * @function fetchVirtualEntities
       * @memberOf EntitySummaryModel
       * @param {string} q - The generic filtering parameter.
       * @param {string} sortParam - Sorting parameter to sort query param results.
       * @param {string} count - Parameter to restrict count of query param results.
       * @returns {void}
       * @private
       */
      fetchVirtualEntities = function (q, sortParam, count) {
        return baseService.fetchWidget({
          url: "virtualEntities?query={q}&sortBy={sortParam}&maxRecords={count}"
        }, {
          q: q,
          sortParam: sortParam,
          count: count
        });
      };

    return {
      readEntity: readEntity,
      getRealEntityAddress: getRealEntityAddress,
      fetchVirtualEntities: fetchVirtualEntities
    };
  };

  return new EntitySummaryModel();
});