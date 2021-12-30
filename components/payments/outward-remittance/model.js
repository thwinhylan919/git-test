define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const outwardRemittanceModel = function() {
    const
      baseService = BaseService.getInstance();
    /* variable to make sure that in case there is no change
     * in model no additional fetch requests are fired.*/
    let getBranchesDeferred;
    const getBranches = function(deferred) {
      const options = {
        url: "locations/country/all/city/all/branchCode/",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getDetailDeferred;
    const getDetail = function(refNo, deferred) {
      const options = {
          url: "payments/outwardRemittances/{refNo}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        },
        params = {
          refNo: refNo
        };

      baseService.fetch(options, params);
    };
    let getPurposeDeferred;
    const getPurpose = function(deferred) {
      const options = {
        url: "purposes/PC",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let getTransactionsDeferred;
    const getTransactions = function(url, deferred) {
      const options = {
        url: url,
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
    let fetchAccountDataDeferred;
    const fetchAccountData = function(taskCode, deferred) {
      const params = {
        taskCode: taskCode
      };
      let url = "accounts/demandDeposit";

      if (taskCode) {
        url += "?taskCode={taskCode}";
      }

      const options = {
        url: url,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };
    let getInternationalCurrencyDeferred;
    const getInternationalCurrencyList = function(deferred) {
      const options = {
        url: "payments/currencies?type=PC_F_IT",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchPDFDeferred;
    const fetchPDF = function(refNo) {
      const options = {
          url: "payments/outwardRemittances/{refNo}?media=application/pdf"
        },
        params = {
          refNo: refNo
        };

      baseService.downloadFile(options, params);
    };
    let fireBatchDeferred;
    const batchRead = function(deferred, batchRequest, type) {
      const options = {
        url: "batch",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.batch(options, {
        type: type
      }, batchRequest);
    };

    return {
      getDetail: function(refNo) {
        getDetailDeferred = $.Deferred();
        getDetail(refNo, getDetailDeferred);

        return getDetailDeferred;
      },
      getTransactions: function(url) {
        getTransactionsDeferred = $.Deferred();
        getTransactions(url, getTransactionsDeferred);

        return getTransactionsDeferred;
      },
      getInternationalCurrencyList: function() {
        getInternationalCurrencyDeferred = $.Deferred();
        getInternationalCurrencyList(getInternationalCurrencyDeferred);

        return getInternationalCurrencyDeferred;
      },
      getBranches: function() {
        getBranchesDeferred = $.Deferred();
        getBranches(getBranchesDeferred);

        return getBranchesDeferred;
      },
      fetchAccountData: function(taskCode) {
        fetchAccountDataDeferred = $.Deferred();
        fetchAccountData(taskCode, fetchAccountDataDeferred);

        return fetchAccountDataDeferred;
      },
      getPurpose: function() {
        getPurposeDeferred = $.Deferred();
        getPurpose(getPurposeDeferred);

        return getPurposeDeferred;
      },
      getHostDate: function() {
        getHostDateDeferred = $.Deferred();
        getHostDate(getHostDateDeferred);

        return getHostDateDeferred;
      },
      batchRead: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        batchRead(fireBatchDeferred, batchRequest, type);

        return fireBatchDeferred;
      },
      fetchPDF: function(refNo) {
        fetchPDFDeferred = $.Deferred();
        fetchPDF(refNo, fetchPDFDeferred);

        return fetchPDFDeferred;
      },
      getPayeeMaintenance: function() {
        return baseService.fetch({
          url: "maintenances/payments"
        });
      }
    };
  };

  return new outwardRemittanceModel();
});