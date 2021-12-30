define([
  "baseService"
], function (BaseService) {
  "use strict";

  const ReIssueCardModel = function () {
    const baseService = BaseService.getInstance(),
      /**
       * Let Model - description.
       *
       * @return {type}  Description.
       */
      Model = function () {
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
      };

    return {
      /**
       * GetNewModel - description.
       *
       * @param  {type} modelData - Description.
       * @return {type}           Description.
       */
      getNewModel: function (modelData) {
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
      createReplaceCard: function (payload, accountId, cardNo) {
        const params = {
            accountId: accountId,
            cardNo: cardNo
          },
          options = {
            url: "accounts/demandDeposit/{accountId}/debitCards/{cardNo}/replace",
            data: payload
          };

        return baseService.add(options, params);
      }
    };
  };

  return new ReIssueCardModel();
});