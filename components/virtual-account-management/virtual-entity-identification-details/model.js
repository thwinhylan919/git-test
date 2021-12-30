define([
  "baseService"
], function(BaseService) {
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
  const VirtualEntityModel = function() {
    const baseService = BaseService.getInstance(),
      /**
       * Private method to fetch the list of identification types. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function fetchIdentificationTypeList
       * @memberOf VirtualEntityModel
       * @returns {void}
       * @private
       */
      fetchIdentificationTypeList = function() {
        return baseService.fetch({
          url: "identificationTypes",
          apiType: "extended"
        });
      };

    return {
      fetchIdentificationTypeList: function() {
        return fetchIdentificationTypeList();
      }
    };
  };

  return new VirtualEntityModel();
});
