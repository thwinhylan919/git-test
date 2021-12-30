define([
    "jquery",
    "baseService"
  ], function($, BaseService) {
    "use strict";

    const AddToFavoriteModel = function() {
      const Model = function() {

          this.favoritesModel = {
            id: null,
            transactionType: null,
            payeeId: null,
            amount: {
              currency: null,
              amount: null
            },
            debitAccountId: {
              displayValue: null,
              value: null
            },
            accountType: null,
            creditAccountId: {
              displayValue: null,
              value: null
            },
             intermediaryBankDetails: {
              name: null,
              branch: null,
              address: null,
              city: null,
              country: null,
              codeType: null,
              code: null
            },
            intermediaryBankNetwork:null,
            network: null,
            purpose: null,
            remarks: null,
            payeeGroupId: null,
            valueDate: null,
            payeeNickName: null,
            charges: null,
            payeeAccountName: null,
            otherDetails: {
              line1: null,
              line2 :null,
              line3:null,
              line4 :null
            },
            otherPurposeText: null
          };

        },
        baseService = BaseService.getInstance();

      let addFavoritesDeferred;
      const addFavorites = function(model, deferred) {
        const options = {
          url: "payments/favorites",
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

      let fireBatchDeferred;
      const fireBatch = function(deferred, batchRequest, type) {
        const options = {
          url: "batch",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        };

        baseService.batch(options, {
          type: type
        }, batchRequest);
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
            transactionType: transactionType
          };

        baseService.remove(options, params);
      };

      return {
        getNewModel: function(modelData) {
          return new Model(modelData);
        },
        getNetworkTypes: function() {
          return baseService.fetch({
            url: "enumerations/networkType?REGION=INDIA"
          });
        },
        fetchAccountData: function(type) {
          let accounts = [];
          const promises = [];

          if (Array.isArray(type)) {
              accounts = type;
          } else {
              accounts.push(type);
          }

          accounts.forEach(function(urlType) {
              const url = "accounts/" + urlType;

              promises.push(baseService.fetchWidget({
                  url: url,
                  mockedUrl: "framework/json/design-dashboard/accounts/demand-deposit.json"
              }));
          });

          return Promise.all(promises).then(function(values) {
              return values.reduce(function(acc, value) {
                  return acc.concat(value.accounts || value || []);
              }, []);
          });
      },

        addFavorites: function(model) {
          addFavoritesDeferred = $.Deferred();
          addFavorites(model, addFavoritesDeferred);

          return addFavoritesDeferred;
        },

        deleteFavourite: function(paymentId, transactionType) {
          deleteFavouriteDeferred = $.Deferred();
          deleteFavourite(paymentId, transactionType, deleteFavouriteDeferred);

          return deleteFavouriteDeferred;
        },

        getCharges: function() {
          baseService.fetch({
            url: "charges"
          });
        },
        fireBatch: function(batchRequest, type) {
          fireBatchDeferred = $.Deferred();
          fireBatch(fireBatchDeferred, batchRequest, type);

          return fireBatchDeferred;
        },
        /**
         * Fetches maintenances.
         *
         * @returns {Promise}  Returns the promise object.
         */
        getMaintenances: function() {
          return baseService.fetch({
            url: "maintenances/payments"
          });
        }

      };
    };

    return new AddToFavoriteModel();
  });
