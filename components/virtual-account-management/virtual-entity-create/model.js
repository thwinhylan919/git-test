define([
  "baseService"
], function (BaseService) {
  "use strict";

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
       * Private method to add the new property for the given virtual entity details.
       *
       * @function getEntityList
       * @memberOf EntityModel
       * @param {string} q - The generic filtering parameter.
       * @returns {void}
       * @private
       */
      getEntityList = function (q) {
        return baseService.fetch({
          url: "virtualEntities?query={q}"
        }, {
          q: q
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
       * Private method to check availability of given virtual entity identifier.
       *
       * @function entityAvailability
       * @memberOf VirtualEntityModel
       * @returns {void}
       * @private
       */
      entityAvailability = function () {
        return baseService.fetch({
          url: "virtualEntities/entityBankParameters"
        });
      },
      /**
       * Private method to create the virtual entity payload. This
       * method will resolve a payload, which can be returned
       * from calling function to the parent.
       *
       * @function virtualEntityPayload
       * @memberOf VirtualEntityModel
       * @private
       */
      virtualEntityPayload = function () {
        return {
          virtualEntityName: null,
          virtualEntityId: null,
          entityType: null,
          address: {
            line1: null,
            line2: null,
            country: null,
            zipCode: null,
            city: "city"
          },
          mailingAddress: {
            line1: null,
            line2: null,
            country: null,
            zipCode: null,
            city: "city"

          },
          corporateDetails: {
            incorporationDate: null,
            countryOfIncorporation: null,
            workNumber: [{
              areaCode: null,
              number: null
            }, {
              areaCode: null,
              number: null
            }],
            mobileNo: {
              areaCode: null,
              number: null
            },
            email: null,
            preferredModeOfCommunication: null,
            type: null
          },
          individualDetails: {
            preferredModeOfCommunication: null,
            email: null,
            workNumber: {
              areaCode: null,
              number: null
            },
            phoneNo: {
              areaCode: null,
              number: null
            },
            mobileNo: {
              areaCode: null,
              number: null
            },
            identificationNumber: null,
            nationality: null,
            gender: null,
            dateOfBirth: null,
            lastName: null,
            middleName: null,
            firstName: null
          },
          lastKycDate: null,
          kycReference: null,
          kycStatus: "P",
          taxIdentifier: null,
          identificationNumber: null,
          identificationType: null,
          statementPreferences: {
            statementType: null,
            frequency: null,
            dueOn: null
          }
        };
      };

    return {
      fetchCountryList: function (limit, offset) {
        return fetchCountryList(limit, offset);
      },
      fetchGenderList: function () {
        return fetchGenderList();
      },
      getEntityList: getEntityList,
      getRealEntityAddress: function () {
        return getRealEntityAddress();
      },
      entityAvailability: function () {
        return entityAvailability();
      },
      getNewModel: function () {
        return virtualEntityPayload();
      }
    };
  };

  return new VirtualEntityModel();
});