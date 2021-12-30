define(
  ["jquery",
    "baseService"
  ],
  function($, BaseService) {
    "use strict";

    /**
     * CardAddonModel - Model file for Authorized Users for Credit Card product.
     *
     * @return {Object}  Description.
     */
    return function cardAddonModel() {
      /**
       * Let Model - Model for Authorized User object.
       *
       * @param  {Object} modelData - Description.
       * @return {void}           Description.
       */
      const Model = function(modelData) {
          this.addonCard = {
            temp_isActive: false,
            submissionId: "",
            facilityId: "",
            simulationId: "",
            productGroupSerialNumber: "",
            applicantDTO: {
              facilityId: "",
              applicantRelationshipType: "ADDON_CARDHOLDER",
              personalInfo: {
                salutation: modelData ? modelData.applicantDTO.personalInfo.salutation ? modelData.applicantDTO.personalInfo.salutation : "" : "",
                firstName: modelData ? modelData.applicantDTO.personalInfo.firstName ? modelData.applicantDTO.personalInfo.firstName : "" : "",
                middleName: modelData ? modelData.applicantDTO.personalInfo.middleName ? modelData.applicantDTO.personalInfo.middleName : null : null,
                lastName: modelData ? modelData.applicantDTO.personalInfo.lastName ? modelData.applicantDTO.personalInfo.lastName : "" : "",
                birthDate: modelData ? modelData.applicantDTO.personalInfo.birthDate ? modelData.applicantDTO.personalInfo.birthDate : "" : "",
                citizenship: modelData ? modelData.applicantDTO.personalInfo.citizenship ? modelData.applicantDTO.personalInfo.citizenship : "" : "",
                permanentResidence: modelData ? modelData.applicantDTO.personalInfo.permanentResidence ? modelData.applicantDTO.personalInfo.permanentResidence : "" : true,
                residentCountry: modelData ? modelData.applicantDTO.personalInfo.residentCountry ? modelData.applicantDTO.personalInfo.residentCountry : "" : "",
                suffix: modelData ? modelData.applicantDTO.personalInfo.suffix ? modelData.applicantDTO.personalInfo.suffix : null : null
              }
            },
            partyId: {
              value: modelData ? modelData.partyId ? modelData.partyId.value : null : null,
              displayValue: null
            },
            temp_previousAddressRequired: false,
            temp_showPreviousAddress: false,
            temp_maskedSSN: "",
            temp_isResAddressSameAsPrimary: false,
            temp_isAddressSameAsPrimary: "OPTION_NO",
            temp_permanentResident: "OPTION_YES",
            temp_showAddressSwitch: true,
            selectedValues: {
              currentAddress: {},
              previousAddress: {},
              primaryInfo: {}
            },
            partyAddresses: modelData ? modelData.partyAddresses : [{
              type: "RES",
              status: "CURRENT",
              postalAddress: {
                line1: "",
                line2: "",
                city: "",
                state: "",
                country: "US",
                postalCode: ""
              },
              accomodationType: "",
              stayingSince: ""
            }],
            identifications: [{
              type: "SSN",
              id: modelData ? modelData.identifications[0] ? modelData.identifications[0].id : "" : ""
            }],
            addOnCardHolderRequirement: {
              embossName: "",
              creditLimitPercentage: "100",
              userSpecifiedEmbossName: false
            }
          };
        },
        baseService = BaseService.getInstance();
      let fetchSalutationsDeferred;
      /**
       * FetchSalutations - Method to fetch salutations for the applicant.
       *
       * @param  {Object} deferred - Description.
       * @return {void}          Description.
       */
      const fetchSalutations = function(deferred) {
        const options = {
          url: "enumerations/salutation?for=primary",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      };
      let fetchSuffixesDeferred;
      /**
       * FetchSuffixes - Method to fetch suffixes for the applicant.
       *
       * @param  {Object} deferred - Description.
       * @return {void}          Description.
       */
      const fetchSuffixes = function(deferred) {
        const options = {
          url: "enumerations/suffix",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      };
      let fetchCountriesDeferred;
      /**
       * FetchCountries - Method to fetch countries.
       *
       * @param  {Object} deferred - Description.
       * @return {void}          Description.
       */
      const fetchCountries = function(deferred) {
        const options = {
          url: "enumerations/country",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      let updateAddOnCardDetailsDeferred;
      /**
       * UpdateAddOnCardDetails - Method to update or create Authorized user details for credit card product.
       *
       * @param  {Object} submissionId - - - - - - - - - - - - - Description.
       * @param  {Object} payload      Description.
       * @param  {object} deferred     Description.
       * @return {void}              Description.
       */
      const updateAddOnCardDetails = function(submissionId, payload, deferred) {
        const params = {
            submissionId: submissionId
          },
          options = {
            url: "submissions/{submissionId}/creditCardApplications/supplementaryCard",
            data: payload,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };

        if (JSON.parse(payload).partyId && JSON.parse(payload).partyId.value) {
          baseService.update(options, params);
        } else {
          baseService.add(options, params);
        }
      };
      let deleteAddOnCardDetailsDeferred;
      /**
       * DeleteAddOnCardDetails - Method to delete Authorized user details for credit card product.
       *
       * @param  {Object} submissionId - - - - - - - - - - - - - Description.
       * @param  {Object} payload      Description.
       * @param  {object} deferred     Description.
       * @return {void}              Description.
       */
      const deleteAddOnCardDetails = function(submissionId, payload, deferred) {
        const params = {
            submissionId: submissionId
          },
          options = {
            url: "submissions/{submissionId}/creditCardApplications/supplementaryCard",
            data: payload,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };

        baseService.remove(options, params);
      };
      let fetchAddOnCardDetailsDeferred;
      /**
       * FetchAddOnCardDetails - Method to fetch Authorized user details for credit card product.
       *
       * @param  {Object} submissionId - - - - - - - - - - - Description.
       * @param  {Object} facilityId   Description.
       * @param  {object} simulationId Description.
       * @param  {object} offerId      Description.
       * @param  {object} deferred     Description.
       * @return {void}              Description.
       */
      const fetchAddOnCardDetails = function(submissionId, facilityId, simulationId, offerId, deferred) {
        const params = {
            submissionId: submissionId,
            facilityId: facilityId,
            simulationId: simulationId,
            offerId: offerId
          },
          options = {
            url: "submissions/{submissionId}/creditCardApplications/supplementaryCard?offerId={offerId}&facilityId={facilityId}&simulationId={simulationId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };

        baseService.fetch(options, params);
      };
      let fetchStatesDeferred;
      /**
       * FetchStates - Method to fetch states.
       *
       * @param  {Object} country  - - - - - - - - - - - - - - Description.
       * @param  {Object} deferred Description.
       * @return {void}          Description.
       */
      const fetchStates = function(country, deferred) {
        const params = {
            countryCode: country
          },
          options = {
            url: "enumerations/country/{countryCode}/state",
            success: function(data) {
              deferred.resolve(data);
            }
          };

        baseService.fetch(options, params);
      };
      let checkStayingSinceDateDeferred;
      /**
       * CheckStayingSinceDate - Method to check whether previous address is required.
       *
       * @param  {Object} submissionId - - - - - - - - - - - - Description.
       * @param  {Object} applicantId  Description.
       * @param  {object} dateData     Description.
       * @param  {object} deferred     Description.
       * @return {void}              Description.
       */
      const checkStayingSinceDate = function(submissionId, applicantId, dateData, deferred) {
        const params = {
            submissionId: submissionId,
            applicantId: applicantId,
            date: dateData
          },
          options = {
            url: "submissions/{submissionId}/applicants/{applicantId}/validateAddressDate/{date}",
            showMessage: false,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };

        baseService.fetch(options, params);
      };
      let getAccomodationTypeListDeferred;
      /**
       *MEthod to fetch accommodation type list.
       *
       * @param  {Object} deferred - Description.
       * @return {void}          Description.
       */
      const getAccomodationTypeList = function(deferred) {
        const options = {
          url: "enumerations/accomodationType",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      };

      return {
        getNewModel: function(modelData) {
          return new Model(modelData);
        },
        deleteAddOnCardDetails: function(submissionId, payload) {
          deleteAddOnCardDetailsDeferred = $.Deferred();
          deleteAddOnCardDetails(submissionId, payload, deleteAddOnCardDetailsDeferred);

          return deleteAddOnCardDetailsDeferred;
        },
        updateAddOnCardDetails: function(submissionId, payload) {
          updateAddOnCardDetailsDeferred = $.Deferred();
          updateAddOnCardDetails(submissionId, payload, updateAddOnCardDetailsDeferred);

          return updateAddOnCardDetailsDeferred;
        },
        fetchAddOnCardDetails: function(submissionId, facilityId, simulationId, offerId) {
          fetchAddOnCardDetailsDeferred = $.Deferred();
          fetchAddOnCardDetails(submissionId, facilityId, simulationId, offerId, fetchAddOnCardDetailsDeferred);

          return fetchAddOnCardDetailsDeferred;
        },
        fetchSuffixes: function() {
          fetchSuffixesDeferred = $.Deferred();
          fetchSuffixes(fetchSuffixesDeferred);

          return fetchSuffixesDeferred;
        },
        fetchSalutations: function() {
          fetchSalutationsDeferred = $.Deferred();
          fetchSalutations(fetchSalutationsDeferred);

          return fetchSalutationsDeferred;
        },
        fetchCountries: function() {
          fetchCountriesDeferred = $.Deferred();
          fetchCountries(fetchCountriesDeferred);

          return fetchCountriesDeferred;
        },
        getAccomodationTypeList: function() {
          getAccomodationTypeListDeferred = $.Deferred();
          getAccomodationTypeList(getAccomodationTypeListDeferred);

          return getAccomodationTypeListDeferred;
        },
        fetchStates: function(country) {
          fetchStatesDeferred = $.Deferred();
          fetchStates(country, fetchStatesDeferred);

          return fetchStatesDeferred;
        },
        checkStayingSinceDate: function(submissionId, applicantId, dateData) {
          checkStayingSinceDateDeferred = $.Deferred();
          checkStayingSinceDate(submissionId, applicantId, dateData, checkStayingSinceDateDeferred);

          return checkStayingSinceDateDeferred;
        }
      };
    };
  });