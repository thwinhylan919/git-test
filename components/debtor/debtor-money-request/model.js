define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const RequestMoneyModel = function() {
    const Model = function() {
        this.RequestMoneyModel = {
          dictionaryArray: null,
          refLinks: null,
          type: "NONREC",
          frequency: "10",
          startDate: null,
          endDate: null,
          amount: {
            currency: null,
            amount: null
          },
          userReferenceNo: null,
          remarks: null,
          purpose: null,
          debitAccountId: null,
          statusType: null,
          payerId: null,
          payerType: null,
          sepaDomestic: {
            dictionaryArray: null,
            refLinks: null,
            nominatedAccount: {
              displayValue: null,
              value: null
            },
            oinNumber: null,
            oinDescription: null
          }
        };
      },
      baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let getCurrencyDeferred;
    const getCurrency = function(deferred) {
      const options = {
        url: "bankConfiguration",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getDebtorListDeferred;
    const getDebtorList = function(deferred) {
      const options = {
        url: "payments/payerGroup?expand=ALL",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getDebtorSubListDeferred;
    const getDebtorSubList = function(groupId, deferred) {
      const options = {
          url: "payments/payerGroup/{groupId}/payers?types={type}&nickName=nickName",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          groupId: groupId,
          type: "DEMANDDRAFT",
          nickName: ""
        };

      baseService.fetch(options, params);
    };
    let getAccountListDeferred;
    const getAccountList = function(deferred) {
      const options = {
        url: "accounts/demandDeposit",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getHostDateDeferred;
    const getHostDate = function(deferred) {
      const options = {
        url: "payments/currentDate",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let initiateRequestMoneyDeferred;
    const initiateRequestMoney = function(model, deferred) {
      const options = {
        url: "payments/instructions/payins/domestic",
        data: model,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.add(options);
    };
    let confirmRequestMoneyDeferred;
    const confirmRequestMoney = function(paymentId, deferred) {
      const options = {
          url: "payments/instructions/payins/domestic/{instructionId}",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        },
        params = {
          instructionId: paymentId
        };

      baseService.patch(options, params);
    };
    let confirmRequestMoneyWithAuthDeferred;
    const confirmRequestMoneyWithAuth = function(paymentId, authKey, deferred) {
      const options = {
          url: "payments/instructions/payins/domestic/{instructionId}/authentication",
          headers: {
            TOKEN_ID: authKey
          },
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        },
        params = {
          instructionId: paymentId
        };

      baseService.update(options, params);
    };
    let fireBatchDeferred;
    const fireBatch = function(deferred, batchRequest, type) {
      const options = {
        url: "batch",
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };

      baseService.batch(options, {
        type: type
      }, batchRequest);
    };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getCurrency: function() {
        getCurrencyDeferred = $.Deferred();
        getCurrency(getCurrencyDeferred);

        return getCurrencyDeferred;
      },
      getDebtorList: function() {
        getDebtorListDeferred = $.Deferred();
        getDebtorList(getDebtorListDeferred);

        return getDebtorListDeferred;
      },
      getDebtorSubList: function(groupId) {
        getDebtorSubListDeferred = $.Deferred();
        getDebtorSubList(groupId, getDebtorSubListDeferred);

        return getDebtorSubListDeferred;
      },
      confirmRequestMoneyWithAuth: function(paymentId, authKey) {
        confirmRequestMoneyWithAuthDeferred = $.Deferred();
        confirmRequestMoneyWithAuth(paymentId, authKey, confirmRequestMoneyWithAuthDeferred);

        return confirmRequestMoneyWithAuthDeferred;
      },
      confirmRequestMoney: function(paymentId) {
        confirmRequestMoneyDeferred = $.Deferred();
        confirmRequestMoney(paymentId, confirmRequestMoneyDeferred);

        return confirmRequestMoneyDeferred;
      },
      initiateRequestMoney: function(model) {
        initiateRequestMoneyDeferred = $.Deferred();
        initiateRequestMoney(model, initiateRequestMoneyDeferred);

        return initiateRequestMoneyDeferred;
      },
      getHostDate: function() {
        getHostDateDeferred = $.Deferred();
        getHostDate(getHostDateDeferred);

        return getHostDateDeferred;
      },
      getAccountList: function() {
        getAccountListDeferred = $.Deferred();
        getAccountList(getAccountListDeferred);

        return getAccountListDeferred;
      },
      getPayerMaintenance: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      },
      fireBatch: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      }
    };
  };

  return new RequestMoneyModel();
});