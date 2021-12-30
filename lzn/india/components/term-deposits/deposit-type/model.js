define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  const openTdModel = function() {
    const baseService = BaseService.getInstance();

    let getDepositProductsDeferred;
    const getDepositProducts = function(depositType, i, baseCurrency, deferred) {
      const params = {
          depositType: depositType,
          baseCurrency: baseCurrency
        },
        options = {
        url: "products/deposit?productModule=TD&depositProductType={depositType}&productCurrency={baseCurrency}",
        success: function(data) {
          deferred.resolve(data, i);
        }
      };

      baseService.fetch(options, params);
    };
    let getAccountsDeferred;
    const getAccounts = function(productType, excludeBaseCurrency, i, deferred) {
      const params ={
          productType: productType,
          excludeBaseCurrency: excludeBaseCurrency
        },options = {
        url: "accounts/demandDeposit?productType={productType}&excludeBaseCurrency={excludeBaseCurrency}",
        success: function(data) {
          deferred.resolve(data, i);
        }
      };

      baseService.fetch(options, params);
    };

    return {
      getDepositProducts: function(depositType, i, baseCurrency) {
        getDepositProductsDeferred = $.Deferred();
        getDepositProducts(depositType, i, baseCurrency, getDepositProductsDeferred);

        return getDepositProductsDeferred;
      },
      getAccounts: function(productType, excludeBaseCurrency, i) {
        getAccountsDeferred = $.Deferred();
        getAccounts(productType, excludeBaseCurrency, i, getAccountsDeferred);

        return getAccountsDeferred;
      }
    };
  };

  return new openTdModel();
});