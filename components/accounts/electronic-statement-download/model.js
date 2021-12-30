define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  const eStatementModel = function() {
    /* Extending predefined baseService to get ajax functions. */
    let params;
    const baseService = BaseService.getInstance();
    let getEstatementsListDeferred;
    const getEstatementsList = function(accountType, accountId, statementYear, statementMonth, module, deferred) {
      let url;

      if (accountType === "deposit")
        {url = "accounts/" + accountType + "/" + accountId + "/statements;module=" + module + "?statementYear=" + statementYear + "&statementMonth=" + statementMonth;}
      else
        {url = "accounts/" + accountType + "/" + accountId + "/statements?statementYear=" + statementYear + "&statementMonth=" + statementMonth;}

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
    let downLoadStatementDeferred;
    const downLoadStatement = function(accountType, accountId, statementNo, module, deferred) {
      let url;

      if (accountType === "deposit")
        {url = "accounts/" + accountType + "/" + accountId + "/statements/" + statementNo + "/download;module=" + module + "?media=application/pdf";}
      else
        {url = "accounts/" + accountType + "/" + accountId + "/statements/" + statementNo + "/download?media=application/pdf";}

      const options = {
        url: url,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.downloadFile(options, params);
    };

    return {
      getEstatementsList: function(accountType, accountId, statementYear, statementMonth, module) {
        getEstatementsListDeferred = $.Deferred();
        getEstatementsList(accountType, accountId, statementYear, statementMonth, module, getEstatementsListDeferred);

        return getEstatementsListDeferred;
      },
      downLoadStatement: function(accountType, accountId, statementNo, module) {
        downLoadStatementDeferred = $.Deferred();
        downLoadStatement(accountType, accountId, statementNo, module, downLoadStatementDeferred);

        return downLoadStatementDeferred;
      }
    };
  };

  return new eStatementModel();
});