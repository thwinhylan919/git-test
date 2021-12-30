define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * @namespace BillerCategoryLending~Model
   * @class BillerCategoryLendingModel
   * @extends BaseService {@link BaseService}
   */
  return function billerCategoryLendingModel() {
    /**
     * In case more than one instance of model is required
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     */
    const Model = function() {
        this.primaryApplicant = {
          firstName: null,
          lastName: null,
          emailId: null
        };

        this.coApplicants = [{
          firstName: null,
          lastName: null,
          emailId: null
        }];

        this.submissionId = null;
        this.productCode = null;
        this.productDescription = null;
        this.offerId = null;
        this.offerName = null;
        this.prductClassName = null;
        this.productGroupSerialNumber = null;
        this.typeApplication = null;
      },
      baseService = BaseService.getInstance();
    /**
     * Method to fetch list of mapped billers.
     *  deferred object is resolved once the  information  is successfully fetched
     * @function fetchBillerCategoryMappingLIst
     * @param {string} url- rest url to fetch data
     * @param {oject} deferred- resolved for successful request
     * @private
     */
    let fetchBillerCategoryMappingLIstDeferred;
    const fetchBillerCategoryMappingLIst = function(url, deferred) {
      const options = {
        url: url,
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
     * Method to fetch information related to specific alert .
     *  deferred object is resolved once the  information  is successfully fetched
     */
    let deleteBillerDeferred;
    const deleteBiller = function(data, deferred) {
      const options = {
        url: "payments/billers/{id}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
        params = {
          id: data.id
        };

      baseService.remove(options, params);
    };
    /**
     * Method to fetch list of categories.
     *  deferred object is resolved once the  information  is successfully fetched
     * @function fetchBillerCategoryList
     * @param {oject} deferred- resolved for successful request
     * @private
     */
    let fetchBillerCategoryListDeferred;
    const fetchBillerCategoryList = function(deferred) {
      const options = {
        url: "payments/billerCategories",
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
      getNewModel: function() {
        return new Model();
      },
      fetchBillerCategoryMappingLIst: function(url) {
        fetchBillerCategoryMappingLIstDeferred = $.Deferred();
        fetchBillerCategoryMappingLIst(url, fetchBillerCategoryMappingLIstDeferred);

        return fetchBillerCategoryMappingLIstDeferred;
      },
      fetchBillerCategoryList: function() {
        fetchBillerCategoryListDeferred = $.Deferred();
        fetchBillerCategoryList(fetchBillerCategoryListDeferred);

        return fetchBillerCategoryListDeferred;
      },
      deleteBiller: function(data) {
        deleteBillerDeferred = $.Deferred();
        deleteBiller(data, deleteBillerDeferred);

        return deleteBillerDeferred;
      }
    };
  };
});