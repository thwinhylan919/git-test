/**
 * Model for financial-type-maintenance
 * @param1 {object} jquery instance
 * @param2 {object} BaseService base service instance for server communication
 * return {object} financialTypeMaintenanceModel Modal instance
 */
define([

  "baseService"
], function(BaseService) {
  "use strict";

  const financialTypeMaintenanceModel = function() {
    const baseService = BaseService.getInstance();

    return {
      /**
       * FetchIncomeTypes - fetches the list of income types maintained in the system.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchIncomeTypes: function() {
        return baseService.fetch({
          url: "financialIncomeTypes",
          headers: {
            "x-noncecount": 30
          }
        });
      },
      /**
       * FetchLiabilityTypes - fetches the  list of liability types maintained in the system.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchLiabilityTypes: function() {
        return baseService.fetch({
          url: "financialLiabilityTypes"
        });
      },
      /**
       * FetchAssetTypes - fetches the list of asset types maintained in the system.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchAssetTypes: function() {
        return baseService.fetch({
          url: "financialAssetTypes"
        });
      },
      /**
       * FetchExpenseTypes - fetches the  list of expense types maintained in the system.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchExpenseTypes: function() {
        return baseService.fetch({
          url: "financialExpenseTypes"
        });
      },
      /**
       * FetchAccommodationTypes - fetches the list of accommodation types maintained in the system.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchAccommodationTypes: function() {
        return baseService.fetch({
          url: "accommodationTypes"
        });
      },
      /**
       * FetchIncomeMaster - fetches the master list of income types maintained in the system.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchIncomeMaster: function() {
        return baseService.fetch({
          url: "enumerations/financialIncomeType"
        });
      },
      /**
       * FetchLiabilityMaster - fetches the master list of liability types maintained in the system.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchLiabilityMaster: function() {
        return baseService.fetch({
          url: "enumerations/financialLiabilityType"
        });
      },
      /**
       * FetchAssetMaster - fetches the master list of asset types maintained in the system.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchAssetMaster: function() {
        return baseService.fetch({
          url: "enumerations/financialAsset"
        });
      },
      /**
       * FetchExpenseMaster - fetches the master list of expense types maintained in the system.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchExpenseMaster: function() {
        return baseService.fetch({
          url: "enumerations/financialExpenseType"
        });
      },
      /**
       * FetchAccommodationMaster - fetches the master list of accommodation types maintained in the system.
       *
       * @returns {Promise}  Returns the promise object.
       */
      fetchAccommodationMaster: function() {
        return baseService.fetch({
          url: "enumerations/accomodationType"
        });
      }
    };
  };

  return new financialTypeMaintenanceModel();
});
