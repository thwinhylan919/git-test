define(
  ["jquery",
    "baseService"
  ],
  function($, BaseService) {
    "use strict";

    /**
     * Model file for Authorized Users for Credit Card product.
     *
     * @returns {Function} CardAddonModel - model for card addon.
     */
    return function cardAddonModel() {
      /**
       * Model for Authorized User object.
       *
       * @param {Object} modelData - Model data to initialize.
       * @returns {void}
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
                residentCountry: modelData ? modelData.applicantDTO.personalInfo.residentCountry ? modelData.applicantDTO.personalInfo.residentCountry : "" : ""
              }
            },
            partyId: {
              value: modelData ? modelData.partyId ? modelData.partyId.value : null : null,
              displayValue: null
            },
            temp_previousAddressRequired: false,
            temp_showPreviousAddress: false,
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
                country: "",
                postalCode: ""
              },
              accomodationType: "",
              stayingSince: ""
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
       * Method to fetch salutations for the applicant.
       *
       * @param {Object} deferred - Deferred object.
       * @returns {void}
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
      let fetchCountriesDeferred;
      /**
       * Method to fetch countries.
       *
       * @param {Object} deferred - Deferred object.
       * @returns {void}
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
       * Method to update or create Authorized user details for credit card product.
       *
       * @param {Object} submissionId - Submission id.
       * @param {Object} payload - Payload of the request.
       * @param {Object} deferred - Deferred object.
       * @returns {void}
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
       * Method to delete Authorized user details for credit card product.
       *
       * @param {Object} submissionId - Submission id.
       * @param {Object} payload - Payload of the request.
       * @param {Object} deferred - Deferred object.
       * @returns {void}
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
       * Method to fetch Authorized user details for credit card product.
       *
       * @param {Object} submissionId - Submission id.
       * @param {Object} facilityId - Facility id.
       * @param {Object} simulationId - Simulation id.
       * @param {Object} offerId - Offer id.
       * @param {Object} deferred - Deferred object.
       * @returns {void}
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
       * Method to fetch states.
       *
       * @param {Object} country - Country.
       * @param {Object} deferred - Deferred object.
       * @returns {void}
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
       * Method to check whether previous address is required.
       *
       * @param {Object} submissionId - Submission id.
       * @param {Object} applicantId - Applicant id.
       * @param {Object} dateData -  Date data.
       * @param {Object} deferred - Deferred object.
       * @returns {void}
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
       * Method to fetch accommodation type list.
       *
       * @param {Object} deferred - Deferred object.
       * @returns {void}
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
        /**
         * Public method to delete addon card details.
         *
         * @param {Object} submissionId - Submission id of the application.
         * @param {Object} payload - Request payloadss.
         * @returns {Object} DeleteAddOnCardDetailsDeferred - An object of type deferred.
         */
        deleteAddOnCardDetails: function(submissionId, payload) {
          deleteAddOnCardDetailsDeferred = $.Deferred();
          deleteAddOnCardDetails(submissionId, payload, deleteAddOnCardDetailsDeferred);

          return deleteAddOnCardDetailsDeferred;
        },
        /**
         * Public method to update add on card details.
         *
         * @param {Object} submissionId - Submission id of the application.
         * @param {Object} payload - Request payloadss.
         * @returns {Object} DeleteAddOnCardDetailsDeferred - An object of type deferred.
         */
        updateAddOnCardDetails: function(submissionId, payload) {
          updateAddOnCardDetailsDeferred = $.Deferred();
          updateAddOnCardDetails(submissionId, payload, updateAddOnCardDetailsDeferred);

          return updateAddOnCardDetailsDeferred;
        },
        /**
         * Public method to get add on card details.
         *
         * @param {Object} submissionId - Submission id of the application.
         * @param {Object} facilityId - Facility Id of the application.
         * @param {Object} simulationId - Simulation Id of the application.
         * @param {Object} offerId - Offer Id of the application.
         * @returns {Object} DeleteAddOnCardDetailsDeferred - An object of type deferred.
         */
        fetchAddOnCardDetails: function(submissionId, facilityId, simulationId, offerId) {
          fetchAddOnCardDetailsDeferred = $.Deferred();
          fetchAddOnCardDetails(submissionId, facilityId, simulationId, offerId, fetchAddOnCardDetailsDeferred);

          return fetchAddOnCardDetailsDeferred;
        },
        /**
         * Public method to fetch salutations.
         *
         * @param {Object} submissionId - Submission id of the application.
         * @param {Object} payload - Request payloadss.
         * @returns {Object} DeleteAddOnCardDetailsDeferred - An object of type deferred.
         */
        fetchSalutations: function() {
          fetchSalutationsDeferred = $.Deferred();
          fetchSalutations(fetchSalutationsDeferred);

          return fetchSalutationsDeferred;
        },
        /**
         * Public method to fetch countries.
         *
         * @param {Object} submissionId - Submission id of the application.
         * @param {Object} payload - Request payloadss.
         * @returns {Object} DeleteAddOnCardDetailsDeferred - An object of type deferred.
         */
        fetchCountries: function() {
          fetchCountriesDeferred = $.Deferred();
          fetchCountries(fetchCountriesDeferred);

          return fetchCountriesDeferred;
        },
        /**
         * Public method to fetch accommodation type.
         *
         * @param {Object} submissionId - Submission id of the application.
         * @param {Object} payload - Request payloadss.
         * @returns {Object} DeleteAddOnCardDetailsDeferred - An object of type deferred.
         */
        getAccomodationTypeList: function() {
          getAccomodationTypeListDeferred = $.Deferred();
          getAccomodationTypeList(getAccomodationTypeListDeferred);

          return getAccomodationTypeListDeferred;
        },
        /**
         * Public method to fetch states.
         *
         * @param {string} country - Country of user.
         * @returns {Object} FetchStatesDeferred - An object of type deferred.
         */
        fetchStates: function(country) {
          fetchStatesDeferred = $.Deferred();
          fetchStates(country, fetchStatesDeferred);

          return fetchStatesDeferred;
        },
        /**
         * Public method to check stayng since date.
         *
         * @param {Object} submissionId - Submission id of the application.
         * @param {Object} applicantId - Applicant id.
         * @param {Object} dateData - Date Data.
         * @returns {Object} CheckStayingSinceDateDeferred - An object of type deferred.
         */
        checkStayingSinceDate: function(submissionId, applicantId, dateData) {
          checkStayingSinceDateDeferred = $.Deferred();
          checkStayingSinceDate(submissionId, applicantId, dateData, checkStayingSinceDateDeferred);

          return checkStayingSinceDateDeferred;
        }
      };
    };
  });