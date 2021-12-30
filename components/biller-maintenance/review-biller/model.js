define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ReviewBillerModel = function() {
    const baseService = BaseService.getInstance(),
      Model = function() {
        this.UpdatedBillerDetails = {
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
          validationType: null,
          validationUrl: null,
          status: null
        };
      };
    let fetchCategoryDeferred;
    const fetchCategory = function(deferred) {
      const options = {
        url: "payments/billerCategories",
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
    let uploadImageDeffered;
    const uploadImage = function(form, deferred) {
      const options = {
        url: "contents",
        formData: form,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.uploadFile(options);
    };
    let createBillerDeferred;
    const createBiller = function(model, deferred) {
      const options = {
        url: "billers",
        data: model,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.add(options);
    };
    let updateBillerDeferred;
    const updateBiller = function(billerId, model, deferred) {
      const options = {
        url: "billers/" + billerId,
        data: model,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.update(options);
    };
    let retrieveImageDeffered;
    const retrieveImage = function(id, deferred) {
      const options = {
          url: "contents/{id}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          id: id
        };

      baseService.fetch(options, params);
    };
    let deleteBillerDeferred;
    const deleteBiller = function(id, deferred) {
      const options = {
          url: "billers/{Id}",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        },
        params = {
          Id: id
        };

      baseService.remove(options, params);
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
    let fetchCategoryDetailsDeferred;
    const fetchCategoryDetails = function(id, deferred) {
      const options = {
          url: "categories/{Id}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          Id: id
        };

      baseService.fetch(options, params);
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

    return {
      getNewModel: function() {
        return new Model();
      },
      fetchCategory: function() {
        fetchCategoryDeferred = $.Deferred();
        fetchCategory(fetchCategoryDeferred);

        return fetchCategoryDeferred;
      },
      fetchCountry: function() {
        fetchCountryDeferred = $.Deferred();
        fetchCountry(fetchCountryDeferred);

        return fetchCountryDeferred;
      },
      uploadImage: function(form) {
        uploadImageDeffered = $.Deferred();
        uploadImage(form, uploadImageDeffered);

        return uploadImageDeffered;
      },
      createBiller: function(model) {
        createBillerDeferred = $.Deferred();
        createBiller(model, createBillerDeferred);

        return createBillerDeferred;
      },
      retrieveImage: function(id) {
        retrieveImageDeffered = $.Deferred();
        retrieveImage(id, retrieveImageDeffered);

        return retrieveImageDeffered;
      },
      deleteBiller: function(id) {
        deleteBillerDeferred = $.Deferred();
        deleteBiller(id, deleteBillerDeferred);

        return deleteBillerDeferred;
      },
      fetchPaymentMethods: function() {
        fetchPaymentMethodsDeferred = $.Deferred();
        fetchPaymentMethods(fetchPaymentMethodsDeferred);

        return fetchPaymentMethodsDeferred;
      },
      updateBiller: function(billerId, model) {
        updateBillerDeferred = $.Deferred();
        updateBiller(billerId, model, updateBillerDeferred);

        return updateBillerDeferred;
      },
      fetchCategoryDetails: function(id) {
        fetchCategoryDetailsDeferred = $.Deferred();
        fetchCategoryDetails(id, fetchCategoryDetailsDeferred);

        return fetchCategoryDetailsDeferred;
      },
      getBillerDetails: function(billerId) {
        fetchBillerDetailsDeferred = $.Deferred();
        getBillerDetails(billerId, fetchBillerDetailsDeferred);

        return fetchBillerDetailsDeferred;
      }
    };
  };

  return new ReviewBillerModel();
});