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
            amount: null
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
          yourFirstHome: null,
          propertyDetails: {
            address: {
              line1: "",
              line2: "",
              city: "",
              state: "",
              country: "",
              postalCode: ""
            },
            primaryResidence: true,
            ownership: [{
              partyId: null,
              partyName: null
            }],
            propertySubType: null,
            propertyType: "RESIDENTIAL_PROPERTY",
            purchasePrice: {
              currency: currency ? currency : null,
              amount: ""
            }
          },
          purpose: {
            name: null,
            description: null,
            code: null
          },
          selectedValues: {
            propertySubTypeName: "",
            propertyTypeName: "",
            selectedState: "",
            selectedCountry: ""
          }
        };

        this.disableInputs = false;
      },
      baseService = BaseService.getInstance();
    let fetchPropetyInfoDeferred;
    const fetchPropetyInfo = function(deferred, submissionID) {
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
    let fetchTypeOfPropertyDeferred;
    const fetchTypeOfProperty = function(deferred) {
      const options = {
        url: "properties/propertyType",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchSubTypeOfPropertyDeferred;
    const fetchSubTypeOfProperty = function(deferred, propertyType) {
      const params = {
          propertyType: propertyType
        },
        options = {
          url: "properties/subpropertyType?propertyType={propertyType}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

      baseService.fetch(options, params);
    };
    let savePropetyInfoDeferred;
    const savePropetyInfo = function(deferred, payload, submissionId) {
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
      fetchPropetyInfo: function(submissionID) {
        fetchPropetyInfoDeferred = $.Deferred();
        fetchPropetyInfo(fetchPropetyInfoDeferred, submissionID);

        return fetchPropetyInfoDeferred;
      },
      fetchTypeOfProperty: function() {
        fetchTypeOfPropertyDeferred = $.Deferred();
        fetchTypeOfProperty(fetchTypeOfPropertyDeferred);

        return fetchTypeOfPropertyDeferred;
      },
      fetchSubTypeOfProperty: function(propertyType) {
        fetchSubTypeOfPropertyDeferred = $.Deferred();
        fetchSubTypeOfProperty(fetchSubTypeOfPropertyDeferred, propertyType);

        return fetchSubTypeOfPropertyDeferred;
      },
      savePropetyInfo: function(payload, submissionId) {
        savePropetyInfoDeferred = $.Deferred();
        savePropetyInfo(savePropetyInfoDeferred, payload, submissionId);

        return savePropetyInfoDeferred;
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