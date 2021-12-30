define([
  "baseService"
], function(BaseService) {
  "use strict";

  const upiRequestMoneyModel = function() {
    const baseService = BaseService.getInstance();

    return {
      fetchCreditVPAList: function() {
        return baseService.fetch({
          url: "virtualPaymentAddresses"
        });
      },
      fireBatch: function(batchRequest,type) {
        return baseService.batch({
          url: "batch"
        },{
            type: type
        }, batchRequest);
      },
      fetchPayeeList: function() {
        return baseService.fetch({
          url: "payments/payeeGroup?expand=ALL&types=VPA"
        });
      },
      fetchBankConfig: function() {
        return baseService.fetch({
          url: "bankConfiguration"
        });
      },
      getPayeeMaintenance: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      },
      validateUpiRequestMoney: function(payload) {
        return baseService.add({
          url: "payments/transfers/upi/fundRequest",
          data: payload,
          headers: {
            "X-Validate-Only": "Y"
          }
        });
      },
      confirmUpiRequestMoney: function(payload) {
        return baseService.add({
          url: "payments/transfers/upi/fundRequest",
          data: payload
        });
      },
      getHostDate: function() {
        return baseService.fetch({
          url: "payments/currentDate"
        });
      },
      getNewModel: function() {
        return {
          upiRequestMoneyDetails: {
            amount: {
              amount: null,
              currency: null
            },
            remarks: "",
            debitVPAId: "",
            creditVPAId: "",
            expiryDate: "",
            payeeDetails: {
              id: null,
              nickName: null
            },
            deviceDetails: {
              uuid: null,
              version: null,
              platform: null,
              model: null,
              manufacturer: null,
              virtual: false,
              serial: null,
              sim1IMEI: null,
              sim2IMEI: null,
              latitude: null,
              longitude: null
            }
          }
        };
      }
    };
  };

  return new upiRequestMoneyModel();
});
