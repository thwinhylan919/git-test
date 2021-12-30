define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";

  const downloadStatementModel = function() {
    /* Extending predefined baseService to get ajax functions. */
    let params;
    const baseService = BaseService.getInstance();
    let getpdfDeferred;
    const getpdf = function(cardId, statementMonth, statementYear, deferred) {

      const options = {
        url: "accounts/cards/credit/{cId}/statements/download??statementMonth={sMonth}&statementYear={sYear}&media=application/pdf",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      },
      params = {
        cId: cardId,
        sMonth: statementMonth,
        sYear: statementYear
      };

      baseService.downloadFile(options,params);
    };
    let getEstatementsListDeferred;
    const getEstatementsList = function(cardId, statementMonth, statementYear, deferred) {
      params = {
        cardId: cardId,
        statementMonth: statementMonth,
        statementYear: statementYear
      };

      const options = {
        url: "accounts/cards/credit/{cardId}/statements?statementMonth={statementMonth}&statementYear={statementYear}",
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
      getpdf: function(cardId, statementMonth, statementYear) {
        getpdfDeferred = $.Deferred();
        getpdf(cardId, statementMonth, statementYear, getpdfDeferred);

        return getpdfDeferred;
      },
      getEstatementsList: function(cardId, statementMonth, statementYear) {
        getEstatementsListDeferred = $.Deferred();
        getEstatementsList(cardId, statementMonth, statementYear, getEstatementsListDeferred);

        return getEstatementsListDeferred;
      }
    };
  };

  return new downloadStatementModel();
});