define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const newDebtorModel = function() {
    const Model = function() {
        this.debtorModel = {
          nickName: null,
          groupId: null,
          domesticPayerType: "SEPA",
          sepaDomesticPayer: {
            iban: null,
            bankCode: null,
            sepaPayerType: "DIR"
          }
        };

        this.debtorName = {
          name: null
        };
      },
      baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let getDebtorGroupNameDeferred;
    const getDebtorGroupName = function(model, deferred) {
      const options = {
        url: "payments/payerGroup",
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
    let createNewPayerDeferred;
    const createNewPayer = function(model, groupId, deferred) {
      const options = {
          url: "payments/payerGroup/{groupId}/payers/domestic",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          groupId: groupId
        };

      baseService.add(options, params);
    };
    let confirmAddDebtorDeferred;
    const confirmAddDebtor = function(payerId, groupId, deferred) {
      const options = {
          url: "payments/payerGroup/{groupId}/payers/domestic/{payerId}",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        },
        params = {
          groupId: groupId,
          payerId: payerId
        };

      baseService.patch(options, params);
    };
    let deleteDebtorGroupDeferred;
    const deleteDebtorGroup = function(groupId, deferred) {
      const options = {
          url: "payments/payerGroup/{groupId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          groupId: groupId
        };

      baseService.remove(options, params);
    };
    let deleteDebtorDeferred;
    const deleteDebtor = function(payerId, groupId, deferred) {
      const options = {
          url: "payments/payerGroup/{groupId}/payers/domestic/{payerId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          payerId: payerId,
          groupId: groupId
        };

      baseService.remove(options, params);
    };
    let confirmAddDebtorWithAuthDeferred;
    const confirmAddDebtorWithAuth = function(payerId, groupId, authKey, deferred) {
      const options = {
          url: "payments/payerGroup/{groupId}/payers/domestic/{payerId}/authentication",
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
          payerId: payerId,
          groupId: groupId
        };

      baseService.update(options, params);
    };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getDebtorGroupName: function(model) {
        getDebtorGroupNameDeferred = $.Deferred();
        getDebtorGroupName(model, getDebtorGroupNameDeferred);

        return getDebtorGroupNameDeferred;
      },
      createNewPayer: function(model, groupId) {
        createNewPayerDeferred = $.Deferred();
        createNewPayer(model, groupId, createNewPayerDeferred);

        return createNewPayerDeferred;
      },
      confirmAddDebtor: function(payerId, groupId) {
        confirmAddDebtorDeferred = $.Deferred();
        confirmAddDebtor(payerId, groupId, confirmAddDebtorDeferred);

        return confirmAddDebtorDeferred;
      },
      confirmAddDebtorWithAuth: function(payerId, groupId, authKey) {
        confirmAddDebtorWithAuthDeferred = $.Deferred();
        confirmAddDebtorWithAuth(payerId, groupId, authKey, confirmAddDebtorWithAuthDeferred);

        return confirmAddDebtorWithAuthDeferred;
      },
      deleteDebtorGroup: function(groupId) {
        deleteDebtorGroupDeferred = $.Deferred();
        deleteDebtorGroup(groupId, deleteDebtorGroupDeferred);

        return deleteDebtorGroupDeferred;
      },
      deleteDebtor: function(payerId, groupId) {
        deleteDebtorDeferred = $.Deferred();
        deleteDebtor(payerId, groupId, deleteDebtorDeferred);

        return deleteDebtorDeferred;
      }
    };
  };

  return new newDebtorModel();
});