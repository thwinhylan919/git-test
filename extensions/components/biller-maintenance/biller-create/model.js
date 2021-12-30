define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const BillerCreateModel = function() {
    const baseService = BaseService.getInstance(),
      Model = function() {
        this.BillerDetails = {
          id: null,
          name: null,
          address: {
            line1: null,
            line2: null,
            line3: null,
            city: null,
            state: null,
            country: null,
            zipCode: null
          },
          currency: null,
          logo: {
            value: null,
            maskingQualifier: null,
            maskingAttribute: null,
            indirectionType: null,
            displayValue: null
          },
          sampleBill: {
            value: null,
            maskingAttribute: null,
            maskingQualifier: null,
            indirectionType: null,
            displayValue: null
          },
          creditAccount: null,
          paymentOptions: {
            partPayment: false,
            excessPayment: false,
            latePayment: false,
            quickBillPayment: false,
            quickRecharge: false,
            autoPay: null,
            autoPayBufferDays: null
          },
          paymentMethodsList: [],
          specifications: [],
          areaCategoryDetails: [{
            billerId: null,
            operationalAreaId: null,
            operationalAreaName: null,
            categoryId: null,
            determinantValue: null
          }],
          validationType: "AUTO",
          validationUrl: null,
          type: null,
          accountType: null,
          status: null
        };
      };
    let fetchCurrencyDeferred;
    const fetchCurrency = function(deferred) {
      const options = {
        url: "currency",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchCountryDeferred;
    const fetchCountry = function(deferred) {
      const options = {
        url: "enumerations/country",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchCategoryDeferred;
    const fetchCategory = function(deferred) {
      const options = {
        url: "categories",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchPaymentMethodsDeferred;
    const fetchPaymentMethods = function(deferred) {
      const options = {
        url: "enumerations/paymentOptions",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchBillerDetailsDeferred;
    const getBillerDetails = function(billerId, deferred) {
      const options = {
          url: "billers/{billerId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          billerId: billerId
        };

      baseService.fetch(options, params);
    };
    let fetchBillerListDeferred;
    const fetchBillerList = function(billerListJson, deferred) {
      const options = {
          url: "billers/fetchbillercode",
          version: "cz/v1",
          data:billerListJson,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          billerListJson: billerListJson
        };

      baseService.add(options, params);
    };

    return {
      getNewModel: function() {
        return new Model();
      },
      fetchCurrency: function() {
        fetchCurrencyDeferred = $.Deferred();
        fetchCurrency(fetchCurrencyDeferred);

        return fetchCurrencyDeferred;
      },
      fetchCountry: function() {
        fetchCountryDeferred = $.Deferred();
        fetchCountry(fetchCountryDeferred);

        return fetchCountryDeferred;
      },
      fetchCategory: function() {
        fetchCategoryDeferred = $.Deferred();
        fetchCategory(fetchCategoryDeferred);

        return fetchCategoryDeferred;
      },
      fetchPaymentMethods: function() {
        fetchPaymentMethodsDeferred = $.Deferred();
        fetchPaymentMethods(fetchPaymentMethodsDeferred);

        return fetchPaymentMethodsDeferred;
      },
      getBillerDetails: function(billerId) {
        fetchBillerDetailsDeferred = $.Deferred();
        getBillerDetails(billerId, fetchBillerDetailsDeferred);

        return fetchBillerDetailsDeferred;
      },
      fetchBillerList: function(billerListJson) {
        fetchBillerListDeferred = $.Deferred();
        fetchBillerList(billerListJson, fetchBillerListDeferred);

        return fetchBillerListDeferred;
      }
    };
  };

  return new BillerCreateModel();
});