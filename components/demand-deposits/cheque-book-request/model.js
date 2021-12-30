define([
  "baseService"
], function (BaseService) {
  "use strict";

  const ChequeBookRequestModel = function () {
    const baseService = BaseService.getInstance();

    return {
      fetchChequeBookType: function () {
        return baseService.fetch({
          url: "enumerations/chequeBookType"
        });
      },
      getMaintenance: function() {
        return baseService.fetch({
          url: "accounts/demandDeposit/config/inputNoOfChequeBooks"
        });
      },
      fetchAddress: function (branchCode) {
        return baseService.fetch({
          url: "locations/branches?branchCode={branchCode}"
        }, {
          branchCode: branchCode
        });
      },
      requestChequeBook: function (accountId, payload) {
        return baseService.add({
          url: "accounts/demandDeposit/{accountId}/chequeBooks",
          data: payload
        }, {
          accountId: accountId
        });
      },
      getNewModel: function () {
        return {
          chequeBookDetails: {
            accountId: {
              value: null,
              displayValue: null
            },
            noOfChequeBooksEnabled: "",
            noOfChequeLeaves: "",
            noOfChequeBooks: "",
            personalizedTitle: "",
            currency: "",
            chequeBookTypeList: [{
              stockCode: "",
              stockCurrency: "",
              stockDescription: ""
            }],
            chequeDeliveryDetailsDTO: {
              address: {
                line1: "",
                line2: "",
                line3: "",
                line4: "",
                city: "",
                state: "",
                country: "",
                postalCode: ""
              },
              deliveryOption: "",
              addressType: "",
              branchCode: ""
            }
          }
        };
      }
    };
  };

  return new ChequeBookRequestModel();
});