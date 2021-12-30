define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const ReIssueCardModel = function() {
    const baseService = BaseService.getInstance(),
      /**
       * Let Model - description.
       *
       * @return {type}  Description.
       */
      Model = function() {
        this.replaceModel = {
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
      };
    let createReplaceCardDeferred;
    /**
     * This function fires a POST request to create supplementarycard request
     * and delegates control to the successhandler along with response data
     * once the details are successfully created.
     *
     * @function createSupplimentaryCard
     * @param  {type} payload   - - - - - - - - - - - - - - Description.
     * @param  {type} accountId Description.
     * @param  {type} cardNo    Description.
     * @param  {type} deferred  Description.
     * @return {type}           Description.
     */
    const createReplaceCard = function(payload, accountId, cardNo, deferred) {
      const params = {
          accountId: accountId,
          cardNo: cardNo
        },
        options = {
          url: "accounts/demandDeposit/{accountId}/debitCards/{cardNo}/replace",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };

      baseService.add(options, params);
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
      createReplaceCard: function(payload, accountId, cardNo) {
        createReplaceCardDeferred = $.Deferred();
        createReplaceCard(payload, accountId, cardNo, createReplaceCardDeferred);

        return createReplaceCardDeferred;
      }
    };
  };

  return new ReIssueCardModel();
});
