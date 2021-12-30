define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * Model file for Apply debit card section. This file contains the model definition
   * for Apply Debit Card section and exports the DebitCardApply model which can be used
   * as a component.
   *
   * @namespace DebitCardApply~DebitCardApplyModel
   * @class
   * @property {string} reason - To store the reason .
   * @property {string} deliveryOption -To store the delivery option .
   * @property {Object} addressDetails - Object containing the address details modeofDelivery,
   * @property {string} addressDetails.modeofDelivery -To store modeofDelivery,
   * @property {string} addressDetails.addressType -To store addressType.
   * @property {Object} address - Object containing the address details containing  address line1 ,address line2,address line3  ,address line4 ,country,state,city,zipcode
   * @property {Object} submitCardDetailsDeffered - To store the deffered object for submit card.
   * @property {Object} getReasonsDeffered - To store the deffered object for reasons being fetched.
   * @property {Object} postalAddress - Object containing the postal address details like address line1 ,address        line2,address line3  ,address line4  ,address line5,  address line6,  address line7,address line8,address          line9,address line10,address line11  ,address line12 ,   country,state,city,zipcode
   */
  const ApplyCardModel = function() {
    /**
     * In case more than one instance of model is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model, Model2
     * @private
     * @memberOf ApplyCardModel~ApplyCardModel
     */
    let getReasonsDeffered;
    const Model = function() {
        this.name = "";

        this.address = {
          line1: 0,
          line2: "",
          line3: "",
          line4: "",
          city: "",
          state: "",
          country: "",
          zipCode: ""
        };

        this.reason = "";
        this.deliveryOption = "COR";
      },
      Model2 = function() {
        this.addressDetails = {
          address: {
            line1: "",
            line2: "",
            line3: "",
            line4: "",
            city: "",
            state: "",
            country: "",
            zipCode: ""
          },
          deliveryOption: "",
          addressType: "",
          branchCode: ""
        };
      },
      baseService = BaseService.getInstance(),
      /**
      Get method to get the reasons for blocking card.
       *
      @deferred - returns deferred resolve or reject
      **/
      getReasons = function(deferred) {
        const options = {
          url: "enumerations/debitCardApplicationReason",
          success: function(data) {
            deferred.resolve(data);
          }
        };

        baseService.fetch(options);
      };

    return {

      submitCardDetails: function(accountId, data) {
        const params = {
          accountId: accountId
        },
        options = {
          url: "accounts/demandDeposit/{accountId}/debitCards",
          data: data
        };

        return baseService.add(options, params);
      },
      getNewModel: function() {
        return new Model();
      },
      getNewModelAddress: function() {
        return new Model2();
      },
      getReasons: function() {
        getReasonsDeffered = $.Deferred();
        getReasons(getReasonsDeffered);

        return getReasonsDeffered;
      }
    };
  };

  return new ApplyCardModel();
});
