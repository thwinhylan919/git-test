define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Main file for Service Request global Model<br/><br/>
   * The injected Model Class will have below properties:
   *
   * @namespace
   * @class InvestmentAccountModel
   */
  const InvestmentAccountModel = function() {
    const getData = function() {
        const allData = {
          personalDetails: {
            birthDate: "",
            gender: "",
            maritalStatus: "",
            fullName: "",
            spouseName: "",
            motherName : ""
          },
          identityInfo: [{
            value: null,
            taxId: null,
            partyId: null,
            identificationType: null
          }],
          contactDetails: [{
            contactType: "HPH",
            phoneNumber: null,
            email: null
          }],
          addressDetails: [{
            address1: null,
            address2: null,
            email: null,
            mobileNumber: null,
            state: null,
            country: null,
            pin: null
          }],
          nominees: [{
            nomineeName: null,
            relation: null,
            dateOfBirth: null,
            taxId: null,
            sharePercentage: 0.0,
            temp_nomrelationship : null
          }],
          fatcaDetails: {
            addressType: null,
            nationality: null,
            countryOfBirth: null,
            cityOfBirth: null,
            pepStatus: null,
            grossAnnualIncome: {
              amount: "",
              currency: ""
            },
            occupation: null,
            spouseName: null,
            taxResidencyInfoDTO: {
              nonDomesticTaxResidencyInfo: [{
                taxResidenceCountry : null,
                taxIdentifierType: null,
                taxIdentifier: null
              }]
            }
          },
          additionalDetails: {
            assets: [],
            liability: [],
            investments: [],
            relatives: []
          }
        };

        return allData;
      },

      baseService = BaseService.getInstance();
    let partyDetailsDeferred;
    /**
     * Private method to create a service request
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     *
     * @function fetchpartyDetails
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    const fetchpartyDetails = function(deferred) {
      const options = {
        url: "me/party",
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
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function fetchpartyDetails
       * @memberOf ServiceRequestsSearchModel
       * @returns {Object} - DeferredObject.
       * @example
       *       InvestmentAccountModel.fetchpartyDetails().done(function(data) {
       *
       *       });
       */
      fetchpartyDetails: function() {
        partyDetailsDeferred = $.Deferred();
        fetchpartyDetails(partyDetailsDeferred);

        return partyDetailsDeferred;
      },
      getData: function() {
        return new getData();
      }
    };
  };

  return new InvestmentAccountModel();
});
