define([
  "baseService"
], function (BaseService) {
  "use strict";

  /**
   * Main file for Entity Model. This file contains the model definition
   * for list of scales fetched from the server from table digx_fd_scale  through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch the list of properties:
   *          <ul>
   *              <li>[init()]{@link VirtualEntityModel.init}</li>.
   *
   *              <li>[getProperty()]{@link VirtualEntityModel.createVirtualEntity}</li>
   *
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~EntityModel
   * @class EntityModel
   */
  const VirtualEntityModel = function () {

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
      fetchCountryList = function (limit, offset) {
        return baseService.fetch({
          url: "countries?limit={limit}&offset={offset}",
          apiType: "extended"
        }, {
          limit: limit,
          offset: offset
        });
      },
      /**
       * Private method to add the new property for the given virtual entity details.
       *
       * @function createVirtualEntity
       * @memberOf VirtualEntityModel
       * @param {Object} payload - A data for create a virtual entity.
       * @returns {void}
       * @private
       */
      createVirtualEntity = function (payload) {
        return baseService.add({
          url: "virtualEntities",
          data: payload
        });
      },
      /**
       * Private method to close the virtual entity based on virtual entity identifier.
       *
       * @function deleteVirtualEntity
       * @memberOf VirtualEntityModel
       * @param {string} virtualEntityId - Virtual entity identifier.
       * @param {modNo} modNo - Additional parameter for virtual entity close.
       * @returns {void}
       * @private
       */
      deleteVirtualEntity = function (virtualEntityId) {
        return baseService.remove({
          url: "virtualEntities/{virtualEntityId}"
        }, {
          virtualEntityId: virtualEntityId
        });
      },
      /**
       * Private method to update the new property for the given virtual entity details.
       *
       * @function updateVirtualEntity
       * @memberOf VirtualEntityModel
       * @param {Object} payload - A data object to update a virtual entity.
       * @param {string} virtualEntityId - Virtual entity identifier.
       * @returns {void}
       * @private
       */
      updateVirtualEntity = function (payload, virtualEntityId) {
        return baseService.update({
          url: "virtualEntities/{virtualEntityId}",
          data: payload
        }, {
          virtualEntityId: virtualEntityId
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
      fetchGenderList = function () {
        return baseService.fetch({
          url: "enumerations/gender"
        });
      },
      /**
       * Private method to fetch the real entity address.
       *
       * @function getRealEntityAddress
       * @memberOf VirtualEntityModel
       * @returns {void}
       * @private
       */
      getRealEntityAddress = function () {
        return baseService.fetch({
          url: "me/party?"
        });
      },
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
      fetchIdentificationTypeList = function () {
        return baseService.fetch({
          url: "identificationTypes",
          apiType: "extended"
        });
      },
      /**
       * Private method to read virtual entity
       *
       * @function readEntity
       * @memberOf VirtualEntityModel
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
       * Private method to create the virtual entity view model. This
       * method will resolve a view model, which can be returned
       * from calling function to the parent.
       *
       * @function virtualEntityViewModel
       * @memberOf VirtualEntityModel
       * @private
       */
      virtualEntityViewModel = function () {
        return {
          kycStatus: "P",
          lastKycDate: null,
          taxIdentifier: null,
          kycReference: null,
          identificationNumber: null,
          identificationType: null,
          creationDate: null,
          virtualEntityName: null,
          virtualEntityId: null,
          status: null,
          address: {
            line1: null,
            line2: null,
            country: null,
            zipCode: null
          },
          mailingAddress: {
            line1: null,
            line2: null,
            country: null,
            zipCode: null
          },
          entityType: null,
          corporateDetails: {
            incorporationDate: null,
            countryOfIncorporation: null,
            type: null,
            preferredModeOfCommunication: null,
            email: null,
            workNumber: [{
                areaCode: null,
                number: null
              },
              {
                areaCode: null,
                number: null
              }
            ],
            mobileNo: {
              areaCode: null,
              number: null
            }
          },
          individualDetails: {
            firstName: null,
            lastName: null,
            email: null,
            workNumber: {
              areaCode: null,
              number: null
            },
            mobileNo: {
              areaCode: null,
              number: null
            },
            nationality: null,
            identificationNumber: null,
            gender: null,
            preferredModeOfCommunication: null,
            dateOfBirth: null,
            phoneNo: {
              areaCode: null,
              number: null
            }
          },
          statementPreferences: {
            statementType: null,
            frequency: null,
            dueOn: null
          }

        };
      };

    return {
      createVirtualEntity: createVirtualEntity,
      updateVirtualEntity: updateVirtualEntity,
      deleteVirtualEntity: deleteVirtualEntity,
      fetchCountryList: fetchCountryList,
      fetchGenderList: fetchGenderList,
      getRealEntityAddress: getRealEntityAddress,
      fetchIdentificationTypeList: fetchIdentificationTypeList,
      virtualEntityViewModel: virtualEntityViewModel,
      readEntity: readEntity
    };
  };

  return new VirtualEntityModel();
});