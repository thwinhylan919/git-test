define([
    "baseService"
  ], function (BaseService) {
    "use strict";

    /**
     * Main file for Virtual Account Model. This file contains the model definition
     * for list of scales fetched from the server through REST call.<br/><br/>
     * The injected Model Class will have below properties:
     * <ul>
     *      <li>Service abstractions to fetch the list of properties:
     *          <ul>
     *
     *              <li>[getProperty()]{@link VirtualStructureModel.viewStructure}</li>
     *
     *          </ul>
     *      </li>
     * </ul>
     *
     * @namespace Categories~VirtualStructureModel
     * @class VirtualStructureModel
     */
    const VirtualStructureModel = function () {
      const baseService = BaseService.getInstance(),
        /**
         * Private method to fetch the list of virtual structures based on search. This
         * method will resolve a passed deferred object, which can be returned
         * from calling function to the parent.
         *
         * @function viewStructure
         * @memberOf VirtualStructureModel
         * @param {string} strcutureCode - main account for individual structure data.
         * @param {string} realCustomerNo - Real account number for virtual structure.
         * @returns {void}
         * @private
         */
       viewStructure = function (strcutureCode) {
          return baseService.fetch({
            url: "virtualAccountStructures/{strcutureCode}"
          }, {
            strcutureCode: strcutureCode
            });
        };

      return {
        viewStructure: function (strcutureCode) {
          return viewStructure(strcutureCode);
        }
      };
    };

    return new VirtualStructureModel();
  });
