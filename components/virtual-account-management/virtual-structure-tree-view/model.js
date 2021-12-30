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
     *              <li>[init()]{@link VirtualStructureModel.deleteVirtualStructure}</li>.
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
         * Private method to close the virtual Structure based on virtualMainAcc. This
         * method will resolve a passed deferred object, which can be returned
         * from calling function to the parent.
         *
         * @function deleteVirtualStructure
         * @memberOf VirtualStructureModel
         * @param {string} structureCode - virtualMainAcc for virtul Structure.
         * @returns {void}
         * @private
         */
        deleteVirtualStructure = function (structureCode) {
          return baseService.remove({
             url: "virtualAccountStructures/{structureCode}"
          }, {
            structureCode: structureCode
            });
        },
        /**
         * Private method to fetch the list of virtual structures based on search. This
         * method will resolve a passed deferred object, which can be returned
         * from calling function to the parent.
         *
         * @function viewStructure
         * @memberOf VirtualStructureModel
         * @param {string} structureCode - main account for individual structure data.
         * @returns {void}
         * @private
         */
       viewStructure = function (structureCode) {
          return baseService.fetch({
            url: "virtualAccountStructures/{structureCode}"
          }, {
            structureCode: structureCode
            });
        };

      return {
        deleteVirtualStructure: function (structureCode) {
          return deleteVirtualStructure(structureCode);
        },
        viewStructure: function (structureCode) {
          return viewStructure(structureCode);
        }
      };
    };

    return new VirtualStructureModel();
  });
