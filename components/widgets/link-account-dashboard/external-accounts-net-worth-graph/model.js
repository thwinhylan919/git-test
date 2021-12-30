define(["baseService", "jquery"], function (BaseService, $) {
  "use strict";

  const ListingModel = function () {
    const baseService = BaseService.getInstance();
    let fetchAccountsDeferred;
    const fetchAccounts = function (deferred) {
      const options = {
        url: "accounts",
        mockedUrl:"framework/json/design-dashboard/dashboard/net-worth-graph/accounts.json",
        success: function (data) {
          deferred.resolve(data);
        }
      };

      baseService.fetchWidget(options);

    };
    let fetchAccesstokenDeferred;
    const fetchAccesstoken = function(deferred) {
      const options = {
        url: "accesstokens",
        showMessage: false,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

        baseService.fetch(options);

    };
    let fetchBankConfigurationDeferred;
    const fetchBankConfiguration = function(deferred) {
      const options = {
        url: "bankConfiguration",
        showMessage: false,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

        baseService.fetch(options);

    };
    let fetchExchangeRateDeferred;
    const fetchExchangeRate = function(branchCode, baseCurrency, toCurrency, deferred) {
      const options = {
        url: "forex/rates?branchCode="+branchCode+"&ccy1Code="+baseCurrency+"&ccy2Code="+toCurrency,
        showMessage: false,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };

      baseService.fetch(options);
    };
    let fetchexternalbankAccountsDeferred;
    const fetchexternalbankAccounts = function(bankCode,deferred) {
      const options = {
                url: "externalBankAccounts?bankCode=" + bankCode ,

                success: function(data) {
                  deferred.resolve(data);
                },
                error: function(data) {
                  deferred.reject(data);
                }
              } ;

              baseService.fetch(options);
  };

    return {
      fetchAccounts: function () {
        fetchAccountsDeferred = $.Deferred();
        fetchAccounts(fetchAccountsDeferred);

        return fetchAccountsDeferred;
      },
      creditCardDetails: function () {

        return baseService.fetchWidget({
            url: "accounts/cards/credit?expand=ALL",
            mockedUrl:"framework/json/design-dashboard/dashboard/net-worth-graph/cards.json"
        });
      },
      fetchAccesstoken:function(){
        fetchAccesstokenDeferred = $.Deferred();
      fetchAccesstoken(fetchAccesstokenDeferred);

        return fetchAccesstokenDeferred;
      },
      fetchBankConfiguration:function(){
        fetchBankConfigurationDeferred = $.Deferred();
        fetchBankConfiguration(fetchBankConfigurationDeferred);

        return fetchBankConfigurationDeferred;
      },
      fetchExchangeRate:function(branchCode,baseCurrency,toCurrency){
        fetchExchangeRateDeferred = $.Deferred();
        fetchExchangeRate(branchCode,baseCurrency,toCurrency,fetchExchangeRateDeferred);

        return fetchExchangeRateDeferred;
      },
      fetchexternalbankAccounts:function(bankCode){
        fetchexternalbankAccountsDeferred = $.Deferred();
      fetchexternalbankAccounts(bankCode,fetchexternalbankAccountsDeferred);

        return fetchexternalbankAccountsDeferred;
      }

    };
  };

  return new ListingModel();
});
