/**
 * Model for add-edit-nominee
 * @param {object} BaseService
 * @return {object} nomineeDetailsModel
 */
define([
  "baseService"
], function(BaseService) {
  "use strict";

  const nomineeDetailsModel = function() {
    /**
     * In case more than one instance of nomineeDetailsModel is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     */
    const Model = function() {
        this.addNomineeModel = {
          accountId: {
            displayValue: null,
            value: null
          },
          accountType: null,
          accountModule: null,
          dateOfBirth: null,
          name: null,
          relation: null,
          minor: false,
          address: {
            country: null,
            state: null,
            city: null,
            zipCode: null,
            line1: null,
            line2: null
          }
        };

        this.guardianDetails = {
          name: null,
          address: {
            country: null,
            state: null,
            city: null,
            zipCode: null,
            line1: null,
            line2: null
          }
        };
      },
      baseService = BaseService.getInstance();

    return {
      /**
       * @returns {Object}  Returns the modelData.
       */
      getNewModel: function() {
        return new Model();
      },
      /**
       * Fetches currentDate.
       *
       * @returns {Promise}  Returns the promise object.
       */
      getHostDate: function() {
        return baseService.fetch({
          url: "payments/currentDate"
        });
      },
      /**
       * Fetches nomineeRelations.
       *
       * @returns {Promise}  Returns the promise object.
       */
      getRelation: function() {
        return baseService.fetch({
          url: "enumerations/nomineeRelations"
        });
      },
      /**
       * Fetches country.
       *
       * @returns {Promise}  Returns the promise object.
       */
      getCountries: function() {
        return baseService.fetch({
          url: "enumerations/country"
        });
      },
      /**
       * Fetches nominee list.
       *
       * @returns {Promise}  Returns the promise object.
       */
      getNomineeList: function() {
        return baseService.fetch({
          url: "nominee"
        });
      }
    };
  };

  return new nomineeDetailsModel();
});