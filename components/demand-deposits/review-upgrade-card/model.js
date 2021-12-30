define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const UpgradeCardModel = function() {
    const baseService = BaseService.getInstance(),
      /**
       * Let Model - description.
       *
       * @return {type}  Description.
       */
      Model = function() {
        this.upcardCardPayload = {
          requestType: "CHANGE_DEBIT_CARD",
          requestData: "",
          entityTypeIdentifier: "",
          status: "",
          entityTypeIdentifierKey: "",
          priorityType: "",
          entityType: "",
          definition: {
            id: ""
          }
        };

        this.upcardCardModel = {
          cardType: "",
          address: {
            line1: 0,
            line2: "",
            line3: "",
            line4: "",
            city: "",
            state: "",
            country: "",
            zipCode: ""
          },
          deliveryOption: ""
        };

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
            zipCode: "",
            branch: "",
            branchName: ""
          }
        };

        this.requestData = {
          label: ""
        };
      };

    let fetchCardTypesDeferred;
    /**
     * FetchCardTypes - description.
     *
     * @param  {type} debitCardNo - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred    Description.
     * @return {type}             Description.
     */
    const fetchCardTypes = function(debitCardNo, deferred) {
      const params = {
          debitCardNo: debitCardNo
        },
        options = {
          url: "accounts/demandDeposit/{debitCardNo}/debitCards/applicableTypes",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

      baseService.fetch(options, params);
    };

    return {
      /**
       * GetNewModel - description.
       *
       * @param  {type} modelData - Description.
       * @return {type}           Description.
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      /**
       * CreateUpgradeCardSR - description.
       *
       * @param  {type} payload - Description.
       * @return {type}         Description.
       */
      createUpgradeCardSR: function(payload) {
        const options = {
          url: "servicerequest",
          data: payload
        };

        return baseService.add(options);
      },
      /**
       * FetchCardTypes - description.
       *
       * @param  {type} cardNo - Description.
       * @return {type}        Description.
       */
      fetchCardTypes: function(cardNo) {
        fetchCardTypesDeferred = $.Deferred();
        fetchCardTypes(cardNo, fetchCardTypesDeferred);

        return fetchCardTypesDeferred;
      }
    };
  };

  return new UpgradeCardModel();
});
