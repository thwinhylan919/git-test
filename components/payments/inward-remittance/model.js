define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const inwardRemittanceModel = function() {
    const
      baseService = BaseService.getInstance();
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
          url: "payments/inwardRemittances/{refNo}",
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
    let fetchPDFDeferred;
    const fetchPDF = function(refNo) {
      const options = {
          url: "payments/inwardRemittances/{refNo}?media=application/pdf"
        },
        params = {
          refNo: refNo
        };

      baseService.downloadFile(options, params);
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
      fetchPDF: function(refNo) {
        fetchPDFDeferred = $.Deferred();
        fetchPDF(refNo, fetchPDFDeferred);

        return fetchPDFDeferred;
      },
      getHostDate: function() {
        getHostDateDeferred = $.Deferred();
        getHostDate(getHostDateDeferred);

        return getHostDateDeferred;
      }
    };
  };

  return new inwardRemittanceModel();
});