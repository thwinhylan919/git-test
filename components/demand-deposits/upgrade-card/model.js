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
          deliveryOption: null,
          addressType: null,
          addressTypeDescription: null,
          branchCode: null,
          address: {
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
    let createUpgradeCardSRDeferred;
    /**
     * This function fires a POST request to create supplementarycard request
     * and delegates control to the successhandler along with response data
     * once the details are successfully created.
     *
     * @function createSupplimentaryCard
     * @param  {type} payload   - - - - - - - - - - - - - - - - Description.
     * @param  {type} deferred  Description.
     * @return {type}           Description.
     */
    const createUpgradeCardSR = function(payload, deferred) {
      const options = {
        url: "servicerequest",
        data: payload,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };

      baseService.add(options);
    };
    let fetchCardTypesDeferred;
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
       * CreateReplaceCard - description.
       *
       * @param  {type} payload   - - - - - - - - - - - - - - - Description.
       * @param  {type} accountId Description.
       * @param  {type} cardNo    Description.
       * @return {type}           Description.
       */
      createUpgradeCardSR: function(payload) {
        createUpgradeCardSRDeferred = $.Deferred();
        createUpgradeCardSR(payload, createUpgradeCardSRDeferred);

        return createUpgradeCardSRDeferred;
      },
      fetchCardTypes: function(cardNo) {
        fetchCardTypesDeferred = $.Deferred();
        fetchCardTypes(cardNo, fetchCardTypesDeferred);

        return fetchCardTypesDeferred;
      }
    };
  };

  return new UpgradeCardModel();
});
