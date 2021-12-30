define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  const AccountStatement = function() {
    /* Extending predefined baseService to get ajax functions. */
    let params;
    const baseService = BaseService.getInstance();
    let fetchBilledStatementsDeferred;
    const fetchBilledStatements = function(cardId, selectedMonth, selectedYear, deferred, isDownload) {
      let txnUrl = null;

      if (!selectedMonth) {
        params = {
          cardId: cardId
        };

        txnUrl = "accounts/cards/credit/{cardId}/statements/transactions?type=BILLED";
      } else {
        params = {
          cardId: cardId,
          month: selectedMonth,
          year: selectedYear
        };

        txnUrl = "accounts/cards/credit/{cardId}/statements/transactions?type=BILLED&statementYear={year}&statementMonth={month}";
      }

      const options = {
        url: txnUrl,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      if (isDownload) {
        options.url += "&media=application/pdf";
        baseService.downloadFile(options, params);
      } else {
        baseService.fetch(options, params);
      }
    };
    let fetchUnbilledStatementsDeferred;
    const fetchUnbilledStatements = function(cardId, deferred, isDownload) {
      params = {
        cardId: cardId
      };

      const options = {
        url: "accounts/cards/credit/{cardId}/statements/transactions?type=UNBILLED",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      if (isDownload) {
        options.url += "&media=application/pdf";
        baseService.downloadFile(options, params);
      } else {
        baseService.fetch(options, params);
      }
    };
    let fetchEStatementsDeferred;
    const fetchEStatements = function(cardId, deferred) {
      params = {
        cardId: cardId
      };

      const options = {
        url: "accounts/cards/credit/{cardId}/preferences/eStatement",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options, params);
    };

    return {
      fetchBilledStatements: function(cardId, selectedMonth, selectedYear) {
        fetchBilledStatementsDeferred = $.Deferred();
        fetchBilledStatements(cardId, selectedMonth, selectedYear, fetchBilledStatementsDeferred);

        return fetchBilledStatementsDeferred;
      },
      downloadBilledStatement: function(cardId, selectedMonth, selectedYear) {
        fetchBilledStatements(cardId, selectedMonth, selectedYear, fetchBilledStatementsDeferred, true);
      },
      fetchUnbilledStatements: function(cardId) {
        fetchUnbilledStatementsDeferred = $.Deferred();
        fetchUnbilledStatements(cardId, fetchUnbilledStatementsDeferred);

        return fetchUnbilledStatementsDeferred;
      },
      downloadUnbilledStatement: function(cardId) {
        fetchUnbilledStatements(cardId, fetchUnbilledStatementsDeferred, true);
      },
      fetchEStatements: function(cardId) {
        fetchEStatementsDeferred = $.Deferred();
        fetchEStatements(cardId, fetchEStatementsDeferred);

        return fetchEStatementsDeferred;
      }
    };
  };

  return new AccountStatement();
});