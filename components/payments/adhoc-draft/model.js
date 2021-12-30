define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Var AdhocPaymentModel - description.
   *
   * @return {type}  Description.
   */
  const AdhocPaymentModel = function() {
    const Model = function() {
        this.addressDetails = {
          modeofDelivery: null,
          addressType: null,
          addressTypeDescription: null,
          postalAddress: {
            line1: "",
            line2: "",
            line3: "",
            line4: "",
            line5: "",
            line6: "",
            line7: "",
            line8: "",
            line9: "",
            line10: "",
            line11: "",
            line12: "",
            city: "",
            state: "",
            country: "",
            zipCode:"",
            branch: "",
            branchName: ""
          }
        };

        this.adhocPaymentModel = {
          genericPayee: {
            accountNumber: null,
            accountName: null,
            branchCode: null,
            transferMode: "",
            accountType: null,
            network: null,
            bankDetails: {
              name: null,
              branch: null,
              address: null,
              city: null,
              country: null,
              codeType: null,
              code: null
            },
            name: null,
            nickName: null,
            groupId: null,
            sepaType: null,
            ukPaymentType: null,
            demandDraftPayeeType: "",
            payAtCity: "",
            payAtCountry: "",
            demandDraftDeliveryDTO: {
              dictionaryArray: null,
              refLinks: null,
              deliveryMode: null,
              branch: null,
              mailModeType: null,
              addressType: null
            },
            otherAddress: {
              line1: null,
              line2: null,
              city: null,
              state: null,
              country: null,
              zipCode: null
            }
          },
          genericPayout: {
            inFavourOf: null,
            charges: null,
            otherDetails: {
              line1: null
            },
            partyId: {
              displayValue: null,
              value: null
            },
            amount: {
              currency: null,
              amount: null
            },
            userReferenceNo: null,
            remarks: null,
            purpose: null,
            purposeText: null,
            debitAccountId: {
              displayValue: null,
              value: null
            },
            creditAccountId: null,
            valueDate: null,
            frequency: "10",
            startDate: null,
            endDate: null,
            nextExecutionDate: null,
            instances: null,
            externalReferenceNumber: null,
            freqDays: 0,
            freqMonths: 0,
            freqYears: 0
          },
          paymentType: null
        };
      },
      baseService = BaseService.getInstance();
      let region = false,
      /**
       * getCountriesDeferred - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
       getCountriesDeferred; const getCountries = function(deferred) {
        const options = {
          url: "enumerations/country",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      };
      /**
       * getCitiesDeferred - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      let getCitiesDeferred; const getCities = function(deferred) {
        const options = {
          url: "locations/country/all/city",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      };
      /**
       * listAccessPointDeferred - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      let listAccessPointDeferred;
      const listAccessPoint = function(deferred) {
        const options = {
          url: "accessPoints",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };
      /**
       * makeAdhocPaymentDeferred - description
       *
       * @param  {type} payload  description
       * @param  {type} deferred description
       * @return {type}          description
       */
      let makeAdhocPaymentDeferred; const makeAdhocPayment = function(payload, deferred) {
        const options = {
          url: "payments/generic",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.add(options);
      };

      /**
       * bancConfigurationDeffered - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      let bancConfigurationDeffered; const fetchBankConfiguration = function(deferred) {
        const options = {
          url: "bankConfiguration",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };

        baseService.fetch(options);
      };
      /**
       * getHostDateDeferred - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      let getHostDateDeferred; const getHostDate = function(deferred) {
        const options = {
          url: "payments/currentDate",
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
      init: function(reg) {
        region = reg || undefined;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getPaymentTypes: function() {
        return baseService.fetch({
          url: "enumerations/paymentType?REGION={region}"
        }, {
          region: region
        });
      },
      getCountries: function() {
        getCountriesDeferred = $.Deferred();
        getCountries(getCountriesDeferred);

        return getCountriesDeferred;
      },
      getCities: function() {
        getCitiesDeferred = $.Deferred();
        getCities(getCitiesDeferred);

        return getCitiesDeferred;
      },
      listAccessPoint: function() {
        listAccessPointDeferred = $.Deferred();
        listAccessPoint(listAccessPointDeferred);

        return listAccessPointDeferred;
      },
      makeAdhocPayment: function(payload) {
        makeAdhocPaymentDeferred = $.Deferred();
        makeAdhocPayment(payload, makeAdhocPaymentDeferred);

        return makeAdhocPaymentDeferred;
      },
      getHostDate: function() {
        getHostDateDeferred = $.Deferred();
        getHostDate(getHostDateDeferred);

        return getHostDateDeferred;
      },
      fetchBankConfiguration: function() {
        bancConfigurationDeffered = $.Deferred();
        fetchBankConfiguration(bancConfigurationDeffered);

        return bancConfigurationDeffered;
      }
    };
  };

  return new AdhocPaymentModel();
});
