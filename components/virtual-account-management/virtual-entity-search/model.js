define([
  "baseService"
], function (BaseService) {
  "use strict";

  const EntityModel = function () {
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
        return baseService.fetch({
          url: "virtualEntities/{virtualEntityId}"
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
        return baseService.fetch({
          url: "me/party"
        });
      },

      /**
       * Private method to add the new property for the given virtual entity details.
       *
       * @function getEntityList
       * @memberOf EntityModel
       * @param {string} q - The generic filtering parameter.
       * @param {string} sortParam - Sorting parameter to sort query param results.
       * @param {string} count - Parameter to restrict count of query param results.
       * @returns {void}
       * @private
       */
      getEntityList = function (q, sortParam, count) {
        return baseService.fetch({
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
      getEntityList: getEntityList
    };
  };

  return new EntityModel();
});