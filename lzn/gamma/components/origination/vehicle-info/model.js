define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const PropertyInfoModel = function() {
    const Model = function(currency) {
        this.loanApplicationRequirementDTO = {
          productGroupSerialNumber: null,
          productGroupCode: null,
          productGroupName: null,
          productGroupLinkageType: null,
          submissionId: {
            displayValue: null,
            value: null
          },
          requestedAmount: {
            currency: currency ? currency : null,
            amount: ""
          },
          requestedTenure: {
            days: null,
            months: null,
            years: null
          },
          purposeType: null,
          capitalizeFeesOpted: null,
          noOfCoApplicants: null,
          facilityId: null,
          vehicleDetails: {
            collateralId: "",
            isAddedAsCollateral: true,
            vehicleIdentificationNum: null,
            vehicleMakeType: null,
            vehicleModel: null,
            vehicleSubType: "CAR",
            vehicleType: "PASSENGER_VEHICLE",
            vehicleYear: null,
            vehicleNew: true,
            registrationState: null,
            distanceTravelled: null
          },
          purpose: {
            name: null,
            description: null,
            code: null
          },
          selectedValues: {
            selectedState: "",
            selectedCountry: "",
            vehicleMakeType: "",
            vehicleSubType: "",
            registrationState: ""
          }
        };

        this.disableInputs = false;
      },
      baseService = BaseService.getInstance();
    let fetchVehicleInfoDeferred;
    const fetchVehicleInfo = function(deferred, submissionID) {
      const params = {
          submissionID: submissionID
        },
        options = {
          url: "submissions/{submissionID}/loanApplications",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchVehiclePolicyDeferred;
    const fetchVehiclePolicy = function(deferred, submissionID) {
      const params = {
          submissionID: submissionID
        },
        options = {
          url: "vehiclePolicyTemplates",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchCollateralCategoryDeferred;
    const fetchCollateralCategory = function(deferred) {
      const options = {
        url: "enumerations/collateralCategory?type=AUTOMOBILE",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchStatesDeferred;
    const fetchStates = function(country, deferred) {
      const params = {
          country: country
        },
        options = {
          url: "enumerations/country/{country}/state",
          success: function(data) {
            deferred.resolve(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchVehicleMakeDeferred;
    const fetchVehicleMake = function(deferred) {
      const options = {
        url: "enumerations/vehicleMake",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let saveVehicleInfoDeferred;
    const saveVehicleInfo = function(deferred, payload, submissionId) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/loanApplications",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.add(options, params);
    };
    let lookupVehicleInfoDeferred;
    const lookupVehicleInfo = function(deferred, submissionId, vehicleIdentificationNum, vehicleSubType, vehicleMake, vehicleModel) {
      const params = {
          submissionId: submissionId,
          vin: vehicleIdentificationNum,
          type: "PASSENGER_VEHICLE",
          subType: vehicleSubType,
          make: vehicleMake,
          model: vehicleModel
        },
        options = {
          url: "submissions/{submissionId}/loanApplications/vehicleLookup?vin={vin}&type={type}&subType={subType}&make={make}&model={model}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchVehicleTypeDeferred;
    const fetchVehicleType = function(deferred, submissionId) {
      const params = {
          submissionId: submissionId,
          vehicleCategory: "PASSENGER_VEHICLE"
        },
        options = {
          url: "submissions/{submissionId}/loanApplications/vehicleSubType?vehicleType={vehicleCategory}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let fetchVehicleModelDeferred;
    const fetchVehicleModel = function(deferred, submissionId, vehicleCategory, vehicleMake) {
      const params = {
          submissionId: submissionId,
          vehicleCategory: vehicleCategory,
          vehicleMake: vehicleMake
        },
        options = {
          url: "submissions/{submissionId}/loanApplications/vehicleModels?type={vehicleCategory}&make={vehicleMake}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let getApplicantDeferred;
    const getApplicant = function(deferred, submissionId) {
      const params = {
          submissionId: submissionId
        },
        options = {
          url: "submissions/{submissionId}/applicants",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };

    return {
      getNewModel: function(currency) {
        return new Model(currency);
      },
      fetchVehicleInfo: function(submissionID) {
        fetchVehicleInfoDeferred = $.Deferred();
        fetchVehicleInfo(fetchVehicleInfoDeferred, submissionID);

        return fetchVehicleInfoDeferred;
      },
      fetchVehiclePolicy: function(submissionID) {
        fetchVehiclePolicyDeferred = $.Deferred();
        fetchVehiclePolicy(fetchVehiclePolicyDeferred, submissionID);

        return fetchVehiclePolicyDeferred;
      },
      fetchVehicleType: function(submissionID) {
        fetchVehicleTypeDeferred = $.Deferred();
        fetchVehicleType(fetchVehicleTypeDeferred, submissionID);

        return fetchVehicleTypeDeferred;
      },
      fetchStates: function(country) {
        fetchStatesDeferred = $.Deferred();
        fetchStates(country, fetchStatesDeferred);

        return fetchStatesDeferred;
      },
      fetchVehicleModel: function(submissionID, vehicleCategory, vehicleMake) {
        fetchVehicleModelDeferred = $.Deferred();
        fetchVehicleModel(fetchVehicleModelDeferred, submissionID, vehicleCategory, vehicleMake);

        return fetchVehicleModelDeferred;
      },
      fetchCollateralCategory: function() {
        fetchCollateralCategoryDeferred = $.Deferred();
        fetchCollateralCategory(fetchCollateralCategoryDeferred);

        return fetchCollateralCategoryDeferred;
      },
      fetchVehicleMake: function() {
        fetchVehicleMakeDeferred = $.Deferred();
        fetchVehicleMake(fetchVehicleMakeDeferred);

        return fetchVehicleMakeDeferred;
      },
      saveVehicleInfo: function(payload, submissionId) {
        saveVehicleInfoDeferred = $.Deferred();
        saveVehicleInfo(saveVehicleInfoDeferred, payload, submissionId);

        return saveVehicleInfoDeferred;
      },
      lookupVehicleInfo: function(submissionId, vehicleIdentificationNum, vehicleSubType, vehicleMake, vehicleModel) {
        lookupVehicleInfoDeferred = $.Deferred();
        lookupVehicleInfo(lookupVehicleInfoDeferred, submissionId, vehicleIdentificationNum, vehicleSubType, vehicleMake, vehicleModel);

        return lookupVehicleInfoDeferred;
      },
      getApplicant: function(submissionId) {
        getApplicantDeferred = $.Deferred();
        getApplicant(getApplicantDeferred, submissionId);

        return getApplicantDeferred;
      }
    };
  };

  return new PropertyInfoModel();
});