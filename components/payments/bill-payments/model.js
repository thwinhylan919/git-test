define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const billPaymentsModel = function() {
    const Model = function() {
        this.payBillModel = {
          amount: {
            currency: null,
            amount: null
          },
          valueDate: null,
          userReferenceNo: "",
          remarks: "",
          purpose: "",
          debitAccountId: {
            displayValue: null,
            value: null
          },
          status: null,
          billerId: null,
          billNumber: null,
          billDate: null,
          consumerNumber: null,
          relationshipNumber: null
        };

        this.favoritesModel = {
          id: null,
          transactionType: "BILLPAYMENT",
          payeeId: null,
          amount: {
            currency: null,
            amount: null
          },
          debitAccountId: {
            displayValue: null,
            value: null
          },
          relationshipNumber: null,
          remarks: null,
          payeeAccountName: null,
          billerCategory: null
        };
      },
      baseService = BaseService.getInstance();
    let getBillersDeferred;
    const getBillers = function(deferred) {
      const options = {
        url: "payments/registeredBillers",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let listAccessPointDeferred;
    const listAccessPoint = function(deferred) {
      const options = {
        url: "accessPoints",
        success: function(data) {
          deferred.resolve(data);
        }
      };

      baseService.fetch(options);
    };
    let getCurrencyDeferred;
    const getCurrency = function(deferred) {
      const options = {
        url: "payments/currencies?type=BILLPAYMENT",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getBillerNamesDeferred;
    const getBillerNames = function(deferred) {
      const options = {
        url: "payments/billers?categoryType=ALL",
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
    let getBillPaymentDetailsDeferred;
    const getBillPaymentDetails = function(paymentId, deferred) {
      const options = {
        url: "payments/transfers/bill/{paymentId}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
        params = {
          paymentId: paymentId
        };

      baseService.fetch(options, params);
    };
    let deleteFavouriteDeferred;
    const deleteFavourite = function(paymentId, transactionType, deferred) {
      const options = {
        url: "payments/favorites?transactionId={paymentId}&&type={transactionType}",
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        }
      },
        params = {
          paymentId: paymentId,
          transactionType:transactionType
        };

      baseService.remove(options, params);
    };
    let paybillDeferred;
    const paybill = function(model, deferred) {
      const options = {
        url: "payments/transfers/bill",
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
    let getAccountsDeferred;
    const getAccounts = function(deferred) {
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
    let confirmPaymentWithAuthDeferred;
    const confirmPaymentWithAuth = function(paymentId, authKey, deferred) {
      const options = {
        url: "payments/transfers/bill/{paymentId}/authentication",
        headers: {
          TOKEN_ID: authKey
        },
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
        params = {
          paymentId: paymentId
        };

      baseService.update(options, params);
    };
    let addFavoritesDeferred;
    const addFavorites = function(model, deferred) {
      const options = {
        url: "payments/favorites",
        data: model,
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };

      baseService.add(options);
    };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getBillers: function() {
        getBillersDeferred = $.Deferred();
        getBillers(getBillersDeferred);

        return getBillersDeferred;
      },
      getCurrency: function() {
        getCurrencyDeferred = $.Deferred();
        getCurrency(getCurrencyDeferred);

        return getCurrencyDeferred;
      },
      listAccessPoint: function() {
        listAccessPointDeferred = $.Deferred();
        listAccessPoint(listAccessPointDeferred);

        return listAccessPointDeferred;
      },
      getAccounts: function() {
        getAccountsDeferred = $.Deferred();
        getAccounts(getAccountsDeferred);

        return getAccountsDeferred;
      },
      paybill: function(model) {
        paybillDeferred = $.Deferred();
        paybill(model, paybillDeferred);

        return paybillDeferred;
      },
      getBillerNames: function() {
        getBillerNamesDeferred = $.Deferred();
        getBillerNames(getBillerNamesDeferred);

        return getBillerNamesDeferred;
      },
      deleteFavourite: function(paymentId, transactionType) {
        deleteFavouriteDeferred = $.Deferred();
        deleteFavourite(paymentId, transactionType, deleteFavouriteDeferred);

        return deleteFavouriteDeferred;
      },
      addFavorites: function(model) {
        addFavoritesDeferred = $.Deferred();
        addFavorites(model, addFavoritesDeferred);

        return addFavoritesDeferred;
      },
      getHostDate: function() {
        getHostDateDeferred = $.Deferred();
        getHostDate(getHostDateDeferred);

        return getHostDateDeferred;
      },
      fetchBankConfig: function() {
        return baseService.fetch({
          url: "bankConfiguration"
        });
      },
      confirmPaymentWithAuth: function(paymentId, authKey) {
        confirmPaymentWithAuthDeferred = $.Deferred();
        confirmPaymentWithAuth(paymentId, authKey, confirmPaymentWithAuthDeferred);

        return confirmPaymentWithAuthDeferred;
      },
      getBillPaymentDetails: function(paymentId) {
        getBillPaymentDetailsDeferred = $.Deferred();
        getBillPaymentDetails(paymentId, getBillPaymentDetailsDeferred);

        return getBillPaymentDetailsDeferred;
      }
    };
  };

  return new billPaymentsModel();
});